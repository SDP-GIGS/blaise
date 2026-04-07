import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { motion } from "framer-motion";
import { Award, Trophy, Target } from "lucide-react";
import { internshipService } from "@/services/internshipService";

const StudentScores = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await internshipService.listEvaluations();
        setEvaluations(data);
      } catch (loadError) {
        setError(loadError?.message || "Unable to load evaluation scores.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const { averageScore, highestScore } = useMemo(() => {
    if (!evaluations.length) {
      return { averageScore: 0, highestScore: 0 };
    }

    const scores = evaluations.map((item) => Number(item.score) || 0);
    const avg = scores.reduce((sum, value) => sum + value, 0) / scores.length;

    return {
      averageScore: avg,
      highestScore: Math.max(...scores),
    };
  }, [evaluations]);

  return (
    <AppLayout>
      <div className="relative min-h-screen w-full bg-linear-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 text-yellow-400 font-semibold text-xs uppercase tracking-widest mb-2">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>Scores</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">My Scores</h1>
            <p className="text-white/70 text-base">Live evaluation scores from supervisors</p>
          </motion.div>

          {error && (
            <div className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 p-8 text-white/80">
              Loading scores...
            </div>
          ) : evaluations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 p-8 flex flex-col items-center justify-center shadow text-center"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-yellow-100/20 mb-4">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Evaluations Yet</h2>
              <p className="text-white/60">Scores will appear once your supervisors submit evaluations.</p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/10 border border-white/20 p-5">
                  <p className="text-white/60 text-xs">Evaluations</p>
                  <p className="text-2xl font-extrabold text-white">{evaluations.length}</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/20 p-5">
                  <p className="text-white/60 text-xs">Average Score</p>
                  <p className="text-2xl font-extrabold text-white">{averageScore.toFixed(1)}</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/20 p-5">
                  <p className="text-white/60 text-xs">Highest Score</p>
                  <p className="text-2xl font-extrabold text-white">{highestScore}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {evaluations.map((ev, index) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 p-6 shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-400/25 flex items-center justify-center">
                          <Target className="w-5 h-5 text-cyan-200" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white capitalize">{ev.type} evaluation</p>
                          <p className="text-xs text-white/60">By {ev.evaluator_name || "Supervisor"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{ev.score}</p>
                        <p className="text-xs text-white/60">{ev.date}</p>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm">{ev.comments || "No comments"}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentScores;


