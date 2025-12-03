import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Ride, Earning } from '../types';

interface AppContextType {
  user: User;
  isOnline: boolean;
  toggleOnline: () => void;
  balance: number;
  currentRide: Ride | null;
  setCurrentRide: (ride: Ride | null) => void;
  earningsHistory: Earning[];
  acceptRide: (ride: Ride) => void;
  updateRideStatus: (status: Ride['status']) => void;
  completeRide: () => void;
}

const defaultUser: User = {
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

const initialEarnings: Earning[] = [
  { id: '1', time: '10:45 AM', title: 'Trip to VI', description: 'Lekki Phase 1 to Victoria Island', amount: 2500, date: 'Today, May 24' },
  { id: '2', time: '09:12 AM', title: 'Trip to Ikoyi', description: 'Ikeja GRA to Dolphin Estate', amount: 1800, date: 'Today, May 24' },
  { id: '3', time: '06:30 PM', title: 'Trip to Airport', description: 'Surulere to MM2 Airport', amount: 3200, date: 'Yesterday, May 23' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<User>(defaultUser);
  const [isOnline, setIsOnline] = useState(false);
  const [balance, setBalance] = useState(150500);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [earningsHistory, setEarningsHistory] = useState<Earning[]>(initialEarnings);

  const toggleOnline = () => setIsOnline(prev => !prev);

  const acceptRide = (ride: Ride) => {
    setCurrentRide({ ...ride, status: 'pickup' });
  };

  const updateRideStatus = (status: Ride['status']) => {
    if (currentRide) {
      setCurrentRide({ ...currentRide, status });
    }
  };

  const completeRide = () => {
    if (currentRide) {
      setBalance(prev => prev + currentRide.price);
      // Fallback logic for optional properties
      const dropoff = currentRide.dropoff || currentRide.dropoffAddress || '';
      const pickup = currentRide.pickup || currentRide.pickupAddress || '';
      
      const newEarning: Earning = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Trip to ${dropoff.split(',')[0]}`,
        description: `${pickup.split(',')[0]} to ${dropoff.split(',')[0]}`,
        amount: currentRide.price,
        date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
      setEarningsHistory(prev => [newEarning, ...prev]);
      setCurrentRide(null);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      isOnline,
      toggleOnline,
      balance,
      currentRide,
      setCurrentRide,
      earningsHistory,
      acceptRide,
      updateRideStatus,
      completeRide
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};