import React, { useState, useEffect, useMemo } from 'react';
import { getSupplies, updateSupplyItem } from '../services/dbService';
import { generateSupplyRecommendations } from '../services/geminiService';
import type { SupplyItem } from '../types';
import { predictionData } from '../data/mockData';
import { agents } from '../data/agents';
import { LoadingSpinner, EditIcon, SaveIcon, CancelIcon } from './icons/Icons';

const SupplyProgressBar: React.FC<{ item: SupplyItem }> = ({ item }) => {
  const percentage = (item.stock / item.capacity) * 100;
  const isLowStock = item.stock <= item.lowStockThreshold;
  const barColor = isLowStock ? 'bg-red-500' : percentage < 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const Supplies: React.FC = () => {
  const [supplies, setSupplies] = useState<SupplyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string>('');
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  const agent = useMemo(() => agents.caduceus, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supplyData = await getSupplies();
      setSupplies(supplyData);
      setLoading(false);
    };

    const fetchRecommendations = async () => {
      setLoadingRecs(true);
      const supplyData = await getSupplies();
      const recs = await generateSupplyRecommendations(supplyData, predictionData);
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

  const handleEditClick = (item: SupplyItem) => {
    setEditingRowId(item.id);
    setEditStock(item.stock);
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditStock(0);
  };

  const handleSaveClick = async (item: SupplyItem) => {
    if (!editingRowId || editStock < 0 || editStock > item.capacity) return;
    const updatedItem = { ...item, stock: editStock };
    await updateSupplyItem(updatedItem);
    setSupplies(supplies.map(s => (s.id === updatedItem.id ? updatedItem : s)));
    setEditingRowId(null);
    setEditStock(0);
  };
  
  const renderSupplyTable = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64"><LoadingSpinner className="h-8 w-8" /></div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 font-semibold">Item</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Stock Level</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((item) => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.category}</td>
                {editingRowId === item.id ? (
                  <>
                    <td className="p-4" colSpan={2}>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(parseInt(e.target.value, 10) || 0)}
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-24"
                          min="0"
                          max={item.capacity}
                        />
                        <span className="ml-2 text-gray-400">/ {item.capacity}</span>
                      </div>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                       <button onClick={() => handleSaveClick(item)} className="text-green-400 hover:text-green-300"><SaveIcon className="h-5 w-5"/></button>
                       <button onClick={handleCancelClick} className="text-red-400 hover:text-red-300"><CancelIcon className="h-5 w-5"/></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 w-1/3">
                      <SupplyProgressBar item={item} />
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm">{item.stock} / {item.capacity}</span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleEditClick(item)} className="text-gray-400 hover:text-white">
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
        <h1 className="text-3xl font-bold text-white">Supply Chain Management</h1>
        <p className="text-gray-400 mt-1">Track inventory levels and get procurement recommendations.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Inventory Status</h2>
          {renderSupplyTable()}
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-full bg-gradient-to-br ${agent.gradient}`}>
              <agent.Icon className="h-6 w-6 text-white" />
            </div>
            <h2 className={`ml-3 text-xl font-bold ${agent.color}`}>{agent.name}'s Recommendations</h2>
          </div>
          {loadingRecs ? (
            <div className="flex justify-center items-center h-40"><LoadingSpinner className="h-8 w-8 text-orange-400"/></div>
          ) : (
            <ul className="space-y-3 text-gray-300">
              {parseRecommendations(recommendations).map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-400 mr-2">◆</span>
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

export default Supplies;