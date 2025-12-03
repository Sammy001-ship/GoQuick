import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AppRoute, Earning } from '../types';

interface EarningsScreenProps {
  navigate: (route: AppRoute) => void;
}

const EarningsScreen: React.FC<EarningsScreenProps> = ({ navigate }) => {
  const { balance, earningsHistory } = useApp();

  // Group earnings by Date
  const groupedEarnings = useMemo(() => {
    const groups: Record<string, Earning[]> = {};
    earningsHistory.forEach(item => {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
    });
    return groups;
  }, [earningsHistory]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#1D2A3A] font-sans pb-24">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex items-center bg-white dark:bg-[#2d3748] p-4 pb-3 justify-between border-b border-gray-200 dark:border-gray-700">
        <button 
            onClick={() => navigate(AppRoute.DASHBOARD)}
            className="flex size-10 shrink-0 items-center justify-start text-gray-800 dark:text-white"
        >
          <span className="material-symbols-outlined !text-2xl">arrow_back_ios_new</span>
        </button>
        <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">Earnings & Withdrawal</h2>
        <div className="w-10"></div>
      </div>

      <main className="flex-grow">
        {/* Summary Card */}
        <div className="p-4">
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-white dark:bg-[#2d3748]">
            <div className="flex w-full grow flex-col items-stretch justify-center gap-1 p-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">Total Earnings</p>
              <p className="text-gray-900 dark:text-white text-4xl font-bold tracking-tight">₦{balance.toLocaleString()}.00</p>
              <div className="flex items-end gap-3 justify-between mt-1">
                <p className="text-gray-400 dark:text-gray-500 text-xs">Updated just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle (Visual Only) */}
        <div className="flex px-4 py-3">
          <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
            <button className="flex-1 h-full rounded-md bg-white dark:bg-[#2d3748] shadow-sm text-primary-green text-sm font-bold transition-all">Daily</button>
            <button className="flex-1 h-full rounded-md text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Weekly</button>
          </div>
        </div>

        {/* List */}
        <div className="px-4 pb-40">
            {Object.entries(groupedEarnings).map(([date, items]: [string, Earning[]]) => (
                <div key={date}>
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold pb-2 pt-4">{date}</h3>
                    <div className="space-y-2">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-[#2d3748] px-4 min-h-[72px] py-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-4 flex-grow">
                                    <div className="text-gray-800 dark:text-white flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 shrink-0 size-12">
                                        <span className="material-symbols-outlined">directions_car</span>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-gray-900 dark:text-white text-base font-medium line-clamp-1">{item.time} - {item.title}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal line-clamp-1">{item.description}</p>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <p className="text-[#00B14F] text-base font-semibold">+ ₦{item.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </main>

      {/* Withdrawal Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2d3748] border-t border-gray-200 dark:border-gray-700 p-4 rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Available for Withdrawal</p>
            <p className="text-gray-900 dark:text-white text-2xl font-bold">₦45,700.00</p>
          </div>
        </div>
        <button 
            onClick={() => alert("Withdrawal processed! Funds will arrive in 24 hours.")}
            className="flex w-full cursor-pointer items-center justify-center rounded-lg h-14 bg-[#00B14F] text-white gap-2 text-base font-bold shadow-lg shadow-green-500/30 hover:bg-[#009944] transition-colors"
        >
          Withdraw Funds
        </button>
        <p className="text-gray-400 dark:text-gray-500 text-xs text-center mt-3">Funds will be sent to your Zenith Bank account ending in ...1234.</p>
      </div>
    </div>
  );
};

export default EarningsScreen;