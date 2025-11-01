"use client";

import DashboardLayout from "@/layouts/dashboard-layout";

const navigation = [
  { name: "Dashboard", href: "/super-admin/dashboard", icon: "📊" },
  { name: "Clinics", href: "/super-admin/clinics", icon: "🏥" },
  { name: "Subscriptions", href: "/super-admin/subscriptions", icon: "💳" },
  { name: "Users", href: "/super-admin/users", icon: "👥" },
  { name: "Reports", href: "/super-admin/reports", icon: "📈" },
  { name: "Settings", href: "/super-admin/settings", icon: "⚙️" },
];

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout navigation={navigation} title="Super Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clinics</p>
              <p className="text-3xl font-bold text-gray-900">245</p>
            </div>
            <div className="text-4xl">🏥</div>
          </div>
          <p className="mt-2 text-sm text-green-600">+12% from last month</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
          <p className="mt-2 text-sm text-green-600">+8% from last month</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Revenue
              </p>
              <p className="text-3xl font-bold text-gray-900">$45,231</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <p className="mt-2 text-sm text-green-600">+23% from last month</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900">189</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
          <p className="mt-2 text-sm text-red-600">-3% from last month</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">New Clinic Registered</p>
              <p className="text-sm text-gray-500">City Medical Center</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Subscription Upgraded</p>
              <p className="text-sm text-gray-500">
                Downtown Clinic → Professional Plan
              </p>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Support Ticket</p>
              <p className="text-sm text-gray-500">Payment issue reported</p>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
