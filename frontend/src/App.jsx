import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import Login from './pages/login'
import SignUp from './pages/signup'
import StudentDashboard from './pages/student/studentDash'
import StudentPlacement from './pages/student/studentPlacement'
import StudentScores from './pages/student/studentscores'
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
      </Routes>
    </Router>
  )
}

export default App
