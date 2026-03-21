import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { mockPlacements, statusColors } from "../../data/mockData";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Calendar,
  UserCheck,
  Globe,
  Briefcase,
} from "lucide-react";

const StudentPlacement = () => {
  const { user } = useAuth();
  const placement = mockPlacements.find((p) => p.studentId === user?.id);

  if (!placement) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Active Placement
            </h2>
            <p className="text-gray-500">
              Contact your administrator to get assigned.
            </p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  const details = [
    {
      icon: Building2,
      label: "Company",
      value: placement.company,
    },
    {
      icon: MapPin,
      label: "Department",
      value: placement.department,
    },
    {
      icon: Calendar,
      label: "Start Date",
      value: placement.startDate,
    },
    {
      icon: Calendar,
      label: "End Date",
      value: placement.endDate,
    },
    {
      icon: UserCheck,
      label: "Workplace Supervisor",
      value: placement.workplaceSupervisor,
    },
    {
      icon: UserCheck,
      label: "Academic Supervisor",
      value: placement.academicSupervisor,
    },
  ];

  const timeline = [
    { label: "Placement Assigned", date: placement.startDate, done: true },
    { label: "Internship Started", date: placement.startDate, done: true },
    { label: "Midterm Review", date: "In Progress", done: false },
    { label: "Final Evaluation", date: placement.endDate, done: false },
  ];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-widest mb-2">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Placement</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            My Placement
          </h1>
          <p className="text-gray-500 text-base">
            Your current internship assignment details
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="placement-hero"
        >
          <div className="placement-hero-top">
            <div className="placement-hero-main">
              <div className="placement-hero-icon">
                <Globe className="placement-hero-icon-svg" />
              </div>
              <div>
                <h2 className="placement-hero-title">{placement.company}</h2>
                <p className="placement-hero-dept">
                  {placement.department} Department
                </p>
              </div>
            </div>
            <span
              className={`status-badge ${statusColors[placement.status]?.bg} ${statusColors[placement.status]?.text}`}
            >
              {placement.status}
            </span>
          </div>

          <div className="placement-details-grid">
            {details.map((d, index) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="placement-detail-card"
              >
                <div className="placement-detail-icon">
                  <d.icon className="placement-detail-icon-svg" />
                </div>
                <div>
                  <p className="placement-detail-label">{d.label}</p>
                  <p className="placement-detail-value">{d.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="placement-timeline-card"
        >
          <h3 className="placement-timeline-title">Placement Timeline</h3>
          <div className="placement-timeline">
            <div className="placement-timeline-line" />
            {timeline.map((step, index) => (
              <div key={index} className="placement-timeline-row">
                <div
                  className={
                    step.done
                      ? "placement-timeline-dot placement-timeline-dot--done"
                      : "placement-timeline-dot"
                  }
                >
                  {step.done && (
                    <span className="placement-timeline-dot-check">✓</span>
                  )}
                </div>
                <div>
                  <p
                    className={
                      step.done
                        ? "placement-timeline-label placement-timeline-label--done"
                        : "placement-timeline-label"
                    }
                  >
                    {step.label}
                  </p>
                  <p className="placement-timeline-date">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default StudentPlacement;
