import React from 'react';
import { useApp } from '../context/AppContext';
import { AppRoute } from '../types';

interface NavigationScreenProps {
  navigate: (route: AppRoute) => void;
}

const NavigationScreen: React.FC<NavigationScreenProps> = ({ navigate }) => {
  const { currentRide, updateRideStatus, completeRide } = useApp();

  if (!currentRide) {
    navigate(AppRoute.DASHBOARD);
    return null;
  }

  const { status, passengerName, passengerAvatar, pickup, dropoff } = currentRide;

  // Handler to progress through states
  const handleProgress = () => {
    switch (status) {
      case 'pickup':
        updateRideStatus('arrived_pickup');
        break;
      case 'arrived_pickup':
        updateRideStatus('in_progress');
        break;
      case 'in_progress':
        updateRideStatus('arrived_destination');
        break;
      case 'arrived_destination':
        completeRide();
        navigate(AppRoute.EARNINGS);
        break;
      default:
        break;
    }
  };

  // UI Components helpers
  const isRouting = status === 'pickup' || status === 'in_progress';
  const isArrived = status === 'arrived_pickup';
  const isFinished = status === 'arrived_destination';

  const instructionText = status === 'pickup' ? 'Turn left on Main St' : status === 'in_progress' ? 'Merge onto Highway 101' : 'You have arrived';
  const subText = status === 'pickup' ? 'in 200m' : status === 'in_progress' ? 'in 3.5km' : '';
  const actionText = 
    status === 'pickup' ? 'Arrived at Pickup' : 
    status === 'arrived_pickup' ? 'Start Trip' :
    status === 'in_progress' ? 'Arrived at Destination' : 
    'End Ride';
  
  const bgClass = isFinished ? "backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90" : "bg-white dark:bg-zinc-800";
  const primaryColor = isFinished ? "bg-[#FFC107] hover:bg-[#FFB300]" : "bg-[#FFC107] hover:bg-[#FFB300]";

  return (
    <div className="relative mx-auto flex h-screen w-full flex-col overflow-hidden font-display">
      
      {/* Top Bar - only show during routing */}
      {!isFinished && (
        <div className="absolute top-0 left-0 z-10 w-full bg-white/95 dark:bg-zinc-900/95 p-4 pt-4 shadow-md backdrop-blur-sm border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex shrink-0 items-center justify-center text-[#FFC107]">
              <span className="material-symbols-outlined text-4xl">turn_left</span>
            </div>
            <div className="flex-1 px-4">
              <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">{instructionText}</h2>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">{subText}</p>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white">
              <span className="material-symbols-outlined">volume_up</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Background */}
      <div className="absolute inset-0 h-full w-full bg-gray-200">
        <div 
            className="h-full w-full bg-cover bg-center" 
            style={{ 
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_mfuz7stJQ5BMtokEgkgnfHPJUAQXnQfaGEBXUVBTL0qzvUQrJpD9S4qrjomsWOQGkwV39zlf-7xkCLJ3hxeIf9bChmRFBJebEznwXVnDXHXqMk_2t2Gnkg0XgiiVEMnWpw_nLKRB_nkF_65krs0N_ZQIDAChjPaUYgpmXxEYjUJ1t4CfMPvWd0Yu4GGXr3UjWz_lY5q4M5rUJn0cpJpNqWAwYpzVWi6oiS1K3I-X9WuTP2O5SVANEaw8oYSVhaj1nsMSMUJNL30")' 
            }}
        ></div>
        
        {/* Route Line Placeholder (Overlay) */}
        {!isFinished && (
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-70">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 50 100 L 50 50 L 70 30" stroke="#FFC107" strokeWidth="2" fill="none" strokeDasharray="5,1" />
                </svg>
             </div>
        )}
      </div>

      {/* Approaching Badge */}
      {status === 'pickup' && (
        <div className="absolute bottom-[400px] z-20 w-full px-4 animate-bounce">
            <div className="flex items-center justify-center gap-2 rounded-full bg-[#FFC107] py-3 px-4 text-center shadow-lg mx-auto w-max">
            <span className="material-symbols-outlined text-gray-900">person_pin_circle</span>
            <p className="text-base font-bold text-gray-900">Approaching Pickup</p>
            </div>
        </div>
      )}

      {/* Bottom Sheet Control */}
      {isFinished ? (
        // Finished View
        <div className="absolute inset-0 z-20 flex flex-col justify-end bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center p-6 text-center flex-1">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#FFC107] mb-8 shadow-2xl animate-pulse">
                    <span className="material-symbols-outlined text-white text-[80px]">flag</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Arrived at Destination</h1>
                <p className="text-base font-normal text-gray-600 dark:text-gray-400 max-w-xs">
                    You have successfully reached the drop-off location for {passengerName}.
                </p>
            </div>
            <div className="p-4 pb-8 w-full max-w-md mx-auto">
                <button 
                    onClick={handleProgress}
                    className="w-full rounded-lg bg-[#FFC107] py-4 text-center text-lg font-bold text-gray-900 shadow-lg hover:bg-[#ffca2c] active:translate-y-0.5 transition-all"
                >
                    End Ride
                </button>
            </div>
        </div>
      ) : (
        // Standard Navigation Sheet
        <div className="absolute bottom-0 z-10 w-full">
            <div className="flex w-full flex-col gap-4 rounded-t-3xl bg-white dark:bg-zinc-900 p-5 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
                {/* Stats */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">ETA: 10:45 AM</p>
                        <p className="text-base font-medium text-gray-600 dark:text-gray-400">4 min left</p>
                    </div>
                    <div className="rounded-full bg-gray-200 dark:bg-white/10 h-2">
                        <div className="h-full rounded-full bg-[#FFC107]" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-sm font-normal text-gray-500">1.2 km remaining</p>
                </div>

                <hr className="border-t border-gray-100 dark:border-white/10" />

                {/* Passenger Info */}
                <div className="flex items-center gap-4">
                    <img className="h-14 w-14 rounded-full object-cover border border-gray-100" src={passengerAvatar} alt="Passenger" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{status.includes('pickup') ? 'Pickup' : 'Dropoff'} Passenger</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{passengerName}</h3>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[#FFC107] text-[16px]">star</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">4.9</span>
                        </div>
                    </div>
                    <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-md hover:bg-green-600">
                        <span className="material-symbols-outlined">call</span>
                    </button>
                    <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200">
                        <span className="material-symbols-outlined">chat</span>
                    </button>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
                    <span className="material-symbols-outlined mt-0.5 text-gray-500 dark:text-gray-400">location_on</span>
                    <p className="flex-1 text-base font-normal text-gray-900 dark:text-white leading-tight">
                        {status.includes('pickup') ? pickup : dropoff}
                    </p>
                </div>

                {/* Main Action */}
                <button 
                    onClick={handleProgress}
                    className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl py-4 text-center text-lg font-bold text-gray-900 shadow-md active:scale-[0.99] transition-all ${primaryColor}`}
                >
                    {actionText}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default NavigationScreen;
