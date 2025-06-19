"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { bucode } from "@/config";
const TinyMCEWrite = dynamic(() => import("@/components/Customreport/TinyMCEWrite"), {
  ssr: false,
});
export default function ManualEditClient() {
  const [value, setValue] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [keyMap, setkeyMap] = useState([]);
  const [searchKey, setsearchKey] = useState("");
  const [projectFilter, setprojectFilter] = useState()
  const [formData, setFormData] = useState({ name: "", detail: "", bucode: "", createby: "" });

  useEffect(() => {
    getData()
  }, []);
  useEffect(() => {
    if (id) loadManual(id);
  }, [id]);

  const loadManual = async (id) => {
    try {
      const res = await fetch("https://api-h-series.telecorp.co.th/api/manual/" + id);
      const data = await res.json();
      setFormData({
        name: data?.data?.name || "",
        detail: data?.data?.detail || "",
        bucode: data?.data?.bucode || "",
        createby: data?.data?.createby || "",
      });
    } catch (err) {
      console.error("โหลดข้อมูล manual ล้มเหลว:", err);
    }
  };

  const getData = async () => {
    try {
      const res = await fetch("https://api-h-series.telecorp.co.th/api/Patient/PatientReport/84995");
      const data = await res.json();
      const keys = flattenObject(data.data);
      setkeyMap(keys || []);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
    }
  };

  function flattenObject(obj, parentKey = '') {
    let keys = [];

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const newKey = parentKey ? `${parentKey}.${key}` : key;
      const value = obj[key];

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          keys.push(...flattenObject(item, `${newKey}[${index}]`));
        });
      } else if (typeof value === 'object' && value !== null) {
        keys.push(...flattenObject(value, newKey));
      } else {
        keys.push(newKey);
      }
    }

    return keys;
  }

  const filteredCases = keyMap
    ?.filter((c) => {
      const search = searchKey.toLowerCase();
      return (
        ((c || "").toLowerCase().includes(search)
        ));
    })
  const saveClick = async () => {
    try {
      const payload = {
        ...formData,
        updateat: new Date().toISOString(),
      };

      const res = await fetch(
        id
          ? `https://api-h-series.telecorp.co.th/api/manual/${id}` // PUT
          : "https://api-h-series.telecorp.co.th/api/manual",      // POST
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("ไม่สามารถบันทึกได้");

      alert("✅ บันทึกสำเร็จ");
    } catch (err) {
      console.error(err);
      alert("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#e0f7fa] via-[#fce4ec] to-[#ede7f6] dark:from-gray-900 dark:to-gray-800 text-black dark:text-white transition-all">
      {/* Sidebar */}
      <aside className="w-80 bg-white/40 dark:bg-white/10 backdrop-blur-xl p-6 border-r border-purple-200 dark:border-gray-700 shadow-2xl z-10 rounded-tr-3xl rounded-br-3xl">
        <h2 className="text-3xl font-extrabold mb-6 text-purple-700 dark:text-white flex items-center gap-2 tracking-tight">
          📘 <span>KEY</span>
        </h2>
        <input className="bg-white rounded-lg p-2 text-black w-full" value={searchKey} onChange={(e) => setsearchKey(e.target.value)} placeholder="search" />
        <div className="flex flex-col gap-4 overflow-x-auto max-h-[90vh] pr-1 custom-scroll">

          <div className="w-full p-2  flex flex-col">
            {filteredCases.map((key, index) => (
              <button
                key={index}
                draggable
                contentEditable={false} // สำคัญมาก!
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", key);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition m-2 text-xs"
              >
                {key}
              </button>

            ))}

          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-10 py-12 overflow-y-auto">
        <div className="flex justify-end mb-2">
          <button className="bg-blue-500 rounded-lg p-2 text-white" onClick={() => saveClick()}>save</button>
        </div>

        <div className="max-w-8xl mx-auto bg-white  text-black rounded-3xl shadow-2xl border border-purple-200 dark:border-gray-600 transition-all duration-300 animate-fadeIn backdrop-blur-xl">
          <TinyMCEWrite
            initialValue={formData.detail}
            onChange={(val) => setFormData({ ...formData, detail: val })}
          />
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
