// import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

// ...existing code...

ProtectedRoute.propTypes = {
    role: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired, // Ensure children is a React node
    // add other props if needed
};

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // Logged in but wrong role
        return <Navigate to="/" replace />;
    }

    // Authorized
    return children;
};

export default ProtectedRoute;

// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const ProtectedRoute = ({ children, role }) => {
//   const { isAuthenticated, currentUser } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (role && currentUser?.role !== role) {
//     // Redirect to appropriate dashboard based on role
//     const redirectPath = currentUser?.role === 'teacher' ? '/teacher' : '/student';
//     return <Navigate to={redirectPath} replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;
