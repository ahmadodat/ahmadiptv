import React from 'react';
import Icon from './Icon';
import { IconName } from '../types';
import Header from './Header';

interface DashboardProps {
  onNavigate: (view: 'player') => void;
}

const DashboardCard: React.FC<{ title: string; iconName: IconName; onClick?: () => void; disabled?: boolean }> = ({ title, iconName, onClick, disabled }) => (
  <div
    onClick={!disabled ? onClick : undefined}
    className={`group aspect-video md:aspect-square bg-[#1E1E1E] rounded-xl flex flex-col items-center justify-center text-center p-6 transform transition-all duration-300 ease-in-out border border-gray-800/50 ${
      disabled
        ? 'opacity-40 cursor-not-allowed'
        : 'hover:scale-105 hover:shadow-2xl hover:border-[#8A1538] hover:shadow-red-800/10 cursor-pointer'
    }`}
    role={disabled ? undefined : 'button'}
    aria-disabled={disabled}
    tabIndex={disabled ? -1 : 0}
  >
    <div className={`w-20 h-20 md:w-24 md:h-24 mb-4 text-gray-400 transition-colors duration-300 ${!disabled ? 'group-hover:text-amber-400' : ''}`}>
      <Icon name={iconName} className="w-full h-full"/>
    </div>
    <h2 className={`text-2xl md:text-3xl font-bold text-gray-300 transition-colors duration-300 ${!disabled ? 'group-hover:text-white' : ''}`}>
      {title}
    </h2>
    {disabled && <p className="text-xs text-gray-500 mt-1">(Coming Soon)</p>}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="h-screen w-screen bg-[#121212] text-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto w-full">
          <DashboardCard title="Live TV" iconName="tv" onClick={() => onNavigate('player')} />
          <DashboardCard title="Movies" iconName="movies" disabled />
          <DashboardCard title="Series" iconName="entertainment" disabled />
          <DashboardCard title="Settings" iconName="settings" disabled />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;