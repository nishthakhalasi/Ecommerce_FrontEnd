"use client";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Total Users</h2>
        <p className="text-3xl font-bold">150</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Orders Today</h2>
        <p className="text-3xl font-bold">25</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Revenue</h2>
        <p className="text-3xl font-bold">$1,200</p>
      </div>
    </div>
  );
}
