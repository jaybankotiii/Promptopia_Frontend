import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState(''); // To display success or error message
    const navigate = useNavigate(); // For redirection

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', form);
            setMessage({ type: 'success', text: response.data.message }); // Show success message
            navigate('/dashboard'); // Redirect to dashboard
        } catch (err) {
            setMessage({ type: 'error', text: err.response.data.error }); // Show error message
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Register
                </button>
            </form>
            {message && (
                <p
                    className={`mt-4 ${
                        message.type === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default Register;
