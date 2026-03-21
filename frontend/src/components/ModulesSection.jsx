import {
  Users,
  Building2,
  NotebookPen,
  MessageSquareMore,
  Award,
  Calculator,
  BarChart3,
} from "lucide-react";

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
      className="py-24 px-6 bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-950"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-widest">
            System Architecture
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-yellow-700 dark:text-yellow-300 mt-3">
            Seven Core Modules
          </h2>
          <p className="text-yellow-700/50 dark:text-yellow-300/50 mt-4 max-w-xl mx-auto">
            A modular architecture covering the complete internship lifecycle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => (
            <div
              key={mod.num}
              className="group relative rounded-2xl border border-yellow-200 dark:border-yellow-900/30 bg-white/80 dark:bg-gray-900/80 p-6 hover:border-yellow-400/50 hover:bg-yellow-100/60 dark:hover:bg-yellow-900/40 transition-all duration-300 opacity-0 animate-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/40 transition-colors">
                  <mod.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-yellow-700/40 dark:text-yellow-300/40 tracking-widest">
                      MODULE {mod.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-yellow-700 dark:text-yellow-300 font-serif">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-yellow-700/40 dark:text-yellow-300/40 mt-1.5 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* CTA card */}
          <div
            className="rounded-2xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-100/30 dark:bg-yellow-900/10 p-6 flex flex-col items-center justify-center text-center opacity-0 animate-fade-up"
            style={{ animationDelay: "0.7s" }}
          >
            <p className="text-yellow-700/60 dark:text-yellow-300/60 text-sm mb-3">
              Ready to get started?
            </p>
            <a
              href="/login"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-blue-900 font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
