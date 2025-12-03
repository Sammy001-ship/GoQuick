import React from 'react';

interface RideCompleteProps {
  onEndRide: () => void;
}

const RideComplete: React.FC<RideCompleteProps> = ({ onEndRide }) => {
  return (
    <div className="relative h-full w-full flex flex-col bg-[#f6f7f8] dark:bg-[#101922]">
       <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 dark:opacity-30"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_mfuz7stJQ5BMtokEgkgnfHPJUAQXnQfaGEBXUVBTL0qzvUQrJpD9S4qrjomsWOQGkwV39zlf-7xkCLJ3hxeIf9bChmRFBJebEznwXVnDXHXqMk_2t2Gnkg0XgiiVEMnWpw_nLKRB_nkF_65krs0N_ZQIDAChjPaUYgpmXxEYjUJ1t4CfMPvWd0Yu4GGXr3UjWz_lY5q4M5rUJn0cpJpNqWAwYpzVWi6oiS1K3I-X9WuTP2O5SVANEaw8oYSVhaj1nsMSMUJNL30")' }}
        ></div>
        
        <div className="relative z-10 flex h-full flex-col justify-end bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#101922] dark:via-[#101922]/95 p-6">
          <div className="flex flex-col items-center justify-center text-center pb-10">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#FFC107] mb-8 shadow-xl animate-bounce">
              <span className="material-symbols-outlined text-zinc-900" style={{ fontSize: '64px' }}>flag</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Arrived at Destination</h1>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              You have successfully reached the drop-off location.
            </p>
          </div>

          <div className="w-full space-y-3 pb-8">
             <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Trip Fare</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">₦5,500</span>
             </div>

            <button 
              onClick={onEndRide}
              className="w-full rounded-xl bg-[#FFC107] py-4 text-center text-lg font-bold text-slate-900 shadow-lg hover:bg-[#ffcd38] transition-colors"
            >
              Complete Ride
            </button>
          </div>
        </div>
    </div>
  );
};

export default RideComplete;
