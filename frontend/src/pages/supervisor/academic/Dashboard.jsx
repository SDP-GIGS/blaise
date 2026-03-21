import AppLayout from "@/components/AppLayout";
import {
  mockPlacements,
  mockLogs,
  mockEvaluations,
  mockUsers,
} from "@/data/mockData";

const assignedStudents = mockPlacements.filter(
  (p) => p.academicSupervisor === "Dr. Academic Supervisor",
);
const pendingReviews = mockLogs.filter((l) => l.status === "submitted");
const recentEvaluations = mockEvaluations.filter((e) => e.type === "academic");

import { UserCircle2, GraduationCap, Users2, FileText } from "lucide-react";

const AcademicSupervisorDashboard = () => (
  <AppLayout>
    <div className="max-w-5xl mx-auto mt-8 space-y-8">
      <h1 className="text-3xl font-extrabold mb-2 text-gradient bg-gradient-to-r from-cyan-500 to-emerald-400 bg-clip-text text-transparent">
        Academic Supervisor Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
        Welcome! Here is an overview of your assigned students, pending reviews,
        and evaluation stats.
      </p>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-100 to-emerald-100 dark:from-cyan-900 dark:to-emerald-900 p-6 shadow flex flex-col items-center">
          <span className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">
            {assignedStudents.length}
          </span>
          <span className="text-gray-700 dark:text-gray-200 mt-1">
            Assigned Students
          </span>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900 dark:to-yellow-950 p-6 shadow flex flex-col items-center">
          <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
            {pendingReviews.length}
          </span>
          <span className="text-gray-700 dark:text-gray-200 mt-1">
            Pending Reviews
          </span>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-50 dark:from-emerald-900 dark:to-cyan-950 p-6 shadow flex flex-col items-center">
          <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            {recentEvaluations.length}
          </span>
          <span className="text-gray-700 dark:text-gray-200 mt-1">
            Evaluations Done
          </span>
        </div>
      </div>

      {/* Assigned Students Table */}
      <div className="bg-white/90 dark:bg-gray-900/80 rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">
          Assigned Students
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-emerald-50 dark:bg-emerald-900/30">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedStudents.map((placement) => {
                const student = mockUsers.find(
                  (u) => u.id === placement.studentId,
                );
                return (
                  <tr
                    key={placement.id}
                    className="border-b last:border-0 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10"
                  >
                    <td className="px-4 py-2 font-medium">{student?.name}</td>
                    <td className="px-4 py-2">{placement.company}</td>
                    <td className="px-4 py-2">{placement.department}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-1 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs font-semibold">
                        {placement.status.charAt(0).toUpperCase() +
                          placement.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Academic Evaluations */}
      <div className="bg-white/90 dark:bg-gray-900/80 rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-cyan-700 dark:text-cyan-300">
          Recent Academic Evaluations
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-cyan-50 dark:bg-cyan-900/30">
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              {recentEvaluations.map((evaln) => {
                const student = mockUsers.find((u) => u.id === evaln.studentId);
                return (
                  <tr
                    key={evaln.id}
                    className="border-b last:border-0 hover:bg-cyan-50/40 dark:hover:bg-cyan-900/10"
                  >
                    <td className="px-4 py-2 font-medium">{student?.name}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-1 rounded bg-cyan-200 dark:bg-cyan-800 text-cyan-900 dark:text-cyan-100 text-xs font-semibold">
                        {evaln.totalScore} / {evaln.maxTotal}
                      </span>
                    </td>
                    <td
                      className="px-4 py-2 max-w-xs truncate"
                      title={evaln.comments}
                    >
                      {evaln.comments}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Supervisor Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-2">
        <div className="relative flex-shrink-0">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-500 flex items-center justify-center shadow-lg">
            <UserCircle2 className="w-16 h-16 text-white" />
          </div>
          <span className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow">
            ✓
          </span>
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-emerald-500 bg-clip-text text-transparent">
            Dr. Academic Supervisor
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Academic Supervisor
          </p>
          <p className="text-gray-400 dark:text-gray-400 text-sm">
            academic@example.com
          </p>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default AcademicSupervisorDashboard;
