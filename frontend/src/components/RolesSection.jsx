import { GraduationCap, Briefcase, BookOpen, Shield } from "lucide-react";

const roles = [
  {
    icon: GraduationCap,
    title: "Student Intern",
    description:
      "Submit weekly logbooks, track placement progress, and view evaluation scores in real-time.",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Briefcase,
    title: "Workplace Supervisor",
    description:
      "Review student logs, provide feedback, approve submissions, and submit workplace evaluations.",
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: BookOpen,
    title: "Academic Supervisor",
    description:
      "Monitor student progress, review logbooks, and submit academic evaluation scores.",
    color: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-500",
  },
  {
    icon: Shield,
    title: "Internship Administrator",
    description:
      "Manage placements, assign supervisors, oversee evaluations, and generate reports.",
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-500",
  },
];

const RolesSection = () => {
  return (
    <section
      id="roles"
      className="relative py-28 px-6 bg-gradient-to-b from-gray-50/80 via-white/60 to-yellow-50/80 dark:from-gray-900/90 dark:via-yellow-900/60 dark:to-yellow-950/80 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-base font-extrabold text-yellow-700 dark:text-yellow-200 uppercase tracking-widest drop-shadow">
            User Roles
          </span>
          <h2 className="text-5xl sm:text-6xl font-serif font-extrabold text-gray-900 dark:text-yellow-100 mt-4 drop-shadow-xl">
            Four Roles, One Platform
          </h2>
          <p className="text-lg text-gray-600 dark:text-yellow-200/70 mt-6 max-w-2xl mx-auto font-medium">
            Each role has a tailored dashboard and workflow designed for
            efficiency and clarity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {roles.map((role, i) => (
            <div
              key={role.title}
              className="group relative rounded-3xl border border-yellow-200/60 dark:border-yellow-900/40 bg-white/70 dark:bg-yellow-900/40 shadow-xl p-8 hover:border-yellow-400/80 hover:bg-yellow-100/80 dark:hover:bg-yellow-900/60 transition-all duration-300 opacity-0 animate-fade-up backdrop-blur-xl hover:scale-105 hover:shadow-2xl"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <role.icon
                  className={`w-8 h-8 ${role.iconColor} group-hover:text-yellow-100 transition-colors duration-300`}
                />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-yellow-100 mb-2 font-serif drop-shadow">
                {role.title}
              </h3>
              <p className="text-base text-gray-600 dark:text-yellow-200/70 leading-relaxed font-medium">
                {role.description}
              </p>
            </div>
          ))}
        </div>
        {/* Decorative blurred circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-yellow-200/30 blur-3xl animate-pulse-slow z-0" />
        <div className="absolute -bottom-32 right-10 w-96 h-96 rounded-full bg-yellow-100/20 blur-3xl animate-float z-0" />
      </div>
    </section>
  );
};

export default RolesSection;
