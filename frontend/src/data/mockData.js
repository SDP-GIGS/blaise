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
