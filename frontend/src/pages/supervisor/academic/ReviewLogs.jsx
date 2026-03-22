import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  User,
  Building2,
  BookOpen,
  AlertCircle,
  Send,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Calendar,
  ClipboardCheck,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    id: "s1",
    name: "Amara Nakato",
    regNo: "21/U/0341",
    company: "MTN Uganda",
    department: "Network Engineering",
    avatar: "AN",
    color: "from-violet-400 to-purple-500",
    logsSubmitted: 5,
    logsApproved: 3,
    logsPending: 1,
    logsRevision: 1,
  },
  {
    id: "s2",
    name: "Brian Ssekandi",
    regNo: "21/U/0892",
    company: "Stanbic Bank",
    department: "IT & Digital",
    avatar: "BS",
    color: "from-cyan-400 to-blue-500",
    logsSubmitted: 6,
    logsApproved: 5,
    logsPending: 1,
    logsRevision: 0,
  },
  {
    id: "s3",
    name: "Cynthia Auma",
    regNo: "21/U/1134",
    company: "Airtel Uganda",
    department: "Software Development",
    avatar: "CA",
    color: "from-emerald-400 to-teal-500",
    logsSubmitted: 4,
    logsApproved: 2,
    logsPending: 2,
    logsRevision: 0,
  },
  {
    id: "s4",
    name: "David Ochieng",
    regNo: "21/U/0567",
    company: "Dfcu Bank",
    department: "Systems & Infrastructure",
    avatar: "DO",
    color: "from-amber-400 to-orange-500",
    logsSubmitted: 5,
    logsApproved: 4,
    logsPending: 0,
    logsRevision: 1,
  },
  {
    id: "s5",
    name: "Esther Nabirye",
    regNo: "21/U/0223",
    company: "Makerere University Hospital",
    department: "Health Informatics",
    avatar: "EN",
    color: "from-rose-400 to-pink-500",
    logsSubmitted: 3,
    logsApproved: 2,
    logsPending: 1,
    logsRevision: 0,
  },
];

