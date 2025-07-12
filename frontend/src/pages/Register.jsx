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
            navigate("/login");
        } else {
            alert("Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-4 py-8 md:flex-row md:gap-16 md:px-8 md:py-12">
            {/* Left - Image */}
            <div className="hidden md:block">
                <img
                    src="/images/Screenshot 2025-06-22 163759.png"
                    alt="Register"
                    className="h-auto w-80 object-cover md:w-96"
                />
            </div>

            {/* Right - Form */}
            <div className="animate-fade-in w-full max-w-md space-y-6 rounded-2xl border border-gray-300 bg-white p-6 shadow-xl md:p-8">
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
                        className="lucide lucide-square-user mb-2 h-16 w-16 text-blue-800"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                    </svg>
                    <h2 className="mb-2 text-center text-2xl font-extrabold text-gray-900 md:text-4xl">
                        Create Your Account
                    </h2>
                    <p className="text-center text-sm text-gray-500">
                        Join as a Student or Teacher
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg transition duration-150 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
