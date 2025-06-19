// app/manual/view/page.jsx
import ManualEditClient from "@/components/Customreport/ManualEditClient";
import { Suspense } from "react"; 

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">⏳ กำลังโหลด...</div>}>
      <ManualEditClient />
    </Suspense>
  );
}
