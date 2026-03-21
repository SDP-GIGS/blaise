import React from "react";
import AppLayout from "../../components/AppLayout";

export default function AdminDashboard() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          Welcome to the Internship Logging & Evaluation System (ILES) Admin
          Dashboard.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Manage users and roles</li>
          <li>Oversee internship placements</li>
          <li>View and generate reports</li>
          <li>Monitor system activity and statistics</li>
        </ul>
      </div>
    </AppLayout>
  );
}
