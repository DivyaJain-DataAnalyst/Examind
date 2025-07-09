
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import Navbar from "../../components/Navbar";
import { ChevronLeft } from "lucide-react"; // Make sure this import is present

const TeacherTestResults = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [testTitle, setTestTitle] = useState("");
    const [testSubject, setTestSubject] = useState(""); // <-- NEW STATE FOR SUBJECT
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await axios.get(`/api/results/test/${testId}`);
                setResults(res.data.attempts);
                setTestTitle(res.data.testTitle);
                setTestSubject(res.data.testSubject); // <-- SETTING NEW SUBJECT STATE

            } catch (err) {
                console.error("Error fetching results:", err);
                // Optionally add user-facing toast notification for errors
                // toast.error("Failed to load test results.");
                // For a more robust app, you might want to redirect if the testId is invalid
                // navigate('/teacher');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [testId, navigate]);

    // Construct the Navbar title more dynamically
    const navbarTitle = loading
        ? 'Loading Results...'
        : testTitle
            ? `Results for ${testTitle}`
            : 'Test Results'; // Fallback if testTitle somehow isn't set

    // Construct the main heading more dynamically
    const mainHeadingTestName = loading
        ? 'Loading Test...'
        : testTitle || 'Unknown Test';
    
    const mainHeadingSubject = testSubject ? ` (${testSubject})` : '';

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <Navbar title={navbarTitle} />

            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Back button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/teacher")}
                        className="group inline-flex transform items-center rounded-full border-2 border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-lg transition-all duration-300 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-xl"
                    >
                        <ChevronLeft
                            size={18}
                            className="mr-2 transition-transform duration-300 group-hover:-translate-x-1"
                        />
                        <span>Back to Dashboard</span>
                    </button>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl font-extrabold mb-8 text-gray-900 leading-tight">
                    Student Results for "
                    <span className="text-blue-700">
                        {mainHeadingTestName}
                    </span>
                    {mainHeadingSubject} {/* Display subject here */}
                    "
                </h1>

                {loading ? (
                    <div className="py-12 text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-xl font-medium text-gray-600">Loading student results...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-gray-300 py-16 text-center bg-white shadow-inner">
                        <p className="text-gray-500 text-2xl font-semibold">No student has submitted this test yet.</p>
                        <p className="text-gray-400 mt-2">Share the test with your students to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {results.map((studentAttempt) => {
                            const percentage = studentAttempt.totalPoints === 0
                                ? 0
                                : Math.round((studentAttempt.score / studentAttempt.totalPoints) * 100);

                            const isPassed = percentage >= 60; // Assuming 60% is passing

                            return (
                                <Link
                                    to={`/teacher/results/${testId}/${studentAttempt.studentId._id}`}
                                    key={studentAttempt._id}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-200 ease-in-out hover:scale-[1.01] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <div className="mb-3 sm:mb-0">
                                        <p className="text-xl font-bold text-gray-800">
                                            {studentAttempt.studentId.name}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="font-medium text-blue-700">Score: {studentAttempt.score} / {studentAttempt.totalPoints}</span>
                                            <span className={`ml-4 text-lg font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                                                {percentage}% {isPassed ? ' (Passed)' : ' (Failed)'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="inline-flex items-center text-blue-600 font-medium hover:underline group-hover:text-blue-800 transition-colors">
                                            View Details
                                            <svg className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherTestResults;