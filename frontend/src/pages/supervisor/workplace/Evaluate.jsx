import AppLayout from "@/components/AppLayout";

const WorkplaceEvaluate = () => (
  <AppLayout>
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Evaluate Student</h1>
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-6">
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Fill in the evaluation form for the selected student. Assign scores
          and provide comments.
        </p>
        {/* Evaluation form goes here */}
      </div>
    </div>
  </AppLayout>
);

export default WorkplaceEvaluate;