const LOGS = {
  s1: [
    {
      id: "l1",
      week: 1,
      dateRange: "3 Feb – 7 Feb 2025",
      submittedAt: "2025-02-07",
      status: "approved",
      activities:
        "Attended orientation and network lab induction. Set up monitoring tools on Ubuntu 22.04 server. Attended team standup meetings.",
      learnings:
        "Gained exposure to enterprise network topology. Understood BGP routing fundamentals used in production.",
      challenges:
        "Initial SSH access issues resolved with supervisor assistance.",
      supervisorComment: "Good start. Clear and detailed entry.",
      reviewedAt: "2025-02-09",
    },
    {
      id: "l2",
      week: 2,
      dateRange: "10 Feb – 14 Feb 2025",
      submittedAt: "2025-02-14",
      status: "approved",
      activities:
        "Configured VLANs on Cisco switches. Assisted in diagnosing packet loss on the Kampala backbone link.",
      learnings:
        "VLAN segmentation and inter-VLAN routing via Layer 3 switches.",
      challenges: "Documentation of the existing VLAN setup was incomplete.",
      supervisorComment: "Excellent technical depth this week.",
      reviewedAt: "2025-02-16",
    },
    {
      id: "l3",
      week: 3,
      dateRange: "17 Feb – 21 Feb 2025",
      submittedAt: "2025-02-21",
      status: "approved",
      activities:
        "Participated in firewall rule audit. Drafted a report on outdated ACLs.",
      learnings: "Understanding of stateful vs stateless packet filtering.",
      challenges:
        "Some ACL rules lacked documentation from previous engineers.",
      supervisorComment: "Well written. Keep it up.",
      reviewedAt: "2025-02-23",
    },
    {
      id: "l4",
      week: 4,
      dateRange: "24 Feb – 28 Feb 2025",
      submittedAt: "2025-02-28",
      status: "revision",
      activities:
        "Worked on fiber optic cable testing. Attended a vendor presentation on SD-WAN.",
      learnings: "Basics of OTDR testing and interpreting fiber loss results.",
      challenges: "Unclear on how to document OTDR readings properly.",
      supervisorComment:
        "Please expand on the SD-WAN session — what specific topics were covered and how they relate to your placement objectives.",
      reviewedAt: "2025-03-02",
    },
    {
      id: "l5",
      week: 5,
      dateRange: "3 Mar – 7 Mar 2025",
      submittedAt: "2025-03-07",
      status: "submitted",
      activities:
        "Completed SD-WAN pilot deployment on test environment. Documented all steps in the internal wiki.",
      learnings: "SD-WAN overlay concepts, ZTP (Zero Touch Provisioning).",
      challenges:
        "The test environment did not fully mirror production, so some results may differ.",
      supervisorComment: null,
      reviewedAt: null,
    },
  ],
  s2: [
    {
      id: "l6",
      week: 1,
      dateRange: "3 Feb – 7 Feb 2025",
      submittedAt: "2025-02-07",
      status: "approved",
      activities:
        "IT department onboarding. Assigned to the helpdesk ticketing team. Set up workstation with standard bank software.",
      learnings:
        "Bank IT policies and acceptable use guidelines. ServiceNow ticketing workflow.",
      challenges: "Access provisioning took longer than expected.",
      supervisorComment: "Solid first entry.",
      reviewedAt: "2025-02-09",
    },
    {
      id: "l7",
      week: 2,
      dateRange: "10 Feb – 14 Feb 2025",
      submittedAt: "2025-02-14",
      status: "approved",
      activities:
        "Resolved 14 helpdesk tickets. Assisted in printer server migration from Windows Server 2016 to 2022.",
      learnings: "Active Directory user management, Group Policy Objects.",
      challenges:
        "Some tickets required escalation due to legacy system dependencies.",
      supervisorComment:
        "Great ticket resolution rate. Good learning documented.",
      reviewedAt: "2025-02-16",
    },
    {
      id: "l8",
      week: 3,
      dateRange: "17 Feb – 21 Feb 2025",
      submittedAt: "2025-02-21",
      status: "approved",
      activities:
        "Participated in monthly IT security awareness training. Shadow session with the network team.",
      learnings:
        "Phishing simulation outcomes. Bank's incident response protocol.",
      challenges:
        "Had to balance helpdesk duties with the shadow session schedule.",
      supervisorComment:
        "Well balanced week. Keep tracking your time allocation.",
      reviewedAt: "2025-02-23",
    },
    {
      id: "l9",
      week: 4,
      dateRange: "24 Feb – 28 Feb 2025",
      submittedAt: "2025-02-28",
      status: "approved",
      activities:
        "Configured VPN access for 30 new remote staff. Drafted a proposal for automating onboarding scripts.",
      learnings: "Cisco AnyConnect VPN setup, PowerShell scripting basics.",
      challenges:
        "Some staff had outdated OS versions incompatible with the VPN client.",
      supervisorComment: "Excellent initiative on the automation proposal.",
      reviewedAt: "2025-03-01",
    },
    {
      id: "l10",
      week: 5,
      dateRange: "3 Mar – 7 Mar 2025",
      submittedAt: "2025-03-07",
      status: "approved",
      activities:
        "Presented the onboarding automation proposal to IT manager. Started implementing script v1.",
      learnings: "Professional presentation skills in a corporate IT context.",
      challenges:
        "Manager requested changes to the approval workflow in the script.",
      supervisorComment:
        "Outstanding. This is exactly the kind of initiative expected.",
      reviewedAt: "2025-03-09",
    },
    {
      id: "l11",
      week: 6,
      dateRange: "10 Mar – 14 Mar 2025",
      submittedAt: "2025-03-14",
      status: "submitted",
      activities:
        "Finalized and tested automation script. Deployed to 5 pilot users.",
      learnings: "Testing methodologies for IT automation tools.",
      challenges:
        "Edge case with users having special characters in their usernames.",
      supervisorComment: null,
      reviewedAt: null,
    },
  ],
  s3: [
    {
      id: "l12",
      week: 1,
      dateRange: "3 Feb – 7 Feb 2025",
      submittedAt: "2025-02-07",
      status: "approved",
      activities:
        "Onboarding and codebase walkthrough. Set up local development environment with Docker.",
      learnings:
        "Airtel's internal CI/CD pipeline using GitLab. Git branching strategy (Gitflow).",
      challenges:
        "Encountered Docker networking issues on Windows host — resolved by switching to WSL2.",
      supervisorComment:
        "Good technical entry. Continue being specific about tools used.",
      reviewedAt: "2025-02-09",
    },
    {
      id: "l13",
      week: 2,
      dateRange: "10 Feb – 14 Feb 2025",
      submittedAt: "2025-02-14",
      status: "approved",
      activities:
        "Fixed 3 bugs in the USSD billing module. Wrote unit tests for the fixed functions.",
      learnings: "USSD session flow, Java Spring Boot service architecture.",
      challenges:
        "Understanding legacy USSD state machine code took significant time.",
      supervisorComment: "Good job on the unit tests. Well documented.",
      reviewedAt: "2025-02-17",
    },
    {
      id: "l14",
      week: 3,
      dateRange: "17 Feb – 21 Feb 2025",
      submittedAt: "2025-02-21",
      status: "submitted",
      activities:
        "Started working on a new feature: real-time balance notifications via SMS gateway.",
      learnings:
        "SMS gateway APIs (Africa's Talking), asynchronous messaging patterns.",
      challenges:
        "Rate limiting on the test API environment causing test failures.",
      supervisorComment: null,
      reviewedAt: null,
    },
    {
      id: "l15",
      week: 4,
      dateRange: "24 Feb – 28 Feb 2025",
      submittedAt: "2025-02-28",
      status: "submitted",
      activities:
        "Completed SMS notification feature. Code reviewed by senior developer.",
      learnings:
        "Code review best practices, handling reviewer feedback professionally.",
      challenges:
        "Initial implementation had memory leak — identified and fixed during review.",
      supervisorComment: null,
      reviewedAt: null,
    },
  ],
  s4: [
    {
      id: "l16",
      week: 1,
      dateRange: "3 Feb – 7 Feb 2025",
      submittedAt: "2025-02-07",
      status: "approved",
      activities:
        "Infrastructure team orientation. Rack and stack exercise in the data centre.",
      learnings: "Data centre physical layout, cable management standards.",
      challenges:
        "First time working in a raised-floor data centre environment.",
      supervisorComment: "Good observational detail in this entry.",
      reviewedAt: "2025-02-10",
    },
    {
      id: "l17",
      week: 2,
      dateRange: "10 Feb – 14 Feb 2025",
      submittedAt: "2025-02-14",
      status: "approved",
      activities:
        "Assisted in VMware vSphere cluster configuration. Created 3 VMs for a new test environment.",
      learnings: "vMotion, resource pools, VM snapshots.",
      challenges:
        "Snapshot deletion caused a brief datastore performance dip — investigated with team.",
      supervisorComment: "Well documented incident. Good learning opportunity.",
      reviewedAt: "2025-02-16",
    },
    {
      id: "l18",
      week: 3,
      dateRange: "17 Feb – 21 Feb 2025",
      submittedAt: "2025-02-21",
      status: "approved",
      activities:
        "Monitoring infrastructure with Zabbix. Set up custom alert thresholds.",
      learnings: "SNMP traps, Zabbix trigger expressions.",
      challenges:
        "False positives on disk I/O alerts — tuned thresholds with mentor.",
      supervisorComment:
        "Excellent — this is exactly the kind of iterative problem solving we want to see.",
      reviewedAt: "2025-02-23",
    },
    {
      id: "l19",
      week: 4,
      dateRange: "24 Feb – 28 Feb 2025",
      submittedAt: "2025-02-28",
      status: "approved",
      activities:
        "Drafted disaster recovery runbook for two critical services.",
      learnings: "RTO/RPO concepts, backup rotation strategies.",
      challenges:
        "Finding existing documentation to base the runbook on was difficult.",
      supervisorComment:
        "Runbook is thorough. However please clarify which backup solution is currently in use.",
      reviewedAt: "2025-03-01",
    },
    {
      id: "l20",
      week: 5,
      dateRange: "3 Mar – 7 Mar 2025",
      submittedAt: "2025-03-07",
      status: "revision",
      activities:
        "Updated runbook based on feedback. Attended a storage vendor demo (NetApp).",
      learnings: "NAS vs SAN, NetApp ONTAP basics.",
      challenges:
        "Vendor demo was very technical — needed follow-up reading to fully understand.",
      supervisorComment:
        "Please add a reflection section — how does what you learned from the NetApp demo connect to your course content?",
      reviewedAt: "2025-03-09",
    },
  ],
  s5: [
    {
      id: "l21",
      week: 1,
      dateRange: "3 Feb – 7 Feb 2025",
      submittedAt: "2025-02-07",
      status: "approved",
      activities:
        "Orientation at the Health Informatics unit. Introduction to the hospital's HIS (Health Information System).",
      learnings:
        "HL7 FHIR standard basics, EMR workflow in a clinical setting.",
      challenges:
        "Medical terminology was unfamiliar — began a self-study resource.",
      supervisorComment:
        "Good start. The self-study initiative is commendable.",
      reviewedAt: "2025-02-10",
    },
    {
      id: "l22",
      week: 2,
      dateRange: "10 Feb – 14 Feb 2025",
      submittedAt: "2025-02-14",
      status: "approved",
      activities:
        "Assisted in data cleanup exercise on patient records database. Wrote SQL queries to identify duplicate entries.",
      learnings:
        "Data quality management, de-duplication strategies in healthcare data.",
      challenges:
        "Some records lacked unique identifiers, making deduplication logic complex.",
      supervisorComment:
        "SQL queries were clean and well commented. Well done.",
      reviewedAt: "2025-02-16",
    },
    {
      id: "l23",
      week: 3,
      dateRange: "17 Feb – 21 Feb 2025",
      submittedAt: "2025-02-21",
      status: "submitted",
      activities:
        "Joined a requirements gathering meeting for a new outpatient module. Drafted user stories.",
      learnings:
        "Agile requirements elicitation in a healthcare context. Stakeholder communication.",
      challenges:
        "Clinical staff had very different mental models of the workflow than the IT team expected.",
      supervisorComment: null,
      reviewedAt: null,
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_META = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  submitted: {
    label: "Pending Review",
    icon: Clock,
    bg: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  revision: {
    label: "Revision Requested",
    icon: AlertCircle,
    bg: "bg-rose-100 text-rose-800 border-rose-200",
    dot: "bg-rose-500",
  },
};

const Badge = ({ status }) => {
  const meta = STATUS_META[status] ?? STATUS_META.submitted;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.bg}`}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  );
};

const Avatar = ({ initials, color, size = "md" }) => {
  const sz = size === "sm" ? "h-8 w-8 text-xs" : "h-11 w-11 text-sm";
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm`}
    >
      {initials}
    </div>
  );
};

