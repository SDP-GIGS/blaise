export const UserRole = {
  STUDENT: "student",
  WORKPLACE_SUPERVISOR: "workplace_supervisor",
  ACADEMIC_SUPERVISOR: "academic_supervisor",
  ADMIN: "admin",
};

export const roleLabels = {
  [UserRole.STUDENT]: "Student",
  [UserRole.WORKPLACE_SUPERVISOR]: "Workplace Supervisor",
  [UserRole.ACADEMIC_SUPERVISOR]: "Academic Supervisor",
  [UserRole.ADMIN]: "Administrator",
};

export const mockUsers = [
  {
    id: 1,
    email: 'student@example.com',
    password: 'password123',
    role: UserRole.STUDENT,
    name: 'John Student',
  },
  {
    id: 2,
    email: 'workplace@example.com',
    password: 'password123',
    role: UserRole.WORKPLACE_SUPERVISOR,
    name: 'Jane Workplace Supervisor',
  },
  {
    id: 3,
    email: 'academic@example.com',
    password: 'password123',
    role: UserRole.ACADEMIC_SUPERVISOR,
    name: 'Dr. Academic Supervisor',
  },
  {
    id: 4,
    email: 'admin@example.com',
    password: 'password123',
    role: UserRole.ADMIN,
    name: 'Admin User',
  },
];

export const mockLogs = [
  {
    id: 1,
    studentId: 1,
    weekNumber: 1,
    hoursWorked: 38,
    status: "approved",
    startDate: "2026-01-03",
    endDate: "2026-01-09",
  },
  {
    id: 2,
    studentId: 1,
    weekNumber: 2,
    hoursWorked: 40,
    status: "approved",
    startDate: "2026-01-10",
    endDate: "2026-01-16",
  },
  {
    id: 3,
    studentId: 1,
    weekNumber: 3,
    hoursWorked: 39,
    status: "submitted",
    startDate: "2026-01-17",
    endDate: "2026-01-23",
  },
  {
    id: 4,
    studentId: 1,
    weekNumber: 4,
    hoursWorked: 41,
    status: "approved",
    startDate: "2026-01-24",
    endDate: "2026-01-30",
  },
];

export const mockPlacements = [
  {
    id: 1,
    studentId: 1,
    company: "TechNova Solutions",
    department: "Software Engineering",
    startDate: "2026-01-01",
    endDate: "2026-04-30",
    status: "active",
    workplaceSupervisor: "Jane Workplace Supervisor",
    academicSupervisor: "Dr. Academic Supervisor",
  },
];

export const statusColors = {
  approved: {
    bg: "status-bg-approved",
    text: "status-text-approved",
  },
  submitted: {
    bg: "status-bg-submitted",
    text: "status-text-submitted",
  },
  pending: {
    bg: "status-bg-pending",
    text: "status-text-pending",
  },
  rejected: {
    bg: "status-bg-rejected",
    text: "status-text-rejected",
  },
  active: {
    bg: "status-bg-approved",
    text: "status-text-approved",
  },
};

export const mockEvaluations = [
  {
    id: 1,
    studentId: 1,
    type: "workplace",
    evaluatorName: "Jane Workplace Supervisor",
    weight: 60,
    totalScore: 84,
    maxTotal: 100,
    criteria: [
      { name: "Professionalism", score: 18, maxScore: 20 },
      { name: "Technical Skills", score: 22, maxScore: 25 },
      { name: "Communication", score: 20, maxScore: 25 },
      { name: "Punctuality", score: 24, maxScore: 30 },
    ],
    comments:
      "Consistently meets expectations and shows strong initiative in assigned tasks.",
  },
  {
    id: 2,
    studentId: 1,
    type: "academic",
    evaluatorName: "Dr. Academic Supervisor",
    weight: 40,
    totalScore: 90,
    maxTotal: 100,
    criteria: [
      { name: "Report Quality", score: 23, maxScore: 25 },
      { name: "Reflection", score: 22, maxScore: 25 },
      { name: "Learning Outcomes", score: 22, maxScore: 25 },
      { name: "Presentation", score: 23, maxScore: 25 },
    ],
    comments:
      "Demonstrates clear understanding of internship objectives and articulates learning very well.",
  },
];
