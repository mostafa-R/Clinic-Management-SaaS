"use client";

import DashboardLayout from "@/layouts/dashboard-layout";

const navigation = [
  { name: "Dashboard", href: "/staff/dashboard", icon: "📊" },
  { name: "Appointments", href: "/staff/appointments", icon: "📅" },
  { name: "Patients", href: "/staff/patients", icon: "👨‍⚕️" },
  { name: "Billing", href: "/staff/billing", icon: "💳" },
  { name: "Reports", href: "/staff/reports", icon: "📈" },
];

export default function StaffDashboard() {
  return (
    <DashboardLayout navigation={navigation} title="Staff Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Today's Check-ins
              </p>
              <p className="text-3xl font-bold text-gray-900">18</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
          <p className="mt-2 text-sm text-gray-600">5 waiting</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Payments
              </p>
              <p className="text-3xl font-bold text-gray-900">$2,340</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <p className="mt-2 text-sm text-orange-600">12 invoices</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Patients</p>
              <p className="text-3xl font-bold text-gray-900">7</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
          <p className="mt-2 text-sm text-green-600">This week</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <button className="rounded-lg border-2 border-primary-200 bg-primary-50 p-4 text-center transition hover:bg-primary-100">
            <div className="mb-2 text-3xl">👤</div>
            <p className="font-medium">Register Patient</p>
          </button>
          <button className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-center transition hover:bg-blue-100">
            <div className="mb-2 text-3xl">📅</div>
            <p className="font-medium">Book Appointment</p>
          </button>
          <button className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-center transition hover:bg-green-100">
            <div className="mb-2 text-3xl">💳</div>
            <p className="font-medium">Process Payment</p>
          </button>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Upcoming Appointments</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-600">General Checkup</p>
            </div>
            <div className="text-right">
              <p className="font-medium">10:00 AM</p>
              <span className="text-xs rounded-full bg-green-100 px-2 py-1 text-green-700">
                Confirmed
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Jane Smith</p>
              <p className="text-sm text-gray-600">Follow-up</p>
            </div>
            <div className="text-right">
              <p className="font-medium">11:30 AM</p>
              <span className="text-xs rounded-full bg-yellow-100 px-2 py-1 text-yellow-700">
                Waiting
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
