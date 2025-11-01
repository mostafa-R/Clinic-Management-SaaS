"use client";

import DashboardLayout from "@/layouts/dashboard-layout";

const navigation = [
  { name: "Dashboard", href: "/clinic/dashboard", icon: "📊" },
  { name: "Patients", href: "/clinic/patients", icon: "👨‍⚕️" },
  { name: "Appointments", href: "/clinic/appointments", icon: "📅" },
  { name: "Billing", href: "/clinic/billing", icon: "💳" },
  { name: "Staff", href: "/clinic/staff", icon: "👥" },
  { name: "Reports", href: "/clinic/reports", icon: "📈" },
  { name: "Settings", href: "/clinic/settings", icon: "⚙️" },
];

export default function ClinicDashboard() {
  return (
    <DashboardLayout navigation={navigation} title="Clinic Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Patients
              </p>
              <p className="text-3xl font-bold text-gray-900">1,284</p>
            </div>
            <div className="text-4xl">👨‍⚕️</div>
          </div>
          <p className="mt-2 text-sm text-green-600">+15 this week</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Today's Appointments
              </p>
              <p className="text-3xl font-bold text-gray-900">28</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
          <p className="mt-2 text-sm text-gray-600">12 completed, 16 pending</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Revenue
              </p>
              <p className="text-3xl font-bold text-gray-900">$12,450</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <p className="mt-2 text-sm text-green-600">+18% from last month</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Invoices
              </p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
          <p className="mt-2 text-sm text-orange-600">$3,240 outstanding</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Today's Schedule</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-l-4 border-green-500 bg-green-50 p-3">
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600">General Checkup</p>
              </div>
              <span className="text-sm font-medium text-green-600">
                9:00 AM
              </span>
            </div>
            <div className="flex items-center justify-between border-l-4 border-blue-500 bg-blue-50 p-3">
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-gray-600">Follow-up Visit</p>
              </div>
              <span className="text-sm font-medium text-blue-600">
                10:30 AM
              </span>
            </div>
            <div className="flex items-center justify-between border-l-4 border-yellow-500 bg-yellow-50 p-3">
              <div>
                <p className="font-medium">Mike Johnson</p>
                <p className="text-sm text-gray-600">Consultation</p>
              </div>
              <span className="text-sm font-medium text-yellow-600">
                2:00 PM
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Recent Patients</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  JD
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">
                    Last visit: 2 days ago
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  JS
                </div>
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500">
                    Last visit: 1 week ago
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  MJ
                </div>
                <div>
                  <p className="font-medium">Mike Johnson</p>
                  <p className="text-sm text-gray-500">
                    Last visit: 2 weeks ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
