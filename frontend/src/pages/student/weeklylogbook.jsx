import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, NotebookPen, X, Send } from "lucide-react";
import { internshipService } from "@/services/internshipService";

const statusStyles = {
  draft: "bg-slate-500/70 text-white",
  submitted: "bg-yellow-400/80 text-[#232526]",
  reviewed: "bg-cyan-400/80 text-[#232526]",
  approved: "bg-green-500/80 text-white",
  rejected: "bg-red-500/80 text-white",
};

const emptyForm = {
  placement: "",
  week_number: "",
  date: "",
  activities: "",
  learnings: "",
  challenges: "",
};

const WeeklyLogbook = () => {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [logs, setLogs] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [historyLog, setHistoryLog] = useState(null);
  const [editLog, setEditLog] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [placementsData, logsData] = await Promise.all([
        internshipService.listPlacements(),
        internshipService.listLogs(),
      ]);

      setPlacements(placementsData);
      setLogs(logsData.sort((a, b) => b.week_number - a.week_number));

      if (placementsData.length && !form.placement) {
        setForm((prev) => ({ ...prev, placement: String(placementsData[0].id) }));
      }
    } catch (loadError) {
      setError(loadError?.message || "Unable to load your logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createLog = async (shouldSubmit) => {
    setSaving(true);
    setError("");

    try {
      const created = await internshipService.createLog({
        placement: Number(form.placement),
        week_number: Number(form.week_number),
        date: form.date,
        activities: form.activities,
        learnings: form.learnings,
        challenges: form.challenges,
      });

      const finalLog = shouldSubmit
        ? await internshipService.submitLog(created.id)
        : created;

      setLogs((prev) => [finalLog, ...prev].sort((a, b) => b.week_number - a.week_number));
      setShowNew(false);
      setForm((prev) => ({ ...emptyForm, placement: prev.placement }));
    } catch (saveError) {
      setError(saveError?.message || "Failed to save log.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (log) => {
    setEditLog(log);
    setEditForm({
      placement: String(log.placement),
      week_number: String(log.week_number),
      date: log.date || "",
      activities: log.activities || "",
      learnings: log.learnings || "",
      challenges: log.challenges || "",
    });
  };

  const saveEditedLog = async (event) => {
    event.preventDefault();

    if (!editLog) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updated = await internshipService.updateLog(editLog.id, {
        placement: Number(editForm.placement),
        week_number: Number(editForm.week_number),
        date: editForm.date,
        activities: editForm.activities,
        learnings: editForm.learnings,
        challenges: editForm.challenges,
      });

      setLogs((prev) =>
  prev.map((item) => (item.id === editLog.id ? updated : item))
  .sort((a, b) => b.week_number - a.week_number),
);
      setEditLog(null);
    } catch (saveError) {
      setError(saveError?.message || "Failed to update log.");
    } finally {
      setSaving(false);
    }
  };

  const submitDraft = async (logId) => {
    setSaving(true);
    setError("");

    try {
      const submitted = await internshipService.submitLog(logId);
      setLogs((prev) => prev.map((item) => (item.id === logId ? submitted : item)));
    } catch (submitError) {
      setError(submitError?.message || "Failed to submit log.");
    } finally {
      setSaving(false);
    }
  };

  const placementOptions = useMemo(
    () => placements.map((item) => ({ id: String(item.id), label: `${item.company} (${item.status})` })),
    [placements],
  );

  return (
    <AppLayout>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2 flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
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
                Save drafts, then submit to your supervisor when ready.
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

          {error && (
            <div className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <AnimatePresence>
            {showNew && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">New Log Entry</h3>
                  <button
                    type="button"
                    onClick={() => setShowNew(false)}
                    className="text-white/70 hover:text-yellow-300 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">Placement</label>
                    <select
                      value={form.placement}
                      onChange={(e) => setForm({ ...form, placement: e.target.value })}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    >
                      <option value="" disabled>
                        Select placement
                      </option>
                      {placementOptions.map((option) => (
                        <option key={option.id} value={option.id} className="text-black">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">Week Number</label>
                    <input
                      type="number"
                      min="1"
                      value={form.week_number}
                      onChange={(e) => setForm({ ...form, week_number: e.target.value })}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/70">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">Activities</label>
                    <textarea
                      value={form.activities}
                      onChange={(e) => setForm({ ...form, activities: e.target.value })}
                      rows={2}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">Learnings</label>
                    <textarea
                      value={form.learnings}
                      onChange={(e) => setForm({ ...form, learnings: e.target.value })}
                      rows={2}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-white/70">Challenges</label>
                    <textarea
                      value={form.challenges}
                      onChange={(e) => setForm({ ...form, challenges: e.target.value })}
                      rows={2}
                      className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 md:col-span-2 mt-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => createLog(false)}
                      className="rounded-xl bg-white/15 text-white border border-white/20 px-6 py-2 font-bold hover:bg-white/25 transition disabled:opacity-50"
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => createLog(true)}
                      className="rounded-xl bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-[#232526] font-bold px-6 py-2 shadow hover:scale-105 transition-all disabled:opacity-50"
                    >
                      Save and Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7">
            <h2 className="text-xl font-bold text-white mb-4">Your Logbook Entries</h2>
            {loading ? (
              <p className="text-white/80">Loading logs...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-white/90">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-2 text-left font-bold">Week</th>
                      <th className="px-4 py-2 text-left font-bold">Date</th>
                      <th className="px-4 py-2 text-left font-bold">Activities</th>
                      <th className="px-4 py-2 text-left font-bold">Status</th>
                      <th className="px-4 py-2 text-left font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-white/60">
                          No log entries yet.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="border-b border-white/10 hover:bg-white/10 transition">
                          <td className="px-4 py-2">Week {log.week_Number}</td>
                          <td className="px-4 py-2">{log.date}</td>
                          <td className="px-4 py-2 max-w-sm truncate">{log.activities}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[log.status] || statusStyles.draft}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 flex gap-2">
                            <button
                              onClick={() => openEdit(log)}
                              disabled={log.status !== "draft" || saving}
                              className="px-3 py-1 rounded bg-yellow-400/80 text-[#232526] font-bold hover:bg-yellow-300 transition disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => submitDraft(log.id)}
                              disabled={log.status !== "draft" || saving}
                              className="px-3 py-1 rounded bg-cyan-500/80 text-white font-bold hover:bg-cyan-400 transition disabled:opacity-50"
                            >
                              <Send className="w-3 h-3 inline mr-1" /> Submit
                            </button>
                            <button
                              onClick={() => setHistoryLog(log)}
                              className="px-3 py-1 rounded bg-white/10 text-white border border-white/20 font-bold hover:bg-white/20 transition"
                            >
                              History
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <AnimatePresence>
            {historyLog && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7 fixed top-0 left-0 right-0 z-50 max-w-lg mx-auto mt-24"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Log Details</h3>
                  <button
                    type="button"
                    onClick={() => setHistoryLog(null)}
                    className="text-white/70 hover:text-yellow-300 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-sm text-white/90 space-y-2">
                  <p><b>Week:</b> {historyLog.weekNumber}</p>
                  <p><b>Status:</b> {historyLog.status}</p>
                  <p><b>Activities:</b> {historyLog.activities}</p>
                  <p><b>Learned:</b> {historyLog.learnings}</p>
                  <p><b>Challenges:</b> {historyLog.challenges || "-"}</p>
                  <p className="text-xs text-white/70">Status history timeline will use backend audit events in the next iteration.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {editLog && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7 fixed top-0 left-0 right-0 z-50 max-w-lg mx-auto mt-24"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Edit Draft</h3>
                  <button
                    type="button"
                    onClick={() => setEditLog(null)}
                    className="text-white/70 hover:text-yellow-300 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={saveEditedLog} className="grid grid-cols-1 gap-4">
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20"
                    required
                  />
                  <textarea
                    value={editForm.activities}
                    onChange={(e) => setEditForm({ ...editForm, activities: e.target.value })}
                    rows={2}
                    className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20"
                    required
                  />
                  <textarea
                    value={editForm.learnings}
                    onChange={(e) => setEditForm({ ...editForm, learnings: e.target.value })}
                    rows={2}
                    className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20"
                    required
                  />
                  <textarea
                    value={editForm.challenges}
                    onChange={(e) => setEditForm({ ...editForm, challenges: e.target.value })}
                    rows={2}
                    className="rounded-lg px-3 py-2 bg-white/10 text-white border border-white/20"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-[#232526] font-bold px-6 py-2 shadow disabled:opacity-50"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditLog(null)}
                      className="rounded-xl bg-white/10 text-white border border-white/20 px-6 py-2 font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
};

export default WeeklyLogbook;


