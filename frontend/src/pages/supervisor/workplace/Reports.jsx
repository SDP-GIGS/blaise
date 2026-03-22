import AppLayout from "@/components/AppLayout";
import { BarChart3 } from "lucide-react";

const WorkplaceReports = () => (
  <AppLayout>
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-emerald-600" /> Reports & Aggregation
      </h1>
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-6">
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          View charts, statistics, and aggregated data for your assigned
          students and their progress.
        </p>
        {/* Charts and reporting widgets go here */}
      </div>
    </div>
  </AppLayout>
);

export default WorkplaceReports;
