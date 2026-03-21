import { useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Send, Lock, NotebookPen, X } from "lucide-react";

const WeeklyLogbook = () => {
  const { user, token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logs/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch logs");
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    try {
      await fetch("http://127.0.0.1:8000/api/logs/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
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
      fetchLogs();
    } catch (error) {
      console.error("Error submitting log:", error);
    }
  };

  const handleFileChange = (e) => {
    setForm({ ...form, attachments: e.target.files[0] });
  };

  if (loading)
    return (
      <AppLayout>
        <div>Loading...</div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-widest mb-2">
              <NotebookPen className="w-4 h-4 text-emerald-600" />
              <span>Logbook</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Daily Internship Logbook
            </h1>
            <p className="text-gray-500 text-base">
              Record your daily internship activities
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowNew(true)}
            className="logbook-new-btn"
          >
            <Plus className="logbook-new-btn-icon" />
            Add New Log
          </motion.button>
        </div>

        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="logbook-new-card"
            >
              <div className="logbook-new-header">
                <h3>New Log Entry</h3>
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="logbook-new-close"
                >
                  <X className="logbook-new-close-icon" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="logbook-new-body">
                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="logbook-input"
                    required
                  />
                </div>
                <div>
                  <label>Department</label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="logbook-input"
                    placeholder="e.g., IT Department"
                    required
                  />
                </div>
                <div>
                  <label>Task Description</label>
                  <textarea
                    value={form.task_description}
                    onChange={(e) =>
                      setForm({ ...form, task_description: e.target.value })
                    }
                    rows={3}
                    className="logbook-input"
                    placeholder="Describe the tasks performed..."
                    required
                  />
                </div>
                <div>
                  <label>Skills Learned</label>
                  <textarea
                    value={form.skills_learned}
                    onChange={(e) =>
                      setForm({ ...form, skills_learned: e.target.value })
                    }
                    rows={2}
                    className="logbook-input"
                    placeholder="What skills did you learn?"
                    required
                  />
                </div>
                <div>
                  <label>Hours Worked</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.hours_worked}
                    onChange={(e) =>
                      setForm({ ...form, hours_worked: e.target.value })
                    }
                    className="logbook-input"
                    required
                  />
                </div>
                <div>
                  <label>Challenges Faced</label>
                  <textarea
                    value={form.challenges_faced}
                    onChange={(e) =>
                      setForm({ ...form, challenges_faced: e.target.value })
                    }
                    rows={2}
                    className="logbook-input"
                    placeholder="Any challenges faced?"
                  />
                </div>
                <div>
                  <label>File Attachment</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="logbook-input"
                  />
                </div>
                <div className="logbook-new-actions">
                  <button type="submit" className="logbook-btn-primary">
                    Submit Log
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNew(false)}
                    className="logbook-btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="logbook-list">
          <table className="logbook-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tasks</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Supervisor Comments</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.date}</td>
                  <td>{log.task_description}</td>
                  <td>{log.hours_worked}</td>
                  <td>
                    <span className={`status-badge status-${log.status}`}>
                      {log.status}
                    </span>
                  </td>
                  <td>{log.supervisor_comments || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default WeeklyLogbook;
