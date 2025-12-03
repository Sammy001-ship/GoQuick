import React, { useState } from 'react';
import { WithdrawalRequest } from '../types';

// Mock Data for the Admin Dashboard
const MOCK_STATS = [
  { label: 'Total Revenue', value: '₦4.2M', change: '+12%', color: 'text-green-500' },
  { label: 'Active Drivers', value: '1,240', change: '+5%', color: 'text-blue-500' },
  { label: 'Pending Docs', value: '18', change: '-2', color: 'text-orange-500' },
];

const MOCK_PENDING_DOCS = [
  { id: 1, driver: 'Jameson Miller', docType: 'Car Legal Document', date: '2 mins ago', image: 'https://images.unsplash.com/photo-1549449179-79841f480376?q=80&w=1000&auto=format&fit=crop' },
  { id: 2, driver: 'Sarah Connor', docType: 'Driver License', date: '1 hour ago', image: 'https://images.unsplash.com/photo-1628009368231-736004b6807f?q=80&w=1000&auto=format&fit=crop' },
];

interface AdminDashboardProps {
  withdrawalRequests?: WithdrawalRequest[];
  onApproveWithdrawal?: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ withdrawalRequests = [], onApproveWithdrawal }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'payouts'>('overview');
  const [verificationQueue, setVerificationQueue] = useState(MOCK_PENDING_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  const pendingWithdrawals = withdrawalRequests.filter(r => r.status === 'Pending');

  const handleVerify = (id: number, approved: boolean) => {
    // In a real app, this sends an API request to update the DB
    setVerificationQueue((prev) => prev.filter((doc) => doc.id !== id));
    setSelectedDoc(null);
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-50 dark:bg-[#101922] overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-[#1F2937] p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Owner Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Goquick Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-4 gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[100px] py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview' 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'bg-white dark:bg-[#1F2937] text-slate-600 dark:text-slate-400 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('verification')}
          className={`flex-1 min-w-[110px] py-2.5 rounded-lg text-xs font-bold transition-all relative whitespace-nowrap ${
            activeTab === 'verification' 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'bg-white dark:bg-[#1F2937] text-slate-600 dark:text-slate-400 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Docs
          {verificationQueue.length > 0 && (
            <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-slate-50 dark:border-[#101922]">
              {verificationQueue.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('payouts')}
          className={`flex-1 min-w-[100px] py-2.5 rounded-lg text-xs font-bold transition-all relative whitespace-nowrap ${
            activeTab === 'payouts' 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'bg-white dark:bg-[#1F2937] text-slate-600 dark:text-slate-400 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Payouts
          {pendingWithdrawals.length > 0 && (
             <span className="absolute -top-1 -right-1 size-5 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-slate-50 dark:border-[#101922]">
              {pendingWithdrawals.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              {MOCK_STATS.map((stat, idx) => (
                <div key={idx} className={`bg-white dark:bg-[#1F2937] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${idx === 0 ? 'col-span-2' : ''}`}>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <div className="flex items-end justify-between mt-1">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <span className={`text-xs font-bold ${stat.color} bg-opacity-10 py-1 px-2 rounded-full`}>{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white dark:bg-[#1F2937] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Ride Volume (Last 7 Days)</h3>
              <div className="flex items-end justify-between h-32 gap-2">
                {[40, 65, 30, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-md relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-indigo-500 rounded-t-md transition-all duration-1000 group-hover:bg-indigo-400" 
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {verificationQueue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-green-600 text-4xl">check</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Caught Up!</h3>
                <p className="text-slate-500 dark:text-slate-400">No documents pending review.</p>
              </div>
            ) : (
              verificationQueue.map((doc) => (
                <div key={doc.id} className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 flex justify-between items-start">
                    <div className="flex gap-3">
                       <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                         <span className="material-symbols-outlined">person</span>
                       </div>
                       <div>
                         <h3 className="font-bold text-slate-900 dark:text-white">{doc.driver}</h3>
                         <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded {doc.date}</p>
                       </div>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-lg">Pending</span>
                  </div>
                  
                  <div className="px-4 pb-4">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Document: {doc.docType}</p>
                    <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative group">
                        {selectedDoc === doc.id ? (
                           <div className="absolute inset-0 z-10 bg-black/90 flex flex-col items-center justify-center p-4">
                              <p className="text-white text-sm mb-4">Inspecting Document...</p>
                              <button onClick={() => setSelectedDoc(null)} className="text-white underline text-xs">Close Preview</button>
                           </div>
                        ) : (
                           <div 
                              className="w-full h-full bg-cover bg-center"
                              style={{ backgroundImage: `url("${doc.image}")` }}
                            >
                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <button 
                                    onClick={() => setSelectedDoc(doc.id)}
                                    className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                                  >
                                    Inspect
                                  </button>
                               </div>
                            </div>
                        )}
                    </div>
                  </div>

                  <div className="flex border-t border-gray-100 dark:border-gray-700 divide-x divide-gray-100 dark:divide-gray-700">
                    <button 
                      onClick={() => handleVerify(doc.id, false)}
                      className="flex-1 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                      Reject
                    </button>
                    <button 
                      onClick={() => handleVerify(doc.id, true)}
                      className="flex-1 py-3 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">check</span>
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'payouts' && (
           <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {pendingWithdrawals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="size-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-blue-600 text-4xl">payments</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Pending Payouts</h3>
                  <p className="text-slate-500 dark:text-slate-400">All withdrawal requests have been processed.</p>
                </div>
              ) : (
                pendingWithdrawals.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                          <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined">person</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{req.driverName}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{req.date}</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">₦{req.amount.toLocaleString()}</p>
                     </div>

                     <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg mb-4">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Bank Details</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{req.bankName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-mono">{req.accountNumber}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{req.accountName}</p>
                     </div>

                     <button 
                        onClick={() => onApproveWithdrawal && onApproveWithdrawal(req.id)}
                        className="w-full py-2.5 bg-[#137fec] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                     >
                        Approve Payout
                     </button>
                  </div>
                ))
              )}
           </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;