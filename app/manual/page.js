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
      setManuals(data.data || []);
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

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📚 รายการคู่มือทั้งหมด</h1>
        <button
          onClick={() => openModal("add")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          ➕ เพิ่มคู่มือ
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-300">กำลังโหลดข้อมูล...</span>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left text-gray-800 dark:text-white">ชื่อ</th>
                <th className="p-3 text-left text-gray-800 dark:text-white">BU Code</th>
                <th className="p-3 text-left text-gray-800 dark:text-white">ผู้สร้าง</th>
                <th className="p-3 text-left text-gray-800 dark:text-white">วันที่สร้าง</th>
                <th className="p-3 text-left text-gray-800 dark:text-white">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {manuals.map((m) => (
                <tr key={m.uid} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="p-3 border-t border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">{m.name}</td>
                  <td className="p-3 border-t border-gray-300 dark:border-gray-700">{m.bucode}</td>
                  <td className="p-3 border-t border-gray-300 dark:border-gray-700">{m.createby}</td>
                  <td className="p-3 border-t border-gray-300 dark:border-gray-700">{new Date(m.createat).toLocaleString()}</td>
                  <td className="p-3 border-t border-gray-300 dark:border-gray-700 space-x-2">
                    <a
                      href={`/manual/view?id=${m.uid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded inline-block"
                    >
                      👁️ ดู
                    </a>
                    <button onClick={() => openModal("edit", m)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">✏️ แก้ไข</button>
                  </td>
                </tr>
              ))}
              {manuals.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400">ไม่มีข้อมูลคู่มือ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && modal.mode !== "view" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-auto shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {modal.mode === "add" ? "➕ เพิ่มคู่มือ" : "✏️ แก้ไขคู่มือ"}
            </h2>

            <label className="block mb-2 text-gray-700 dark:text-gray-200">ชื่อคู่มือ</label>
            <input
              type="text"
              className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">รายละเอียด</label>
            <div className=" w-[900px]">
              <TinyMCEWrite
                initialValue={formData.detail}
                onChange={(val) => setFormData({ ...formData, detail: val })}
              />
            </div>
            <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-200">BU Code</label>
            <input
              type="text"
              className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              disabled
              value={formData.bucode}
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">สร้างโดย</label>
            <input
              type="text"
              className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              value={formData.createby}
              onChange={(e) => setFormData({ ...formData, createby: e.target.value })}
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">❌ ปิด</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">💾 บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
