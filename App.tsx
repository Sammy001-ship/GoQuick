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

// Default User Data
const DEFAULT_USER: User = {
  name: "Jameson Miller",
  rating: 4.9,
  rides: 1284,
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfdc_sc4MKXkjo7cHh94BpLSTZ5RbhQ7TWffR-pZWEUPwqoE9uMyeSruY9oLPQTZMPuI4EUsV6EcA0QjznWPSFIEj2athrPTsZNrWFbEsImroQuL54Uhe0Vdd8y6V9Vn9c32qOfysU7ZptzS63xzsZLKeMEd-Qm7dvr7Ct0qqGPYQUZnpDDKdEBWxHnxNFBulNMiJpJJPVaRgrAd5L4mFKheReS2c_r0q4S_Lgshjf_Pmo-rWL_N-2YUz0gcC9sQOZbIds-s6cLc",
  phone: "(123) 456-7890",
  email: "j.miller@email.com",
  vehicle: {
    model: "Toyota Camry",
    color: "Midnight Black",
    plate: "GQK-1234"
  }
};

// Mock active ride data
const MOCK_RIDE: Ride = {
  id: 'ride-123',
  passengerName: 'Bisi',
  passengerRating: 4.8,
  passengerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUq-T8dROdcm9uNAbrFQHmpVk4TsQclTROGDMJVbKwb76-SHCRe_8Che70W4eo6YRzT3df1B6gk0iUV7UuRCpkycTTQTP4jpiCR9VM8KgfevShio267k14XPO8aupn0nXCZttXJn9ONVBeFAFjMUabK9yG2f_5Vgi0cKwaH4vBQ7VbvkpHbmvYU2AMwsDrle785lbCsPWNzjQwdg8vgNII84MISGWy4pVW2vp8W-w_nmOmAWKZ5YC30WrZ9HptKaa8YdgiauX10Ls',
  price: 5500,
  distance: '25 km',
  duration: '45 min',
  pickupAddress: '123 Allen Avenue, Ikeja',
  dropoffAddress: '456 Ozumba Mbadiwe, VI',
};

