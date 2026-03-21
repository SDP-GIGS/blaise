import { useState, useMemo } from "react";
import AppLayout from "../../components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, NotebookPen, X } from "lucide-react";
import {
  mockLogs,
  statusColors,
  addMockLog,
  updateMockLog,
  deleteMockLog,
} from "../../data/mockData";

const WeeklyLogbook = () => {
  // Always use mock logs for demo
  const demoStudentId = 1;
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    date: "",
    department: "",
    task_description: "",
    skills_learned: "",
    hours_worked: "",
    challenges_faced: "",
    attachments: null,
  });
  const [logs, setLogs] = useState(
    mockLogs.filter((l) => l.studentId === demoStudentId),
  );
  const [editLog, setEditLog] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: mockLogs.length + 1,
      studentId: demoStudentId,
      weekNumber: mockLogs.length + 1,
      date: form.date,
      department: form.department,
      task_description: form.task_description,
      skills_learned: form.skills_learned,
      hours_worked: form.hours_worked,
      challenges_faced: form.challenges_faced,
      supervisor_comments: "Pending review",
      status: "submitted",
    };
    addMockLog(newLog);
    setLogs([newLog, ...logs]);
    setShowNew(false);
    setForm({
      date: "",
      department: "",
      task_description: "",
      skills_learned: "",
      hours_worked: "",
      challenges_faced: "",
      attachments: null,
    });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, attachments: e.target.files[0] });
  };

  // Edit handlers
  const openEdit = (log) => {
    setEditLog(log);
    setEditForm({
      date: log.date || "",
      department: log.department || "",
      task_description: log.task_description || log.activities || "",
      skills_learned: log.skills_learned || log.learningOutcomes || "",
      hours_worked: log.hours_worked || log.hoursWorked || "",
      challenges_faced: log.challenges_faced || log.challenges || "",
      attachments: null,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e) => {
    setEditForm({ ...editForm, attachments: e.target.files[0] });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editLog) return;
    const updated = {
      ...editLog,
      date: editForm.date,
      department: editForm.department,
      task_description: editForm.task_description,
      skills_learned: editForm.skills_learned,
      hours_worked: editForm.hours_worked,
      challenges_faced: editForm.challenges_faced,
    };
    updateMockLog(editLog.id, updated);
    setLogs(mockLogs.filter((l) => l.studentId === demoStudentId));
    setEditLog(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    deleteMockLog(id);
    setLogs(mockLogs.filter((l) => l.studentId === demoStudentId));
  };

  return (
    <AppLayout>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <NotebookPen className="w-6 h-6 text-yellow-400 drop-shadow" />
                <span className="text-lg font-bold tracking-widest text-yellow-300 uppercase drop-shadow">
                  Weekly Logbook
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-2">
                Internship Activity Log
              </h1>
              <p className="text-lg text-white/70 font-medium">
                Record your weekly internship activities and progress
              </p>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowNew(true)}
              className="rounded-xl bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-[#232526] font-bold px-6 py-3 shadow-lg hover:scale-105 transition-all text-lg"
            >
              <Plus className="w-5 h-5 mr-2 inline-block" /> Add New Log
            </motion.button>
          </motion.div>

          {/* New Log Modal */}
          <AnimatePresence>
            {showNew && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    New Log Entry
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowNew(false)}
                    className="text-white/70 hover:text-yellow-300 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">Department</label>
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                      }
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      placeholder="e.g., IT Department"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">
                      Task Description
                    </label>
                    <textarea
                      value={form.task_description}
                      onChange={(e) =>
                        setForm({ ...form, task_description: e.target.value })
                      }
                      rows={2}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      placeholder="Describe the tasks performed..."
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">
                      Skills Learned
                    </label>
                    <textarea
                      value={form.skills_learned}
                      onChange={(e) =>
                        setForm({ ...form, skills_learned: e.target.value })
                      }
                      rows={2}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      placeholder="What skills did you learn?"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">
                      Hours Worked
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={form.hours_worked}
                      onChange={(e) =>
                        setForm({ ...form, hours_worked: e.target.value })
                      }
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">
                      Challenges Faced
                    </label>
                    <textarea
                      value={form.challenges_faced}
                      onChange={(e) =>
                        setForm({ ...form, challenges_faced: e.target.value })
                      }
                      rows={2}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      placeholder="Any challenges faced?"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">
                      File Attachment
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                    />
                  </div>
                  <div className="flex gap-3 md:col-span-2 mt-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-[#232526] font-bold px-6 py-2 shadow hover:scale-105 transition-all"
                    >
                      Submit Log
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNew(false)}
                      className="rounded-xl bg-white/10 text-white border border-white/20 px-6 py-2 font-bold hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Static Logbook Table (as requested) */}
          <div className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Logbook Entries
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-white/90">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-4 py-2 text-left font-bold">Date</th>
                    <th className="px-4 py-2 text-left font-bold">Tasks</th>
                    <th className="px-4 py-2 text-left font-bold">Hours</th>
                    <th className="px-4 py-2 text-left font-bold">Status</th>
                    <th className="px-4 py-2 text-left font-bold">
                      Supervisor Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2">Week 1</td>
                    <td className="px-4 py-2">
                      Onboarded to the team, set up development environment, and
                      reviewed existing codebase.
                    </td>
                    <td className="px-4 py-2">38</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-500/80 text-white">
                        approved
                      </span>
                    </td>
                    <td className="px-4 py-2">Good start to the internship.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Week 2</td>
                    <td className="px-4 py-2">
                      Implemented new feature module and wrote unit tests for
                      existing components.
                    </td>
                    <td className="px-4 py-2">40</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-500/80 text-white">
                        approved
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      Nicely written tests and clean code.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Week 3</td>
                    <td className="px-4 py-2">
                      Participated in sprint planning and supported bug fixes
                      reported by QA.
                    </td>
                    <td className="px-4 py-2">39</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-yellow-400/80 text-[#232526]">
                        submitted
                      </span>
                    </td>
                    <td className="px-4 py-2">N/A</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Week 4</td>
                    <td className="px-4 py-2">
                      Refactored legacy components for performance and
                      accessibility improvements.
                    </td>
                    <td className="px-4 py-2">41</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-500/80 text-white">
                        approved
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      Great progress this month; keep documenting your work
                      clearly.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Editable Logbook Table (CRUD) */}
          <div className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7">
            <h2 className="text-xl font-bold text-white mb-4">
              Your Logbook Entries
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-white/90">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-4 py-2 text-left font-bold">Date</th>
                    <th className="px-4 py-2 text-left font-bold">Tasks</th>
                    <th className="px-4 py-2 text-left font-bold">Hours</th>
                    <th className="px-4 py-2 text-left font-bold">Status</th>
                    <th className="px-4 py-2 text-left font-bold">
                      Supervisor Comments
                    </th>
                    <th className="px-4 py-2 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-white/60"
                      >
                        No log entries yet.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-white/10 hover:bg-white/10 transition"
                      >
                        <td className="px-4 py-2">
                          {log.date || `Week ${log.weekNumber}`}
                        </td>
                        <td className="px-4 py-2 max-w-xs truncate">
                          {log.task_description || log.activities}
                        </td>
                        <td className="px-4 py-2">
                          {log.hours_worked || log.hoursWorked}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[log.status]?.bg} ${statusColors[log.status]?.text}`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {log.supervisor_comments ||
                            log.supervisorComment ||
                            "N/A"}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            onClick={() => openEdit(log)}
                            className="px-3 py-1 rounded bg-yellow-400/80 text-[#232526] font-bold hover:bg-yellow-300 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="px-3 py-1 rounded bg-red-500/80 text-white font-bold hover:bg-red-400 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Log Modal */}
          <AnimatePresence>
            {editLog && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7 mb-4 fixed top-0 left-0 right-0 z-50 max-w-lg mx-auto mt-24"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Edit Log Entry
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditLog(null)}
                    className="text-white/70 hover:text-yellow-300 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form
                  onSubmit={handleEditSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">Date</label>
                    <input
                      name="date"
                      type="date"
                      value={editForm.date}
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
                      placeholder="e.g., IT Department"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">
                      Task Description
                    </label>
                    <textarea
                      name="task_description"
                      value={editForm.task_description}
                      onChange={handleEditChange}
                      rows={2}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      placeholder="Describe the tasks performed..."
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">
                      Skills Learned
                    </label>
                    <textarea
                      name="skills_learned"
                      value={editForm.skills_learned}
                      onChange={handleEditChange}
                      rows={2}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      placeholder="What skills did you learn?"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">
                      Hours Worked
                    </label>
                    <input
                      name="hours_worked"
                      type="number"
                      step="0.5"
                      value={editForm.hours_worked}
                      onChange={handleEditChange}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">
                      Challenges Faced
                    </label>
                    <textarea
                      name="challenges_faced"
                      value={editForm.challenges_faced}
                      onChange={handleEditChange}
                      rows={2}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      placeholder="Any challenges faced?"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">
                      File Attachment
                    </label>
                    <input
                      name="attachments"
                      type="file"
                      onChange={handleEditFileChange}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                    />
                  </div>
                  <div className="flex gap-3 md:col-span-2 mt-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-[#232526] font-bold px-6 py-2 shadow hover:scale-105 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditLog(null)}
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
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-yellow-400 via-emerald-400 to-cyan-400 opacity-30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-cyan-400 via-emerald-400 to-yellow-400 opacity-20 blur-[120px] rounded-full" />
        </div>
      </div>
    </AppLayout>
  );
};

export default WeeklyLogbook;
