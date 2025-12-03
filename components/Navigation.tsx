import React, { useState, useEffect } from 'react';
import { Ride } from '../types';

interface NavigationProps {
  ride: Ride;
  phase: 'pickup' | 'dropoff';
  onPrimaryAction: () => void;
  onChat: () => void;
  onCall: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ ride, phase, onPrimaryAction, onChat, onCall }) => {
  const isPickup = phase === 'pickup';
  const targetAddress = isPickup ? ride.pickupAddress : ride.dropoffAddress;
  const actionText = isPickup ? 'Arrived at Pickup Location' : 'Arrived at Destination';
  const statusText = isPickup ? 'Approaching Passenger Pickup' : 'Approaching Drop-off';
  const instruction = isPickup ? 'Turn left on Main St' : 'Exit right to Ozumba Mbadiwe';

  // --- Real-time Simulation Logic ---
  
  // Parse initial values (fallback to defaults if parsing fails)
  const initialMinutes = parseInt(ride.duration) || 15; 
  const initialDistVal = parseFloat(ride.distance) || 5.0;
  const distUnit = ride.distance.includes('km') ? 'km' : 'mi';

  // State for real-time updates
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(initialMinutes * 60);
  const [distanceLeft, setDistanceLeft] = useState(initialDistVal);
  const [progress, setProgress] = useState(0);

  // Reset simulation when phase changes
  useEffect(() => {
    setTimeLeftSeconds(initialMinutes * 60);
    setDistanceLeft(initialDistVal);
    setProgress(0);
  }, [phase, initialMinutes, initialDistVal]);

  // Timer Effect
  useEffect(() => {
    if (timeLeftSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });

      // Linearly decrease distance and increase progress based on time
      setDistanceLeft((prev) => {
        const decrement = initialDistVal / (initialMinutes * 60);
        return Math.max(0, prev - decrement);
      });

      setProgress((prev) => {
        const increment = 100 / (initialMinutes * 60);
        return Math.min(100, prev + increment);
      });

    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [initialDistVal, initialMinutes, timeLeftSeconds]);

  // Derived Display Values
  const etaDate = new Date();
  etaDate.setSeconds(etaDate.getSeconds() + timeLeftSeconds);
  const formattedEta = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const minutesDisplay = Math.ceil(timeLeftSeconds / 60);
  const distanceDisplay = distanceLeft.toFixed(1);
  const isApproaching = timeLeftSeconds < 120; // Show approaching badge if < 2 mins away

  return (
    <div className="relative flex h-full w-full flex-col bg-[#f6f7f8] dark:bg-[#101922]">
      {/* Top Bar (Navigation Instructions) */}
      <div className="absolute top-0 left-0 z-10 w-full bg-white/95 dark:bg-[#1C1C1E]/95 p-4 pt-4 shadow-md backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex shrink-0 items-center justify-center text-[#FFC107]">
            <span className="material-symbols-outlined text-4xl">turn_left</span>
          </div>
          <div className="flex-1 px-4">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">{instruction}</h2>
            <p className="text-base font-normal leading-normal text-slate-500 dark:text-slate-400">in {Math.max(100, Math.floor(distanceLeft * 1000))}m</p>
          </div>
          <div className="flex items-center justify-end">
             <button className="flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined">volume_up</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="absolute inset-0 h-full w-full bg-gray-200 overflow-hidden">
        <div 
          className="h-full w-full bg-cover bg-center transition-transform duration-[2000ms] ease-linear scale-110"
          style={{ 
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_mfuz7stJQ5BMtokEgkgnfHPJUAQXnQfaGEBXUVBTL0qzvUQrJpD9S4qrjomsWOQGkwV39zlf-7xkCLJ3hxeIf9bChmRFBJebEznwXVnDXHXqMk_2t2Gnkg0XgiiVEMnWpw_nLKRB_nkF_65krs0N_ZQIDAChjPaUYgpmXxEYjUJ1t4CfMPvWd0Yu4GGXr3UjWz_lY5q4M5rUJn0cpJpNqWAwYpzVWi6oiS1K3I-X9WuTP2O5SVANEaw8oYSVhaj1nsMSMUJNL30")',
            backgroundPosition: `center ${50 + (progress / 5)}%` // Subtle map movement effect
          }}
        >
          {/* Map Controls */}
          <div className="absolute right-4 top-32 flex flex-col gap-3 z-20">
             <button className="flex size-12 items-center justify-center rounded-full bg-white dark:bg-[#1C1C1E] shadow-lg text-slate-900 dark:text-white">
               <span className="material-symbols-outlined">my_location</span>
             </button>
             <button className="flex size-12 items-center justify-center rounded-full bg-white dark:bg-[#1C1C1E] shadow-lg text-slate-900 dark:text-white">
               <span className="material-symbols-outlined">layers</span>
             </button>
          </div>

          {/* Passenger/Destination Location Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
            {/* Pulsating Effect */}
            <div className="relative flex items-center justify-center">
                <div className="size-20 rounded-full bg-[#137fec]/20 animate-ping absolute inset-0"></div>
                <div className="size-20 rounded-full bg-[#137fec]/10 absolute inset-0"></div>
                <div className="size-10 bg-[#137fec] border-[3px] border-white dark:border-[#1C1C1E] rounded-full shadow-xl flex items-center justify-center relative z-10">
                    <span className="material-symbols-outlined text-white text-lg">
                        {isPickup ? 'person' : 'flag'}
                    </span>
                </div>
            </div>
            
            {/* Label */}
            <div className="bg-white dark:bg-[#1C1C1E] px-3 py-1.5 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {isPickup ? ride.passengerName : 'Destination'}
                </p>
                <p className="text-[10px] text-slate-500 text-center font-medium">
                    {isPickup ? 'Passenger Location' : 'Drop-off Point'}
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Status Pill - Only visible when approaching */}
      <div className={`absolute bottom-[360px] left-0 right-0 z-10 flex justify-center pointer-events-none transition-opacity duration-500 ${isApproaching ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 rounded-full bg-[#FFC107] py-2 px-5 shadow-lg animate-bounce pointer-events-auto">
          <span className="material-symbols-outlined text-slate-900">person_pin_circle</span>
          <p className="text-sm font-bold text-slate-900">{statusText}</p>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 z-20 w-full rounded-t-2xl bg-white dark:bg-[#1C1C1E] p-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col gap-4">
          
          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-bold text-slate-900 dark:text-white">ETA: {formattedEta}</p>
              <p className={`text-base font-medium ${minutesDisplay <= 2 ? 'text-red-500 animate-pulse' : 'text-green-600 dark:text-green-400'}`}>
                {minutesDisplay} min left
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-[#FFC107] transition-all duration-1000 ease-linear" 
                style={{ width: `${Math.min(100, progress)}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {distanceDisplay} {distUnit} remaining
            </p>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* Passenger Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={ride.passengerImage} 
                alt={ride.passengerName} 
                className="h-14 w-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" 
              />
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1C1C1E] rounded-full p-0.5">
                 <div className="bg-green-500 size-3 rounded-full border-2 border-white dark:border-[#1C1C1E]"></div>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                {isPickup ? 'Pickup Passenger' : 'Drop-off Passenger'}
              </p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{ride.passengerName}</h3>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#FFC107] text-sm">star</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{ride.passengerRating}</span>
              </div>
            </div>
            
            <button 
              onClick={onCall}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white hover:bg-green-100 hover:text-green-600 transition-colors"
            >
              <span className="material-symbols-outlined">phone</span>
            </button>
             <button 
              onClick={onChat}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white hover:bg-blue-100 hover:text-blue-600 transition-colors"
            >
              <span className="material-symbols-outlined">chat</span>
            </button>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            <span className="material-symbols-outlined mt-0.5 text-[#FFC107]">location_on</span>
            <p className="flex-1 text-sm font-medium text-slate-900 dark:text-white leading-tight">{targetAddress}</p>
          </div>

          {/* Action Button */}
          <button 
            onClick={onPrimaryAction}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#FFC107] py-4 shadow-md transition-transform active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative text-lg font-bold text-slate-900 uppercase tracking-wide">{actionText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;