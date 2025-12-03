import React from 'react';
import { AppRoute } from '../types';

interface BottomNavProps {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentRoute, navigate }) => {
  // Only show nav on main screens, hide during active rides
  if (currentRoute === AppRoute.NAVIGATION || currentRoute === AppRoute.REQUEST) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-white/10 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        <button 
          onClick={() => navigate(AppRoute.DASHBOARD)}
          className={`flex flex-col items-center gap-1 ${currentRoute === AppRoute.DASHBOARD ? 'text-primary' : 'text-gray-400'}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-xs font-medium">Home</span>
        </button>
        <button 
          onClick={() => navigate(AppRoute.EARNINGS)}
          className={`flex flex-col items-center gap-1 ${currentRoute === AppRoute.EARNINGS ? 'text-primary-green' : 'text-gray-400'}`}
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="text-xs font-medium">Earnings</span>
        </button>
        <button 
          onClick={() => navigate(AppRoute.PROFILE)}
          className={`flex flex-col items-center gap-1 ${currentRoute === AppRoute.PROFILE ? 'text-primary' : 'text-gray-400'}`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
