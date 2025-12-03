import React, { useState } from 'react';
import { Transaction } from '../types';

interface EarningsProps {
  onBack: () => void;
  balance: number;
  transactions: Transaction[];
  onRequestWithdrawal: (amount: number, bankDetails: { bankName: string; accountNumber: string; accountName: string }) => void;
}

const Earnings: React.FC<EarningsProps> = ({ onBack, balance, transactions, onRequestWithdrawal }) => {
  const [period, setPeriod] = useState<'Daily' | 'Weekly'>('Daily');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  
  // Withdrawal Form State
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !bankName || !accountNumber || !accountName) return;
    
    // Validate amount
    const numAmount = parseFloat(amount);
    if (numAmount > balance) {
      alert("Insufficient funds");
      return;
    }

    onRequestWithdrawal(numAmount, { bankName, accountNumber, accountName });
    setShowWithdrawModal(false);
    
    // Reset form
    setAmount('');
    setBankName('');
    setAccountNumber('');
    setAccountName('');
  };

  // Filter transactions based on period (Mock logic for filter)
  const filteredTransactions = transactions.filter(t => {
    if (period === 'Daily') return t.date === 'Today';
    // For weekly, we just show all for this demo
    return true;
  });

  return (
    <div className="flex h-full w-full flex-col bg-[#F7F8FA] dark:bg-[#1D2A3A] relative">
      {/* App Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-[#2d3748] p-4 border-b border-gray-200 dark:border-gray-700">
        <button onClick={onBack} className="flex size-10 shrink-0 items-center justify-start text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold">Earnings & Withdrawal</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-48">
        {/* Summary Card */}
        <div className="p-4">
          <div className="flex flex-col rounded-xl shadow-sm bg-white dark:bg-[#2d3748] p-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Earnings</p>
            <p className="text-slate-900 dark:text-white text-4xl font-bold tracking-tight mb-2">
              ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2">
              <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Updated just now</p>
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div className="px-4 py-2">
          <div className="flex h-12 w-full rounded-lg bg-gray-200 dark:bg-[#4a5568] p-1">
            <button 
              onClick={() => setPeriod('Daily')}
              className={`flex-1 rounded-md text-sm font-semibold transition-all ${period === 'Daily' ? 'bg-white dark:bg-[#2d3748] text-[#00B14F] shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Daily
            </button>
            <button 
               onClick={() => setPeriod('Weekly')}
               className={`flex-1 rounded-md text-sm font-semibold transition-all ${period === 'Weekly' ? 'bg-white dark:bg-[#2d3748] text-[#00B14F] shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* List */}
        <div className="px-4 pt-4 space-y-4">
           {filteredTransactions.length === 0 ? (
             <p className="text-center text-slate-400 text-sm py-8">No transactions for this period.</p>
           ) : (
             filteredTransactions.map((t) => (
               <div key={t.id} className="flex items-center gap-4 bg-white dark:bg-[#2d3748] p-4 rounded-xl shadow-sm">
                  <div className={`flex items-center justify-center rounded-full shrink-0 size-12 
                    ${t.type === 'Withdrawal' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' : 'bg-green-100 dark:bg-green-900/20 text-green-600'}`}>
                    <span className="material-symbols-outlined">{t.type === 'Withdrawal' ? 'payments' : 'directions_car'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white text-base font-bold truncate">{t.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{t.description}</p>
                    {t.type === 'Withdrawal' && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md mt-1 inline-block
                        ${t.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {t.status === 'Paid' ? 'Successful' : t.status}
                      </span>
                    )}
                  </div>
                  <p className={`text-base font-bold whitespace-nowrap ${t.type === 'Withdrawal' ? 'text-slate-900 dark:text-white' : 'text-[#00B14F]'}`}>
                    {t.amount > 0 ? '+' : ''} ₦{Math.abs(t.amount).toLocaleString()}
                  </p>
               </div>
             ))
           )}
        </div>
      </div>

      {/* Withdrawal Footer */}
      <div className="absolute bottom-0 w-full bg-white dark:bg-[#2d3748] border-t border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Available for Withdrawal</p>
            <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowWithdrawModal(true)}
          className="w-full h-14 bg-[#00B14F] hover:bg-[#009944] text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/20 transition-colors"
        >
          Withdraw Funds
        </button>
      </div>

      {/* Withdrawal Modal Overlay */}
      {showWithdrawModal && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-[#1F2937] rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Withdraw Funds</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleWithdrawSubmit} className="p-5 space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">₦</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    max={balance}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00B14F] outline-none font-bold text-lg"
                    required
                  />
                </div>
               </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Zenith Bank"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00B14F] outline-none"
                  required
                />
               </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Number</label>
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="0123456789"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00B14F] outline-none"
                  required
                />
               </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Holder Name</label>
                <input 
                  type="text" 
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="As it appears on account"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00B14F] outline-none"
                  required
                />
               </div>

               <button 
                  type="submit"
                  className="w-full py-3 mt-2 rounded-xl bg-[#00B14F] text-white font-bold hover:bg-[#009944] shadow-md transition-colors"
               >
                 Submit Request
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;