import React from "react";
import AppLayout from "../../components/AppLayout";

export default function AcademicDashboard() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">
          Academic Supervisor Dashboard
        </h1>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          Welcome to the ILES Academic Supervisor Dashboard. Here you can review
          logs, submit academic evaluations, and monitor student progress.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Review student logbooks</li>
          <li>Submit academic evaluations</li>
          <li>Monitor student progress</li>
        </ul>
      </div>
    </AppLayout>
  );
}
