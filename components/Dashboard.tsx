import React, { useState } from 'react';
import { AppView, User } from '../types';

interface DashboardProps {
  user: User;
  isOnline: boolean;
  onToggleOnline: (status: boolean) => void;
  onNavigate: (view: AppView, data?: any) => void;
  dailyTripCount: number;
  balance: number;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'update' | 'info' | 'success' | 'warning';
  time: string;
  read: boolean;
  actionRoute?: AppView;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'System Update Available',
    message: 'Version 2.4.0 is ready. Includes new navigation features.',
    type: 'update',
    time: 'Now',
    read: false
  },
  {
    id: 2,
    title: 'Weekly Earnings Report',
    message: 'You earned ₦150,500 last week. Check your details.',
    type: 'success',
    time: '2h ago',
    read: false,
    actionRoute: AppView.EARNINGS
  },
  {
    id: 3,
    title: 'Document Expiry',
    message: 'Your vehicle insurance expires in 3 days. Please update it.',
    type: 'warning',
    time: '1d ago',
    read: true,
    actionRoute: AppView.PROFILE
  }
];

const mockBids = [
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
  }
];

const Dashboard: React.FC<DashboardProps> = ({ user, isOnline, onToggleOnline, onNavigate, dailyTripCount, balance }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    
    // Navigate if action exists
    if (notification.actionRoute) {
      onNavigate(notification.actionRoute);
      setShowNotifications(false);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'update': return 'system_update';
      case 'success': return 'attach_money';
      case 'warning': return 'warning';
      case 'info': default: return 'notifications';
    }
  };

  const getIconStyles = (type: Notification['type']) => {
    switch (type) {
      case 'update': return 'text-[#137fec] bg-blue-100 dark:bg-blue-900/30';
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'warning': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default: return 'text-slate-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-[#f6f7f8] dark:bg-[#101922]">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 bg-[#f6f7f8] dark:bg-[#101922] sticky top-0 z-30 border-b border-white/5 shadow-sm">
        <button onClick={() => onNavigate(AppView.PROFILE)} className="flex size-12 shrink-0 items-center justify-center">
          <div 
            className="aspect-square size-10 rounded-full bg-cover bg-center border-2 border-transparent hover:border-primary-blue transition-all"
            style={{ backgroundImage: `url("${user.avatar}")` }}
          ></div>
        </button>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-zinc-900 dark:text-white">
          Goquick
        </h2>
        <div className="flex w-12 items-center justify-end relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 size-2.5 bg-red-500 rounded-full border-2 border-[#f6f7f8] dark:border-[#101922] animate-pulse"></span>
            )}
          </button>

          {/* Notification Dropdown Backdrop */}
          {showNotifications && (
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setShowNotifications(false)}
            />
          )}

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute top-14 right-0 w-80 z-50 bg-white dark:bg-[#1F2937] rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-[#137fec] font-semibold hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No new notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0 relative cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${getIconStyles(notification.type)}`}>
                          <span className="material-symbols-outlined text-xl">{getIcon(notification.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm font-semibold truncate pr-2 ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{notification.time}</span>
                          </div>
                          <p className={`text-xs mt-0.5 line-clamp-2 ${!notification.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                            {notification.message}
                          </p>
                          {notification.type === 'update' && (
                            <button className="mt-2 text-[10px] font-bold bg-[#137fec] text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">
                              Update Now
                            </button>
                          )}
                        </div>
                        {!notification.read && <div className="size-2 bg-[#137fec] rounded-full absolute top-4 right-4 shadow-sm"></div>}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-white/5">
                <button className="w-full py-2 text-xs font-semibold text-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
                  View Notification History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {/* Status Toggle */}
        <div className="px-4 py-3 sticky top-0 z-10">
          <div className={`flex items-center gap-4 rounded-xl p-4 min-h-14 justify-between border transition-colors duration-300 ${
            isOnline 
              ? 'bg-green-100 dark:bg-green-900/20 border-green-500/20' 
              : 'bg-blue-100 dark:bg-[#137fec]/20 border-[#137fec]/20'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${
                isOnline ? 'bg-green-200 dark:bg-green-500/30 text-green-700 dark:text-green-400' : 'bg-[#137fec]/20 dark:bg-[#137fec]/30 text-[#137fec]'
              }`}>
                <span className="material-symbols-outlined text-2xl">power_settings_new</span>
              </div>
              <p className="text-base font-medium leading-normal text-zinc-900 dark:text-white flex-1 truncate">
                {isOnline ? 'You are currently Online' : 'You are currently Offline'}
              </p>
            </div>
            <div className="shrink-0">
              <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-zinc-300 dark:bg-zinc-700 p-0.5 transition-colors">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={isOnline}
                  onChange={(e) => onToggleOnline(e.target.checked)}
                />
                <div className={`h-[27px] w-[27px] rounded-full bg-white shadow-sm transition-all duration-300 ${isOnline ? 'translate-x-[20px] bg-green-500' : 'translate-x-0'}`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="flex px-4 py-3">
          <div 
            className="w-full bg-center bg-no-repeat aspect-[16/7] bg-cover rounded-xl object-cover shadow-inner relative"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCaKdodRIok_ukETXWLpYrD6XTDNBJPep6YmT-Mds72-DmG2n1FXM6kbV01tsKCeL1RnosM0G5vjBWAt19Kr-uOK8_VCxHtp8n2aUUwOyUsTdS3pW_EiARcmBSGTjGOjApHFtE_YOEL8lzIvlZiCyVmQld2Nel0sJnozKM-uHAEG0FeSO4Tnt7i8Zh-p7FQOMTFyZZEcp5-5H1rcDRvBLshAKGmj8l9DPKecl6EfNN6VI3wg_0V-_h398twC1ENoiiWBi4i1wG9GV4")' }}
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
          </div>
        </div>

        {/* Earnings Stats */}
        <div className="flex items-center justify-between px-4 pb-3 pt-3">
            <h2 className="text-zinc-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Today's Earnings</h2>
            <button onClick={() => onNavigate(AppView.EARNINGS)} className="text-[#137fec] text-sm font-semibold hover:underline">View All</button>
        </div>
        
        <div className="flex flex-wrap gap-4 px-4 pb-4">
          <div onClick={() => onNavigate(AppView.EARNINGS)} className="cursor-pointer flex min-w-[150px] flex-1 flex-col gap-2 rounded-xl p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <p className="text-base font-medium leading-normal text-zinc-500 dark:text-zinc-400">Total Earnings</p>
            <p className="tracking-light text-2xl font-bold leading-tight text-zinc-900 dark:text-white">₦{balance.toLocaleString()}</p>
          </div>
          <div className="flex min-w-[100px] flex-1 flex-col gap-2 rounded-xl p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
            <p className="text-base font-medium leading-normal text-zinc-500 dark:text-zinc-400">Trips</p>
            <p className="tracking-light text-2xl font-bold leading-tight text-zinc-900 dark:text-white">{dailyTripCount}</p>
          </div>
        </div>

        {/* Bids List */}
        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          <h2 className="text-zinc-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">New Bids</h2>
          <button className="text-[#137fec] text-sm font-semibold">See All</button>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-6">
          {!isOnline ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
              Go online to see new requests
            </div>
          ) : (
            mockBids.map((bid) => (
              <div 
                key={bid.id} 
                onClick={() => onNavigate(AppView.RIDE_REQUEST, bid)}
                className="flex flex-col gap-4 rounded-xl p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:border-[#137fec] transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Pickup</p>
                    <p className="text-base font-semibold text-zinc-900 dark:text-white truncate max-w-[120px]">{bid.pickup}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-1 min-w-[50px]">
                    <div className="w-full border-t border-dashed border-zinc-400 dark:border-zinc-700"></div>
                    <span className="material-symbols-outlined text-lg text-zinc-500 dark:text-zinc-400 group-hover:text-[#137fec] transition-colors">arrow_forward</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Dropoff</p>
                    <p className="text-base font-semibold text-zinc-900 dark:text-white truncate max-w-[120px]">{bid.dropoff}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4 border-t border-gray-100 dark:border-white/5 pt-4">
                  <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">distance</span> {bid.distance}</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">schedule</span> {bid.duration}</span>
                  </div>
                  <p className="text-2xl font-extrabold text-[#137fec]">₦{bid.price.toLocaleString()}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(AppView.RIDE_REQUEST, bid);
                  }}
                  className="w-full rounded-lg bg-[#137fec] py-3 text-sm font-bold text-white hover:bg-blue-600 transition-colors shadow-md mt-1"
                >
                  Accept Bid
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;