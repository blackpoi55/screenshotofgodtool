// app/manual/view/ManualViewClient.jsx
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
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 p-4 border-r dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">📚 คู่มือทั้งหมด</h2>
        <div className="flex flex-col gap-2">
          {manuals.map((m) => (
            <button
              key={m.uid}
              onClick={() => getData(m.uid)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 border 
                ${value?.uid === m.uid
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100 border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-blue-900"}`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
          {value ? (
            <div
              className="prose prose-sm lg:prose-base max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: value.detail }}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 animate-pulse">
              กำลังโหลดข้อมูล...
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
