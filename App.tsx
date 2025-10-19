import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Staffing from './components/Staffing';
import Supplies from './components/Supplies';
import Advisories from './components/Advisories';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';
import { initializeDB } from './services/dbService';

export type ViewType = 'dashboard' | 'staffing' | 'supplies' | 'advisories' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  useEffect(() => {
    // Initialize the local storage database on app load
    initializeDB();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'staffing':
        return <Staffing />;
      case 'supplies':
        return <Supplies />;
      case 'advisories':
        return <Advisories />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto pb-24 lg:pb-6">
        {renderView()}
      </main>
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default App;