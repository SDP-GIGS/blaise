import { useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { mockLogs, mockUsers, statusColors } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ReviewWorkflow = () => {
  const initialLogs = useMemo(() => {
    const usersById = Object.fromEntries(mockUsers.map((u) => [u.id, u]));

    return mockLogs
      .filter((l) => l.status === "submitted" || l.status === "reviewed")
      .map((l) => ({
        ...l,
        studentName: usersById[l.studentId]?.name || `Student #${l.studentId}`,
      }));
  }, []);

  const [logs, setLogs] = useState(initialLogs);
  const [commentMap, setCommentMap] = useState({});
  const [showComment, setShowComment] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleApprove = (logId) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              status: "approved",
              supervisorComment: commentMap[logId] || "Approved.",
            }
          : l,
      ),
    );
  };

  const handleReview = (logId) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              status: "reviewed",
              supervisorComment: commentMap[logId] || "Needs revision.",
            }
          : l,
      ),
    );
  };

  const pendingCount = logs.filter((l) => l.status !== "approved").length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">
              Review
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">
            Review Workflow
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review and approve student log submissions
          </p>
        </motion.div>

        {pendingCount === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 card-premium"
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold font-display text-foreground">
              All Caught Up!
            </h2>
            <p className="text-muted-foreground mt-2">No logs pending review.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {logs
              .filter((log) => log.status !== "approved")
              .map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-premium overflow-hidden"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-400">
                            W{log.weekNumber}
                          </span>
                        </div>
                        <div>
                          <p className="text-base font-bold text-foreground font-display">
                            {log.studentName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Week {log.weekNumber} • {log.startDate} — {log.endDate} •{" "}
                            {log.hoursWorked}h
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`status-badge ${statusColors[log.status]?.bg} ${statusColors[log.status]?.text}`}
                        >
                          {log.status}
                        </span>
                        <button
                          onClick={() =>
                            setExpanded(expanded === log.id ? null : log.id)
                          }
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        >
                          {expanded === log.id ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expanded === log.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 text-sm pt-2">
                            <div className="glass-card rounded-xl p-4">
                              <p className="text-[10px] font-bold text-accent uppercase tracking-[0.15em] mb-1.5">
                                Activities
                              </p>
                              <p className="text-muted-foreground leading-relaxed">
                                {log.activities}
                              </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="glass-card rounded-xl p-4">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.15em] mb-1.5">
                                  Learning Outcomes
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                  {log.learningOutcomes}
                                </p>
                              </div>
                              <div className="glass-card rounded-xl p-4">
                                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.15em] mb-1.5">
                                  Challenges
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                  {log.challenges}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {showComment === log.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <textarea
                            value={commentMap[log.id] || ""}
                            onChange={(e) =>
                              setCommentMap({
                                ...commentMap,
                                [log.id]: e.target.value,
                              })
                            }
                            rows={2}
                            placeholder="Add your review comment..."
                            className="input-premium mt-4"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="px-5 sm:px-6 py-3 bg-secondary/20 border-t border-border/50 flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setShowComment(showComment === log.id ? null : log.id)
                      }
                      className="btn-secondary text-xs py-2 px-3"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Comment
                    </button>
                    <button
                      onClick={() => handleReview(log.id)}
                      className="px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 flex items-center gap-1.5 transition-all duration-200"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Request Revision
                    </button>
                    <button
                      onClick={() => handleApprove(log.id)}
                      className="btn-primary text-xs py-2 px-3"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ReviewWorkflow;