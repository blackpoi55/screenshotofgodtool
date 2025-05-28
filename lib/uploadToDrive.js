import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';
import { Readable } from 'stream';

export async function uploadBase64ToGoogleDrive(base64, filename) {
  const keyPath = path.join(process.cwd(), 'service-account.json');
  const keyFile = await fs.readFile(keyPath, 'utf8');
  const credentials = JSON.parse(keyFile);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const folderId = process.env.DRIVE_FOLDER_ID;

  // ✅ ตัด prefix แล้วแปลง base64 → buffer
  const buffer = Buffer.from(base64.split(',')[1], 'base64');

  const fileMetadata = {
    name: `${filename}.png`,
    parents: [folderId],
  };

  const media = {
    mimeType: 'image/png',
    body: Readable.from(buffer), // ✅ แก้ตรงนี้
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id',
  });

  const fileId = file.data.id;

  // แชร์ให้ anyone ดูได้
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return `https://drive.google.com/uc?id=${fileId}`;
}
