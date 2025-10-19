import React from 'react';
import type { ViewType } from '../App';
import { DashboardIcon, StaffIcon, SupplyIcon, AdvisoryIcon, SettingsIcon } from './icons/Icons';

interface BottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'staffing', label: 'Staffing', icon: StaffIcon },
    { id: 'supplies', label: 'Supplies', icon: SupplyIcon },
    { id: 'advisories', label: 'Advisories', icon: AdvisoryIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around py-2 z-50">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as ViewType)}
            className={`flex flex-col items-center justify-center w-1/5 h-16 rounded-lg transition-colors duration-200 ${
              isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className={`text-xs text-center ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;