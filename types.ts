export enum AppView {
  DASHBOARD = 'DASHBOARD',
  EARNINGS = 'EARNINGS',
  PROFILE = 'PROFILE',
  RIDE_REQUEST = 'RIDE_REQUEST',
  NAVIGATION_PICKUP = 'NAVIGATION_PICKUP',
  NAVIGATION_DROPOFF = 'NAVIGATION_DROPOFF',
  RIDE_COMPLETE = 'RIDE_COMPLETE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  CHAT = 'CHAT',
}

export enum AppRoute {
  DASHBOARD = 'DASHBOARD',
  EARNINGS = 'EARNINGS',
  PROFILE = 'PROFILE',
  REQUEST = 'REQUEST',
  NAVIGATION = 'NAVIGATION',
}

export interface Ride {
  id: string;
  passengerName: string;
  passengerRating: number;
  passengerImage: string;
  passengerAvatar?: string;
  price: number;
  distance: string;
  duration: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickup?: string;
  dropoff?: string;
  status?: 'pending' | 'pickup' | 'arrived_pickup' | 'in_progress' | 'arrived_destination' | 'completed';
}

export interface Transaction {
  id: string;
  type: 'Earning' | 'Withdrawal';
  title: string;
  description: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Paid';
  timestamp: number;
}

export interface WithdrawalRequest {
  id: string;
  driverName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'Pending' | 'Paid';
  date: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  rating: number;
  totalRides: number;
  avatarUrl: string;
  phone: string;
  email: string;
  vehicle: {
    model: string;
    color: string;
    plate: string;
  };
}

// Interfaces needed for AppContext compatibility
export interface User {
  name: string;
  rating: number;
  rides: number;
  avatar: string;
  phone: string;
  email: string;
  vehicle: {
    model: string;
    color: string;
    plate: string;
  };
}

export interface Earning {
  id: string;
  time: string;
  title: string;
  description: string;
  amount: number;
  date: string;
}