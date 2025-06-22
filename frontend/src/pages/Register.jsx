import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await register(name, email, password, role);
        setIsLoading(false);
        if (success) {
            navigate("/login"); // ✅ Go to login page after register
        } else {
            alert("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 gap-60 bg-white">
            <div>
                <img
                    src="./images/Screenshot 2025-06-22 163759.png"
                    alt="Register"
                    className="w-124 h-164 object-cover"
                />
            </div>
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in border border-gray-300">
                <div className="flex flex-col items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-square-user w-16 h-24 text-blue-800 mb-2"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                    </svg>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Create Your Account
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Join as a Student or Teacher
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        required
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                <div className="text-center text-gray-500 text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
