import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import {
  GraduationCap,
  User,
  Building2,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Send,
  Star,
  AlertCircle,
  ClipboardCheck,
  RotateCcw,
  Info,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    id: "s1",
    name: "Amara Nakato",
    regNo: "21/U/0341",
    company: "MTN Uganda",
    department: "Network Engineering",
    avatar: "AN",
    color: "from-violet-400 to-purple-500",
    evaluated: false,
  },
  {
    id: "s2",
    name: "Brian Ssekandi",
    regNo: "21/U/0892",
    company: "Stanbic Bank",
    department: "IT & Digital",
    avatar: "BS",
    color: "from-cyan-400 to-blue-500",
    evaluated: true,
    prevScore: 78,
    prevMax: 100,
  },
  {
    id: "s3",
    name: "Cynthia Auma",
    regNo: "21/U/1134",
    company: "Airtel Uganda",
    department: "Software Development",
    avatar: "CA",
    color: "from-emerald-400 to-teal-500",
    evaluated: false,
  },
  {
    id: "s4",
    name: "David Ochieng",
    regNo: "21/U/0567",
    company: "Dfcu Bank",
    department: "Systems & Infrastructure",
    avatar: "DO",
    color: "from-amber-400 to-orange-500",
    evaluated: true,
    prevScore: 85,
    prevMax: 100,
  },
  {
    id: "s5",
    name: "Esther Nabirye",
    regNo: "21/U/0223",
    company: "Makerere University Hospital",
    department: "Health Informatics",
    avatar: "EN",
    color: "from-rose-400 to-pink-500",
    evaluated: false,
  },
];

// Evaluation rubric — 5 criteria, each out of 20 → total 100
const CRITERIA = [
  {
    id: "c1",
    label: "Technical Knowledge & Application",
    description:
      "Demonstrates understanding of relevant technical concepts and applies them appropriately in the placement environment.",
    max: 20,
  },
  {
    id: "c2",
    label: "Log Quality & Consistency",
    description:
      "Weekly logs are detailed, accurate, reflective, and submitted on time throughout the placement period.",
    max: 20,
  },
  {
    id: "c3",
    label: "Professional Conduct",
    description:
      "Student exhibits punctuality, teamwork, communication, and adheres to workplace norms and ethical standards.",
    max: 20,
  },
  {
    id: "c4",
    label: "Problem Solving & Initiative",
    description:
      "Student identifies challenges independently, proposes solutions, and takes initiative beyond assigned tasks.",
    max: 20,
  },
  {
    id: "c5",
    label: "Overall Progress & Learning",
    description:
      "Demonstrates measurable growth over the placement duration relative to stated learning objectives.",
    max: 20,
  },
];

const GRADE_MAP = [
  { min: 90, label: "A+", color: "#059669", bg: "#d1fae5" },
  { min: 80, label: "A", color: "#0891b2", bg: "#cffafe" },
  { min: 70, label: "B+", color: "#7c3aed", bg: "#ede9fe" },
  { min: 60, label: "B", color: "#d97706", bg: "#fef3c7" },
  { min: 50, label: "C", color: "#ea580c", bg: "#ffedd5" },
  { min: 0, label: "F", color: "#dc2626", bg: "#fee2e2" },
];

const getGrade = (pct) =>
  GRADE_MAP.find((g) => pct >= g.min) ?? GRADE_MAP.at(-1);

const ScoreInput = ({ criterion, value, onChange }) => {
  const pct = value ? Math.round((value / criterion.max) * 100) : 0;
  const color =
    pct >= 80
      ? "#059669"
      : pct >= 60
        ? "#d97706"
        : pct > 0
          ? "#dc2626"
          : "#d1d5db";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800">{criterion.label}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              {criterion.description}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-xs text-gray-400 font-medium">Max</span>
            <p className="text-sm font-bold text-gray-500">{criterion.max}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-4 flex items-center gap-4">
        {/* Slider */}
        <div className="flex-1 relative">
          <input
            type="range"
            min={0}
            max={criterion.max}
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${color} ${pct}%, #e5e7eb ${pct}%)`,
              accentColor: color,
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-300">0</span>
            <span className="text-[10px] text-gray-300">
              {criterion.max / 2}
            </span>
            <span className="text-[10px] text-gray-300">{criterion.max}</span>
          </div>
        </div>
        {/* Number input */}
        <div className="flex-shrink-0 flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={criterion.max}
            value={value ?? ""}
            placeholder="—"
            onChange={(e) => {
              const v = Math.min(
                criterion.max,
                Math.max(0, Number(e.target.value)),
              );
              onChange(v);
            }}
            className="w-14 text-center text-sm font-bold rounded-xl border border-gray-200 bg-gray-50 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition"
            style={{ color }}
          />
          <span className="text-xs text-gray-400">/ {criterion.max}</span>
        </div>
      </div>
    </div>
  );
};

