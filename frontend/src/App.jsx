import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Overview from "./pages/Overview";
import Notifications from "./pages/Notifications.jsx";
import NotFound from "./pages/NotFound.jsx";



import StudentDashboard from "./pages/student/studentDash";
import StudentPlacement from "./pages/student/studentPlacement";
import StudentScores from "./pages/student/studentscores";
import WeeklyLogbook from "./pages/student/weeklylogbook";
import ProfileSettings from "./pages/student/profile";
import StudentNotifications from "./pages/student/Notifications.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvaluations from "./pages/admin/adminEvaluations";
import AdminReports from "./pages/admin/adminReports";
import AdminPlacementManagement from "./pages/admin/AdminPlacementManagement";
import AdminUsers from "./pages/admin/AdminUsers";

import SupervisorNotifications from "./pages/supervisor/Notifications";
import WorkplaceSupervisorDashboard from "./pages/supervisor/workplace/Dashboard";
import WorkplaceReviewLogs from "./pages/supervisor/workplace/ReviewLogs";
import WorkplaceEvaluate from "./pages/supervisor/workplace/Evaluate";

import AcademicDashboard from "./pages/academic/AcademicDashboard";
import AcademicSupervisorDashboard from "./pages/supervisor/academic/Dashboard";
import AcademicReviewLogs from "./pages/supervisor/academic/ReviewLogs";
import AcademicEvaluate from "./pages/supervisor/academic/Evaluate";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/overview" element={<Overview />} />

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/placement" element={<ProtectedRoute allowedRoles={['student']}><StudentPlacement /></ProtectedRoute>} />
      <Route path="/student/scores" element={<ProtectedRoute allowedRoles={['student']}><StudentScores /></ProtectedRoute>} />
      <Route path="/student/logbook" element={<ProtectedRoute allowedRoles={['student']}><WeeklyLogbook /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><ProfileSettings /></ProtectedRoute>} />
      <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={['student']}><StudentNotifications /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/evaluations" element={<ProtectedRoute allowedRoles={['admin']}><AdminEvaluations /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/AdminUsers" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/placements" element={<ProtectedRoute allowedRoles={['admin']}><AdminPlacementManagement /></ProtectedRoute>} />

      {/* Workplace Supervisor Routes */}
      <Route path="/supervisor/workplace" element={<ProtectedRoute allowedRoles={['workplace_supervisor']}><WorkplaceSupervisorDashboard /></ProtectedRoute>} />
      <Route path="/supervisor/workplace/review" element={<ProtectedRoute allowedRoles={['workplace_supervisor']}><WorkplaceReviewLogs /></ProtectedRoute>} />
      <Route path="/supervisor/workplace/evaluate" element={<ProtectedRoute allowedRoles={['workplace_supervisor']}><WorkplaceEvaluate /></ProtectedRoute>} />
      <Route path="/supervisor/notifications" element={<ProtectedRoute allowedRoles={['workplace_supervisor', 'academic_supervisor']}><SupervisorNotifications /></ProtectedRoute>} />

      {/* Academic Supervisor Routes */}
      <Route path="/supervisor/academic" element={<ProtectedRoute allowedRoles={['academic_supervisor']}><AcademicSupervisorDashboard /></ProtectedRoute>} />
      <Route path="/supervisor/academic/review" element={<ProtectedRoute allowedRoles={['academic_supervisor']}><AcademicReviewLogs /></ProtectedRoute>} />
      <Route path="/supervisor/academic/evaluate" element={<ProtectedRoute allowedRoles={['academic_supervisor']}><AcademicEvaluate /></ProtectedRoute>} />

      {/* Legacy Routes */}
      <Route path="/academic" element={<ProtectedRoute allowedRoles={['academic_supervisor']}><AcademicDashboard /></ProtectedRoute>} />

      {/* Notifications */}
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['student', 'workplace_supervisor', 'academic_supervisor', 'admin']}><Notifications /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;