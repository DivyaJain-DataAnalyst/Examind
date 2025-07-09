import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    // Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { TeacherDashboard, CreateTest } from "./pages/teacher";
import { StudentDashboard, TakeTest, TestResults } from "./pages/student";
import ProtectedRoute from "./components/ProtectedRoute";
import { Register, Login, Landing } from "./pages";
import About from "./pages/About";
import TeacherTestResults from "./pages/teacher/TeacherTestResults";
import SingleStudentResult from "./pages/teacher/SingleStudentResult";
function App() {
    return (
        <AuthProvider>
            <Router>
                {/* //changed */}
                
                <div className="min-h-screen w-full">
                    <Routes>
                        <Route path="/teacher/results/:testId" element={<TeacherTestResults />} />
                        <Route path="/teacher/results/:testId/:studentId" element={<SingleStudentResult />} />

                        <Route path="/about" element={<About/>} />
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
                        {/* <Route
                            path="/teacher/edit-test/:testId"
                            element={
                                <ProtectedRoute role="teacher">
                                    <EditTest />
                                </ProtectedRoute>
                            }
                        /> */}

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
                        <Route path="/" element={<Landing />} />
                    </Routes>
                    <Toaster position="top-right" />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
