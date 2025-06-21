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
        <div className="min-h-screen bg-white">
            <Navbar title="Teacher Dashboard" />

            <div className="max-w-8xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="mb-12 bg-red">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-6 lg:mb-0">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Welcome back, {user?.name}
                            </h1>
                            <p className="text-md text-gray-600">
                                Manage your tests and track student performance
                            </p>
                        </div>

                        <Link
                            to="/teacher/create-test"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <PlusCircle size={20} className="mr-2" />
                            Create New Test
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 border-t border-gray-200 pt-6 ">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <BookOpen className="w-6 h-6 text-blue-600" />
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

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ">
                        <div className="flex items-center ">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-black">
                                    Active Tests
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        tests.filter(
                                            (test) => test.status === "active"
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-black">
                                    Upcoming
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        tests.filter(
                                            (test) => test.status === "upcoming"
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tests Section */}
                <div className="bg-white rounded-2xl ">
                    <div className="p-8 border-b border-gray-200 ">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Tests
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage and monitor all your tests
                        </p>
                    </div>

                    <div className="p-8">
                        {isLoading ? (
                            <div className="text-center py-16">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                                <p className="text-lg text-gray-600">
                                    Loading your tests...
                                </p>
                            </div>
                        ) : tests.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No tests yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Get started by creating your first test
                                </p>
                                <Link
                                    to="/teacher/create-test"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <PlusCircle size={18} className="mr-2" />
                                    Create Your First Test
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
                                {tests.map((test) => (
                                    <div
                                        key={test._id}
                                        className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-200 overflow-hidden shadow-lg"
                                    >
                                        {/* Header */}
                                        <div className="p-6 pb-4">
                                            <div className="flex justify-between mb-3 items-center group space-x-2">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-3 ">
                                                    {/* {test.title} */}
                                                </h3>
                                                <div className="ml-2 w-2 h-2 bg-red-700 rounded-full opacity-60 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div>

                                                <span
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                                                        test.status
                                                    )}`}
                                                >
                                                    {test.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center border border-blue-200 p-2 rounded-md">
                                                    <BookOpen
                                                        size={16}
                                                        className="mr-1.5 text-blue-500"
                                                    />
                                                    <span className="text-xl font-bold text-gray-500">
                                                        {test.subject}
                                                    </span>
                                                </div>
                                                <div className="flex items-center border border-red-400 rounded-full p-2">
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
                                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                                <div className="flex items-center text-sm">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                                    <span className="text-gray-500 w-12">
                                                        Start:
                                                    </span>
                                                    <span className="text-gray-900 font-medium">
                                                        {formatDate(
                                                            test.startTime
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                                    <span className="text-gray-500 w-12">
                                                        End:
                                                    </span>
                                                    <span className="text-gray-900 font-medium">
                                                        {formatDate(
                                                            test.endTime
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
                                                    className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Edit
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Edit
                                                </Link>
                                                <Link
                                                    to={`/teacher/results/${test._id}`}
                                                    className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
