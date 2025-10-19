
import React from 'react';
import { predictionData, resourceUtilization } from '../data/mockData';
import { StaffIcon } from './icons/Icons';

// Simple inline icons for dashboard specific items
const BedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M5 18h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
);

const VentilatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
);


const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Aura - Predictive Hospital Management</h1>
        <p className="text-gray-400 mt-1">Real-time overview of hospital operations and predicted patient load.</p>
      </div>

      {/* Resource Utilization Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResourceCard
          title="Staff Utilization"
          value={resourceUtilization.staff}
          Icon={StaffIcon}
          color="blue"
        />
        <ResourceCard
          title="Bed Occupancy"
          value={resourceUtilization.beds}
          Icon={BedIcon}
          color="purple"
        />
        <ResourceCard
          title="Ventilator Usage"
          value={resourceUtilization.ventilators}
          Icon={VentilatorIcon}
          color="teal"
        />
      </div>

      {/* 7-Day Forecast Section */}
      <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">7-Day Patient Surge Forecast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {predictionData.map((data) => (
            <ForecastCard key={data.day} day={data.day} surge={data.predictedSurge} />
          ))}
        </div>
      </div>
      
      {/* Quick Actions / Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Key Alert</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 rounded-lg flex items-start">
                <svg className="h-6 w-6 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                    <h3 className="font-semibold">Patient Surge Expected for Diwali</h3>
                    <p className="text-sm">Predicted 95% surge in 2 days. Review staffing and supply levels immediately.</p>
                </div>
            </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">System Status</h2>
            <ul className="space-y-3">
                <li className="flex items-center justify-between">
                    <span className="text-gray-300">AI Agents</span>
                    <span className="flex items-center text-green-400 font-semibold">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        Operational
                    </span>
                </li>
                 <li className="flex items-center justify-between">
                    <span className="text-gray-300">Database Sync</span>
                     <span className="flex items-center text-green-400 font-semibold">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        Real-time
                    </span>
                </li>
                 <li className="flex items-center justify-between">
                    <span className="text-gray-300">API Connectivity</span>
                     <span className="flex items-center text-green-400 font-semibold">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        Healthy
                    </span>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

interface ResourceCardProps {
  title: string;
  value: number;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: 'blue' | 'purple' | 'teal';
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, value, Icon, color }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', progress: 'bg-blue-500' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', progress: 'bg-purple-500' },
    teal: { bg: 'bg-teal-500/20', text: 'text-teal-400', progress: 'bg-teal-500' },
  };
  const classes = colorClasses[color];

  return (
    <div className={`bg-gray-800/50 p-6 rounded-lg shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-300">{title}</h3>
        <div className={`p-2 rounded-lg ${classes.bg}`}>
            <Icon className={`h-6 w-6 ${classes.text}`} />
        </div>
      </div>
      <div className="text-4xl font-bold text-white mb-2">{value}%</div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className={`${classes.progress} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
};

interface ForecastCardProps {
    day: string;
    surge: number;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ day, surge }) => {
    const isHighSurge = surge > 80;
    const isToday = day === 'Today';
    const isSpecialDay = day.includes('Diwali');

    return (
        <div className={`p-4 rounded-lg flex flex-col items-center justify-between transition-all duration-300 text-center ${isToday ? 'bg-purple-600 shadow-lg' : 'bg-gray-700/50 hover:bg-gray-700'}`}>
            <p className={`text-sm font-semibold h-10 flex items-center ${isToday ? 'text-white' : 'text-gray-400'}`}>{day}</p>
            <div className="my-3">
                <span className={`text-3xl font-bold ${isHighSurge || isSpecialDay ? 'text-red-400' : 'text-white'}`}>{surge}</span>
                <span className={`text-lg ${isHighSurge || isSpecialDay ? 'text-red-400' : 'text-gray-300'}`}>%</span>
            </div>
             <div className="w-full h-1.5 bg-gray-600 rounded-full">
                <div className={`h-1.5 rounded-full ${isHighSurge || isSpecialDay ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${surge}%`}}></div>
            </div>
        </div>
    );
};

export default Dashboard;
