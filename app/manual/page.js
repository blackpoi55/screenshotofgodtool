// ManualPage.jsx
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { bucode } from "@/config";

const TinyMCEWrite = dynamic(() => import("@/components/Tiny/TinyMCEWrite"), {
  ssr: false,
});

export default function ManualPage() {
  const [manuals, setManuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "add", data: null });
  const [formData, setFormData] = useState({ name: "", detail: "", bucode: "", createby: "" });

  const fetchManuals = async () => {
  try {
    const res = await fetch("https://api-h-series.telecorp.co.th/api/manual/getbyCode/" + bucode);
    const data = await res.json();

    const sorted = (data.data || []).sort((a, b) => {
      return new Date(b.createat).getTime() - new Date(a.createat).getTime(); // เรียงจากใหม่ → เก่า
    });

    setManuals(sorted);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchManuals();
  }, []);

  const openModal = (mode, data = null) => {
    setModal({ open: true, mode, data });
    if (data) {
      setFormData({
        name: data.name || "",
        detail: data.detail || "",
        bucode: data.bucode || bucode,
        createby: data.createby || "",
      });
    } else {
      setFormData({ name: "", detail: "", bucode: bucode, createby: "" });
    }
  };

  const closeModal = () => {
    setModal({ open: false, mode: "add", data: null });
    setFormData({ name: "", detail: "", bucode: "", createby: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อคู่มือ", timer: 2000, showConfirmButton: false });
      return;
    }

    if (!formData.createby.trim()) {
      Swal.fire({ icon: "warning", title: "กรุณาระบุชื่อผู้สร้าง", timer: 2000, showConfirmButton: false });
      return;
    }

    const now = new Date().toISOString();
    const payload = {
      ...formData,
      ...(modal.mode === "add" ? { createat: now, updateat: null } : { updateat: now }),
    };

    const method = modal.mode === "edit" ? "PUT" : "POST";
    const url =
      modal.mode === "edit"
        ? `https://api-h-series.telecorp.co.th/api/manual/${modal.data.uid}`
        : "https://api-h-series.telecorp.co.th/api/manual";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error: ${res.status} - ${errorText}`);
      }

      closeModal();
      fetchManuals();
      Swal.fire({ icon: "success", title: "บันทึกข้อมูลเรียบร้อยแล้ว!", timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", err);
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", timer: 2000, showConfirmButton: false });
    }
  };
  const handleDelete = async (manual) => {
    const confirm = await Swal.fire({
      title: `คุณแน่ใจหรือไม่?`,
      text: `ต้องการลบคู่มือ "${manual.name}" หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://api-h-series.telecorp.co.th/api/manual/${manual.uid}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server Error: ${res.status} - ${errorText}`);
        }

        await fetchManuals();
        Swal.fire({ icon: "success", title: "ลบข้อมูลเรียบร้อยแล้ว", timer: 2000, showConfirmButton: false });
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", err);
        Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการลบข้อมูล", timer: 2000, showConfirmButton: false });
      }
    }
  };
 
  return (
    <div className="p-10 max-w-full mx-auto bg-gradient-to-br from-indigo-100 via-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 min-h-screen text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-purple-700 dark:text-white tracking-tight flex items-center gap-2">
          📚 <span>รายการคู่มือทั้งหมด</span>
        </h1>
        <button
          onClick={() => openModal("add")}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xl transition-transform transform hover:scale-105"
        >
          ➕ เพิ่มคู่มือ
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
          <span className="ml-4 text-lg font-medium text-purple-700 dark:text-purple-200">กำลังโหลดข้อมูล...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl shadow-2xl border border-purple-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-purple-100 dark:bg-gray-700 text-purple-800 dark:text-white rounded-t-3xl">
              <tr>
                <th className="p-4 text-left">ชื่อ</th>
                <th className="p-4 text-left">BU Code</th>
                <th className="p-4 text-left">ผู้สร้าง</th>
                <th className="p-4 text-left">วันที่สร้าง</th>
                <th className="p-4 text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-gray-700">
              {manuals.map((m) => (
                <tr key={m.uid} className="hover:bg-purple-50 dark:hover:bg-gray-800 transition">
                  <td className="p-4">{m.name}</td>
                  <td className="p-4">{m.bucode}</td>
                  <td className="p-4">{m.createby}</td>
                  <td className="p-4">{new Date(m.createat).toLocaleString()}</td>
                  <td className="p-4 space-x-2">
                    <a
                      href={`/manual/view?id=${m.uid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm shadow-md transition"
                    >
                      👁️ ดู
                    </a>
                    <button
                      onClick={() => openModal("edit", m)}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-4 py-1.5 rounded-full text-sm shadow-md transition"
                    >
                      ✏️ แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-full text-sm shadow-md transition"
                    >
                      🗑️ ลบ
                    </button>

                  </td>
                </tr>
              ))}
              {manuals.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-purple-500 dark:text-purple-200 font-medium">
                    ไม่มีข้อมูลคู่มือ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal.open && modal.mode !== "view" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 dark:bg-gray-900/90 p-8 rounded-3xl w-[80%] max-w-[1300px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-purple-800 dark:text-white">
              {modal.mode === "add" ? "➕ เพิ่มคู่มือ" : "✏️ แก้ไขคู่มือ"}
            </h2>

            <label className="block mb-2 text-gray-700 dark:text-gray-200">ชื่อคู่มือ</label>
            <input
              type="text"
              className="w-full mb-4 px-4 py-2 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">รายละเอียด</label>
            <div className="w-full mb-4">
              <TinyMCEWrite
                initialValue={formData.detail}
                onChange={(val) => setFormData({ ...formData, detail: val })}
              />
            </div>

            <label className="block mb-2 text-gray-700 dark:text-gray-200">BU Code</label>
            <input
              type="text"
              disabled
              className="w-full mb-4 px-4 py-2 border rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              value={formData.bucode}
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">สร้างโดย</label>
            <input
              type="text"
              className="w-full mb-4 px-4 py-2 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={formData.createby}
              onChange={(e) => setFormData({ ...formData, createby: e.target.value })}
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl"
              >
                ❌ ปิด
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-md"
              >
                💾 บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
