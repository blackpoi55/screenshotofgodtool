"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { bucode } from "@/config";

export default function ManualViewClient() {
  const [value, setValue] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [manuals, setManuals] = useState([]);

  useEffect(() => {
    fetchManuals();
  }, []);

  useEffect(() => {
    if (id) getData(id);
  }, [id]);

  const fetchManuals = async () => {
    try {
      const res = await fetch(`https://api-h-series.telecorp.co.th/api/manual/getbyCode/${bucode}`);
      const data = await res.json();
      setManuals(data.data || []);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
    }
  };

  const getData = async (manualId) => {
    try {
      const res = await fetch(`https://api-h-series.telecorp.co.th/api/manual/${manualId}`);
      const data = await res.json();
      setValue(data.data);
    } catch (error) {
      console.error("โหลดข้อมูลล้มเหลว:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-indigo-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-black">
      {/* Sidebar */}
      <aside className="w-80 bg-white/70 dark:bg-white/10 backdrop-blur-md p-6 border-r border-blue-200 dark:border-gray-700 shadow-2xl z-10">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-white flex items-center gap-2">
          📚 <span>คู่มือระบบ</span>
        </h2>
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[80vh] pr-1 custom-scroll">
          {manuals.map((m) => (
            <button
              key={m.uid}
              onClick={() => getData(m.uid)}
              className={`text-left px-5 py-3 rounded-xl font-semibold text-sm transition-all border relative group overflow-hidden
                ${value?.uid === m.uid
                  ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg border-blue-600"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 border-gray-300"}
              `}
            >
              <span className="z-10 relative">{m.name}</span>
              {value?.uid === m.uid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white font-bold">★</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-10 py-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-blue-200 relative animate-fadeIn">
          {value ? (
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-indigo transition-all duration-300"
              dangerouslySetInnerHTML={{ __html: value.detail }}
            />
          ) : (
            <div className="space-y-3 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3" />
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.4);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
