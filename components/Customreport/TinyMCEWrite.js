"use client";
import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TINYMCE_API_KEY = "9rv7sk2supns77ueu5ufbwpwl5ihjtapi3a1r3p3rgxrct5l";

export default function TinyMCEWrite({ initialValue = "", onChange }) {
    const editorRef = useRef(null);
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <Editor
            apiKey={TINYMCE_API_KEY}
            value={value}
            onInit={(evt, editor) => {
                editorRef.current = editor;

                // 🔽 รองรับการ drop ข้อความ
                editor.getBody().addEventListener("drop", (e) => {
                    e.preventDefault();
                    const text = e.dataTransfer.getData("text/plain");
                    if (text) {
                        editor.insertContent(`{{${text}}}`);
                    }
                });
            }}
            onEditorChange={(content) => {
                setValue(content);
                if (onChange) onChange(content);
            }}
            init={{
                height: 750,
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
                font_family_formats: `
                    Sarabun=Sarabun,Helvetica,Arial,sans-serif;
                    Arial=Arial,Helvetica,sans-serif;
                    Courier New=Courier New,Courier,monospace;
                    Georgia=Georgia,serif;
                    Times New Roman=Times New Roman,Times,serif;
                    Verdana=Verdana,Geneva,sans-serif
                `,
                automatic_uploads: false,
                images_upload_handler: (blobInfo, success, failure) => {
                    try {
                        const base64 = "data:" + blobInfo.blob().type + ";base64," + blobInfo.base64();
                        setTimeout(() => {
                            success(base64);
                        }, 100);
                    } catch (err) {
                        failure("เกิดข้อผิดพลาด: ไม่สามารถแสดงภาพได้");
                    }
                },
                branding: false,
                content_style: `
 
  @font-face {
    font-family: 'Sarabun';
    src: url('/fonts/sarabun/Sarabun-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Sarabun';
    src: url('/fonts/sarabun/Sarabun-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
  }
  @font-face {
    font-family: 'Sarabun';
    src: url('/fonts/sarabun/Sarabun-Italic.ttf') format('truetype');
    font-weight: 400;
    font-style: italic;
  } 
`
                ,

            }}
        />
    );
}
