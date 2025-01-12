import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [isOpen, setIsOpen] = useState(false); // Mobile menu state
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear authentication token
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to login
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-gray-800">
                            Promptopia
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/evaluate-bulk"
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Evaluate Bulk
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="space-y-2 px-4 py-2">
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="block text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/evaluate"
                                    className="block text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Evaluate Prompt
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block text-left text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
