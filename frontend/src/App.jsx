import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import Login from './pages/login'
import SignUp from './pages/signup'
import StudentDashboard from './pages/student/studentDash'
import StudentPlacement from './pages/student/studentPlacement'
import StudentScores from './pages/student/studentscores'
import WeeklyLogbook from './pages/student/weeklylogbook'
import AdminEvaluations from './pages/admin/adminEvaluations'
import AdminReports from './pages/admin/Adminreports'
import AdminUsers from './pages/admin/AdminUsers'
import AdminPlacementManagement from './pages/admin/AdminPlacementManagement'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/placement" element={<StudentPlacement />} />
        <Route path="/student/scores" element={<StudentScores />} />
        <Route path="/student/logbook" element={<WeeklyLogbook />} />
        <Route path="/admin/evaluations" element={<AdminEvaluations />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/placements" element={<AdminPlacementManagement />} />
      </Routes>
    </Router>
  )
}

export default App
