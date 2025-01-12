import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Evaluating from './components/Evaluating';
import EvaluateBulk from './components/EvaluateBulk';  // 🚀 New Component

import axios from 'axios';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isEvaluated, setIsEvaluated] = useState(true);
    const [loading, setLoading] = useState(true);

    // 🔍 Check evaluation status on login
    useEffect(() => {
        const checkEvaluationStatus = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:3000/api/prompts/status', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsEvaluated(response.data.isEvaluated);
                } catch (error) {
                    console.error('Error checking evaluation status:', error);
                }
            }
            setLoading(false);
        };

        checkEvaluationStatus();
    }, [isLoggedIn]);

    // ⏳ Show loading while checking evaluation
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-xl font-semibold">Loading...</h1>
            </div>
        );
    }

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                {/* 🌐 Public Routes */}
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/evaluating" element={<Evaluating />} />

                {/* 🏠 Redirect based on evaluation */}
                <Route
                    path="/"
                    element={
                        isLoggedIn
                            ? (isEvaluated ? <Navigate to="/dashboard" /> : <Navigate to="/evaluating" />)
                            : <Home />
                    }
                />

                {/* 🔒 Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute isLoggedIn={isLoggedIn} isEvaluated={isEvaluated}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                {/* 📂 New Bulk Upload Route */}
                <Route
                    path="/evaluate-bulk"
                    element={
                        <ProtectedRoute isLoggedIn={isLoggedIn} isEvaluated={isEvaluated}>
                            <EvaluateBulk />
                        </ProtectedRoute>
                    }
                />

                {/* 🚧 Redirect Rules */}
                {!isLoggedIn && <Route path="*" element={<Navigate to="/" />} />}
                {isLoggedIn && !isEvaluated && <Route path="*" element={<Navigate to="/evaluating" />} />}
            </Routes>
        </Router>
    );
}

export default App;
