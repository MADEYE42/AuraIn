import React from 'react';
import type { ViewType } from '../App';
import { DashboardIcon, StaffIcon, SupplyIcon, AdvisoryIcon, SettingsIcon } from './icons/Icons';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'staffing', label: 'Staffing', icon: StaffIcon },
    { id: 'supplies', label: 'Supplies', icon: SupplyIcon },
    { id: 'advisories', label: 'Advisories', icon: AdvisoryIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="hidden lg:block w-64 bg-gray-800 border-r border-gray-700 p-6 flex-shrink-0">
      <div className="flex items-center mb-10">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-xl font-bold ml-3">Aura Hospital OS</h1>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.id} className="mb-2">
                <button
                  onClick={() => setCurrentView(item.id as ViewType)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white font-semibold shadow-lg'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-6 w-6 mr-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
