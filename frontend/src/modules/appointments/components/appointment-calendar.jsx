"use client";

import { useState } from "react";

export function AppointmentCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Appointments Calendar</h2>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <p className="text-gray-500">
          Calendar component will be implemented here
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Using FullCalendar or React Big Calendar
        </p>
      </div>
    </div>
  );
}
