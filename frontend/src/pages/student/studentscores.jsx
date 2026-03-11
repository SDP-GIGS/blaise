import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { mockEvaluations } from "../../data/mockData";
import { motion } from "framer-motion";
import { Award, Star, Trophy, Target } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import "./studentscore.css";

const StudentScores = () => {
  const { user } = useAuth();
  const evals = mockEvaluations.filter((e) => e.studentId === user?.id);

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
      <div className="scores-root">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="scores-header"
        >
          <div className="scores-kicker">
            <Trophy className="scores-kicker-icon" />
            <span>Scores</span>
          </div>
          <h1 className="scores-title">My Scores</h1>
          <p className="scores-subtitle">
            View your evaluation results and weighted scores
          </p>
        </motion.div>

        {evals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="scores-empty-card"
          >
            <div className="scores-empty-icon">
              <Award className="scores-empty-icon-svg" />
            </div>
            <h2 className="scores-empty-title">No Evaluations Yet</h2>
            <p className="scores-empty-text">
              Scores will appear once your supervisors submit evaluations.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="scores-summary-card"
            >
              <div className="scores-summary-grid">
                <div className="scores-gauge-wrapper">
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
                  <div className="scores-gauge-center">
                    <Star className="scores-gauge-star" />
                    <p className="scores-gauge-value">
                      {weightedTotal.toFixed(1)}%
                    </p>
                    <p className="scores-gauge-label">WEIGHTED SCORE</p>
                  </div>
                </div>
                <div className="scores-summary-info">
                  <div>
                    <h2 className="scores-summary-title">Performance Summary</h2>
                    <p className="scores-summary-subtitle">
                      Based on {evals.length} evaluation
                      {evals.length > 1 ? "s" : ""} totaling {maxWeight}% weight
                    </p>
                  </div>
                  <div className="scores-summary-stats">
                    <div className="scores-summary-pill">
                      <p className="scores-summary-pill-value">
                        {evals.length}
                      </p>
                      <p className="scores-summary-pill-label">
                        Evaluations
                      </p>
                    </div>
                    <div className="scores-summary-pill">
                      <p className="scores-summary-pill-value">
                        {maxWeight}%
                      </p>
                      <p className="scores-summary-pill-label">
                        Weight Used
                      </p>
                    </div>
                    <div className="scores-summary-pill">
                      <p className="scores-summary-pill-grade">
                        {weightedTotal >= 70
                          ? "A"
                          : weightedTotal >= 50
                          ? "B"
                          : "C"}
                      </p>
                      <p className="scores-summary-pill-label">Grade</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="scores-evals">
              {evals.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="scores-eval-card"
                >
                  <div className="scores-eval-header">
                    <div className="scores-eval-title-wrap">
                      <div
                        className={
                          ev.type === "workplace"
                            ? "scores-eval-icon scores-eval-icon--workplace"
                            : "scores-eval-icon scores-eval-icon--academic"
                        }
                      >
                        <Target className="scores-eval-icon-svg" />
                      </div>
                      <div>
                        <p className="scores-eval-title">
                          {ev.type === "workplace"
                            ? "Workplace Evaluation"
                            : "Academic Evaluation"}
                        </p>
                        <p className="scores-eval-subtitle">
                          By {ev.evaluatorName} • Weight: {ev.weight}%
                        </p>
                      </div>
                    </div>
                    <div className="scores-eval-score-wrap">
                      <p className="scores-eval-score">
                        {ev.totalScore}/{ev.maxTotal}
                      </p>
                      <p className="scores-eval-percent">
                        {((ev.totalScore / ev.maxTotal) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="scores-criteria-list">
                    {ev.criteria.map((c) => (
                      <div key={c.name} className="scores-criteria-row">
                        <p className="scores-criteria-name">{c.name}</p>
                        <div className="scores-criteria-bar">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(c.score / c.maxScore) * 100}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              delay: 0.3 + i * 0.1,
                            }}
                            className="scores-criteria-bar-fill"
                          />
                        </div>
                        <span className="scores-criteria-score">
                          {c.score}/{c.maxScore}
                        </span>
                      </div>
                    ))}
                  </div>

                  {ev.comments && (
                    <div className="scores-comments">
                      <p className="scores-comments-label">Comments</p>
                      <p className="scores-comments-text">{ev.comments}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentScores;

