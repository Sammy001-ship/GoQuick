import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ride, AppRoute } from '../types';

const mockBids: Ride[] = [
  {
    id: 'bid_1',
    passengerName: 'Bisi',
    passengerRating: 4.8,
    passengerAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUq-T8dROdcm9uNAbrFQHmpVk4TsQclTROGDMJVbKwb76-SHCRe_8Che70W4eo6YRzT3df1B6gk0iUV7UuRCpkycTTQTP4jpiCR9VM8KgfevShio267k14XPO8aupn0nXCZttXJn9ONVBeFAFjMUabK9yG2f_5Vgi0cKwaH4vBQ7VbvkpHbmvYU2AMwsDrle785lbCsPWNzjQwdg8vgNII84MISGWy4pVW2vp8W-w_nmOmAWKZ5YC30WrZ9HptKaa8YdgiauX10Ls",
    passengerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUq-T8dROdcm9uNAbrFQHmpVk4TsQclTROGDMJVbKwb76-SHCRe_8Che70W4eo6YRzT3df1B6gk0iUV7UuRCpkycTTQTP4jpiCR9VM8KgfevShio267k14XPO8aupn0nXCZttXJn9ONVBeFAFjMUabK9yG2f_5Vgi0cKwaH4vBQ7VbvkpHbmvYU2AMwsDrle785lbCsPWNzjQwdg8vgNII84MISGWy4pVW2vp8W-w_nmOmAWKZ5YC30WrZ9HptKaa8YdgiauX10Ls",
    pickup: '123 Allen Ave, Ikeja',
    pickupAddress: '123 Allen Ave, Ikeja',
    dropoff: '456 Adeola Odeku, VI',
    dropoffAddress: '456 Adeola Odeku, VI',
    distance: '8.4 km',
    duration: '25 min',
    price: 10125,
    status: 'pending'
  },
  {
    id: 'bid_2',
    passengerName: 'Olivia Chen',
    passengerRating: 4.9,
    passengerAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJv0P5-aC34OUuICySLzln6CkBHeK84nQ9tCmNOPgzvCJafjesMCEiUf7xZNq4xfasV8mTku71Jmj65MLYwUzrsbWzGRwvWNYZhNiu93eblWTJ4x1bwL_oxHNCJvnZLlZjuXfik_fN_rWF-HBge_Ck0KMZR8InHCgk2CFTQ4edASaBDYWM7qix8inc5G4XKGDxSWQRHLCJxIENldCV2DGKd1IkMUcubICslRW36k7Yq3095o2G_5aEmfm0dKJAbMXlzTw_O9DkrPg",
    passengerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJv0P5-aC34OUuICySLzln6CkBHeK84nQ9tCmNOPgzvCJafjesMCEiUf7xZNq4xfasV8mTku71Jmj65MLYwUzrsbWzGRwvWNYZhNiu93eblWTJ4x1bwL_oxHNCJvnZLlZjuXfik_fN_rWF-HBge_Ck0KMZR8InHCgk2CFTQ4edASaBDYWM7qix8inc5G4XKGDxSWQRHLCJxIENldCV2DGKd1IkMUcubICslRW36k7Yq3095o2G_5aEmfm0dKJAbMXlzTw_O9DkrPg",
    pickup: 'Murtala Muhammed Airport',
    pickupAddress: 'Murtala Muhammed Airport',
    dropoff: 'Eko Hotel',
    dropoffAddress: 'Eko Hotel',
    distance: '20.6 km',
    duration: '45 min',
    price: 20250,
    status: 'pending'
  }
];

const mockNotifications = [
  {
    id: 1,
    title: 'System Update',
    message: 'New navigation features are now available. Update your app to the latest version.',
    time: 'Now',
    isUnread: true,
    icon: 'system_update',
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'
  },
  {
    id: 2,
    title: 'Weekend Bonus',
    message: 'Complete 5 more rides to unlock your ₦5,000 bonus!',
    time: '2h ago',
    isUnread: true,
    icon: 'savings',
    color: 'text-green-500 bg-green-100 dark:bg-green-900/30'
  },
  {
    id: 3,
    title: 'Ride Cancelled',
    message: 'Passenger cancelled the request #R8921.',
    time: '5h ago',
    isUnread: false,
    icon: 'cancel_schedule_send',
    color: 'text-red-500 bg-red-100 dark:bg-red-900/30'
  }
];

interface DashboardProps {
  navigate: (route: AppRoute, data?: any) => void;
}

