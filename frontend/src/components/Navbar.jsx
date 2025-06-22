import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = ({ title = "ExamPortal" }) => {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 w-full border border-gray-300 bg-blue-50">
            <div className="max-w-8xl mx-auto px-12 py-0">
                <div className="flex h-16 justify-between">
                    <div className="flex gap-4">
                        <img
                            src="./images/examind.png"
                            alt="Examind"
                            className="h-12 w-44"
                        />
                        <Link
                            to={
                                currentUser?.role === "teacher"
                                    ? "/teacher"
                                    : "/student"
                            }
                            className="flex flex-shrink-0 items-center"
                        >
                            <span className="text-[26px] font-bold text-blue-900 text-shadow-lg">
                                {title}
                            </span>
                        </Link>
                    </div>

                    <div className="hidden items-center space-x-4 md:flex">
                        {currentUser && (
                            <div className="font-medium text-white">
                                {currentUser.name} ({currentUser.role})
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="text-md flex cursor-pointer items-center space-x-1 rounded-md bg-red-800 px-3 py-2 font-medium text-white transition duration-150 ease-in-out hover:scale-105 hover:bg-red-700"
                        >
                            <LogOut size={16} />
                            <span>Log out</span>
                        </button>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-700 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="bg-blue-700 md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {currentUser && (
                            <div className="block px-3 py-2 font-medium text-white">
                                {currentUser.name} ({currentUser.role})
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center space-x-1 rounded-md bg-blue-800 px-3 py-2 text-sm font-medium text-white hover:bg-blue-900"
                        >
                            <LogOut size={16} />
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
