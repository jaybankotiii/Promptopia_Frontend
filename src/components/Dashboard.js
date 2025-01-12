import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PromptItem from './PromptItem';
import AddPrompt from './AddPrompt';
import EvaluateButton from './EvaluateButton';

const Dashboard = () => {
    const [prompts, setPrompts] = useState([]);


    // Check evaluation status on component mount
    useEffect(() => {
        const checkEvaluationStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/prompts/status', {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error('Error checking evaluation status:', error);
            }
        };

        checkEvaluationStatus();
    }, []);


    // Fetch prompts from the database
    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/prompts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPrompts(response.data);
            } catch (error) {
                console.error('Error fetching prompts:', error);
            }
        };
        fetchPrompts();
    }, []);

    // Add a new prompt to the state
    const addPrompt = (newPrompt) => {
        setPrompts([...prompts, newPrompt]);
    };

    // Delete a prompt from the state
    const deletePrompt = (id) => {
        setPrompts(prompts.filter(prompt => prompt._id !== id));
    };



    return (
        <div className="flex items-center justify-center h-screen overflow-y-auto overflow-x-hidden bg-gray-100">
            <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Scrollable container for prompts */}
                <div className="max-h-[500px] overflow-y-auto no-scrollbar space-y-4 pr-2">
                    {prompts.map((prompt) => (
                        <PromptItem
                            key={prompt._id}
                            promptData={prompt}
                            onDelete={deletePrompt}
                        />
                    ))}
                </div>

                <AddPrompt onAdd={addPrompt} />
                <EvaluateButton prompts={prompts} />
            </div>


        </div>
    );
};

export default Dashboard;
