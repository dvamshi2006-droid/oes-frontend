import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import AvailableExams from './pages/AvailableExams';
import ExamInstructions from './pages/ExamInstructions';
import TakeExam from './pages/TakeExam';
import Result from './pages/Result';
import ExamHistory from './pages/ExamHistory';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageExams from './pages/ManageExams';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';
import ManageQuestions from './pages/ManageQuestions';
import StudentManagement from './pages/StudentManagement';
import ResultsManagement from './pages/ResultsManagement';
import ExamStatistics from './pages/ExamStatistics';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/exams" element={<AvailableExams />} />
                <Route path="/student/exams/:id/instructions" element={<ExamInstructions />} />
                <Route path="/student/take-exam/:examId" element={<TakeExam />} />
                <Route path="/student/results/:id" element={<Result />} />
                <Route path="/student/history" element={<ExamHistory />} />
                <Route path="/student/profile" element={<Profile />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/exams" element={<ManageExams />} />
                <Route path="/admin/exams/create" element={<CreateExam />} />
                <Route path="/admin/exams/:id/edit" element={<EditExam />} />
                <Route path="/admin/questions" element={<ManageQuestions />} />
                <Route path="/admin/students" element={<StudentManagement />} />
                <Route path="/admin/results" element={<ResultsManagement />} />
                <Route path="/admin/statistics" element={<ExamStatistics />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