const MiniStat = ({ value, label, color }) => (
  <div className="text-center">
    <div className={`text-lg font-extrabold ${color}`}>{value}</div>
    <div className="text-[10px] text-gray-400 leading-tight">{label}</div>
  </div>
);

// ─── Log Detail Panel ─────────────────────────────────────────────────────────
import { useRef } from "react";
const LogDetailPanel = ({ log, onClose }) => {
  // Local audit trail state (mocked, not persisted)
  const [history, setHistory] = useState(
    () =>
      log._history || [
        {
          status: log.status,
          comment: log.supervisorComment,
          date: log.reviewedAt || log.submittedAt,
          action:
            log.status === "approved"
              ? "Approved"
              : log.status === "revision"
                ? "Revision Requested"
                : "Submitted",
        },
      ],
  );
  const [comment, setComment] = useState("");
  const [action, setAction] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(log.status);
  const [currentComment, setCurrentComment] = useState(
    log.supervisorComment ?? "",
  );
  const firstRender = useRef(true);

  // Add new audit entry
  const handleSubmit = () => {
    let newStatus = currentStatus;
    let newComment = currentComment;
    let actionLabel = "Commented";
    if (action === "approve") {
      newStatus = "approved";
      actionLabel = "Approved";
    } else if (action === "revision") {
      newStatus = "revision";
      actionLabel = "Revision Requested";
    }
    if (comment) newComment = comment;
    setHistory([
      ...history,
      {
        status: newStatus,
        comment: comment,
        date: new Date().toISOString(),
        action: actionLabel,
      },
    ]);
    setCurrentStatus(newStatus);
    setCurrentComment(newComment);
    setSubmitted(true);
    setAction(null);
    setComment("");
  };

  // Only show previous comment if exists and not editing
  const lastComment = history
    .slice()
    .reverse()
    .find((h) => h.comment);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div
          className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10"
          style={{ borderTop: "3px solid #0891b2" }}
        >
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Weekly Log
            </p>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Week {log.week} — {log.dateRange}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge status={currentStatus} />
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Submitted date */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={12} />
            Submitted on{" "}
            {new Date(log.submittedAt).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>

          {/* Sections */}
          {[
            {
              label: "Activities Undertaken",
              value: log.activities,
              accent: "#0891b2",
            },
            { label: "Key Learnings", value: log.learnings, accent: "#059669" },
            {
              label: "Challenges Faced",
              value: log.challenges,
              accent: "#f59e0b",
            },
          ].map(({ label, value, accent }) => (
            <div key={label}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="h-4 w-0.5 rounded-full"
                  style={{ background: accent }}
                />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {label}
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                {value}
              </p>
            </div>
          ))}

          {/* Audit Trail */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-0.5 rounded-full bg-cyan-400" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Audit Trail
              </p>
            </div>
            <ol className="space-y-2 text-xs">
              {history.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-gray-700 min-w-[90px]">
                    {h.action}
                  </span>
                  <span className="text-gray-400">
                    {new Date(h.date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {h.comment && (
                    <span className="italic text-gray-600 bg-gray-50 border border-gray-100 rounded px-2 py-1 ml-2">
                      "{h.comment}"
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Action Panel */}
          {submitted ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
              <CheckCircle2
                size={20}
                className="text-emerald-600 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  {action === "approve"
                    ? "Log approved successfully."
                    : action === "revision"
                      ? "Revision request sent to student."
                      : "Comment submitted."}
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  The student will be notified.
                </p>
              </div>
            </div>
          ) : action ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-4 w-0.5 rounded-full bg-cyan-500" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {action === "approve"
                    ? "Add Approval Comment (optional)"
                    : action === "revision"
                      ? "Describe What Needs Revision"
                      : "Add Comment"}
                </p>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder={
                  action === "approve"
                    ? "Great work this week! Keep it up..."
                    : action === "revision"
                      ? "Please expand on the activities section and include specific tools used..."
                      : "Add your feedback here..."
                }
                className="w-full text-sm rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 transition"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setAction(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-white flex items-center gap-1.5 transition"
                  style={{
                    background:
                      action === "approve"
                        ? "#059669"
                        : action === "revision"
                          ? "#e11d48"
                          : "#0891b2",
                  }}
                >
                  <Send size={11} />
                  {action === "approve"
                    ? "Approve Log"
                    : action === "revision"
                      ? "Request Revision"
                      : "Submit Comment"}
                </button>
              </div>
            </div>
          ) : currentStatus === "submitted" ? (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">
                Actions
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAction("approve")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-sm"
                >
                  <CheckCircle2 size={15} /> Approve Log
                </button>
                <button
                  onClick={() => setAction("revision")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition shadow-sm"
                >
                  <RotateCcw size={15} /> Request Revision
                </button>
                <button
                  onClick={() => setAction("comment")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition shadow-sm"
                >
                  <MessageSquare size={15} /> Comment Only
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setAction("comment")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition shadow-sm"
              >
                <MessageSquare size={15} /> Add / Edit Comment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AcademicReviewLogs = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const student = STUDENTS.find((s) => s.id === selectedStudent);
  const logs = (LOGS[selectedStudent] ?? []).filter((log) => {
    const matchStatus = filterStatus === "all" || log.status === filterStatus;
    return matchStatus;
  });

  const filteredStudents = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.company.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppLayout>
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f8fafc 100%)",
          fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardCheck size={20} className="text-cyan-600" />
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">
                Academic Supervisor
              </p>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Review Student Weekly Logs
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Select a student to view and action their logbook entries.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Left: Student List ───────────────────────────── */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition"
                />
              </div>

              <div className="space-y-2">
                {filteredStudents.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6 italic">
                    No students found.
                  </p>
                )}
                {filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedStudent(s.id);
                      setFilterStatus("all");
                    }}
                    className={`w-full text-left rounded-2xl border p-4 transition-all group ${
                      selectedStudent === s.id
                        ? "bg-white border-cyan-300 shadow-md ring-2 ring-cyan-100"
                        : "bg-white/70 border-gray-100 hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar initials={s.avatar} color={s.color} />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {s.regNo}
                        </p>
                      </div>
                      {selectedStudent === s.id && (
                        <ChevronRight
                          size={14}
                          className="text-cyan-500 ml-auto flex-shrink-0"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                      <Building2
                        size={11}
                        className="text-gray-300 flex-shrink-0"
                      />
                      <span className="truncate">{s.company}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                      <MiniStat
                        value={s.logsApproved}
                        label="Approved"
                        color="text-emerald-600"
                      />
                      <MiniStat
                        value={s.logsPending}
                        label="Pending"
                        color="text-amber-500"
                      />
                      <MiniStat
                        value={s.logsRevision}
                        label="Revision"
                        color="text-rose-500"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right: Log Table ─────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {!selectedStudent ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 text-center px-8">
                  <div className="h-16 w-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-4">
                    <User size={28} className="text-cyan-400" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Select a Student
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 max-w-sm">
                    Choose a student from the panel on the left to view and
                    review their weekly logbook entries.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Student Header */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <Avatar
                      initials={student.avatar}
                      color={student.color}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-extrabold text-gray-900">
                        {student.name}
                      </h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <BookOpen size={11} /> {student.regNo}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Building2 size={11} /> {student.company} —{" "}
                          {student.department}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-xl font-extrabold text-emerald-600">
                          {student.logsApproved}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Approved
                        </div>
                      </div>
                      <div className="w-px bg-gray-100" />
                      <div className="text-center">
                        <div className="text-xl font-extrabold text-amber-500">
                          {student.logsPending}
                        </div>
                        <div className="text-[10px] text-gray-400">Pending</div>
                      </div>
                      <div className="w-px bg-gray-100" />
                      <div className="text-center">
                        <div className="text-xl font-extrabold text-rose-500">
                          {student.logsRevision}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Revision
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filter Bar */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={13} className="text-gray-400" />
                    {["all", "submitted", "approved", "revision"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilterStatus(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          filterStatus === f
                            ? "bg-cyan-600 text-white border-cyan-600"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {f === "all"
                          ? "All Logs"
                          : f === "submitted"
                            ? "Pending Review"
                            : f === "approved"
                              ? "Approved"
                              : "Revision"}
                      </button>
                    ))}
                    <span className="ml-auto text-xs text-gray-400">
                      {logs.length} log{logs.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Logs Table */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Week
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Period
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Submitted
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Reviewed
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-5 py-12 text-center text-sm text-gray-400 italic"
                            >
                              No logs match the selected filter.
                            </td>
                          </tr>
                        ) : (
                          logs.map((log, i) => (
                            <tr
                              key={log.id}
                              className="border-b border-gray-50 hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="px-5 py-4 font-bold text-gray-800">
                                Week {log.week}
                              </td>
                              <td className="px-5 py-4 text-gray-500 text-xs font-mono">
                                {log.dateRange}
                              </td>
                              <td className="px-5 py-4 text-gray-500 text-xs font-mono">
                                {new Date(log.submittedAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </td>
                              <td className="px-5 py-4">
                                <Badge status={log.status} />
                              </td>
                              <td className="px-5 py-4 text-gray-400 text-xs font-mono">
                                {log.reviewedAt
                                  ? new Date(log.reviewedAt).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      },
                                    )
                                  : "—"}
                              </td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => setSelectedLog(log)}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition-colors"
                                >
                                  <Eye size={13} />
                                  {log.status === "submitted"
                                    ? "Review"
                                    : "View"}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <LogDetailPanel
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </AppLayout>
  );
};

export default AcademicReviewLogs;
