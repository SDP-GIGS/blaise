import {
  Users,
  Building2,
  NotebookPen,
  MessageSquareMore,
  Award,
  Calculator,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const modules = [
  {
    icon: Users,
    title: "User & Role Management",
    desc: "Authentication, RBAC, custom dashboards per role.",
    num: "01",
  },
  {
    icon: Building2,
    title: "Internship Placement",
    desc: "Assign students, validate dates, prevent overlaps.",
    num: "02",
  },
  {
    icon: NotebookPen,
    title: "Weekly Logbook",
    desc: "Draft, submit, and lock logs with deadline enforcement.",
    num: "03",
  },
  {
    icon: MessageSquareMore,
    title: "Supervisor Review",
    desc: "State transitions, comments, and audit trails.",
    num: "04",
  },
  {
    icon: Award,
    title: "Academic Evaluation",
    desc: "Criteria-based evaluation with structured rubrics.",
    num: "05",
  },
  {
    icon: Calculator,
    title: "Score Computation",
    desc: "Weighted formulas: 40% + 30% + 30% auto-calculated.",
    num: "06",
  },
  {
    icon: BarChart3,
    title: "Dashboards & Reporting",
    desc: "Aggregated stats, charts, and exportable reports.",
    num: "07",
  },
];

const ModulesSection = () => {
  return (
    <section
      id="modules"
      className="relative py-28 px-6 bg-gradient-to-b from-yellow-50/80 via-white/60 to-yellow-100/90 dark:from-yellow-900/90 dark:via-yellow-900/60 dark:to-yellow-950/80 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Removed System Architecture section header and description as requested */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {modules.map((mod, i) => (
            <div
              key={mod.num}
              className="group relative rounded-3xl border border-yellow-200/60 dark:border-yellow-900/40 bg-white/70 dark:bg-yellow-900/40 shadow-xl p-8 hover:border-yellow-400/80 hover:bg-yellow-100/80 dark:hover:bg-yellow-900/60 transition-all duration-300 opacity-0 animate-fade-up backdrop-blur-xl hover:scale-105 hover:shadow-2xl"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <mod.icon className="w-8 h-8 text-blue-900 group-hover:text-yellow-100 transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold text-yellow-700/40 dark:text-yellow-200/40 tracking-widest">
                      MODULE {mod.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-yellow-700 dark:text-yellow-100 font-serif drop-shadow">
                    {mod.title}
                  </h3>
                  <p className="text-base text-yellow-700/60 dark:text-yellow-200/60 mt-2 leading-relaxed font-medium">
                    {mod.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Decorative blurred circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-yellow-200/30 blur-3xl animate-pulse-slow z-0" />
        <div className="absolute -bottom-32 right-10 w-96 h-96 rounded-full bg-yellow-100/20 blur-3xl animate-float z-0" />
        {/* CTA card */}
        <div
          className="rounded-2xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-100/30 dark:bg-yellow-900/10 p-6 flex flex-col items-center justify-center text-center opacity-0 animate-fade-up mt-16"
          style={{ animationDelay: "0.7s" }}
        >
          <p className="text-yellow-700/60 dark:text-yellow-300/60 text-sm mb-3">
            Ready to get started?
          </p>
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-blue-900 font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;


