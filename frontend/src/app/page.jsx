import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">
          🏥 Clinic Management System
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Comprehensive SaaS platform for managing medical clinics,
          appointments, and patient records
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/auth/login">
            <Button size="lg" className="px-8">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/patient/booking">
            <Button size="lg" variant="secondary" className="px-8">
              Book Appointment
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 text-4xl">👨‍⚕️</div>
            <h3 className="mb-2 text-xl font-semibold">Patient Management</h3>
            <p className="text-gray-600">
              Complete patient records with medical history and documents
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 text-4xl">📅</div>
            <h3 className="mb-2 text-xl font-semibold">Appointments</h3>
            <p className="text-gray-600">
              Online booking with automated reminders via SMS/Email/WhatsApp
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 text-4xl">💳</div>
            <h3 className="mb-2 text-xl font-semibold">Billing & Payments</h3>
            <p className="text-gray-600">
              Invoice generation and multiple payment methods supported
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