const DashboardScreen: React.FC<DashboardProps> = ({ navigate }) => {
  const { user, isOnline, toggleOnline, balance } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const toggleNotifications = () => {
    if (!showNotifications) {
      setUnreadCount(0);
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg font-sans pb-20 relative">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 bg-light-bg dark:bg-dark-bg sticky top-0 z-30 border-b border-white/5">
        <div className="flex size-12 shrink-0 items-center" onClick={() => navigate(AppRoute.PROFILE)}>
          <div 
            className="aspect-square size-10 rounded-full bg-cover bg-center cursor-pointer border-2 border-transparent hover:border-primary transition-all" 
            style={{ backgroundImage: `url("${user.avatar}")` }}
          />
        </div>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-zinc-900 dark:text-white">Goquick</h2>
        
        {/* Notification Section */}
        <div className="flex w-12 items-center justify-end relative">
          <button 
            onClick={toggleNotifications}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg text-zinc-900 dark:text-white relative hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-light-bg dark:border-dark-bg"></span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute top-14 right-0 w-[85vw] max-w-sm bg-white dark:bg-[#1D2A3A] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Notifications</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  </div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {mockNotifications.map(notification => (
                    <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group`}>
                      <div className="flex gap-4">
                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                          <span className="material-symbols-outlined text-xl">{notification.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-semibold ${notification.isUnread && unreadCount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full p-3 text-center text-primary text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-t border-gray-100 dark:border-white/5">
                  View All Notifications
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Online Status Toggle */}
      <div className="px-4 py-3">
        <div className={`flex items-center gap-4 rounded-xl p-4 min-h-14 justify-between border transition-colors ${isOnline ? 'bg-primary/10 border-primary/20' : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10'}`}>
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${isOnline ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-white/10 text-gray-500'}`}>
              <span className="material-symbols-outlined text-2xl">power_settings_new</span>
            </div>
            <p className="text-base font-medium leading-normal text-zinc-900 dark:text-white flex-1 truncate">
              {isOnline ? 'You are Online' : 'You are currently Offline'}
            </p>
          </div>
          <div className="shrink-0">
            <label className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 transition-colors ${isOnline ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
              <input 
                className="invisible absolute peer" 
                type="checkbox" 
                checked={isOnline}
                onChange={toggleOnline}
              />
              <div className={`h-[27px] w-[27px] rounded-full bg-white transition-transform shadow-sm ${isOnline ? 'translate-x-[20px]' : ''}`}></div>
            </label>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="flex px-4 py-3">
        <div 
          className="w-full bg-center bg-no-repeat aspect-[16/7] bg-cover rounded-xl object-cover shadow-inner" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCaKdodRIok_ukETXWLpYrD6XTDNBJPep6YmT-Mds72-DmG2n1FXM6kbV01tsKCeL1RnosM0G5vjBWAt19Kr-uOK8_VCxHtp8n2aUUwOyUsTdS3pW_EiARcmBSGTjGOjApHFtE_YOEL8lzIvlZiCyVmQld2Nel0sJnozKM-uHAEG0FeSO4Tnt7i8Zh-p7FQOMTFyZZEcp5-5H1rcDRvBLshAKGmj8l9DPKecl6EfNN6VI3wg_0V-_h398twC1ENoiiWBi4i1wG9GV4")' }}
        ></div>
      </div>

      {/* Stats */}
      <h2 className="text-zinc-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-3">Today's Earnings</h2>
      <div className="flex flex-wrap gap-4 px-4 pb-4">
        <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-base font-medium leading-normal text-zinc-500 dark:text-zinc-400">Total Earnings</p>
          <p className="tracking-light text-2xl font-bold leading-tight text-zinc-900 dark:text-white">₦{(balance - 150500).toLocaleString()}</p>
        </div>
        <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-base font-medium leading-normal text-zinc-500 dark:text-zinc-400">Trips</p>
          <p className="tracking-light text-2xl font-bold leading-tight text-zinc-900 dark:text-white">0</p>
        </div>
      </div>

      {/* Bids List */}
      <div className="flex items-center justify-between px-4 pb-3 pt-3">
        <h2 className="text-zinc-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">New Bids</h2>
        {isOnline && <button className="text-primary text-sm font-semibold">See All</button>}
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6">
        {!isOnline ? (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            Go online to see new requests
          </div>
        ) : (
          mockBids.map((bid) => (
            <div key={bid.id} className="flex flex-col gap-4 rounded-xl p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Pickup</p>
                  <p className="text-base font-semibold text-zinc-900 dark:text-white truncate max-w-[120px]">{bid.pickup}</p>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[60px]">
                  <div className="flex-1 border-t border-dashed border-zinc-400 dark:border-zinc-700"></div>
                  <span className="material-symbols-outlined text-lg text-zinc-400">arrow_forward</span>
                </div>
                <div className="flex flex-col text-right">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Dropoff</p>
                  <p className="text-base font-semibold text-zinc-900 dark:text-white truncate max-w-[120px]">{bid.dropoff}</p>
                </div>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">distance</span> {bid.distance}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">schedule</span> {bid.duration}</span>
                </div>
                <p className="text-2xl font-extrabold text-primary">₦{bid.price.toLocaleString()}</p>
              </div>
              <button 
                onClick={() => navigate(AppRoute.REQUEST, bid)}
                className="w-full rounded-lg bg-primary py-3.5 text-base font-bold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
              >
                Accept Bid
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;