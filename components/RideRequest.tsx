import React, { useEffect, useState } from 'react';
import { Ride } from '../types';

interface RideRequestProps {
  ride: Ride;
  onAccept: () => void;
  onDecline: () => void;
}

const RideRequest: React.FC<RideRequestProps> = ({ ride, onAccept, onDecline }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const totalTime = 15;

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onDecline]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#f6f7f8] dark:bg-[#101922] rounded-t-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header & Timer */}
        <div className="p-4 pt-6">
          <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h1 className="text-center text-xl font-bold text-gray-900 dark:text-white">New Ride Request</h1>
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                <p className="text-sm font-bold text-gray-900 dark:text-white animate-pulse">{timeLeft}s</p>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div 
                  className="h-full bg-[#137fec] transition-all duration-1000 ease-linear rounded-full" 
                  style={{ width: `${(timeLeft / totalTime) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkZj0lVQykcWoF35bUUkXQswOJtmvds4ns5i58iEq4_08v8MYW8vpMSPY9frqhcerbTRq9eK5yDwKPjhsjvC_g88q7OxZLvnpFPtcQ5dVPeDjrv2J1MWPCni7glcDDPVt6ujseD1smEcCVzLk5tyX-AqKHJ8HSOkBGbajJpNdRwqmzKLeofVC5Q9RZD7j_8dZSZjWY2IwS3TNUn5C8gOvJOCxDm6WbHM-EHR64AXcKb4jDaIw0ybfJ-Se53l1HmpZPsMxrjJ3D_mI")' }}
          ></div>
        </div>

        {/* Details Card */}
        <div className="p-4 -mt-4 relative z-10">
          <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
              <img src={ride.passengerImage} alt={ride.passengerName} className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
              <div className="flex flex-col">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{ride.passengerName}</p>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base leading-none text-yellow-500 fill-current">star</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{ride.passengerRating}</p>
                </div>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₦{ride.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{ride.distance} • {ride.duration}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex flex-col items-center gap-1">
                   <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30"></div>
                   <div className="h-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">PICKUP</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{ride.pickupAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                 <div className="mt-1 flex flex-col items-center gap-1">
                   <span className="material-symbols-outlined text-red-500 text-xl leading-none">location_on</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">DROP-OFF</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{ride.dropoffAddress}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
             <button onClick={onDecline} className="flex h-14 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-lg font-bold hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors">
              Decline
            </button>
            <button onClick={onAccept} className="flex h-14 items-center justify-center rounded-xl bg-[#00B14F] text-white text-lg font-bold shadow-lg shadow-green-500/30 hover:bg-[#009944] transition-colors">
              Accept Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideRequest;
