import AppLayout from "@/components/AppLayout";

const WorkplaceSupervisorDashboard = () => (
  <AppLayout>
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">
        Workplace Supervisor Dashboard
      </h1>
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-6">
        <p className="text-gray-700 dark:text-gray-200 mb-2">
          Welcome! Here you can see an overview of your assigned students,
          pending reviews, and recent activity.
        </p>
        {/* Add dashboard widgets here */}
      </div>
    </div>
  </AppLayout>
);

export default WorkplaceSupervisorDashboard;
