"use client";

import { useEffect, useRef } from "react";

export default function TinyMCERead({ html = "" }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        // 🔧 ล้าง inline style ที่ TinyMCE ใส่มา (สี font, พื้นหลัง)
        const elements = ref.current.querySelectorAll("*");
        elements.forEach((el) => {
            if (el.style.color) el.style.color = "inherit";
            if (el.style.backgroundColor) el.style.backgroundColor = "transparent";
        });
    }, [html]);

    return (
        <div className="prose prose-lg max-w-none p-6 rounded-xl shadow bg-white text-black border border-gray-200">
            <style jsx>{`
                .prose * {
                    color: inherit !important;
                    background-color: transparent !important;
                }
                .prose table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .prose th,
                .prose td {
                    border: 1px solid #ccc;
                    padding: 0.75rem;
                    background-color: transparent !important;
                }
                .prose img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                }
                .prose pre {
                    background: #f5f5f5;
                    color: #000;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                }
                .prose blockquote {
                    border-left: 4px solid #ccc;
                    padding-left: 1rem;
                    background-color: #f9f9f9;
                    color: #444;
                }
            `}</style>

            <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}
