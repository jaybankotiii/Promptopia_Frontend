import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, isEvaluated, children }) => {
    // If the user is not logged in, redirect to login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // If the user is logged in but evaluation is incomplete, redirect to /evaluating
    if (!isEvaluated) {
        return <Navigate to="/evaluating" replace />;
    }

    // If logged in and evaluated, allow access
    return children;
};

export default ProtectedRoute;
