// app/manual/view/page.jsx
import { Suspense } from "react";
import ManualViewClient from "./ManualViewClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">⏳ กำลังโหลด...</div>}>
      <ManualViewClient />
    </Suspense>
  );
}
