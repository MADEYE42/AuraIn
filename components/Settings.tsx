import React, { useState } from 'react';
import { initializeDB } from '../services/dbService';

const Settings: React.FC = () => {
    const [resetting, setResetting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleResetData = () => {
        if (window.confirm("Are you sure you want to reset all local data? This will restore the staff and supply lists to their initial state.")) {
            setResetting(true);
            localStorage.removeItem('aura_hospital_db');
            initializeDB();
            setTimeout(() => {
                setResetting(false);
                setResetSuccess(true);
                setTimeout(() => setResetSuccess(false), 3000);
            }, 1000);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage application settings and data.</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Data Management</h2>
                <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-300 mb-4">
                        This application uses your browser's local storage to save changes to staff and supply lists. 
                        Resetting the data will clear all your changes and restore the application to its original demo state.
                    </p>
                    <button
                        onClick={handleResetData}
                        disabled={resetting || resetSuccess}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {resetting ? 'Resetting...' : resetSuccess ? 'Data Reset Successfully!' : 'Reset Local Data'}
                    </button>
                </div>
            </div>
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl">
                <h2 className="text-xl font-bold mb-4">About</h2>
                 <div className="border-t border-gray-700 pt-4 text-gray-300 space-y-2">
                   <p><strong>Aura Hospital OS</strong> is a conceptual dashboard demonstrating the integration of generative AI to assist hospital administrators.</p>
                   <p>AI Agents are powered by Google's Gemini API.</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
