import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import CreateTest from './pages/teacher/CreateTest';
import EditTest from './pages/teacher/EditTest';
import StudentDashboard from './pages/student/StudentDashboard';
import TakeTest from './pages/student/TakeTest';
import TestResults from './pages/student/TestResults';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Register from './pages/Register.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
          {/* //changed */}

        <div className="h-screen w-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Teacher Routes */}
            <Route 
              path="/teacher" 
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher/create-test" 
              element={
                <ProtectedRoute role="teacher">
                  <CreateTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher/edit-test/:testId" 
              element={
                <ProtectedRoute role="teacher">
                  <EditTest />
                </ProtectedRoute>
              } 
            />
            
            {/* Student Routes */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/take-test/:testId" 
              element={
                <ProtectedRoute role="student">
                  <TakeTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/results/:testId" 
              element={
                <ProtectedRoute role="student">
                  <TestResults />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
