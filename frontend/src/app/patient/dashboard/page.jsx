"use client";

import PortalLayout from "@/layouts/portal-layout";

const navigation = [
  { name: "Dashboard", href: "/patient/dashboard" },
  { name: "Appointments", href: "/patient/appointments" },
  { name: "Medical History", href: "/patient/medical-history" },
  { name: "Billing", href: "/patient/billing" },
];

export default function PatientDashboard() {
  return (
    <PortalLayout navigation={navigation}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>

        {/* Upcoming Appointment */}
        <div className="rounded-lg bg-primary-50 border border-primary-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-primary-900">
            Next Appointment
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dr. Sarah Johnson</p>
              <p className="text-sm text-gray-600">General Checkup</p>
              <p className="mt-2 text-sm">
                📅 Tomorrow, March 15, 2024 at 10:00 AM
              </p>
            </div>
            <button className="rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700">
              View Details
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <button className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
            <div className="mb-2 text-4xl">📅</div>
            <h3 className="font-semibold">Book Appointment</h3>
            <p className="mt-1 text-sm text-gray-600">Schedule a new visit</p>
          </button>

          <button className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
            <div className="mb-2 text-4xl">📋</div>
            <h3 className="font-semibold">Medical Records</h3>
            <p className="mt-1 text-sm text-gray-600">View your history</p>
          </button>

          <button className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
            <div className="mb-2 text-4xl">💳</div>
            <h3 className="font-semibold">Pay Bills</h3>
            <p className="mt-1 text-sm text-gray-600">Manage payments</p>
          </button>
        </div>

        {/* Recent Visits */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Recent Visits</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">General Checkup</p>
                <p className="text-sm text-gray-600">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">March 1, 2024</p>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                View Report
              </button>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Follow-up Visit</p>
                <p className="text-sm text-gray-600">Dr. Michael Brown</p>
                <p className="text-xs text-gray-500">February 15, 2024</p>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                View Report
              </button>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Pending Payments</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Invoice #1234</p>
                <p className="text-sm text-gray-600">
                  General Checkup - March 1
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">$150.00</p>
                <button className="mt-1 text-sm text-primary-600 hover:text-primary-700">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
