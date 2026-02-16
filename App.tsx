import React, { useState, useEffect } from 'react';
import { AppView, Ride, Transaction, WithdrawalRequest, User } from './types';
import Dashboard from './components/Dashboard';
import RideRequest from './components/RideRequest';
import Navigation from './components/Navigation';
import Earnings from './components/Earnings';
import Profile from './components/Profile';
import RideComplete from './components/RideComplete';
import AdminDashboard from './components/AdminDashboard';
import ChatScreen from './components/ChatScreen';
import { api } from './lib/api';

const DEFAULT_USER: User = {
  name: 'Jameson Miller',
  rating: 4.9,
  rides: 1284,
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBVfdc_sc4MKXkjo7cHh94BpLSTZ5RbhQ7TWffR-pZWEUPwqoE9uMyeSruY9oLPQTZMPuI4EUsV6EcA0QjznWPSFIEj2athrPTsZNrWFbEsImroQuL54Uhe0Vdd8y6V9Vn9c32qOfysU7ZptzS63xzsZLKeMEd-Qm7dvr7Ct0qqGPYQUZnpDDKdEBWxHnxNFBulNMiJpJJPVaRgrAd5L4mFKheReS2c_r0q4S_Lgshjf_Pmo-rWL_N-2YUz0gcC9sQOZbIds-s6cLc',
  phone: '(123) 456-7890',
  email: 'j.miller@email.com',
  vehicle: {
    model: 'Toyota Camry',
    color: 'Midnight Black',
    plate: 'GQK-1234',
  },
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: 'Earning',
    title: 'Trip to VI',
    description: 'Lekki Phase 1 to Victoria Island',
    amount: 2500,
    date: 'Today',
    status: 'Completed',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 't2',
    type: 'Earning',
    title: 'Trip to Ikoyi',
    description: 'Ikeja GRA to Dolphin Estate',
    amount: 1800,
    date: 'Today',
    status: 'Completed',
    timestamp: Date.now() - 7200000,
  },
  {
    id: 't3',
    type: 'Earning',
    title: 'Trip to Airport',
    description: 'Surulere to MM2 Airport',
    amount: 3200,
    date: 'Yesterday',
    status: 'Completed',
    timestamp: Date.now() - 86400000,
  },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [previousView, setPreviousView] = useState<AppView | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [walletBalance, setWalletBalance] = useState(45700);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dailyTripCount = transactions.filter((t) => t.type === 'Earning' && t.date === 'Today').length;

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const data = await api.bootstrap();
        setUser(data.user);
        setIsOnline(data.isOnline);
        setActiveRide(data.activeRide);
        setWalletBalance(data.walletBalance);
        setTransactions(data.transactions);
        setWithdrawalRequests(data.withdrawalRequests);
      } catch (error) {
        console.error('Failed to bootstrap from backend, using local defaults.', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isOnline && currentView === AppView.DASHBOARD && !isOwnerMode && !activeRide && !isLoading) {
      timeout = setTimeout(async () => {
        try {
          const nextRide = await api.getNextRide();
          if (nextRide) {
            setActiveRide(nextRide);
            setCurrentView(AppView.RIDE_REQUEST);
          }
        } catch (error) {
          console.error('Failed to fetch next ride.', error);
        }
      }, 3500);
    }

    return () => clearTimeout(timeout);
  }, [isOnline, currentView, isOwnerMode, activeRide, isLoading]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const toggleOwnerMode = () => {
    setIsOwnerMode(!isOwnerMode);
    setCurrentView(!isOwnerMode ? AppView.ADMIN_DASHBOARD : AppView.DASHBOARD);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    try {
      await api.updateUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user profile.', error);
    }
  };

  const handleGoOnline = async (status: boolean) => {
    setIsOnline(status);
    try {
      await api.updateStatus(status);
    } catch (error) {
      console.error('Failed to sync online status.', error);
    }
  };

  const handleAcceptRide = async () => {
    if (!activeRide) return;

    try {
      const acceptedRide = await api.acceptRide(activeRide.id);
      setActiveRide(acceptedRide);
    } catch (error) {
      console.error('Failed to accept ride.', error);
    }

    setCurrentView(AppView.NAVIGATION_PICKUP);
  };

  const handleDeclineRide = () => {
    setActiveRide(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleArrivedAtPickup = () => setCurrentView(AppView.NAVIGATION_DROPOFF);
  const handleArrivedAtDestination = () => setCurrentView(AppView.RIDE_COMPLETE);

  const handleEndRide = async () => {
    if (activeRide) {
      try {
        const payload = await api.completeRide(activeRide.id);
        setTransactions((prev) => [payload.transaction, ...prev]);
        setWalletBalance(payload.walletBalance);
      } catch (error) {
        console.error('Failed to complete ride.', error);
      }
    }

    setActiveRide(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleChat = () => {
    setPreviousView(currentView);
    setCurrentView(AppView.CHAT);
  };

  const handleBackFromChat = () => {
    if (previousView) {
      setCurrentView(previousView);
      setPreviousView(null);
    } else {
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const handleCall = () => {
    const phoneNumber = '08012345678';
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleRequestWithdrawal = async (
    amount: number,
    bankDetails: { bankName: string; accountNumber: string; accountName: string },
  ) => {
    try {
      const payload = await api.requestWithdrawal(amount, bankDetails);
      setWithdrawalRequests((prev) => [payload.withdrawalRequest, ...prev]);
      setTransactions((prev) => [payload.withdrawalTransaction, ...prev]);
      setWalletBalance(payload.walletBalance);
    } catch (error) {
      console.error('Failed to request withdrawal.', error);
    }
  };

  const handleApproveWithdrawal = async (id: string) => {
    try {
      await api.approveWithdrawal(id);
    } catch (error) {
      console.error('Failed to approve withdrawal.', error);
    }

    setWithdrawalRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: 'Paid' } : req)));
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Paid' } : t)));
  };

  const navigateTo = (view: AppView, data?: Ride) => {
    if (activeRide && view === AppView.RIDE_REQUEST) return;
    if (view === AppView.RIDE_REQUEST && data) setActiveRide(data);
    setCurrentView(view);
  };

  return (
    <div className="mx-auto w-full max-w-md h-[100dvh] bg-white dark:bg-[#101922] overflow-hidden relative shadow-2xl sm:rounded-xl sm:my-8 sm:h-[90vh] sm:border border-gray-200 dark:border-gray-800">
      <div className="absolute top-2 right-2 z-[60]">
        <button
          onClick={toggleOwnerMode}
          className="text-[10px] font-bold px-2 py-1 bg-black/20 dark:bg-white/20 hover:bg-black/40 text-black dark:text-white rounded-md backdrop-blur-md"
        >
          {isOwnerMode ? 'Switch to Driver App' : 'Switch to Owner View'}
        </button>
      </div>

      {isLoading && (
        <div className="h-full w-full flex items-center justify-center text-slate-500 dark:text-slate-300">Loading backend…</div>
      )}

      {!isLoading && currentView === AppView.DASHBOARD && (
        <Dashboard
          user={user}
          isOnline={isOnline}
          onToggleOnline={handleGoOnline}
          onNavigate={navigateTo}
          dailyTripCount={dailyTripCount}
          balance={walletBalance}
        />
      )}

      {!isLoading && currentView === AppView.RIDE_REQUEST && activeRide && (
        <RideRequest ride={activeRide} onAccept={handleAcceptRide} onDecline={handleDeclineRide} />
      )}

      {!isLoading && (currentView === AppView.NAVIGATION_PICKUP || currentView === AppView.NAVIGATION_DROPOFF) && activeRide && (
        <Navigation
          phase={currentView === AppView.NAVIGATION_PICKUP ? 'pickup' : 'dropoff'}
          ride={activeRide}
          onPrimaryAction={currentView === AppView.NAVIGATION_PICKUP ? handleArrivedAtPickup : handleArrivedAtDestination}
          onChat={handleChat}
          onCall={handleCall}
        />
      )}

      {!isLoading && currentView === AppView.CHAT && activeRide && (
        <ChatScreen ride={activeRide} onBack={handleBackFromChat} onCall={handleCall} />
      )}

      {!isLoading && currentView === AppView.RIDE_COMPLETE && <RideComplete onEndRide={handleEndRide} />}

      {!isLoading && currentView === AppView.EARNINGS && (
        <Earnings
          onBack={() => navigateTo(AppView.DASHBOARD)}
          balance={walletBalance}
          transactions={transactions}
          onRequestWithdrawal={handleRequestWithdrawal}
        />
      )}

      {!isLoading && currentView === AppView.PROFILE && (
        <Profile
          user={user}
          onUpdateUser={handleUpdateUser}
          onBack={() => navigateTo(AppView.DASHBOARD)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {!isLoading && currentView === AppView.ADMIN_DASHBOARD && (
        <AdminDashboard withdrawalRequests={withdrawalRequests} onApproveWithdrawal={handleApproveWithdrawal} />
      )}
    </div>
  );
};

export default App;
