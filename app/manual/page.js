"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import TinyMCERead from "@/components/Tiny/TinyMCERead";
// npm install @tinymce/tinymce-react --legacy-peer-deps
// npm i @tinymce/miniature --legacy-peer-deps
const TinyMCEWrite = dynamic(() => import("@/components/Tiny/TinyMCEWrite"), {
  ssr: false,
});

const LOCAL_KEY = "tinymce_manual_content";

export default function ManualPage() {
  const [content, setContent] = useState("<p>เริ่มเขียนคู่มือของคุณ...</p>");
  const [mode, setMode] = useState("write");
  const [savedTime, setSavedTime] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setContent(saved);
    const savedAt = localStorage.getItem(`${LOCAL_KEY}_time`);
    if (savedAt) setSavedTime(savedAt);
  }, []);

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_KEY, content);
    const now = new Date().toLocaleString();
    localStorage.setItem(`${LOCAL_KEY}_time`, now);
    setSavedTime(now);
    alert("✅ บันทึกเรียบร้อยแล้ว!");
  };

  const exportHTML = () => {
    const blob = new Blob([content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "manual.html";
    link.click();
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setMode("write")}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          ✏️ เขียน
        </button>
        <button
          onClick={() => setMode("read")}
          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
        >
          📖 ดู
        </button>
        <button
          onClick={saveToLocalStorage}
          className="px-4 py-2 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500"
        >
          💾 บันทึก
        </button>
        <button
          onClick={exportHTML}
          className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
        >
          ⬇️ ดาวน์โหลด HTML
        </button>
        {savedTime && (
          <span className="text-sm text-gray-500 mt-1">บันทึกล่าสุด: {savedTime}</span>
        )}
      </div>

      {mode === "write" ? (
        <TinyMCEWrite initialValue={content} onChange={setContent} />
      ) : (
        <TinyMCERead html={content} />
      )}
    </div>
  );
}
