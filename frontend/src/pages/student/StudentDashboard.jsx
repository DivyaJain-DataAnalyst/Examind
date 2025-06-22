import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Calendar, Bookmark } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../config/axios";

const StudentDashboard = () => {
    const { user: currentUser } = useAuth();
    const [tests, setTests] = useState([]);
    const [testAttempts, setTestAttempts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const testRes = await axios.get("/api/student/tests");
                const attemptRes = await axios.get("/api/student/attempts");

                setTests(testRes.data.tests);
                setTestAttempts(attemptRes.data.attempts);
            } catch (error) {
                console.error("Error fetching student data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser) {
            fetchStudentData();
        }
    }, [currentUser]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (test) => {
        const now = new Date();
        const start = new Date(test.startTime);
        const end = new Date(test.endTime);
        if (now >= start && now <= end) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available Now
                </span>
            );
        } else if (now < start) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Upcoming
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Closed
                </span>
            );
        }
    };

    const hasAttempted = (testId) => {
        return testAttempts.some((attempt) => attempt.testId === testId);
    };

    const isAvailable = (test) => {
        const now = new Date();
        return now >= new Date(test.startTime) && now <= new Date(test.endTime);
    };

    const isUpcoming = (test) => {
        return new Date(test.startTime) > new Date();
    };

    return (
        <div className="bg-slate-50 h-fit w-full p-4">
            <Navbar title="Student Dashboard" />

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome user */}
                <div className="my-8 pt-8">
                    <h1 className="text-4xl mt-4 font-bold text-gray-900">
                        Welcome,{" "}
                        {currentUser?.name &&
                            currentUser.name.charAt(0).toUpperCase() +
                                currentUser.name.slice(1).toLowerCase()}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        View your upcoming and available tests
                    </p>
                </div>
                {/* Divider */}
                <div className="w-full h-1 bg-linear-to-r from-gray-700 to-white rounded" />
                {isLoading ? (
                    <div className="text-center py-8 bg-white shadow rounded-lg">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading tests...</p>
                    </div>
                ) : (
                    <>
                        {/* Available Tests */}
                        <div className="rounded-lg mb-8 mt-20">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Available Tests
                            </h2>
                            {tests.filter(isAvailable).length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500">
                                        No tests available right now.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                                    {tests.filter(isAvailable).map((test) => (
                                        <div
                                            key={test._id}
                                            className="bg-white border border-gray-300 rounded-lg shadow-[0_1px_5px_rgba(0,0,0,0.2)] hover:shadow-md"
                                        >
                                            <div className="p-5 hover:shadow-lg transition-shadow duration-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {test.title}
                                                    </h3>
                                                    {getStatusBadge(test)}
                                                </div>
                                                <p className="text-gray-600 text-sm mb-3">
                                                    {test.subject}
                                                </p>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <Clock
                                                        size={16}
                                                        className="mr-1 text-green-600"
                                                    />
                                                    <span>
                                                        {test.duration} minutes
                                                    </span>
                                                </div>
                                                <div className="text-sm font-medium text-gray-500 mb-4">
                                                    <div>
                                                        Ends:{" "}
                                                        {formatDate(
                                                            test.endTime
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="pt-2 border-t border-gray-100">
                                                    {hasAttempted(test._id) ? (
                                                        <Link
                                                            to={`/student/results/${test._id}`}
                                                            className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                                        >
                                                            View Results
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            to={`/student/take-test/${test._id}`}
                                                            className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md hover:scale-103 transition-transform duration-400"
                                                        >
                                                            <Bookmark
                                                                size={16}
                                                                className="mr-2"
                                                            />{" "}
                                                            Start Test
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Upcoming Tests */}
                        <div className="bg-white rounded-lg p-6 mb-8 shadow-[0_1px_10px_rgba(0,0,0,0.25)] ">
                            <h2 className="text-2xl font-medium text-gray-900 mb-4">
                                Upcoming Tests
                            </h2>
                            {tests.filter(isUpcoming).length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500">
                                        No upcoming tests scheduled.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-gray-400 pt-4">
                                    {tests.filter(isUpcoming).map((test) => (
                                        <div
                                            key={test._id}
                                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 "
                                        >
                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {test.title}
                                                    </h3>
                                                    {getStatusBadge(test)}
                                                </div>
                                                <p className="text-gray-600 text-sm mb-3">
                                                    {test.subject}
                                                </p>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <Clock
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    <span>
                                                        {test.duration} minutes
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                                    <Calendar
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    <span>
                                                        Starts:{" "}
                                                        {formatDate(
                                                            test.startTime
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