const Avatar = ({ initials, color, size = "md" }) => {
  const sz =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
        ? "h-14 w-14 text-base"
        : "h-10 w-10 text-sm";
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm`}
    >
      {initials}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AcademicEvaluate = () => {
  const [selectedId, setSelectedId] = useState("");
  const [scores, setScores] = useState({});
  const [comment, setComment] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const student = STUDENTS.find((s) => s.id === selectedId);
  const totalMax = CRITERIA.reduce((a, c) => a + c.max, 0);
  const totalScore = CRITERIA.reduce((a, c) => a + (scores[c.id] ?? 0), 0);
  const pct = Math.round((totalScore / totalMax) * 100);
  const grade = getGrade(pct);
  const allFilled = CRITERIA.every((c) => scores[c.id] !== undefined);

  const handleScore = (id, val) => {
    setScores((prev) => ({ ...prev, [id]: val }));
    setErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleReset = () => {
    setScores({});
    setComment("");
    setRecommendation("");
    setErrors({});
    setSubmitted(false);
  };

  const handleSubmit = () => {
    const newErrors = {};
    let hasError = false;
    if (!selectedId) {
      newErrors.student = true;
      hasError = true;
    }
    CRITERIA.forEach((c) => {
      if (scores[c.id] === undefined) {
        newErrors[c.id] = true;
        hasError = true;
      }
    });
    if (!comment.trim()) {
      newErrors.comment = true;
      hasError = true;
    }
    if (!recommendation) {
      newErrors.recommendation = true;
      hasError = true;
    }
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <AppLayout>
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f8fafc 100%)",
          fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          {/* ── Page Header ─────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardCheck size={18} className="text-cyan-600" />
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">
                Academic Supervisor
              </p>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Academic Evaluation
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Score each criterion and provide a comprehensive comment for the
              student's placement evaluation.
            </p>
          </div>

          {/* ── Success State ────────────────────────────────── */}
          {submitted ? (
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm px-8 py-12 flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Evaluation Submitted
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {student?.name}'s evaluation has been recorded successfully.
                </p>
              </div>
              {/* Score summary */}
              <div
                className="w-full max-w-sm rounded-2xl px-6 py-5 flex flex-col items-center gap-1 mt-2"
                style={{ background: grade.bg }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: grade.color }}
                >
                  Final Grade
                </p>
                <p
                  className="text-5xl font-extrabold"
                  style={{ color: grade.color }}
                >
                  {grade.label}
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {totalScore} / {totalMax} &nbsp;·&nbsp; {pct}%
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 text-left mt-2">
                {CRITERIA.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600 truncate pr-2">
                      {c.label}
                    </span>
                    <span className="font-bold text-gray-800 flex-shrink-0">
                      {scores[c.id]} / {c.max}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setSelectedId("");
                  handleReset();
                }}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition shadow"
              >
                <RotateCcw size={14} /> Evaluate Another Student
              </button>
            </div>
          ) : (
            <>
              {/* ── Student Selector ─────────────────────────── */}
              <div
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                style={{
                  borderTop: errors.student
                    ? "3px solid #ef4444"
                    : "3px solid #0891b2",
                }}
              >
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={15} className="text-cyan-600" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Student
                    </h2>
                    <span className="text-rose-400 text-xs">*</span>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedId}
                      onChange={(e) => {
                        setSelectedId(e.target.value);
                        handleReset();
                        setErrors((prev) => ({ ...prev, student: false }));
                      }}
                      className={`w-full appearance-none pr-10 pl-4 py-3 text-sm rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition font-medium text-black ${
                        errors.student
                          ? "border-rose-300 bg-rose-50"
                          : "border-gray-200"
                      }`}
                      style={{ color: "#111" }}
                    >
                      <option
                        value=""
                        className="text-black"
                        style={{ color: "#111" }}
                      >
                        — Select a student —
                      </option>
                      {STUDENTS.map((s) => (
                        <option
                          key={s.id}
                          value={s.id}
                          className="text-black"
                          style={{ color: "#111" }}
                        >
                          {s.name} ({s.regNo}) — {s.company}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {errors.student && (
                    <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> Please select a student.
                    </p>
                  )}

                  {/* Student Info Card */}
                  {student && (
                    <div className="mt-4 flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                      <Avatar
                        initials={student.avatar}
                        color={student.color}
                        size="lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-gray-900">
                          {student.name}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <BookOpen size={10} /> {student.regNo}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Building2 size={10} /> {student.company} —{" "}
                            {student.department}
                          </span>
                        </div>
                      </div>
                      {student.evaluated && (
                        <div className="flex-shrink-0 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
                            <Info size={10} /> Previously evaluated
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Score: {student.prevScore}/{student.prevMax}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Scoring Criteria ─────────────────────────── */}
              <div
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                style={{ borderTop: "3px solid #7c3aed" }}
              >
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Star size={15} className="text-violet-500" />
                      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Scoring Rubric
                      </h2>
                      <span className="text-rose-400 text-xs">*</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Each criterion is out of 20 pts
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-5">
                    Adjust the slider or type a value for each criterion below.
                  </p>

                  <div className="space-y-3">
                    {CRITERIA.map((c) => (
                      <div key={c.id}>
                        <ScoreInput
                          criterion={c}
                          value={scores[c.id]}
                          onChange={(v) => handleScore(c.id, v)}
                        />
                        {errors[c.id] && (
                          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 px-1">
                            <AlertCircle size={10} /> This field is required.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Live Score Summary */}
                  {Object.keys(scores).length > 0 && (
                    <div
                      className="mt-5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                      style={{ background: grade.bg }}
                    >
                      <div className="flex-1">
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-2"
                          style={{ color: grade.color }}
                        >
                          Running Score
                        </p>
                        <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: grade.color,
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className="text-3xl font-extrabold"
                          style={{ color: grade.color }}
                        >
                          {totalScore}
                          <span className="text-base font-medium text-gray-500">
                            {" "}
                            / {totalMax}
                          </span>
                        </p>
                        <p
                          className="text-xs font-bold"
                          style={{ color: grade.color }}
                        >
                          {pct}% &nbsp;·&nbsp; Grade {grade.label}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Comments & Recommendation ─────────────────── */}
              <div
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                style={{ borderTop: "3px solid #059669" }}
              >
                <div className="px-6 py-5 space-y-5">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck size={15} className="text-emerald-600" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Supervisor Comments & Recommendation
                    </h2>
                  </div>

                  {/* General Comment */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Overall Comment <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        setErrors((p) => ({ ...p, comment: false }));
                      }}
                      placeholder="Provide a comprehensive assessment of the student's performance, attitude, and growth during the placement period..."
                      className={`w-full text-sm rounded-xl border px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition bg-gray-50 leading-relaxed ${
                        errors.comment
                          ? "border-rose-300 bg-rose-50"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.comment && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> Please provide an overall
                        comment.
                      </p>
                    )}
                    <p className="text-right text-xs text-gray-300 mt-1">
                      {comment.length} characters
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Recommendation <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          value: "pass",
                          label: "Pass",
                          desc: "Student met all objectives",
                          color: "#059669",
                          bg: "#d1fae5",
                          border: "#a7f3d0",
                        },
                        {
                          value: "conditional",
                          label: "Conditional Pass",
                          desc: "Minor gaps to address",
                          color: "#d97706",
                          bg: "#fef3c7",
                          border: "#fde68a",
                        },
                        {
                          value: "fail",
                          label: "Fail",
                          desc: "Objectives not met",
                          color: "#dc2626",
                          bg: "#fee2e2",
                          border: "#fca5a5",
                        },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setRecommendation(opt.value);
                            setErrors((p) => ({ ...p, recommendation: false }));
                          }}
                          className={`rounded-xl border-2 px-4 py-3 text-left transition-all ${
                            recommendation === opt.value
                              ? "shadow-md"
                              : "border-gray-100 bg-white hover:border-gray-200"
                          }`}
                          style={
                            recommendation === opt.value
                              ? { borderColor: opt.border, background: opt.bg }
                              : {}
                          }
                        >
                          <p
                            className="text-sm font-bold"
                            style={{
                              color:
                                recommendation === opt.value
                                  ? opt.color
                                  : "#374151",
                            }}
                          >
                            {opt.label}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                    {errors.recommendation && (
                      <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={10} /> Please select a
                        recommendation.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Validation Summary ───────────────────────── */}
              {Object.values(errors).some(Boolean) && (
                <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl px-5 py-4">
                  <AlertCircle
                    size={16}
                    className="text-rose-500 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-rose-800">
                      Please fix the errors above before submitting.
                    </p>
                    <p className="text-xs text-rose-500 mt-0.5">
                      All fields marked with * are required.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Submit Bar ───────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 min-w-0">
                  {student ? (
                    <p className="text-sm font-semibold text-gray-800">
                      Submitting evaluation for{" "}
                      <span className="text-cyan-700">{student.name}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No student selected.
                    </p>
                  )}
                  {allFilled && student && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Score: {totalScore}/{totalMax} · Grade {grade.label} ·{" "}
                      {pct}%
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition shadow"
                    style={{
                      background: "linear-gradient(120deg, #0891b2, #059669)",
                    }}
                  >
                    <Send size={14} /> Submit Evaluation
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AcademicEvaluate;
