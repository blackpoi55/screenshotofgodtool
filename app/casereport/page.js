'use client'

import { bucode } from "@/config"
import { useEffect, useState } from "react"
const statusOptions = [
  { label: "ทั้งหมด", value: "" },
  { label: "🟡 pending", value: "pending" },
  { label: "💻 Dev Done", value: "devdone" },
  { label: "✅ resolved", value: "resolved" },
  { label: "❌ rejected", value: "rejected" }
]

const sortOptions = [
  { label: "ล่าสุด ⬇️", value: "createdat-desc" },
  { label: "เก่าสุด ⬆️", value: "createdat-asc" }
]
function page() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [sortBy, setSortBy] = useState("createdat-desc")
  const [selectedCase, setSelectedCase] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [cases, setCases] = useState([])

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    const response = await fetch("https://api-h-series.telecorp.co.th/api/bugreport/getbyCode/" + bucode, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const result = await response.json();

    if (Array.isArray(result.data)) {
      setCases(result.data);
    } else {
      console.warn("⚠️ result.data is not array:", result.data);
      setCases([]);
    }
  };


  const handleStatusUpdate = async (data, newStatus) => {
    // const res = await updatebugstatus({ status: newStatus }, data.id);
    const response = await fetch("https://api-h-series.telecorp.co.th/api/bugreport/" + data.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }), // ส่ง payload ไปยัง API
    });

    const result = await response.json();
    if (result) {
      refresh();
      setIsModalOpen(false);
    } else {
      alert("อัปเดตสถานะไม่สำเร็จ");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold"
      case "devdone":
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold"
      case "pending":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold"
      case "rejected":
        return "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold"
      default:
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold"
    }
  }

  const filteredCases = cases
    .filter((c) => {
      const search = searchTerm.toLowerCase()
      return (
        (c.id.toLowerCase().includes(search) ||
          c.title.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search) ||
          c.module.toLowerCase().includes(search) ||
          c.url.toLowerCase().includes(search) ||
          c.reporter.toLowerCase().includes(search) ||
          c.status.toLowerCase().includes(search)) &&
        (statusFilter === "" || c.status === statusFilter)
      )
    })
    .sort((a, b) => {
      if (sortBy === "createdat-asc") {
        return new Date(a.createdat) - new Date(b.createdat)
      } else {
        return new Date(b.createdat) - new Date(a.createdat)
      }
    })

  const countByStatus = (status) => cases.filter((c) => c.status === status).length
  const getpriorityClass = (priority) => {
    switch (priority) {
      case "ต่ำ":
        return "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold";
      case "ปานกลาง":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold";
      case "สูง":
        return "bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold";
      case "วิกฤต":
        return "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold";
      default:
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard Report Case</h1>

      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <div className="bg-white px-4 py-2 rounded shadow">
          รวมทั้งหมด: <strong>{cases.length}</strong> เคส
        </div>
        <div className="bg-yellow-50 px-4 py-2 rounded shadow text-yellow-800">
          🟡 Pending: <strong>{countByStatus("pending")}</strong>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded shadow text-blue-800">
          💻 Dev Done: <strong>{countByStatus("devdone")}</strong>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded shadow text-green-800">
          ✅ Resolved: <strong>{countByStatus("resolved")}</strong>
        </div>
        <div className="bg-red-50 px-4 py-2 rounded shadow text-red-800">
          ❌ Rejected: <strong>{countByStatus("rejected")}</strong>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full md:items-center">
        <input
          type="text"
          placeholder="🔍 ค้นหาทุกช่อง..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-full md:w-1/4 focus:outline-none"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-full md:w-1/4 focus:outline-none"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-100 text-gray-700 text-sm uppercase">
              <th className="p-3 text-left">วันที่แจ้ง</th>
              <th className="p-3 text-left">ความรุนแรง</th>
              <th className="p-3 text-left">ชื่อเคส</th>
              <th className="p-3 text-left">ผู้รายงาน</th>
              {/* <th className="p-3 text-left">โมดูล</th>
              <th className="p-3 text-left">URL</th> */}
              <th className="p-3 text-left">สถานะ</th>
              <th className="p-3 text-center">ดูเพิ่มเติม</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {filteredCases.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 border-b">
                <td className="p-3 text-xs break-all">
                  {new Date(item.createdat).toLocaleString("th-TH", {
                    hour12: false,         // ปิดรูปแบบ 12 ชั่วโมง
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  })}
                </td>
                <td className="p-3">
                  <span className={getpriorityClass(item.priority)}>{item.priority || "-"}</span>
                </td>
                <td className="p-3">{item.title || "-"}</td>
                <td className="p-3">{item.reporter}</td>
                {/* <td className="p-3 max-w-[200px] truncate">{item.module||"-"}</td>
                <td className="p-3 max-w-[200px] truncate">{item.url||"-"}</td> */}
                <td className="p-3">
                  <span className={getStatusClass(item.status)}>{item.status || "-"}</span>
                </td>
                <td className="p-3 text-center">
                  <button
                    className="px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-xs shadow"
                    onClick={() => {
                      setSelectedCase(item)
                      setIsModalOpen(true)
                    }}
                  >
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-8 relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <img
                  src={selectedCase.screenshotpath}
                  alt="case screenshot"
                  className="w-full h-auto rounded border cursor-pointer hover:shadow-lg transition"
                  onClick={() => setIsImagePreviewOpen(true)}
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedCase.title}</h2>
                <p><strong>ระดับความรุนแรง:</strong> <span className={getpriorityClass(selectedCase.priority)}>{selectedCase.priority || "-"}</span></p>
                <p><strong>สถานะ:</strong> <span className={getStatusClass(selectedCase.status)}>{selectedCase.status}</span></p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedCase, "pending")}
                    className="px-4 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                  >
                    🟡 Pending
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedCase, "devdone")}
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    💻 Dev Done
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedCase, "resolved")}
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    ✅ Mark Resolved
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedCase, "rejected")}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    ❌ Reject
                  </button>
                </div>
                <p><strong>ผู้รายงาน:</strong> {selectedCase.reporter}</p>
                <p><strong>URL:</strong> <a href={selectedCase.url} target="_blank" className="text-blue-600 underline break-all">{selectedCase.url}</a></p>
                <p><strong>โมดูล:</strong> <a href={selectedCase.module} target="_blank" className="text-pink-600 underline break-all">คลิกเพื่อวาร์ป(ของระบบ)</a></p>
                <p><strong>รายละเอียด:</strong></p>
                <p className="bg-gray-100 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap">{selectedCase.description}</p>
                <p className="text-sm text-gray-400">🕒 วันที่แจ้ง:  {new Date(selectedCase.createdat).toLocaleString("th-TH", {
                  hour12: false,         // ปิดรูปแบบ 12 ชั่วโมง
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isImagePreviewOpen && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setIsImagePreviewOpen(false)}>
          <img src={selectedCase.screenshotpath} alt="preview" className="max-h-[90vh] max-w-[90vw] rounded shadow-lg border" />
        </div>
      )}

    </div>
  )
}

export default page