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
const isPrevious = (test) => {
    return new Date(test.endTime) < new Date();
};

    const getStatusBadge = (test) => {
        const now = new Date();
        const start = new Date(test.startTime);
        const end = new Date(test.endTime);
        if (now >= start && now <= end) {
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Available Now
                </span>
            );
        } else if (now < start) {
            return (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Upcoming
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
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
        <div className="h-fit w-full bg-slate-50 p-4">
            <Navbar title="Student Dashboard" />

            <div className="max-w-8xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome user */}
                <div className="my-8 pt-8">
                    <h1 className="mt-4 text-4xl font-bold text-gray-900">
                        Welcome,{" "}
                        {currentUser?.name &&
                            currentUser.name.charAt(0).toUpperCase() +
                                currentUser.name.slice(1).toLowerCase()}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        View your upcoming and available tests
                    </p>
                </div>
                {/* Divider */}
                <div className="h-1 w-full rounded bg-linear-to-r from-gray-700 to-white" />
                {isLoading ? (
                    <div className="rounded-lg bg-white py-8 text-center shadow">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading tests...</p>
                    </div>
                ) : (
                    <>
                        {/* Available Tests */}
                        <div className="mt-20 mb-8 rounded-lg">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                Available Tests
                            </h2>
                            {tests.filter(isAvailable).length === 0 ? (
                                <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center">
                                    <p className="text-gray-500">
                                        No tests available right now.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:grid-cols-3">
                                    {tests.filter(isAvailable).map((test) => (
                                        <div
                                            key={test._id}
                                            className="rounded-lg border border-gray-300 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.2)] hover:shadow-md"
                                        >
                                            <div className="p-5 transition-shadow duration-200 hover:shadow-lg">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {test.title}
                                                    </h3>
                                                    {getStatusBadge(test)}
                                                </div>
                                                <p className="mb-3 text-sm text-gray-600">
                                                    {test.subject}
                                                </p>
                                                <div className="mb-2 flex items-center text-sm text-gray-500">
                                                    <Clock
                                                        size={16}
                                                        className="mr-1 text-green-600"
                                                    />
                                                    <span>
                                                        {test.duration} minutes
                                                    </span>
                                                </div>
                                                <div className="mb-4 text-sm font-medium text-gray-500">
                                                    <div>
                                                        Ends:{" "}
                                                        {formatDate(
                                                            test.endTime,
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="border-t border-gray-100 pt-2">
                                                    {hasAttempted(test._id) ? (
                                                        <Link
                                                            to={`/student/results/${test._id}`}
                                                            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                                        >
                                                            View Results
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            to={`/student/take-test/${test._id}`}
                                                            className="inline-flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-transform duration-400 hover:scale-103 hover:bg-green-700"
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
                        <div className="mb-8 rounded-lg bg-white p-6 shadow-[0_1px_10px_rgba(0,0,0,0.25)]">
                            <h2 className="mb-4 text-2xl font-medium text-gray-900">
                                Upcoming Tests
                            </h2>
                            {tests.filter(isUpcoming).length === 0 ? (
                                <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center">
                                    <p className="text-gray-500">
                                        No upcoming tests scheduled.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 border-t border-gray-400 pt-4 md:grid-cols-2 lg:grid-cols-3">
                                    {tests.filter(isUpcoming).map((test) => (
                                        <div
                                            key={test._id}
                                            className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
                                        >
                                            <div className="p-5">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {test.title}
                                                    </h3>
                                                    {getStatusBadge(test)}
                                                </div>
                                                <p className="mb-3 text-sm text-gray-600">
                                                    {test.subject}
                                                </p>
                                                <div className="mb-2 flex items-center text-sm text-gray-500">
                                                    <Clock
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    <span>
                                                        {test.duration} minutes
                                                    </span>
                                                </div>
                                                <div className="mb-4 flex items-center text-sm text-gray-500">
                                                    <Calendar
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    <span>
                                                        Starts:{" "}
                                                        {formatDate(
                                                            test.startTime,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Previous Tests */}
<div className="mb-8 rounded-lg bg-white p-6 shadow-[0_1px_10px_rgba(0,0,0,0.25)]">
    <h2 className="mb-4 text-2xl font-medium text-gray-900">
        Previous Tests
    </h2>
    {tests.filter(isPrevious).length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center">
            <p className="text-gray-500">
                No previous tests.
            </p>
        </div>
    ) : (
        <div className="grid grid-cols-1 gap-6 border-t border-gray-400 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {tests.filter(isPrevious).map((test) => (
                <div
                    key={test._id}
                    className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
                >
                    <div className="p-5">
                        <div className="mb-3 flex items-start justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {test.title}
                            </h3>
                            {getStatusBadge(test)}
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            {test.subject}
                        </p>
                        <div className="mb-2 flex items-center text-sm text-gray-500">
                            <Clock size={16} className="mr-1" />
                            <span>{test.duration} minutes</span>
                        </div>
                        <div className="mb-4 flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-1" />
                            <span>Ended: {formatDate(test.endTime)}</span>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                            {hasAttempted(test._id) ? (
                                <Link
                                    to={`/student/results/${test._id}`}
                                    className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    View Results
                                </Link>
                            ) : (
                                <span className="inline-flex w-full items-center justify-center rounded-md bg-gray-400 px-4 py-2 text-sm font-medium text-white">
                                    Not Attempted
                                </span>
                            )}
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