// Initial Mock Transactions
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: 'Earning',
    title: 'Trip to VI',
    description: 'Lekki Phase 1 to Victoria Island',
    amount: 2500,
    date: 'Today',
    status: 'Completed',
    timestamp: Date.now() - 3600000
  },
  {
    id: 't2',
    type: 'Earning',
    title: 'Trip to Ikoyi',
    description: 'Ikeja GRA to Dolphin Estate',
    amount: 1800,
    date: 'Today',
    status: 'Completed',
    timestamp: Date.now() - 7200000
  },
  {
    id: 't3',
    type: 'Earning',
    title: 'Trip to Airport',
    description: 'Surulere to MM2 Airport',
    amount: 3200,
    date: 'Yesterday',
    status: 'Completed',
    timestamp: Date.now() - 86400000
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [previousView, setPreviousView] = useState<AppView | null>(null); // For Chat navigation logic
  const [isOnline, setIsOnline] = useState(false);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  
  // User State
  const [user, setUser] = useState<User>(DEFAULT_USER);

  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Dev Mode: Toggle between Driver App and Owner Dashboard
  const [isOwnerMode, setIsOwnerMode] = useState(false);

  // Financial State
  const [walletBalance, setWalletBalance] = useState(45700);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  // Calculate Daily Trips automatically
  const dailyTripCount = transactions.filter(t => t.type === 'Earning' && t.date === 'Today').length;

  useEffect(() => {
    // Check system preference on mount
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleOwnerMode = () => {
    setIsOwnerMode(!isOwnerMode);
    if (!isOwnerMode) {
      setCurrentView(AppView.ADMIN_DASHBOARD);
    } else {
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Simulate a ride request coming in after going online
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isOnline && currentView === AppView.DASHBOARD && !isOwnerMode && !activeRide) {
      timeout = setTimeout(() => {
        setActiveRide(MOCK_RIDE);
        setCurrentView(AppView.RIDE_REQUEST);
      }, 3500); // 3.5 seconds after going online
    }
    return () => clearTimeout(timeout);
  }, [isOnline, currentView, isOwnerMode, activeRide]);

  const handleGoOnline = (status: boolean) => {
    setIsOnline(status);
  };

  const handleAcceptRide = () => {
    setCurrentView(AppView.NAVIGATION_PICKUP);
  };

  const handleDeclineRide = () => {
    setActiveRide(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleArrivedAtPickup = () => {
    setCurrentView(AppView.NAVIGATION_DROPOFF);
  };

  const handleArrivedAtDestination = () => {
    setCurrentView(AppView.RIDE_COMPLETE);
  };

  const handleEndRide = () => {
    if (activeRide) {
      // Logic: 15% cut for the app, 85% to driver
      const driverEarnings = activeRide.price * 0.85;
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'Earning',
        title: `Trip to ${activeRide.dropoffAddress.split(',')[0]}`,
        description: `${activeRide.pickupAddress} to Destination`,
        amount: driverEarnings,
        date: 'Today',
        status: 'Completed',
        timestamp: Date.now()
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setWalletBalance(prev => prev + driverEarnings);
    }

    setActiveRide(null);
    setCurrentView(AppView.DASHBOARD);
  };

  // Chat & Phone Handlers
  const handleChat = () => {
    // Remember where we came from so we can go back
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
    // Simulate call functionality
    const phoneNumber = "08012345678";
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle Withdrawal Request from Driver
  const handleRequestWithdrawal = (amount: number, bankDetails: { bankName: string; accountNumber: string; accountName: string }) => {
    const newRequest: WithdrawalRequest = {
      id: Date.now().toString(),
      driverName: user.name,
      amount: amount,
      bankName: bankDetails.bankName,
      accountNumber: bankDetails.accountNumber,
      accountName: bankDetails.accountName,
      status: 'Pending',
      date: 'Just now',
      timestamp: Date.now()
    };

    const newTransaction: Transaction = {
      id: newRequest.id,
      type: 'Withdrawal',
      title: 'Withdrawal Request',
      description: `${bankDetails.bankName} - ${bankDetails.accountNumber}`,
      amount: -amount,
      date: 'Today',
      status: 'Pending',
      timestamp: Date.now()
    };

    setWithdrawalRequests(prev => [newRequest, ...prev]);
    setTransactions(prev => [newTransaction, ...prev]);
    setWalletBalance(prev => prev - amount); // Deduct immediately from view, pending approval
  };

  // Handle Owner Approval
  const handleApproveWithdrawal = (id: string) => {
    setWithdrawalRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Paid' } : req
    ));

    // Update the transaction status for the driver to see
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'Paid' } : t
    ));
  };

  const navigateTo = (view: AppView, data?: any) => {
    if (activeRide && view === AppView.RIDE_REQUEST) {
      // Prevent manual bid acceptance if ride is active
      return; 
    }

    if (view === AppView.RIDE_REQUEST && data) {
      // Manually trigger a ride request from dashboard list
      setActiveRide(data as Ride);
    }

    setCurrentView(view);
  };

  return (
    <div className="mx-auto w-full max-w-md h-[100dvh] bg-white dark:bg-[#101922] overflow-hidden relative shadow-2xl sm:rounded-xl sm:my-8 sm:h-[90vh] sm:border border-gray-200 dark:border-gray-800">
      
      {/* Dev Toggle Button */}
      <div className="absolute top-2 right-2 z-[60]">
        <button 
          onClick={toggleOwnerMode}
          className="text-[10px] font-bold px-2 py-1 bg-black/20 dark:bg-white/20 hover:bg-black/40 text-black dark:text-white rounded-md backdrop-blur-md"
        >
          {isOwnerMode ? 'Switch to Driver App' : 'Switch to Owner View'}
        </button>
      </div>

      {currentView === AppView.DASHBOARD && (
        <Dashboard 
          user={user}
          isOnline={isOnline} 
          onToggleOnline={handleGoOnline}
          onNavigate={navigateTo}
          dailyTripCount={dailyTripCount}
          balance={walletBalance}
        />
      )}

      {currentView === AppView.RIDE_REQUEST && activeRide && (
        <RideRequest 
          ride={activeRide}
          onAccept={handleAcceptRide}
          onDecline={handleDeclineRide}
        />
      )}

      {(currentView === AppView.NAVIGATION_PICKUP || currentView === AppView.NAVIGATION_DROPOFF) && activeRide && (
        <Navigation 
          phase={currentView === AppView.NAVIGATION_PICKUP ? 'pickup' : 'dropoff'}
          ride={activeRide}
          onPrimaryAction={currentView === AppView.NAVIGATION_PICKUP ? handleArrivedAtPickup : handleArrivedAtDestination}
          onChat={handleChat}
          onCall={handleCall}
        />
      )}

      {currentView === AppView.CHAT && activeRide && (
        <ChatScreen 
          ride={activeRide}
          onBack={handleBackFromChat}
          onCall={handleCall}
        />
      )}

      {currentView === AppView.RIDE_COMPLETE && (
        <RideComplete onEndRide={handleEndRide} />
      )}

      {currentView === AppView.EARNINGS && (
        <Earnings 
          onBack={() => navigateTo(AppView.DASHBOARD)}
          balance={walletBalance}
          transactions={transactions}
          onRequestWithdrawal={handleRequestWithdrawal}
        />
      )}

      {currentView === AppView.PROFILE && (
        <Profile 
          user={user}
          onUpdateUser={handleUpdateUser}
          onBack={() => navigateTo(AppView.DASHBOARD)} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {currentView === AppView.ADMIN_DASHBOARD && (
        <AdminDashboard 
          withdrawalRequests={withdrawalRequests}
          onApproveWithdrawal={handleApproveWithdrawal}
        />
      )}

    </div>
  );
};

export default App;