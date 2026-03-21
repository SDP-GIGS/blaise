import AppLayout from "../../components/AppLayout";
import { mockEvaluations } from "../../data/mockData";
import { motion } from "framer-motion";
import { Award, Star, Trophy, Target } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const demoStudentId = 1;

const StudentScores = () => {
  // Always use mock data for John Student
  const evals = mockEvaluations.filter((e) => e.studentId === demoStudentId);

  const weightedTotal = evals.reduce((sum, e) => {
    const pct = (e.totalScore / e.maxTotal) * e.weight;
    return sum + pct;
  }, 0);

  const maxWeight = evals.reduce((sum, e) => sum + e.weight, 0);

  const gaugeData = [
    {
      value: weightedTotal,
      fill: "hsl(45 93% 58%)",
    },
  ];

  return (
    <AppLayout>
      <div className="relative min-h-screen w-full bg-linear-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-yellow-400 font-semibold text-xs uppercase tracking-widest mb-2">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>Scores</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">My Scores</h1>
            <p className="text-white/70 text-base">
              View your evaluation results and weighted scores
            </p>
          </motion.div>

          {evals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 p-8 flex flex-col items-center justify-center shadow text-center"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-yellow-100/20 mb-4">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                No Evaluations Yet
              </h2>
              <p className="text-white/60">
                Scores will appear once your supervisors submit evaluations.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 p-8 shadow flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center justify-center h-40 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        data={gaugeData}
                        barSize={12}
                      >
                        <RadialBar
                          background={{ fill: "hsl(220 30% 14%)" }}
                          dataKey="value"
                          cornerRadius={10}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Star className="w-8 h-8 text-yellow-400 mb-1" />
                      <p className="text-3xl font-extrabold text-white drop-shadow">
                        {weightedTotal.toFixed(1)}%
                      </p>
                      <p className="text-xs text-white/60 font-bold tracking-widest">
                        WEIGHTED SCORE
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 justify-center">
                    <h2 className="text-xl font-bold text-white mb-1">
                      Performance Summary
                    </h2>
                    <p className="text-white/70 mb-2">
                      Based on {evals.length} evaluation
                      {evals.length > 1 ? "s" : ""} totaling {maxWeight}% weight
                    </p>
                    <div className="flex gap-4">
                      <div className="rounded-xl bg-yellow-400/20 px-4 py-2 text-center">
                        <p className="text-lg font-bold text-yellow-300">
                          {evals.length}
                        </p>
                        <p className="text-xs text-white/70">Evaluations</p>
                      </div>
                      <div className="rounded-xl bg-emerald-400/20 px-4 py-2 text-center">
                        <p className="text-lg font-bold text-emerald-300">
                          {maxWeight}%
                        </p>
                        <p className="text-xs text-white/70">Weight Used</p>
                      </div>
                      <div className="rounded-xl bg-cyan-400/20 px-4 py-2 text-center">
                        <p className="text-lg font-bold text-cyan-300">
                          {weightedTotal >= 70
                            ? "A"
                            : weightedTotal >= 50
                              ? "B"
                              : "C"}
                        </p>
                        <p className="text-xs text-white/70">Grade</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col gap-6 mt-8">
                {evals.map((ev, i) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 p-6 shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 flex items-center justify-center rounded-full ${ev.type === "workplace" ? "bg-emerald-400/30" : "bg-yellow-400/30"}`}
                        >
                          <Target className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">
                            {ev.type === "workplace"
                              ? "Workplace Evaluation"
                              : "Academic Evaluation"}
                          </p>
                          <p className="text-xs text-white/60">
                            By {ev.evaluatorName} • Weight: {ev.weight}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-white">
                          {ev.totalScore}/{ev.maxTotal}
                        </p>
                        <p className="text-xs text-white/60">
                          {((ev.totalScore / ev.maxTotal) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-2">
                      {ev.criteria.map((c) => (
                        <div key={c.name} className="flex items-center gap-4">
                          <p className="w-32 text-xs text-white/70 font-bold">
                            {c.name}
                          </p>
                          <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(c.score / c.maxScore) * 100}%`,
                              }}
                              transition={{
                                duration: 0.8,
                                delay: 0.3 + i * 0.1,
                              }}
                              className={`h-full rounded-full ${ev.type === "workplace" ? "bg-emerald-400/80" : "bg-yellow-400/80"}`}
                            />
                          </div>
                          <span className="text-xs text-white/80 font-bold">
                            {c.score}/{c.maxScore}
                          </span>
                        </div>
                      ))}
                    </div>
                    {ev.comments && (
                      <div className="mt-2 rounded-lg bg-white/10 p-4">
                        <p className="text-xs text-white/60 font-bold mb-1">
                          Comments
                        </p>
                        <p className="text-white/90">{ev.comments}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Ambient Glow Effects */}
        <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-0">
          <div className="absolute top-[-10%] left-[-10%] w-100 h-100 bg-linear-to-br from-yellow-400 via-emerald-400 to-cyan-400 opacity-30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-100 h-100 bg-linear-to-br from-cyan-400 via-emerald-400 to-yellow-400 opacity-20 blur-[120px] rounded-full" />
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentScores;
