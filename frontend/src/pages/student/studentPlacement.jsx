import { useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import { motion } from "framer-motion";
import {
  Building2, Calendar, UserCheck, Globe, Briefcase,
} from "lucide-react";

const statusStyles = {
  new:       "bg-amber-400/20 text-amber-300 border-amber-400/30",
  active:    "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  completed: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
};


const StudentPlacement = () => {
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiClient.get('/placements/');
        const placements = Array.isArray(data) ? data : [];
        const active = placements.find((p) => p.status === 'active') || placements[0] || null;
        setPlacement(active);
      } catch (err) {
        setError(err.message || 'Failed to load placement.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] flex items-center justify-center">
          <p className="text-white/70">Loading placement...</p>
        </div>
      </AppLayout>
    );
  }

  if (!placement) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 mb-4">
            <Building2 className="w-8 h-8 text-white/40" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Active Placement</h2>
          <p className="text-white/60">Contact your administrator to get assigned.</p>
        </div>
      </AppLayout>
    );
  }

  const details = [
    { icon: Building2,  label: "Company",              value: placement.company },
    { icon: Calendar,   label: "Start Date",            value: placement.start_date },
    { icon: Calendar,   label: "End Date",              value: placement.end_date },
    { icon: UserCheck,  label: "Workplace Supervisor",  value: placement.workplace_supervisor_name || "Not assigned" },
    { icon: UserCheck,  label: "Academic Supervisor",   value: placement.academic_supervisor_name || "Not assigned" },
  ];

  const timeline = [
    { label: "Placement Assigned", date: placement.start_date, done: true },
    { label: "Internship Started",  date: placement.start_date, done: placement.status !== 'new' },
    { label: "Final Evaluation",    date: placement.end_date,   done: placement.status === 'completed' },
  ];

  return (
    <AppLayout>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">

          {/* Header */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-widest mb-2">
              <Briefcase className="w-4 h-4 text-emerald-300" />
              <span>Placement</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">My Placement</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[placement.status] || statusStyles.new}`}>
                {placement.status.charAt(0).toUpperCase() + placement.status.slice(1)}
              </span>
            </div>
            <p className="text-white/70 text-base mt-2">Your current internship assignment details</p>
          </motion.div>

          {error && (
            <div className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">{error}</div>
          )}

          {/* Placement Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl px-8 py-8 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-emerald-400 to-cyan-400">
                  <Globe className="w-10 h-10 text-white drop-shadow" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white drop-shadow">{placement.company}</h2>
                  <p className="text-white/70 font-medium">Internship Placement</p>
                </div>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${statusStyles[placement.status] || statusStyles.new}`}>
                {placement.status.charAt(0).toUpperCase() + placement.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {details.map((d, index) => (
                <motion.div key={d.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-center gap-4 bg-white/10 rounded-xl p-4 border border-white/10">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-400/20">
                    <d.icon className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 font-bold uppercase">{d.label}</p>
                    <p className="text-lg text-white font-semibold">{d.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7">
            <h3 className="text-xl font-bold text-white mb-4">Placement Timeline</h3>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-emerald-400 to-cyan-400 rounded-full opacity-30" />
              {timeline.map((step, index) => (
                <div key={index} className="flex items-center gap-4 mb-6 relative">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${step.done ? "bg-emerald-400 border-emerald-400" : "bg-white/20 border-white/40"} text-white font-bold z-10`}>
                    {step.done ? <span>✓</span> : <span>{index + 1}</span>}
                  </div>
                  <div>
                    <p className={`text-base font-bold ${step.done ? "text-emerald-300" : "text-white/80"}`}>{step.label}</p>
                    <p className="text-xs text-white/60">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Ambient Glow */}
        <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-0">
          <div className="absolute top-[-10%] left-[-10%] w-100 h-100 bg-gradient-to-br from-yellow-400 via-emerald-400 to-cyan-400 opacity-30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-100 h-100 bg-gradient-to-br from-cyan-400 via-emerald-400 to-yellow-400 opacity-20 blur-[120px] rounded-full" />
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentPlacement;

