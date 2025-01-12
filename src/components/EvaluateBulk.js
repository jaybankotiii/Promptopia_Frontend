import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EvaluateBulk = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);

        try {
            const token = localStorage.getItem('token');

            // Send file to backend
            await axios.post('http://localhost:3000/api/prompts/evaluate-bulk', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Redirect to /evaluating after upload
            navigate('/evaluating');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload the file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white ">
            <div className="bg-white shadow-lg border rounded-lg p-8 w-full max-w-md text-center">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                    📄 Upload Bulk Prompts (.xlsx)
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
                    <label className="w-full cursor-pointer flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-400 hover:border-blue-500 rounded-lg py-6 px-4 transition duration-300">
                        {file ? (
                            <p className="text-gray-700 font-medium">
                                ✅ {file.name}
                            </p>
                        ) : (
                            <div className="text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0l-3 3m3-3l3 3m9 4v8m0 0l3-3m-3 3l-3-3" />
                                </svg>
                                <span>Drag & drop or click to upload</span>
                                <p className="text-xs text-gray-400">Only .xlsx files are accepted</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-semibold text-white text-lg shadow-md transition duration-300 transform ${
                            uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                        }`}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload and Evaluate'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EvaluateBulk;
