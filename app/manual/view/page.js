// app/manual/view/page.jsx
import ManualViewClient from "@/components/Tiny/ManualViewClient";
import { Suspense } from "react"; 

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">⏳ กำลังโหลด...</div>}>
      <ManualViewClient />
    </Suspense>
  );
}
