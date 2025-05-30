"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import TinyMCERead from "@/components/Tiny/TinyMCERead";

// ✅ import TinyMCEWrite แบบ dynamic (ป้องกัน SSR)
const TinyMCEWrite = dynamic(() => import("@/components/Tiny/TinyMCEWrite"), {
  ssr: false,
});

const LOCAL_KEY = "tinymce_manual_content";

export default function ManualPage() {
  const [content, setContent] = useState("<p>เริ่มเขียนคู่มือของคุณ...</p>");
  const [mode, setMode] = useState("write");

  // ✅ โหลดจาก localStorage เมื่อเข้าเว็บ
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      setContent(saved);
    }
  }, []);

  // ✅ ฟังก์ชันบันทึกลง localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_KEY, content);
    alert("✅ บันทึกเรียบร้อยแล้ว!");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("write")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          ✏️ เขียน
        </button>
        <button
          onClick={() => setMode("read")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          📖 ดู
        </button>
        <button
          onClick={saveToLocalStorage}
          className="px-4 py-2 bg-yellow-500 text-black rounded"
        >
          💾 บันทึก
        </button>
      </div>

      {mode === "write" ? (
        <TinyMCEWrite initialValue={content} onChange={setContent} />
      ) : (
        <TinyMCERead html={content} />
      )}
    </div>
  );
}
