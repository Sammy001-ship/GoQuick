import { Ride, Transaction, User, WithdrawalRequest } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

interface BootstrapPayload {
  user: User;
  isOnline: boolean;
  activeRide: Ride | null;
  walletBalance: number;
  transactions: Transaction[];
  withdrawalRequests: WithdrawalRequest[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(payload || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  bootstrap: () => request<BootstrapPayload>('/api/bootstrap'),
  updateStatus: (isOnline: boolean) => request<{ isOnline: boolean }>('/api/driver/status', {
    method: 'PATCH',
    body: JSON.stringify({ isOnline }),
  }),
  getNextRide: () => request<Ride | null>('/api/rides/next'),
  acceptRide: (id: string) => request<Ride>(`/api/rides/${id}/accept`, { method: 'POST' }),
  completeRide: (id: string) => request<{ transaction: Transaction; walletBalance: number }>(`/api/rides/${id}/complete`, {
    method: 'POST',
  }),
  updateUser: (user: User) => request<User>('/api/user', {
    method: 'PATCH',
    body: JSON.stringify(user),
  }),
  requestWithdrawal: (amount: number, bankDetails: { bankName: string; accountNumber: string; accountName: string }) =>
    request<{ withdrawalRequest: WithdrawalRequest; withdrawalTransaction: Transaction; walletBalance: number }>('/api/withdrawals', {
      method: 'POST',
      body: JSON.stringify({ amount, ...bankDetails }),
    }),
  approveWithdrawal: (id: string) => request<{ id: string; status: 'Paid' }>(`/api/withdrawals/${id}/approve`, {
    method: 'POST',
  }),
};
