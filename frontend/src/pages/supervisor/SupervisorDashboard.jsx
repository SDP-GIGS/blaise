import React from "react";
import AppLayout from "../../components/AppLayout";

export default function SupervisorDashboard() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Supervisor Dashboard</h1>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          Welcome to the ILES Supervisor Dashboard. Here you can review logs,
          evaluate students, and track your assigned interns.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Review weekly logbooks</li>
          <li>Submit evaluations</li>
          <li>View assigned students</li>
        </ul>
      </div>
    </AppLayout>
  );
}
