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
    <section id="roles" className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-widest">
            User Roles
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3">
            Four Roles, One Platform
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            Each role has a tailored dashboard and workflow designed for
            efficiency and clarity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, i) => (
            <div
              key={role.title}
              className="group relative rounded-2xl bg-white/80 dark:bg-gray-900/80 p-6 shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0 animate-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div
                className={`w-14 h-14 rounded-xl bg-linear-to-br ${role.color} flex items-center justify-center mb-5`}
              >
                <role.icon className={`w-7 h-7 ${role.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-serif">
                {role.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
