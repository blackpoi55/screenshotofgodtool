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

                editor.on("drop", (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const key = e.dataTransfer?.getData("text/plain");
                    if (!key) return;

                    setTimeout(() => {
                        editor.focus();

                        const sel = editor.selection;
                        const rng = sel.getRng();

                        // 🔥 ตรวจหา NO ที่แปะไว้โดย TinyMCE รอบๆ caret
                        if (rng.startContainer.nodeType === 3) {
                            const textNode = rng.startContainer;
                            const text = textNode.nodeValue || "";
                            const index = rng.startOffset;

                            // 🔍 ตรวจซ้าย-ขวาของ caret ถ้ามี key แบบดิบ = ให้ลบทิ้ง
                            const before = text.slice(0, index);
                            const after = text.slice(index);

                            let newText = before + after;
                            if (before.endsWith(key)) {
                                newText = before.slice(0, -key.length) + after;
                            } else if (after.startsWith(key)) {
                                newText = before + after.slice(key.length);
                            }

                            textNode.nodeValue = newText;

                            // ✅ ตั้ง caret ใหม่ (เพื่อให้วาง {{key}} ได้ถูก)
                            const newRange = document.createRange();
                            newRange.setStart(textNode, before.length - (before.endsWith(key) ? key.length : 0));
                            newRange.collapse(true);
                            sel.setRng(newRange);
                        }

                        // ✅ แทรก {{KEY}} ที่ตำแหน่ง caret
                        editor.selection.setContent(`{{${key.trim()}}}`);
                    }, 10);
                });

                editor.on('dragover', (e) => e.preventDefault());
            }}


            onEditorChange={(content) => {
                if (content !== value) {
                    setValue(content);
                    if (onChange) onChange(content);
                }
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
