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
import AcademicDashboard from "./pages/academic/AcademicDashboard";
import NotFound from "./pages/NotFound";

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
        <Route
          path="/admin/placements"
          element={<AdminPlacementManagement />}
        />
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/academic" element={<AcademicDashboard />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
