import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { mockPlacements, statusColors } from "../../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Calendar,
  UserCheck,
  Globe,
  Briefcase,
  Edit3,
  X,
  Trash2,
} from "lucide-react";

const demoStudentId = 1;

const defaultPlacement = mockPlacements.find(
  (p) => p.studentId === demoStudentId,
);

const StudentPlacement = () => {
  // For demo, always use mock placement for student 1
  const [placement, setPlacement] = useState(defaultPlacement);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(placement ? { ...placement } : {});

  if (!placement) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-75 py-12">
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
    { icon: Building2, label: "Company", value: placement.company },
    { icon: MapPin, label: "Department", value: placement.department },
    { icon: Calendar, label: "Start Date", value: placement.startDate },
    { icon: Calendar, label: "End Date", value: placement.endDate },
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

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setPlacement({ ...placement, ...editForm });
    setShowEdit(false);
  };

  const handleDelete = () => {
    setPlacement(null);
    setShowEdit(false);
  };

  return (
    <AppLayout>
      <div className="relative min-h-screen w-full bg-linear-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-widest mb-2">
              <Briefcase className="w-4 h-4 text-emerald-300" />
              <span>Placement</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">My Placement</h1>
            <p className="text-white/70 text-base">
              Your current internship assignment details
            </p>
          </motion.div>

          {/* Placement Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl px-8 py-8 flex flex-col gap-6 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-linear-to-br from-yellow-400 via-emerald-400 to-cyan-400">
                  <Globe className="w-10 h-10 text-white drop-shadow" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white drop-shadow">
                    {placement.company}
                  </h2>
                  <p className="text-white/70 font-medium">
                    {placement.department} Department
                  </p>
                </div>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${statusColors[placement.status]?.bg} ${statusColors[placement.status]?.text}`}
              >
                {placement.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {details.map((d, index) => (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-center gap-4 bg-white/10 rounded-xl p-4 border border-white/10"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-400/20">
                    <d.icon className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 font-bold uppercase">
                      {d.label}
                    </p>
                    <p className="text-lg text-white font-semibold">
                      {d.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEdit(true)}
                className="rounded-xl bg-yellow-400/80 text-[#232526] font-bold px-6 py-2 shadow hover:bg-yellow-300 transition flex items-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-500/80 text-white font-bold px-6 py-2 shadow hover:bg-red-400 transition flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Placement Timeline
            </h3>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-1 bg-linear-to-b from-yellow-400 via-emerald-400 to-cyan-400 rounded-full opacity-30" />
              {timeline.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 mb-6 relative"
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${step.done ? "bg-emerald-400 border-emerald-400" : "bg-white/20 border-white/40"} text-white font-bold z-10`}
                  >
                    {step.done ? <span>✓</span> : <span>{index + 1}</span>}
                  </div>
                  <div>
                    <p
                      className={`text-base font-bold ${step.done ? "text-emerald-300" : "text-white/80"}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-white/60">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Edit Placement Modal */}
          <AnimatePresence>
            {showEdit && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7 mb-4 fixed top-0 left-0 right-0 z-50 max-w-lg mx-auto mt-24"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Edit Placement
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="text-white/70 hover:text-yellow-300 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form
                  onSubmit={handleEditSubmit}
                  className="grid grid-cols-1 gap-5"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">Company</label>
                    <input
                      name="company"
                      type="text"
                      value={editForm.company}
                      onChange={handleEditChange}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">Department</label>
                    <input
                      name="department"
                      type="text"
                      value={editForm.department}
                      onChange={handleEditChange}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">Start Date</label>
                    <input
                      name="startDate"
                      type="date"
                      value={editForm.startDate}
                      onChange={handleEditChange}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">End Date</label>
                    <input
                      name="endDate"
                      type="date"
                      value={editForm.endDate}
                      onChange={handleEditChange}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">
                      Workplace Supervisor
                    </label>
                    <input
                      name="workplaceSupervisor"
                      type="text"
                      value={editForm.workplaceSupervisor}
                      onChange={handleEditChange}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">
                      Academic Supervisor
                    </label>
                    <input
                      name="academicSupervisor"
                      type="text"
                      value={editForm.academicSupervisor}
                      onChange={handleEditChange}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-linear-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-[#232526] font-bold px-6 py-2 shadow hover:scale-105 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEdit(false)}
                      className="rounded-xl bg-white/10 text-white border border-white/20 px-6 py-2 font-bold hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Ambient Glow Effects */}
        <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-0">
          <div className="absolute top-[-10%] left-[-10%] w-100 h-100 bg-linear-to-br from-yellow-400 via-emerald-400 to-cyan-400 opacity-30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-100 h-100 bg-linear-to-br from-cyan-400 via-emerald-400 to-yellow-400 opacity-20 blur-[120px] rounded-full" />
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentPlacement;
