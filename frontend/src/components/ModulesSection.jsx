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
    <section id="modules" className="py-24 px-6 gradient-hero">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-gold uppercase tracking-widest">
            System Architecture
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gold-light mt-3">
            Seven Core Modules
          </h2>
          <p className="text-gold/50 mt-4 max-w-xl mx-auto">
            A modular architecture covering the complete internship lifecycle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => (
            <div
              key={mod.num}
              className="group relative rounded-2xl border border-gold/10 bg-navy-light/50 p-6 hover:border-gold/30 hover:bg-navy-light/80 transition-all duration-300 opacity-0 animate-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <mod.icon className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-gold/40 tracking-widest">
                      MODULE {mod.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gold-light font-serif">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-gold/40 mt-1.5 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* CTA card */}
          <div
            className="rounded-2xl border border-gold/20 bg-gold/5 p-6 flex flex-col items-center justify-center text-center opacity-0 animate-fade-up"
            style={{ animationDelay: "0.7s" }}
          >
            <p className="text-gold/60 text-sm mb-3">Ready to get started?</p>
            <a
              href="/login"
              className="px-6 py-2.5 rounded-xl gradient-gold text-navy font-bold text-sm hover:opacity-90 transition-opacity shadow-gold"
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
