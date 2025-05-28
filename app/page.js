// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6 space-y-6 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow px-4 py-3 rounded flex justify-between items-center">
        <h1 className="text-xl font-bold">Next.js Tailwind UI</h1>
        <div className="space-x-4">
          <a href="#" className="text-blue-600 hover:underline">Home</a>
          <a href="https://docs.google.com/spreadsheets/d/1I1JJXCIk-fVTdO-wWS7U2l5GmLkWwRc4ag__Elvpo6s/edit?usp=sharing" className="text-blue-600 hover:underline">sheet</a>
          <a href="https://drive.google.com/drive/folders/1MCMwaJZGR5FnFJZVCXC4DsN4hY8ncpLS?usp=sharing" className="text-blue-600 hover:underline">drive</a>
        </div>
      </nav>

      {/* Buttons */}
      <div className="space-x-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Primary</button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Success</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Danger</button>
        <button className="px-4 py-2 border rounded hover:bg-gray-100">Default</button>
      </div>

      {/* Form */}
      <div className="bg-white p-4 rounded shadow space-y-4 max-w-md">
        <h2 className="text-lg font-semibold">Form</h2>
        <input type="text" placeholder="Name" className="w-full border rounded p-2" />
        <input type="email" placeholder="Email" className="w-full border rounded p-2" />
        <textarea placeholder="Message" className="w-full border rounded p-2"></textarea>
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">Card {n}</h3>
            <p>This is content inside card {n}.</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow mt-6">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2 px-4">Somchai</td>
              <td className="py-2 px-4">somchai@example.com</td>
              <td className="py-2 px-4">
                <span className="px-2 py-1 text-xs rounded bg-green-200 text-green-800">Active</span>
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4">Supaporn</td>
              <td className="py-2 px-4">supaporn@example.com</td>
              <td className="py-2 px-4">
                <span className="px-2 py-1 text-xs rounded bg-yellow-200 text-yellow-800">Pending</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
