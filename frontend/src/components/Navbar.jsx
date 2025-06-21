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
        <nav className="bg-white shadow-lg fixed top-0 left-0 w-full">
            <div className="max-w-8xl px-8 mx-auto">
                <div className="flex justify-between h-16">
                    <div className="flex items-center ">
                        <Link
                            to={
                                currentUser?.role === "teacher"
                                    ? "/teacher"
                                    : "/student"
                            }
                            className="flex-shrink-0 flex items-center"
                        >
                            <span className="text-blue-900 text-3xl font-bold">
                                {title}
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {currentUser && (
                            <div className="text-white font-medium">
                                {currentUser.name} ({currentUser.role})
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-800 hover:bg-red-700 hover:scale-105 transition duration-150 ease-in-out"
                        >
                            <LogOut size={16} />
                            <span>Log out</span>
                        </button>
                    </div>

                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-blue-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {currentUser && (
                            <div className="text-white font-medium px-3 py-2 block">
                                {currentUser.name} ({currentUser.role})
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-800 hover:bg-blue-900"
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
