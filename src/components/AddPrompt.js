import React, { useState } from 'react';
import axios from 'axios';

const AddPrompt = ({ onAdd }) => {
    const [newPrompt, setNewPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState('');

    const handleAdd = async () => {
        if (!newPrompt || !selectedModel) return;

        try {
            const token = localStorage.getItem('token');  // ✅ Get the token
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/prompts`,
                {
                    prompt: newPrompt,
                    goldenModel: selectedModel,
                    suggestedModel: null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // ✅ Include token in headers
                    },
                }
            );

            onAdd(response.data);
            setNewPrompt('');
            setSelectedModel('');
        } catch (error) {
            console.error('Error adding prompt:', error);
        }
    };

    return (
        <div className="flex items-center space-x-2 mb-4 p-4 border rounded-lg">
            <button
                onClick={handleAdd}
                disabled={!newPrompt || !selectedModel}
                className={`px-3 py-1 rounded ${
                    !newPrompt || !selectedModel
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white'
                }`}
            >
                +
            </button>

            <input
                type="text"
                placeholder="Add a Prompt"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                className="flex-grow border p-2 rounded"
            />

            <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="border p-2 rounded"
            >
                <option value="">Select</option>
                <option value="gpt-4">gpt-4</option>
                <option value="gpt-4-turbo">gpt-4-turbo</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</option>
                <option value="claude-2.1">claude-2.1</option>
                <option value="claude-2.0">claude-2.0</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash</option>
            </select>
        </div>
    );
};

export default AddPrompt;
