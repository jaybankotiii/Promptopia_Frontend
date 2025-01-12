import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EvaluateButton = ({ prompts }) => {
    const navigate = useNavigate();

    const handleViewReport = () => {
        navigate('/evaluating');  // Redirect to evaluating page
    };

    const handleEvaluateAll = async () => {
        try {
            const token = localStorage.getItem('token');

            const formattedPrompts = prompts.map(({ prompt, goldenModel }) => ({
                prompt,
                goldenModel
            }));

            console.log("Sending data to evaluate:", formattedPrompts);

            const response = await axios.post(
                'http://localhost:3000/api/prompts/evaluate',
                { prompts: formattedPrompts },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('Evaluation started:', response.data);
            navigate('/evaluating');  // Redirect to evaluating page after starting evaluation
        } catch (error) {
            console.error('Error evaluating prompts:', error);
            alert('Error during evaluation.');
        }
    };

    return (
        <>
            <div className="flex justify-between space-x-4 mt-4 w-full">
                <button
                    onClick={handleEvaluateAll}
                    className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Evaluate All
                </button>

                <button
                    onClick={handleViewReport}
                    className="w-1/2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    View Report
                </button>
            </div>
        </>
    );
};

export default EvaluateButton;
