import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { motion } from "framer-motion";
import { Award, Trophy, Target, BookOpen, Briefcase, GraduationCap } from "lucide-react";

const getGradeColor = (pct) => {
  if (pct >= 80) return "text-emerald-400";
  if (pct >= 60) return "text-sky-400";
  if (pct >= 50) return "text-amber-400";
  return "text-red-400";
};


const getGradeLabel = (pct) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "F";
};

const ScoreCard = ({ icon: Icon, label, score, outOf, contribution, weight, color, delay }) => {
  const pct = outOf > 0 ? Math.round((score / outOf) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 p-6 shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className={`text-sm font-bold ${color}`}>{label}</p>
            <p className="text-xs text-white/50">Weight: {weight}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-extrabold ${getGradeColor(pct)}`}>{score}</p>
          <p className="text-xs text-white/50">out of {outOf}</p>
        </div>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-sky-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{pct}% score</span>
        <span className="text-white/70 font-semibold">Contributes {contribution} pts</span>
      </div>
    </motion.div>
  );
};

const StudentScores = () => {
  const { user } = useAuth();
  const [scoreData, setScoreData] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [scoreRes, evalsRes] = await Promise.all([
          apiClient.get(`/scores/${user?.id}/`),
          apiClient.get('/evaluations/'),
        ]);
        setScoreData(scoreRes);
        setEvaluations(Array.isArray(evalsRes) ? evalsRes : []);
      } catch (err) {
        setError(err?.message || "Unable to load scores.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) loadData();
  }, [user]);

  return (
    <AppLayout>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 text-yellow-400 font-semibold text-xs uppercase tracking-widest mb-2">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>Scores</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">My Scores</h1>
            <p className="text-white/70 text-base">Your weighted internship evaluation breakdown</p>
          </motion.div>

          {error && (
            <div className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">{error}</div>
          )}

          {loading ? (
            <div className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 p-8 text-white/80">Loading scores...</div>
          ) : !scoreData ? (
            <div className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 p-8 flex flex-col items-center text-center">
              <Award className="w-8 h-8 text-yellow-400 mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">No Scores Yet</h2>
              <p className="text-white/60">Scores will appear once your supervisors submit evaluations.</p>
            </div>
          ) : (
            <>
              {/* Final Score Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 flex flex-col items-center text-center shadow-xl"
              >
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Final Weighted Score</p>
                <p className={`text-7xl font-extrabold mb-1 ${getGradeColor(scoreData.final_score)}`}>
                  {scoreData.final_score}
                </p>
                <p className="text-white/50 text-sm mb-3">out of {scoreData.final_score_out_of}</p>
                <span className={`text-2xl font-bold px-4 py-1 rounded-full bg-white/10 ${getGradeColor(scoreData.final_score)}`}>
                  Grade {getGradeLabel(scoreData.final_score)}
                </span>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden mt-6">
                  <motion.div
                    className={`h-full rounded-full ${scoreData.final_score >= 80 ? "bg-emerald-500" : scoreData.final_score >= 60 ? "bg-sky-500" : scoreData.final_score >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${scoreData.final_score}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Score Breakdown */}
              <div className="flex flex-col gap-4">
                <ScoreCard
                  icon={Briefcase}
                  label="Workplace Evaluation"
                  score={scoreData.workplace_evaluation.score}
                  outOf={scoreData.workplace_evaluation.out_of}
                  contribution={scoreData.workplace_evaluation.contribution}
                  weight={scoreData.workplace_evaluation.weight}
                  color="text-sky-400"
                  delay={0.1}
                />
                <ScoreCard
                  icon={GraduationCap}
                  label="Academic Evaluation"
                  score={scoreData.academic_evaluation.score}
                  outOf={scoreData.academic_evaluation.out_of}
                  contribution={scoreData.academic_evaluation.contribution}
                  weight={scoreData.academic_evaluation.weight}
                  color="text-violet-400"
                  delay={0.2}
                />
                <ScoreCard
                  icon={BookOpen}
                  label="Logbook Score"
                  score={scoreData.logbook.average_score}
                  outOf={scoreData.logbook.out_of}
                  contribution={scoreData.logbook.contribution}
                  weight={scoreData.logbook.weight}
                  color="text-emerald-400"
                  delay={0.3}
                />
              </div>

              {/* Logbook Details */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 p-6"
              >
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Logbook Details</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{scoreData.logbook.logs_reviewed}</p>
                    <p className="text-xs text-white/50">Logs Reviewed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">{scoreData.logbook.average_score}/30</p>
                    <p className="text-xs text-white/50">Average Log Score</p>
                  </div>
                </div>
              </motion.div>

              {/* Individual Evaluations */}
              {evaluations.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-white/50 text-xs uppercase tracking-widest">Evaluation Details</p>
                  {evaluations.map((ev, index) => (
                    <motion.div key={ev.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.06 }}
                      className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 p-6 shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-cyan-200" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white capitalize">{ev.evaluation_type} Evaluation</p>
                            <p className="text-xs text-white/60">By {ev.evaluator_name || "Supervisor"} · {ev.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getGradeColor((ev.total_score / 100) * 100)}`}>{ev.total_score}</p>
                          <p className="text-xs text-white/50">/ 100</p>
                        </div>
                      </div>
                      {ev.criteria_scores?.length > 0 && (
                        <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
                          {ev.criteria_scores.map((cs) => (
                            <div key={cs.id} className="flex items-center justify-between text-xs text-white/60">
                              <span className="capitalize">{cs.criteria.replace(/_/g, ' ')}</span>
                              <span className="font-semibold text-white/80">{cs.score}/{cs.max_score}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {ev.comments && (
                        <p className="text-white/70 text-sm mt-3 pt-3 border-t border-white/10">{ev.comments}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentScores;


