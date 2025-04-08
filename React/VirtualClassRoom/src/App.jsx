import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentSignup from './routes/studentSignup';
import StudentLogin from './routes/studentLogin';
import TeacherSignup from './routes/teacherSignup';
import TeacherLogin from './routes/teacherLogin';
import AdminSignup from './routes/adminSignup';
import AdminLogin from './routes/adminLogin';

// Dashboards
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/admindashboard';

function App() {

  return (
    <div>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Student Routes */}
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />

        {/* Teacher Routes */}
        <Route path="/teacher/signup" element={<TeacherSignup />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacherDashboard" element={<TeacherDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
   
        </Routes>
    </Router>
    </div>
    
  );
}

export default App
