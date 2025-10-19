import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { generatePatientAdvisory } from '../services/geminiService';
import { getAdvisoryHistory, addAdvisoryRecord } from '../services/dbService';
import { agents } from '../data/agents';
import { LoadingSpinner, UserIcon } from './icons/Icons';
import type { AdvisoryRecord } from '../types';


const advisoryTopics = [
  'Monsoon Health Precautions',
  'Diwali Safety (Burns & Air Quality)',
  'Managing Heat Waves',
  'COVID-19 Booster Shots',
];

const Advisories: React.FC = () => {
  const [customTopic, setCustomTopic] = useState('');
  const [history, setHistory] = useState<AdvisoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agent = useMemo(() => agents.charaka, []);

  useEffect(() => {
    const loadHistory = async () => {
        const pastAdvisories = await getAdvisoryHistory();
        setHistory(pastAdvisories);
    };
    loadHistory();
  }, []);


  const fetchAdvisory = useCallback(async (topic: string) => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generatePatientAdvisory(topic);
      const newRecord: AdvisoryRecord = {
        id: new Date().toISOString(),
        topic,
        advisory: result,
        timestamp: new Date().toISOString(),
      };
      await addAdvisoryRecord(newRecord);
      setHistory(prev => [newRecord, ...prev]);
    } catch (err) {
      setError('Failed to generate advisory. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setCustomTopic('');
    }
  }, []);
  
  const handleGenerateClick = () => {
    fetchAdvisory(customTopic);
  };
  
  const renderAdvisoryContent = (advisoryText: string) => {
      return (
        <div className="prose prose-invert prose-p:text-gray-300 prose-ul:list-disc prose-li:text-gray-300">
            {advisoryText.split('\n').map((line, index) => {
                const trimmedLine = line.trim();
                 if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
                    return <li key={index} className="ml-4">{trimmedLine.substring(1).trim()}</li>;
                }
                if(trimmedLine.length > 0) {
                    return <p key={index}>{line}</p>;
                }
                return null;
            })}
        </div>
      );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Public Health Advisories</h1>
        <p className="text-gray-400 mt-1">Generate and review patient advisories with AI agent Charaka.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4">Generate New Advisory</h2>
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-400">Quick-start topics:</p>
            {advisoryTopics.map(topic => (
              <button
                key={topic}
                onClick={() => fetchAdvisory(topic)}
                disabled={loading}
                className="w-full text-left p-3 rounded-lg transition-colors duration-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                {topic}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-4 mt-auto">
            <p className="text-sm text-gray-400 mb-2">Or enter a custom topic:</p>
            <textarea
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., 'Preventing Dengue Fever'"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-500"
                rows={2}
                disabled={loading}
            />
            <button
                onClick={handleGenerateClick}
                disabled={loading || !customTopic}
                className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? <LoadingSpinner className="h-5 w-5" /> : 'Generate Advisory'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-full bg-gradient-to-br ${agent.gradient}`}>
              <agent.Icon className="h-6 w-6 text-white" />
            </div>
            <h2 className={`ml-3 text-xl font-bold ${agent.color}`}>Advisory History with {agent.name}</h2>
          </div>
          <div className="h-[60vh] overflow-y-auto pr-2 space-y-6">
             {error && <p className="text-red-400 text-center p-4">{error}</p>}
            {history.length === 0 && !loading && (
                 <p className="text-gray-400 text-center pt-10">Your conversation history with Charaka will appear here.</p>
            )}
            {history.map((record) => (
                <div key={record.id}>
                    {/* User's Prompt */}
                    <div className="flex items-start justify-end">
                        <div className="bg-blue-600/50 rounded-lg p-3 max-w-lg">
                           <p className="text-white font-semibold">{record.topic}</p>
                        </div>
                         <div className="ml-3 flex-shrink-0 bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-300" />
                        </div>
                    </div>
                    {/* AI's Response */}
                     <div className="flex items-start mt-4">
                        <div className={`mr-3 flex-shrink-0 rounded-full h-10 w-10 flex items-center justify-center bg-gradient-to-br ${agent.gradient}`}>
                            <agent.Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="bg-gray-700/60 rounded-lg p-3 max-w-lg">
                           {renderAdvisoryContent(record.advisory)}
                        </div>
                    </div>
                </div>
            ))}
             {loading && <div className="flex justify-center p-4"><LoadingSpinner className="h-8 w-8 text-green-400" /></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advisories;