import React, { useState, useEffect, useMemo } from 'react';
import { getStaff, updateStaffMember } from '../services/dbService';
import { generateStaffingRecommendations } from '../services/geminiService';
import type { StaffMember } from '../types';
import { predictionData } from '../data/mockData';
import { agents } from '../data/agents';
import { LoadingSpinner, EditIcon, SaveIcon, CancelIcon } from './icons/Icons';

const Staffing: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string>('');
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<StaffMember>>({});

  const agent = useMemo(() => agents.florence, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const staffData = await getStaff();
      setStaff(staffData);
      setLoading(false);
    };

    const fetchRecommendations = async () => {
      setLoadingRecs(true);
      // We need staff data to generate recommendations, so let's fetch it first.
      const staffData = await getStaff(); 
      const recs = await generateStaffingRecommendations(staffData, predictionData);
      setRecommendations(recs);
      setLoadingRecs(false);
    };

    fetchData();
    fetchRecommendations();
  }, []);
  
  const parseRecommendations = (text: string) => {
    if (!text) return [];
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            let cleanedLine = line;
            if (cleanedLine.startsWith('- ') || cleanedLine.startsWith('* ')) {
                cleanedLine = cleanedLine.substring(2);
            } else if (cleanedLine.startsWith('-') || cleanedLine.startsWith('*')) {
                cleanedLine = cleanedLine.substring(1);
            }
            return cleanedLine.replace(/\*\*/g, '').trim();
        })
        .filter(line => line.length > 0);
  };

  const handleEditClick = (member: StaffMember) => {
    setEditingRowId(member.id);
    setEditFormData({ status: member.status, shift: member.shift });
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditFormData({});
  };

  const handleSaveClick = async (member: StaffMember) => {
    if (!editingRowId) return;
    const updatedMember = { ...member, ...editFormData };
    await updateStaffMember(updatedMember);
    setStaff(staff.map(s => (s.id === updatedMember.id ? updatedMember : s)));
    setEditingRowId(null);
    setEditFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderStaffTable = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64"><LoadingSpinner className="h-8 w-8" /></div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Specialty</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Shift</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-4">{member.name}</td>
                <td className="p-4">{member.specialty}</td>
                {editingRowId === member.id ? (
                  <>
                    <td className="p-4">
                      <select name="status" value={editFormData.status} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded px-2 py-1">
                        <option>On Duty</option>
                        <option>On Call</option>
                        <option>Off</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <select name="shift" value={editFormData.shift} onChange={handleInputChange} className="bg-gray-700 border border-gray-600 rounded px-2 py-1">
                        <option>Morning</option>
                        <option>Evening</option>
                        <option>Night</option>
                      </select>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <button onClick={() => handleSaveClick(member)} className="text-green-400 hover:text-green-300"><SaveIcon className="h-5 w-5"/></button>
                      <button onClick={handleCancelClick} className="text-red-400 hover:text-red-300"><CancelIcon className="h-5 w-5"/></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        member.status === 'On Duty' ? 'bg-green-500/20 text-green-400' :
                        member.status === 'On Call' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4">{member.shift}</td>
                    <td className="p-4">
                      <button onClick={() => handleEditClick(member)} className="text-gray-400 hover:text-white">
                        <EditIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Staff Management</h1>
        <p className="text-gray-400 mt-1">Monitor, manage, and optimize your hospital staff.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Current Staff Roster</h2>
          {renderStaffTable()}
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
           <div className="flex items-center mb-4">
            <div className={`p-2 rounded-full bg-gradient-to-br ${agent.gradient}`}>
              <agent.Icon className="h-6 w-6 text-white" />
            </div>
            <h2 className={`ml-3 text-xl font-bold ${agent.color}`}>{agent.name}'s Recommendations</h2>
          </div>
          {loadingRecs ? (
            <div className="flex justify-center items-center h-40"><LoadingSpinner className="h-8 w-8 text-purple-400" /></div>
          ) : (
            <ul className="space-y-3 text-gray-300">
              {parseRecommendations(recommendations).map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-400 mr-2">◆</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staffing;