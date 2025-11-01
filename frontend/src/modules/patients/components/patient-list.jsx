"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { usePatients } from "../hooks/use-patients";

export function PatientList() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = usePatients({ search });

  if (isLoading) return <div>Loading patients...</div>;
  if (error) return <div>Error loading patients</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Patients</h2>
        <Button>Add Patient</Button>
      </div>

      <Input
        type="search"
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="rounded-lg border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data?.data?.map((patient) => (
              <tr key={patient.id}>
                <td className="whitespace-nowrap px-6 py-4">{patient.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{patient.phone}</td>
                <td className="whitespace-nowrap px-6 py-4">{patient.email}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
