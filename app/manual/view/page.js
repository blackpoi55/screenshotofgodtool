// app/manual/view/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; 

export default function ManualViewPage() {
    const [manual, setManual] = useState(null);
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
        const fetchManual = async () => {
            try {
                const res = await fetch(`https://api-h-series.telecorp.co.th/api/manual/${id}`);
                const data = await res.json();
                setManual(data.data);
            } catch (error) {
                console.error("โหลดข้อมูลล้มเหลว:", error);
            }
        };

        if (id) fetchManual();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
            <div
                className="mx-auto bg-white dark:bg-gray-800 shadow-md rounded p-6 w-[925px]"
            >
                {manual ? (
                    <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: manual.detail }}
                    />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 p-6">กำลังโหลดข้อมูล...</p>
                )}
            </div>
        </div>
    );
}
