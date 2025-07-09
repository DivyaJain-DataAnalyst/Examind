
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import Navbar from "../../components/Navbar";
import { ChevronLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const SingleStudentResult = () => {
    const { testId, studentId } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [test, setTest] = useState(null); // Contains test title, subject, etc.
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                // API call to get detailed results for a single student on a specific test
                // This assumes your backend's /api/results/test/:testId/student/:studentId endpoint
                // returns { student: {name, email}, test: {title, subject}, detailedQuestions: [...], score, totalPoints }
                const res = await axios.get(`/api/results/test/${testId}/student/${studentId}`);
                
                setStudent(res.data.student);
                setTest(res.data.test);
                setQuestions(res.data.detailedQuestions);
                setScore(res.data.score);
                setTotalPoints(res.data.totalPoints);

            } catch (err) {
                console.error("Failed to load student result", err);
                // Optionally show a toast error or redirect if data not found/access denied
                // toast.error("Failed to load student result.");
                navigate("/teacher/results/" + testId); // Redirect back to all results for this test
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [testId, studentId, navigate]); // Dependencies for useEffect

    const getPercentage = () =>
        totalPoints === 0 ? 0 : Math.round((score / totalPoints) * 100);

    const getGrade = () => {
        const p = getPercentage();
        if (p >= 90) return "A";
        if (p >= 80) return "B";
        if (p >= 70) return "C";
        if (p >= 60) return "D";
        return "F";
    };

    // Helper to get grade color
    const getGradeColor = () => {
        const grade = getGrade();
        switch (grade) {
            case "A": return "text-green-600";
            case "B": return "text-blue-600";
            case "C": return "text-yellow-600";
            case "D": return "text-orange-600";
            case "F": return "text-red-600";
            default: return "text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-2 text-xl font-medium text-gray-600">Loading student's result...</p>
                </div>
            </div>
        );
    }

    // Ensure student and test data are available before rendering main content
    if (!student || !test) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-red-600">Error: Result data not available.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 overflow-y-auto">
            <Navbar title={`Result of ${student.name} for ${test.title}`} />
            
            <div className="max-w-6xl mx-auto px-4 py-8 mt-16"> {/* Added mt-16 for navbar spacing */}
                {/* Back button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)} // Navigate back to the previous page (TeacherTestResults)
                        className="group mb-6 inline-flex transform items-center rounded-full border-2 border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-lg hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-xl"
                    >
                        <ChevronLeft
                            size={18}
                            className="mr-2 transition-transform duration-300 group-hover:-translate-x-1"
                        />
                        <span>Back to Test Results</span>
                        <div className="ml-2 h-2 w-2 rounded-full bg-blue-400 transition-all duration-300 group-hover:animate-pulse group-hover:opacity-100"></div>
                    </button>
                </div>

                <h1 className="text-3xl font-bold mb-4 text-gray-900">Result for {student.name}</h1>
                <h2 className="text-xl text-gray-700 mb-6">Test: {test.title} ({test.subject})</h2>

                {/* Score Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-lg bg-blue-50 p-6 text-center shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Score</h3>
                        <p className="text-4xl font-extrabold text-blue-700">
                            {score} / {totalPoints}
                        </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-6 text-center shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Percentage</h3>
                        <p className="text-4xl font-extrabold text-green-700">
                            {getPercentage()}%
                        </p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-6 text-center shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Grade</h3>
                        <p className={`text-4xl font-extrabold ${getGradeColor()}`}>
                            {getGrade()}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            {getPercentage() >= 60 ? "Passed" : "Failed"}
                        </p>
                    </div>
                </div>

                {/* Questions Review Section */}
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Question Review</h3>
                <div className="space-y-8">
                    {questions.map((q, i) => (
                        <div
                            key={q.questionId}
                            className={`rounded-lg border p-6 transition-all duration-300 shadow-sm
                                ${q.isCorrect
                                    ? "bg-green-50 border-green-200"
                                    : (q.userAnswer !== null && q.userAnswer !== undefined)
                                        ? "bg-red-50 border-red-200"
                                        : "bg-gray-50 border-gray-200"
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-xl font-semibold text-gray-800">Q{i + 1}: {q.text}</p>
                                <div className="flex items-center text-md font-medium">
                                    {q.isCorrect ? (
                                        <div className="flex items-center text-green-600">
                                            <CheckCircle size={20} className="mr-1" />
                                            Correct
                                        </div>
                                    ) : (q.userAnswer !== null && q.userAnswer !== undefined) ? (
                                        <div className="flex items-center text-red-600">
                                            <XCircle size={20} className="mr-1" />
                                            Incorrect
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-gray-500">
                                            <AlertCircle size={20} className="mr-1" />
                                            Not Answered
                                        </div>
                                    )}
                                    <span className="ml-3 text-gray-700">({q.points} pts)</span>
                                </div>
                            </div>

                            {q.imageUrl && (
                                <div className="mt-4 mb-6 text-center">
                                    <img
                                        src={q.imageUrl}
                                        alt="Question Image"
                                        className="max-h-60 mx-auto rounded-lg border border-gray-200 shadow-md object-contain"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Student's Answer:
                                    </p>
                                    <div
                                        className={`rounded-md p-3 text-lg font-medium
                                            ${(q.userAnswer === null || q.userAnswer === undefined)
                                                ? "bg-gray-100 text-gray-500 italic"
                                                : q.isCorrect
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }
                                        `}
                                    >
                                        {q.userAnswer !== null && q.userAnswer !== undefined ? (
                                            q.type === 'multiple-choice' && q.options 
                                                ? q.options.find(opt => opt.id === q.userAnswer)?.text || q.userAnswer 
                                                : q.userAnswer
                                        ) : (
                                            "Not Answered"
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Correct Answer:
                                    </p>
                                    <div className="rounded-md bg-green-100 p-3 text-lg font-medium text-green-800">
                                        {q.type === 'multiple-choice' && q.options 
                                            ? q.options.find(opt => opt.id === q.correctAnswer)?.text || q.correctAnswer
                                            : q.correctAnswer
                                        }
                                        {q.type === 'numerical' && q.tolerance !== undefined && q.tolerance !== null && q.tolerance > 0 &&
                                            <span className="ml-2 text-sm text-green-700">(±{q.tolerance})</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SingleStudentResult;
