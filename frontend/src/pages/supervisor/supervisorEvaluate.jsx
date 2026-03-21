import { useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { mockPlacements, mockUsers } from "@/data/mockData";
import { motion } from "framer-motion";
import { Calculator, Star, ArrowLeft, CheckCircle } from "lucide-react";

const defaultCriteria = [
  { name: "Technical Skills", maxScore: 10 },
  { name: "Communication", maxScore: 10 },
  { name: "Professionalism", maxScore: 10 },
  { name: "Initiative", maxScore: 10 },
  { name: "Teamwork", maxScore: 10 },
];

const SupervisorEvaluate = () => {
  const students = useMemo(() => {
    const usersById = Object.fromEntries(mockUsers.map((u) => [u.id, u]));

    return mockPlacements
      .filter((p) => p.status === "active")
      .map((p) => ({
        ...p,
        studentName: p.studentName || usersById[p.studentId]?.name || "Student",
      }));
  }, []);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleScoreChange = (name, value) => {
    setScores({ ...scores, [name]: Math.min(10, Math.max(0, value)) });
  };

  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const maxTotal = defaultCriteria.length * 10;
  const pct = maxTotal > 0 ? (totalScore / maxTotal) * 100 : 0;

  const selectedPlacement = students.find((p) => p.id === selectedStudent);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedStudent(null);
      setScores({});
      setComments("");
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">
              Evaluate
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">
            Evaluate Student
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Submit evaluation scores for your assigned students
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 card-premium"
          >
            <div className="w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-5 shadow-gold">
              <CheckCircle className="w-10 h-10 text-background" />
            </div>
            <h2 className="text-2xl font-bold font-display text-foreground">
              Evaluation Submitted!
            </h2>
            <p className="text-muted-foreground mt-2">Score recorded successfully.</p>
          </motion.div>
        ) : !selectedStudent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium"
          >
            <div className="p-6 border-b border-border/50">
              <h2 className="text-lg font-bold font-display text-foreground">
                Select a Student
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose a student to evaluate
              </p>
            </div>

            <div className="divide-y divide-border/50">
              {students.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedStudent(p.id)}
                  className="w-full p-5 text-left hover:bg-secondary/30 transition-all duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                      {p.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {p.studentName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.company} • {p.department}
                      </p>
                    </div>
                  </div>
                  <Calculator className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-gold text-sm font-bold text-background">
                  {selectedPlacement?.studentName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display text-foreground">
                    {selectedPlacement?.studentName}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedPlacement?.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="btn-secondary text-xs py-2 px-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <div className="space-y-5 mb-8">
              {defaultCriteria.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <p className="text-sm font-medium text-foreground w-40 flex-shrink-0">
                    {c.name}
                  </p>
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="number"
                      min={0}
                      max={c.maxScore}
                      value={scores[c.name] ?? ""}
                      onChange={(e) => handleScoreChange(c.name, Number(e.target.value))}
                      className="input-premium w-20 text-center"
                      placeholder="0"
                    />
                    <span className="text-xs text-muted-foreground">/ {c.maxScore}</span>
                    <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full gradient-gold rounded-full"
                        animate={{ width: `${((scores[c.name] || 0) / c.maxScore) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-5 mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground font-display">Total Score</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pct.toFixed(0)}% overall performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground font-display">
                  {totalScore}
                  <span className="text-lg text-muted-foreground">/{maxTotal}</span>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[11px] font-bold text-muted-foreground mb-2 block uppercase tracking-wider">
                Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="input-premium"
                placeholder="Overall comments about the student's performance..."
              />
            </div>

            <button onClick={handleSubmit} className="btn-primary">
              Submit Evaluation
            </button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default SupervisorEvaluate;