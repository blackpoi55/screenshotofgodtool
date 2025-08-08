"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { bucode } from "@/config";

export default function ManualViewClient() {
  const [value, setValue] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [manuals, setManuals] = useState([]);
  const [projectFilter, setprojectFilter] = useState()
  const [query, setQuery] = useState("");
  useEffect(() => {
    fetchManuals();
  }, [projectFilter]);

  useEffect(() => {
    if (id) getData(id);
  }, [id]);

  const fetchManuals = async () => {
    try {
      const res = await fetch("https://api-h-series.telecorp.co.th/api/manual/getbyCode/" + projectFilter);
      const data = await res.json();

      const sorted = (data.data || []).sort((a, b) => {
        return new Date(b.createat).getTime() - new Date(a.createat).getTime(); // เรียงจากใหม่ → เก่า
      });

      setManuals(sorted);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
    }
  };

  const getData = async (manualId) => {
    try {
      const res = await fetch(`https://api-h-series.telecorp.co.th/api/manual/${manualId}`);
      const data = await res.json();
      setValue(data.data);
      setprojectFilter(data?.data?.bucode)
    } catch (error) {
      console.error("โหลดข้อมูลล้มเหลว:", error);
    }
  };
  const filteredManuals = manuals.filter(m =>
    (m.name || "").toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#e0f7fa] via-[#fce4ec] to-[#ede7f6] dark:from-gray-900 dark:to-gray-800 text-black dark:text-white transition-all">
      {/* Sidebar */}
      <aside className="w-80 bg-white/40 dark:bg-white/10 backdrop-blur-xl p-6 border-r border-purple-200 dark:border-gray-700 shadow-2xl z-10 rounded-tr-3xl rounded-br-3xl">
        <h2 className="text-3xl font-extrabold mb-6 text-purple-700 dark:text-white flex items-center gap-2 tracking-tight">
          📘 <span>คู่มือระบบ ({filteredManuals.length||0})</span>
        </h2>
        {/* Search */}
        <div className="mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาเอกสาร..."
            className="w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-gray-800 border border-purple-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] pr-1 custom-scroll">
          {filteredManuals.map((m) => (
            <button
              key={m.uid}
              onClick={() => getData(m.uid)}
              className={`text-left flex items-start px-5 py-3 pr-8 rounded-2xl font-semibold text-base leading-6 whitespace-normal break-words transition-all border relative group shadow-md
    ${value?.uid === m.uid
                  ? "bg-gradient-to-r from-purple-500 to-indigo-400 text-white border-purple-500 shadow-lg"
                  : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-purple-100 dark:hover:bg-gray-700 border-gray-300"}
  `}
            >
              <span className="relative z-10 block whitespace-normal break-words text-sm">
                {m.name}
              </span>

              {value?.uid === m.uid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white font-bold">★</span>
              )}
            </button>

          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-10 py-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto bg-white  text-black p-10 rounded-3xl shadow-2xl border border-purple-200 dark:border-gray-600 transition-all duration-300 animate-fadeIn backdrop-blur-xl">
          {value ? (
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-indigo transition-all duration-300"
              dangerouslySetInnerHTML={{ __html: value.detail }}
            />
          ) : (
            <div className="space-y-4 animate-pulse">
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
          background: rgba(137, 110, 250, 0.5);
          border-radius: 8px;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
