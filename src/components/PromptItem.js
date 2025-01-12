import React, { useState } from 'react';
import axios from 'axios';

const PromptItem = ({ promptData, onDelete }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Delete prompt from the database
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/prompts/${promptData._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onDelete(promptData._id);
        } catch (error) {
            console.error('Error deleting prompt:', error);
        }
    };

    return (
        <div className="flex flex-col space-y-2 mb-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setShowConfirmation(true)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                >
                    -
                </button>

                <input
                    type="text"
                    value={promptData.prompt}
                    readOnly
                    className="flex-grow border p-2 rounded"
                />

                {/* Display the selected model as read-only text */}
                <div className="px-3 py-1 bg-gray-200 border p-2 rounded">
                    {promptData.goldenModel || 'No Model Selected'}
                </div>
            </div>


            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p className="mb-4">Do you really want to remove this prompt?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptItem;
