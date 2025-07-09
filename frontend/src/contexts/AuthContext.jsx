
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            axios
                .get("/users/profile") // backend should respond with { user: { name, email, role } }
                .then((res) => {
                    setUser(res.data.user);
                })
                .catch((err) => {
                    console.error("Session invalid:", err.message);
                    localStorage.removeItem("token");
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // const login = async (email, password) => {
    //     try {
    //         const res = await axios.post("/users/login", { email, password });
    //         const { token, user } = res.data;
    //         localStorage.setItem("token", token);
    //         setUser(user);
    //         return true;
    //     } catch (err) {
    //         console.error("Login failed:", err.response?.data || err.message);
    //         return false;
    //     }
    // };
const login = async (email, password) => {
    try {
        const res = await axios.post("/users/login", { email, password });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        setUser(user);
        return user; // 👈 return user directly
    } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
        return null;
    }
};

    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post("/users/register", {
                name,
                email,
                password,
                role,
            });

            const { token, user } = res.data;
            localStorage.setItem("token", token);
            setUser(user);
            return true;
        } catch (err) {
            console.error("Registration failed:", err.response?.data || err.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.get("/users/logout");
        } catch (err) {
            console.error("Logout error:", err.response?.data || err.message);
        }
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

