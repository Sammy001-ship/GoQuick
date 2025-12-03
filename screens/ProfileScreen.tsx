import React from 'react';
import { useApp } from '../context/AppContext';
import { AppRoute } from '../types';

interface ProfileScreenProps {
  navigate: (route: AppRoute) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigate }) => {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg font-sans pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-card sticky top-0 z-10 border-b border-gray-200 dark:border-white/10">
        <button onClick={() => navigate(AppRoute.DASHBOARD)} className="text-gray-800 dark:text-white flex size-10 items-center justify-center">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Profile</h1>
        <button className="text-primary flex size-10 items-center justify-center font-bold">Edit</button>
      </div>

      <div className="flex w-full flex-col">
        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-card p-6 border-b border-gray-200 dark:border-white/5">
          <div className="flex w-full flex-col items-center gap-4">
            <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 border-4 border-gray-100 dark:border-white/10" 
                style={{ backgroundImage: `url("${user.avatar}")` }}
            ></div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-yellow-400 !text-xl">star</span>
                <p className="text-gray-500 dark:text-gray-400 text-base font-medium">{user.rating} ({user.rides.toLocaleString()} rides)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Info Group */}
          <div className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold px-4 pt-4 pb-2">Personal Information</h3>
            <div className="flex flex-col">
              <InfoRow icon="person" label="Full Name" value={user.name} />
              <InfoRow icon="phone" label="Phone Number" value={user.phone} />
              <InfoRow icon="mail" label="Email Address" value={user.email} />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold px-4 pt-4 pb-2">Vehicle Information</h3>
            <div className="flex flex-col">
              <InfoRow icon="directions_car" label="Make & Model" value={user.vehicle.model} />
              <InfoRow icon="palette" label="Color" value={user.vehicle.color} />
              <InfoRow icon="pin" label="License Plate" value={user.vehicle.plate} />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold px-4 pt-4 pb-2">Documents</h3>
            <div className="flex flex-col">
               <DocRow label="Driver's License" status="Verified" statusColor="text-green-500" icon="check_circle" />
               <DocRow label="Vehicle Registration" status="Pending Review" statusColor="text-yellow-500" icon="hourglass_top" />
               <DocRow label="Proof of Insurance" status="Expired" statusColor="text-red-500" icon="cancel" />
            </div>
          </div>

          <div className="pt-2 pb-8 space-y-4">
            <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-base font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
              Log Out
            </button>
            <button className="block w-full text-center text-primary text-base font-medium">Help & Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <div className="flex items-center gap-4 px-4 py-3 justify-between border-t border-gray-100 dark:border-white/5">
    <div className="flex items-center gap-4">
      <div className="text-gray-400 dark:text-gray-500 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 shrink-0 size-10">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-base">{label}</p>
    </div>
    <p className="text-gray-900 dark:text-white text-base font-medium">{value}</p>
  </div>
);

const DocRow = ({ label, status, statusColor, icon }: { label: string, status: string, statusColor: string, icon: string }) => (
    <div className="flex items-center gap-4 px-4 py-3 justify-between border-t border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
    <div className="flex flex-col items-start gap-1">
      <p className="text-gray-900 dark:text-white text-base font-medium">{label}</p>
      <div className={`flex items-center gap-1.5 ${statusColor}`}>
        <span className="material-symbols-outlined !text-base">{icon}</span>
        <p className="text-sm font-medium">{status}</p>
      </div>
    </div>
    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
  </div>
);

export default ProfileScreen;
