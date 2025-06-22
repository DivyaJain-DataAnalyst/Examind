import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    PlusCircle,
    Edit,
    BarChart,
    Clock,
    Calendar,
    Users,
    BookOpen,
    BookCheck,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../config/axios";

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await axios.get("/api/teacher/tests", {
                    params: { teacherId: user._id },
                });
                console.log("Fetched tests:", res.data);
                setTests(res.data);
            } catch (error) {
                console.error("Error fetching tests:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.role === "teacher") {
            fetchTests();
        }
    }, [user]);

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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "upcoming":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "active":
                return "bg-green-50 text-green-700 border-green-200";
            case "completed":
                return "bg-gray-50 text-gray-700 border-gray-200";
            default:
                return "bg-blue-50 text-blue-700 border-blue-200";
        }
    };

    return (
        <div className="min-h-screen bg-white p-4">
            <Navbar title="Teacher Dashboard" />

            <div className="max-w-8xl mx-auto mt-4 px-6 py-12">
                {/* Header Section */}
                <div className="bg-red mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-6 lg:mb-0">
                            <h1 className="mt-6 mb-2 text-4xl font-bold text-gray-900">
                                Welcome back,{" "}
                                {user?.name &&
                                    user.name.charAt(0).toUpperCase() +
                                        user.name.slice(1).toLowerCase()}
                            </h1>
                            <p className="text-md text-gray-600">
                                Manage your tests and track student performance
                            </p>
                        </div>

                        <Link
                            to="/teacher/create-test"
                            className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white hover:from-blue-800"
                        >
                            <PlusCircle
                                size={20}
                                className="mr-2"
                                strokeWidth={2.5}
                            />
                            Create New Test
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-12 grid grid-cols-1 gap-6 border-t border-gray-200 pt-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_5px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center">
                            <div className="rounded-xl bg-blue-100 p-3">
                                <BookCheck className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-black">
                                    Total Tests
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {tests.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_5px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center">
                            <div className="rounded-xl bg-green-100 p-3">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-black">
                                    Active Tests
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        tests.filter(
                                            (test) => test.status === "active",
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_5px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center">
                            <div className="rounded-xl bg-purple-100 p-3">
                                <Calendar className="h-6 w-6 text-black" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-black">
                                    Upcoming
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        tests.filter(
                                            (test) =>
                                                test.status === "upcoming",
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tests Section */}
                <div className="rounded-2xl bg-white">
                    <div className="border-b border-gray-200 py-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Tests
                        </h2>
                        <p className="mt-1 text-gray-600">
                            Manage and monitor all your tests
                        </p>
                    </div>

                    <div className="py-8">
                        {isLoading ? (
                            <div className="py-16 text-center">
                                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                                <p className="text-lg text-gray-600">
                                    Loading your tests...
                                </p>
                            </div>
                        ) : tests.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                                    <BookOpen className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                    No tests yet
                                </h3>
                                <p className="mb-6 text-gray-600">
                                    Get started by creating your first test
                                </p>
                                <Link
                                    to="/teacher/create-test"
                                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                                >
                                    <PlusCircle size={18} className="mr-2" />
                                    Create Your First Test
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                                {tests.map((test) => (
                                    <div
                                        key={test._id}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.25)] transition-all duration-200 hover:border-gray-300 hover:shadow-xl"
                                    >
                                        {/* Header */}
                                        <div className="p-6 pb-4">
                                            <div className="group mb-3 flex items-center justify-between space-x-2">
                                                <h3 className="mr-3 flex-1 truncate text-lg font-semibold text-gray-900">
                                                    {/* {test.title} */}
                                                </h3>
                                                <div className="ml-2 h-2 w-2 rounded-full bg-red-700 opacity-60 transition-all duration-300 group-hover:animate-pulse group-hover:opacity-100"></div>

                                                <span
                                                    className={`rounded-lg px-2.5 py-1 text-xs font-medium ${getStatusColor(
                                                        test.status,
                                                    )}`}
                                                >
                                                    {test.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center rounded-md p-2">
                                                    <span className="text-2xl font-bold text-gray-500">
                                                        {test.subject}
                                                    </span>
                                                </div>
                                                <div className="flex items-center rounded-xl bg-red-300/30 p-2">
                                                    <Clock
                                                        size={16}
                                                        className="mr-1.5 text-green-500"
                                                    />
                                                    <span>
                                                        {test.duration} min
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Schedule */}
                                        <div className="px-6 pb-4">
                                            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                                <div className="flex items-center text-sm">
                                                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="w-12 text-gray-500">
                                                        Start:
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                        {formatDate(
                                                            test.startTime,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <div className="mr-3 h-2 w-2 rounded-full bg-red-500"></div>
                                                    <span className="w-12 text-gray-500">
                                                        End:
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                        {formatDate(
                                                            test.endTime,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="px-6 pb-6">
                                            <div className="flex gap-3">
                                                <Link
                                                    to={`/teacher/edit-test/${test._id}`}
                                                    className="flex flex-1 items-center justify-center rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                                                >
                                                    <Edit
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Edit
                                                </Link>
                                                <Link
                                                    to={`/teacher/results/${test._id}`}
                                                    className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                                >
                                                    <BarChart
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Results
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
