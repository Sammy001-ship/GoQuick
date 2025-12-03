import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Ride, AppRoute } from '../types';

interface RideRequestProps {
  ride: Ride;
  navigate: (route: AppRoute) => void;
}

const RideRequestScreen: React.FC<RideRequestProps> = ({ ride, navigate }) => {
  const { acceptRide } = useApp();
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(AppRoute.DASHBOARD);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleAccept = () => {
    acceptRide(ride);
    navigate(AppRoute.NAVIGATION);
  };

  const handleDecline = () => {
    navigate(AppRoute.DASHBOARD);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-zinc-900 text-white font-display overflow-hidden">
        {/* Overlay Background */}
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkZj0lVQykcWoF35bUUkXQswOJtmvds4ns5i58iEq4_08v8MYW8vpMSPY9frqhcerbTRq9eK5yDwKPjhsjvC_g88q7OxZLvnpFPtcQ5dVPeDjrv2J1MWPCni7glcDDPVt6ujseD1smEcCVzLk5tyX-AqKHJ8HSOkBGbajJpNdRwqmzKLeofVC5Q9RZD7j_8dZSZjWY2IwS3TNUn5C8gOvJOCxDm6WbHM-EHR64AXcKb4jDaIw0ybfJ-Se53l1HmpZPsMxrjJ3D_mI")' }}></div>

        <main className="relative z-10 flex h-full min-h-screen w-full max-w-md flex-col justify-end p-4 pb-8 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="flex flex-col gap-4 animate-slide-up">
            {/* Header Card */}
            <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 p-4 pb-3 shadow-lg">
              <h1 className="text-center text-xl font-bold leading-tight text-gray-900 dark:text-white">New Ride Request</h1>
              <div className="flex flex-col gap-2">
                <div className="flex justify-end">
                  <p className={`text-sm font-semibold ${timeLeft < 5 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{timeLeft}s</p>
                </div>
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear" 
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="w-full overflow-hidden rounded-xl shadow-lg border-2 border-white/10">
              <div 
                className="aspect-video w-full bg-cover bg-center bg-no-repeat" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkZj0lVQykcWoF35bUUkXQswOJtmvds4ns5i58iEq4_08v8MYW8vpMSPY9frqhcerbTRq9eK5yDwKPjhsjvC_g88q7OxZLvnpFPtcQ5dVPeDjrv2J1MWPCni7glcDDPVt6ujseD1smEcCVzLk5tyX-AqKHJ8HSOkBGbajJpNdRwqmzKLeofVC5Q9RZD7j_8dZSZjWY2IwS3TNUn5C8gOvJOCxDm6WbHM-EHR64AXcKb4jDaIw0ybfJ-Se53l1HmpZPsMxrjJ3D_mI")' }}
              ></div>
            </div>

            {/* Info Card */}
            <div className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-gray-800 p-5 shadow-xl">
              <div className="flex w-full grow flex-col items-stretch justify-center gap-4">
                <div className="flex items-center gap-3">
                  <img alt="Passenger" className="h-14 w-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" src={ride.passengerAvatar} />
                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{ride.passengerName}</p>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base leading-none text-yellow-500">star</span>
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{ride.passengerRating}</p>
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">₦{ride.price.toLocaleString()}</p>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{ride.distance} • {ride.duration}</p>
                  </div>
                </div>
                <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-lg text-primary">my_location</span>
                    <div className="flex flex-col">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">PICKUP</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{ride.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-lg text-red-500">location_on</span>
                    <div className="flex flex-col">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">DROP-OFF</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{ride.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex w-full flex-col items-stretch gap-3 mt-2">
              <button 
                onClick={handleAccept}
                className="flex h-14 cursor-pointer items-center justify-center rounded-xl bg-[#00B14F] px-5 text-lg font-bold text-white shadow-md active:scale-[0.98] transition-transform"
              >
                Accept Ride
              </button>
              <button 
                onClick={handleDecline}
                className="flex h-14 cursor-pointer items-center justify-center rounded-xl bg-[#E53935] px-5 text-lg font-bold text-white shadow-md active:scale-[0.98] transition-transform"
              >
                Decline
              </button>
            </div>
          </div>
        </main>
    </div>
  );
};

export default RideRequestScreen;
