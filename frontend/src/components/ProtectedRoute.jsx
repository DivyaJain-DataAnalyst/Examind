// // import React from 'react';
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// const ProtectedRoute = ({ children, role }) => {
//     const { user } = useAuth();

//     if (!user) {
//         // Not logged in
//         return <Navigate to="/login" replace />;
//     }

//     if (role && user.role !== role) {
//         // Logged in but wrong role
//         return <Navigate to="/" replace />;
//     }

//     // Authorized
//     return children;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
