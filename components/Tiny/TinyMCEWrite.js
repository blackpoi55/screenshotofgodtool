"use client";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TINYMCE_API_KEY = "9rv7sk2supns77ueu5ufbwpwl5ihjtapi3a1r3p3rgxrct5l";

export default function TinyMCEWrite({ initialValue = "", onChange }) {
    const editorRef = useRef(null);

    return (
        <Editor
            apiKey={TINYMCE_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={initialValue}
            init={{
                height: 600,
                menubar: "file edit view insert format tools table help",
                plugins: [
                    "advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor",
                    "searchreplace", "visualblocks", "visualchars", "code", "fullscreen",
                    "insertdatetime", "media", "table", "emoticons", "help", "wordcount", "nonbreaking",
                    "directionality", "pagebreak", "codesample"
                ],
                toolbar: [
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor",
                    "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ltr rtl",
                    "link image media table emoticons charmap codesample | fullscreen preview code | removeformat"
                ].join(" | "),
                automatic_uploads: false,
                images_upload_handler: (blobInfo, success, failure) => {
                    try {
                        const base64 = "data:" + blobInfo.blob().type + ";base64," + blobInfo.base64();

                        // ✅ ใส่ timeout ให้แน่ใจว่ามันรอโหลดภาพ
                        setTimeout(() => {
                            success(base64);
                        }, 100); // หรือ 0 ก็ได้
                    } catch (err) {
                        failure("เกิดข้อผิดพลาด: ไม่สามารถแสดงภาพได้");
                    }
                },

                branding: false,
                content_style: `
                    body { font-family:Helvetica,Arial,sans-serif; font-size:16px; padding: 1rem; }
                    img { max-width: 100%; height: auto; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ccc; padding: 0.5rem; }
                `,
            }}
            onEditorChange={(content) => {
                if (onChange) onChange(content);
            }}
        />
    );
}
