// app/api/send-report/route.js
import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';
import { uploadBase64ToGoogleDrive } from '@/lib/uploadToDrive';
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            projectname,
            title,
            description,
            module,
            url,
            reporter,
            status,
            createdat,
            screenshotpath,
        } = body;

        // Step 1: Upload image to Supabase
        const filename = `screenshot-${Date.now()}`;

        // ใหม่: Google Drive
        const imageUrl = await uploadBase64ToGoogleDrive(screenshotpath, filename);


        // Step 2: Load service account credentials
        const keyPath = path.join(process.cwd(), 'service-account.json');
        const keyFile = await fs.readFile(keyPath, 'utf8');
        const credentials = JSON.parse(keyFile);

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = process.env.SHEET_ID;
        const range = 'Sheet1!A1'; // Sheet1 ต้องตรงกับใน Google Sheet

        const values = [
            [
                projectname,
                title,
                description,
                module,
                url,
                reporter,
                status,
                createdat,
                imageUrl
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });

        return Response.json({ status: 'success', imageUrl });
    } catch (err) {
        console.error('⛔ Error:', err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}
