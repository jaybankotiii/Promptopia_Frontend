import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Evaluating = () => {
    const [isEvaluating, setIsEvaluating] = useState(true);
    const [statusMessage, setStatusMessage] = useState('Fetching your results. Please wait...');
    const [results, setResults] = useState([]);
    const [selectedComparison, setSelectedComparison] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Check evaluation status periodically
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const token = localStorage.getItem('token');

                // Check evaluation status
                const statusResponse = await axios.get('http://localhost:3000/api/prompts/status', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(statusResponse.data);

                if (statusResponse.data.isEvaluated) {
                    setIsEvaluating(false);
                    setStatusMessage('🎉 Your evaluation is complete!');

                    // Fetch evaluation results
                    const resultsResponse = await axios.get('http://localhost:3000/api/prompts/results', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    setResults(resultsResponse.data);
                    clearInterval(interval);
                }
                else{
                    setStatusMessage('Your prompts are being evaluated. Please wait...');
                }
            } catch (error) {
                console.error('Error checking evaluation status:', error);
                setStatusMessage('⚠️ Error checking evaluation status. Please try again.');
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const openModal = (comparisons) => {
        setSelectedComparison(comparisons);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedComparison(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-800">📊 Evaluation Results</h1>
            <p className="text-lg text-gray-600 mb-6">{statusMessage}</p>

            {isEvaluating ? (
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                    {results.map((prompt, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold text-indigo-600">
                                {prompt.prompt.length > 50 ? `${prompt.prompt.slice(0, 40)}...` : prompt.prompt}
                            </h2>

                            <div className="mt-4 space-y-2">
                                <p>
                                    <strong>Gold Standard Model:</strong> {prompt.goldStandard ? prompt.goldStandard.model : 'Loading...'}
                                </p>
                                <p>
                                    <strong>Best Model:</strong> {prompt.decision ? prompt.decision.bestModel : 'Loading...'}
                                </p>
                                <p>
                                    <strong>Preferred for Latency:</strong> {prompt.decision ? prompt.decision.preferredForLatency : 'Loading...'}
                                </p>
                                <p>
                                    <strong>Preferred for Token Efficiency:</strong> {prompt.decision ? prompt.decision.preferredForTokenEfficiency : 'Loading...'}
                                </p>
                            </div>

                            {prompt.comparisons && prompt.comparisons.length > 0 ? (
                                <button
                                    onClick={() => openModal(prompt.comparisons)}
                                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                                >
                                    View Model Comparisons
                                </button>
                            ) : (
                                <p className="text-gray-400 mt-2">Comparisons not available yet.</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No evaluation results found.</p>
            )}

            {!isEvaluating && (
                <a
                    href="/dashboard"
                    className="mt-8 bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition duration-200"
                >
                    Go to Dashboard
                </a>
            )}

            {/* 🖼️ Modal for Model Comparisons */}
            {isModalOpen && selectedComparison && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 no-scrollbar rounded-lg shadow-lg w-full max-w-5xl overflow-y-auto max-h-[80vh]">
                        <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Model Comparisons</h3>

                        {/* ✅ Comparison Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Model</th>
                                    <th className="border border-gray-300 px-4 py-2">Latency (ms)</th>
                                    <th className="border border-gray-300 px-4 py-2">Token Economy Gain (%)</th>
                                    <th className="border border-gray-300 px-4 py-2">Semantic Similarity</th>
                                    <th className="border border-gray-300 px-4 py-2">Coherence</th>
                                    <th className="border border-gray-300 px-2 py-2 w-32">Accuracy</th>
                                    <th className="border border-gray-300 px-4 py-2">Verdict</th>
                                    <th className="border border-gray-300 px-4 py-2">Reasoning</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedComparison.map((comp, idx) => (
                                    <tr key={idx} className="text-center">
                                        <td className="border border-gray-300 px-4 py-2">{comp.model}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comp.metrics?.latency?.toFixed(2) || 'N/A'}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comp.metrics?.tokenEconomyGain?.toFixed(2) || 'N/A'}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comp.metrics?.semanticSimilarity?.toFixed(2) || 'N/A'}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comp.metrics?.coherence || 'N/A'}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {comp.metrics?.accuracy !== undefined && comp.metrics?.accuracy !== 'N/A'
                                                ? parseFloat(comp.metrics.accuracy).toFixed(5)
                                                : 'N/A'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{comp.verdict}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comp.reasoning}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ✅ Sticky Close Button */}
                        <button
                            onClick={closeModal}
                            className="relative bottom-0 left-0 w-full bg-red-500 text-white py-2 mt-4 rounded-b-lg shadow-md hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Evaluating;
