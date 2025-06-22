import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const user = await login(email, password);
        setIsLoading(false);

        if (user) {
            if (user.role === "teacher") {
                navigate("/teacher");
            } else if (user.role === "student") {
                navigate("/student");
            } else {
                navigate("/");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center gap-30 bg-white px-4 py-12">
            <div className="animate-fade-in w-full max-w-md space-y-6 rounded-2xl border border-gray-300 bg-white p-8 shadow-[0_1px_10px_rgba(0,0,0,0.25)]">
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
                        className="lucide lucide-square-user mb-2 h-24 w-16 text-blue-800"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                    </svg>
                    <h2 className="mb-2 text-3xl font-extrabold text-black">
                        Sign In to Your Account
                    </h2>
                    <p className="text-sm text-gray-500">
                        Welcome back! Please login to continue.
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg transition duration-150 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <div className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Create Account
                    </Link>
                </div>
            </div>

            <div>
                <img
                    src="../images/login.png"
                    alt="login"
                    className="h-172 w-196"
                />
            </div>
        </div>
    );
};

export default Login;
