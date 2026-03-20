import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Code2, FileText, PenLine } from "lucide-react";

const weeks = [
  {
    week: 1,
    title: "Introduction & SDLC",
    topics: ["Course structure and grading", "SDLC overview", "System overview (ILES)", "Git workflow and branching"],
    assignment: ["Form teams (3–5)", "Draft problem statement and scope"],
    programming: ["Initialize Django backend", "Initialize React frontend", "Setup Git repository with branches"],
    reading: ["Pro Git (Ch. 1–3)", "Django Tutorial Part 1", "React Getting Started Guide"],
  },
  {
    week: 2,
    title: "Requirements Engineering",
    topics: ["Writing user stories", "Functional vs non-functional requirements", "Identifying workflow states"],
    assignment: ["Submit complete user stories for all roles", "Define workflow states (Draft, Submitted, Reviewed, Approved)"],
    programming: ["Create Django models: CustomUser, InternshipPlacement, WeeklyLog, EvaluationCriteria, Evaluation"],
    reading: ["Django Models Documentation", "DRF Quickstart Guide"],
  },
  {
    week: 3,
    title: "Database Design & ERD",
    topics: ["ERD design principles", "Relationships (1–M, M–M)", "Data constraints and normalization"],
    assignment: ["Submit ERD", "Submit workflow state diagram"],
    programming: ["Implement relationships in models", "Configure PostgreSQL", "Apply constraints (unique, required, defaults)"],
    reading: ["Django ORM Documentation", "Database Normalization Basics"],
  },
  {
    week: 4,
    title: "Authentication & RBAC",
    topics: ["Django authentication", "Custom user model", "DRF permissions", "React protected routes"],
    assignment: ["Implement role-based login", "Create dashboards per role"],
    programming: ["Secure API endpoints", "Implement React route guards"],
    reading: ["Django Auth Docs", "DRF Permissions Guide", "React Router Docs"],
  },
  {
    week: 5,
    title: "Internship Placement Module",
    topics: ["Date validation", "Avoiding overlapping placements", "Data integrity"],
    assignment: ["Implement internship assignment logic", "Prevent conflicting date ranges"],
    programming: ["Placement APIs", "Validation rules", "Placement UI"],
    reading: ["Django Validators", "DRF Serializers"],
  },
  {
    week: 6,
    title: "Weekly Logbook Module",
    topics: ["Form validation", "Deadline enforcement", "Draft vs Submitted state"],
    assignment: ["Implement weekly log submission"],
    programming: ["Create/edit log endpoints", "Lock editing after approval", "Enforce submission deadlines"],
    reading: ["React Forms Documentation", "Django Model Methods"],
  },
  {
    week: 7,
    title: "Supervisor Review Workflow",
    topics: ["State transitions", "Audit trail logging", "Prevent invalid transitions"],
    assignment: ["Implement review interface", "Store review comments"],
    programming: ["Enforce valid state changes", "Track status history"],
    reading: ["Django Signals", "DRF ViewSets"],
  },
  {
    week: 8,
    title: "Midterm Prototype Presentation",
    topics: ["Integration testing", "Debugging multi-role systems"],
    assignment: ["Demonstrate: Authentication, Weekly workflow, Supervisor review, Basic dashboards"],
    programming: ["Fix integration bugs", "Refactor for clarity"],
    reading: ["Debugging Django Apps", "React DevTools Guide"],
  },
  {
    week: 9,
    title: "Evaluation & Score Computation",
    topics: ["Weighted scoring formulas", "Prevent duplicate evaluations", "Data validation"],
    assignment: ["Implement scoring logic (e.g., 40% + 30% + 30%)"],
    programming: ["Auto-calculate total score", "Store computed grade", "Prevent double submission"],
    reading: ["Python Numeric Operations", "Django Model Save Overrides"],
  },
  {
    week: 10,
    title: "Dashboards & Aggregation",
    topics: ["Aggregation queries", "Filtering and sorting", "Data visualization"],
    assignment: ["Build: Student progress dashboard, Supervisor pending reviews, Admin statistics dashboard"],
    programming: ["Use Django aggregation", "Implement charts in React"],
    reading: ["Django Aggregation Docs", "Recharts Documentation"],
  },
  {
    week: 11,
    title: "Testing & Validation",
    topics: ["Backend unit testing", "API testing", "Frontend testing"],
    assignment: ["Minimum: 10 backend tests, 5 frontend tests", "Submit test coverage report"],
    programming: ["Write Pytest tests", "Write Jest tests", "Fix detected bugs"],
    reading: ["Django Testing Docs", "Jest + React Testing Library"],
  },
  {
    week: 12,
    title: "Deployment & Technical Defense",
    topics: ["Production deployment", "Environment variables", "Documentation", "Code defense techniques"],
    assignment: ["Deploy to cloud", "Submit: Deployment link, User manual, Technical documentation"],
    programming: ["Configure production settings", "Final system cleanup"],
    reading: ["Render Deployment Docs", "Django Production Checklist"],
  },
];

const iconMap = {
  topics: { icon: BookOpen, label: "Topics", color: "text-blue-400", bg: "bg-blue-500/10" },
  assignment: { icon: PenLine, label: "Assignment", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  programming: { icon: Code2, label: "Programming Task", color: "text-amber-400", bg: "bg-amber-500/10" },
  reading: { icon: FileText, label: "Reading", color: "text-violet-400", bg: "bg-violet-500/10" },
};

const CategoryBlock = ({ type, items }) => {
  const { icon: Icon, label, color, bg } = iconMap[type];
  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-md ${bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <span className="text-sm font-semibold text-foreground">{label}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold/50 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const WeeklyBreakdown = () => {
  return (
    <section id="curriculum" className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-gold uppercase tracking-widest">
            12-Week Curriculum
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mt-3">
            Week by Week
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A structured journey from requirements to deployment.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {weeks.map((w) => (
            <AccordionItem
              key={w.week}
              value={`week-${w.week}`}
              className="rounded-2xl border border-border bg-card shadow-card overflow-hidden data-[state=open]:shadow-card-hover transition-shadow"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gold">
                      {String(w.week).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground font-serif">
                      {w.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Week {w.week} of 12
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid sm:grid-cols-2 gap-4 mt-2">
                  <CategoryBlock type="topics" items={w.topics} />
                  <CategoryBlock type="assignment" items={w.assignment} />
                  <CategoryBlock type="programming" items={w.programming} />
                  <CategoryBlock type="reading" items={w.reading} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default WeeklyBreakdown;
