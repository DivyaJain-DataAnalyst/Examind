import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo"; // Assuming Logo component is in the same directory

const Navbar = ({ title = "ExamPortal" }) => {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleMenu = () => {
        // Added toggleMenu for consistency
        setIsOpen((prev) => !prev);
    };

    return (
        // Fixed Navbar to stay at the top, matching NavbarPublic's styling
        <nav className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 text-black shadow-md sm:px-8 md:px-12 lg:px-16">
            {/* Logo and Title - Aligned with NavbarPublic */}
            <div className="flex items-center space-x-2">
                {/* Image logo with absolute path */}
                <Logo className="text-2xl sm:text-3xl" />{" "}
                {/* Adjusted size for responsiveness */}
            </div>

            {/* Desktop User Info and Logout Button */}
            <div className="hidden items-center space-x-4 md:flex">
                {currentUser && (
                    <div className="font-medium text-gray-800">
                        {" "}
                        {/* Changed text-white to text-gray-800 for consistency with public navbar */}
                        {currentUser.name} ({currentUser.role})
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="text-md flex cursor-pointer items-center space-x-1 rounded-md bg-red-600 px-3 py-2 font-medium text-white shadow-sm transition duration-150 ease-in-out hover:scale-105 hover:bg-red-700" // Added shadow-sm
                >
                    <LogOut size={16} />
                    <span>Log out</span>
                </button>
            </div>

            {/* Mobile Menu Button - Aligned with NavbarPublic */}
            <div className="relative h-8 w-8 cursor-pointer rounded-md p-2 md:hidden">
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                        isOpen
                            ? "scale-90 rotate-45 opacity-0"
                            : "scale-100 rotate-0 opacity-100"
                    }`}
                >
                    <Menu
                        onClick={toggleMenu}
                        size={28}
                        className="text-gray-800"
                    />{" "}
                    {/* Adjusted size and color */}
                </div>
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                        isOpen
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-90 -rotate-45 opacity-0"
                    }`}
                >
                    <X
                        onClick={toggleMenu}
                        size={28}
                        className="text-gray-800"
                    />{" "}
                    {/* Adjusted size and color */}
                </div>
            </div>

            {/* Mobile menu - Aligned with NavbarPublic */}
            {isOpen && (
                <div className="absolute top-full left-0 z-40 w-full overflow-hidden rounded-b-xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-md backdrop-saturate-150 md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {currentUser && (
                            <div className="block px-3 py-2 font-medium text-gray-800">
                                {" "}
                                {/* Changed text-white to text-gray-800 */}
                                {currentUser.name} ({currentUser.role})
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center space-x-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700" // Adjusted color and added shadow-sm
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
