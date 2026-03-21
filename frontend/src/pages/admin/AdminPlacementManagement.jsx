import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { mockPlacements, mockUsers, statusColors } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Building2, X } from "lucide-react";

const PlacementManagement = () => {
  const [placements, setPlacements] = useState(mockPlacements);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    company: "",
    department: "",
    startDate: "",
    endDate: "",
    workplaceSupervisor: "",
    academicSupervisor: "",
  });

  const students = mockUsers.filter((u) => u.role === "student");

  const handleCreate = () => {
    const student = students.find((s) => s.id === form.studentId);
    const newPlacement = {
      id: `p-${Date.now()}`,
      studentId: form.studentId,
      studentName: student?.name || "",
      company: form.company,
      department: form.department,
      startDate: form.startDate,
      endDate: form.endDate,
      workplaceSupervisor: form.workplaceSupervisor,
      academicSupervisor: form.academicSupervisor,
      status: "pending",
    };
    setPlacements([...placements, newPlacement]);
    setShowNew(false);
    setForm({
      studentId: "",
      company: "",
      department: "",
      startDate: "",
      endDate: "",
      workplaceSupervisor: "",
      academicSupervisor: "",
    });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">
                Placements
              </span>
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">
              Placement Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Assign and manage student internship placements
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowNew(true)}
            className="btn-primary self-start flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Placement
          </motion.button>
        </div>

        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="card-premium p-6 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold font-display text-foreground">
                  Create New Placement
                </h3>
                <button
                  onClick={() => setShowNew(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 mb-5">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground mb-2 block uppercase tracking-wider">
                    Student
                  </label>
                  <select
                    value={form.studentId}
                    onChange={(e) =>
                      setForm({ ...form, studentId: e.target.value })
                    }
                    className="input-premium"
                  >
                    <option value="">Select student...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground mb-2 block uppercase tracking-wider">
                    Company
                  </label>
                  <input
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className="input-premium"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground mb-2 block uppercase tracking-wider">
                    Department
                  </label>
                  <input
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="input-premium"
                    placeholder="Department"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground mb-2 block uppercase tracking-wider">
                    Workplace Supervisor
                  </label>
                  <input
                    value={form.workplaceSupervisor}
                    onChange={(e) =>
                      setForm({ ...form, workplaceSupervisor: e.target.value })
                    }
                    className="input-premium"
                    placeholder="Supervisor name"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground mb-2 block uppercase tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="input-premium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground mb-2 block uppercase tracking-wider">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    className="input-premium"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCreate} className="btn-primary">
                  Create Placement
                </button>
                <button
                  onClick={() => setShowNew(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Placements table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company</th>
                  <th>Dept</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                          {p.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-semibold text-foreground">
                          {p.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{p.company}</td>
                    <td className="text-muted-foreground">{p.department}</td>
                    <td className="text-muted-foreground text-xs">
                      {p.startDate} — {p.endDate}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${statusColors[p.status]?.bg} ${statusColors[p.status]?.text}`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default PlacementManagement;
