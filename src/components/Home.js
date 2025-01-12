import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Promptopia</h1>
            <div className="space-x-4">
                <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/register')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Home;
