import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);  // ✅ Added loading state
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);  // ✅ Start loading

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, form);

            // Store token and update login state
            localStorage.setItem('token', response.data.token);
            setIsLoggedIn(true);

            // Redirect based on isEvaluated status
            if (response.data.isEvaluated) {
                navigate('/dashboard');  // ✅ Redirect to Dashboard
            } else {
                navigate('/evaluating');  // ✅ Redirect to Evaluating page
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'An unexpected error occurred');
        } finally {
            setLoading(false);  // ✅ Stop loading
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border p-2 rounded"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-2 rounded"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    disabled={loading}  // ✅ Disable button when loading
                >
                    {loading ? 'Logging in...' : 'Login'}  {/* ✅ Show loading text */}
                </button>
            </form>

            {message && (
                <p className="mt-4 text-red-500">
                    {message}
                </p>
            )}
        </div>
    );
};

export default Login;
