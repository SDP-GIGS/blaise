import SupervisorNotifications from "./pages/supervisor/Notifications";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import StudentDashboard from "./pages/student/studentDash";
import StudentPlacement from "./pages/student/studentPlacement";
import StudentScores from "./pages/student/studentscores";
import WeeklyLogbook from "./pages/student/weeklylogbook";
import ProfileSettings from "./pages/student/profile";
import AdminEvaluations from "./pages/admin/adminEvaluations";
import AdminReports from "./pages/admin/Adminreports";
import AdminPlacementManagement from "./pages/admin/AdminPlacementManagement";
import AdminUsers from "./pages/admin/AdminUsers";
import Overview from "./pages/Overview";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import WorkplaceSupervisorDashboard from "./pages/supervisor/workplace/Dashboard";
import WorkplaceReviewLogs from "./pages/supervisor/workplace/ReviewLogs";
import WorkplaceEvaluate from "./pages/supervisor/workplace/Evaluate";
import AcademicDashboard from "./pages/academic/AcademicDashboard";
import AcademicSupervisorDashboard from "./pages/supervisor/academic/Dashboard";
import AcademicReviewLogs from "./pages/supervisor/academic/ReviewLogs";
import AcademicEvaluate from "./pages/supervisor/academic/Evaluate";
import NotFound from "./pages/NotFound.jsx";
import Notifications from "./pages/Notifications.jsx";
import StudentNotifications from "./pages/student/Notifications.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/placement" element={<StudentPlacement />} />
        <Route path="/student/scores" element={<StudentScores />} />
        <Route path="/student/logbook" element={<WeeklyLogbook />} />
        <Route path="/student/profile" element={<ProfileSettings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/evaluations" element={<AdminEvaluations />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/AdminUsers" element={<AdminUsers />} />
        <Route
          path="/admin/placements"
          element={<AdminPlacementManagement />}
        />
        {/* Workplace Supervisor Routes */}
        <Route
          path="/supervisor/workplace"
          element={<WorkplaceSupervisorDashboard />}
        />
        {/* Supervisor Notifications */}
        <Route
          path="/supervisor/notifications"
          element={<SupervisorNotifications />}
        />
        <Route
          path="/supervisor/workplace/review"
          element={<WorkplaceReviewLogs />}
        />
        <Route
          path="/supervisor/workplace/evaluate"
          element={<WorkplaceEvaluate />}
        />
        {/* Academic Supervisor Routes */}
        <Route
          path="/supervisor/academic"
          element={<AcademicSupervisorDashboard />}
        />
        <Route
          path="/supervisor/academic/review"
          element={<AcademicReviewLogs />}
        />
        <Route
          path="/supervisor/academic/evaluate"
          element={<AcademicEvaluate />}
        />
        {/* Legacy supervisor dashboard route (optional) */}
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/academic" element={<AcademicDashboard />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="/student/notifications"
          element={<StudentNotifications />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
