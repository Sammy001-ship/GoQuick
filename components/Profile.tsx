import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

interface Document {
  id: number;
  label: string;
  status: string;
  statusColor: string;
  icon: string;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onBack, theme, onToggleTheme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile State initialization from props
  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone,
    email: user.email,
    model: user.vehicle.model,
    color: user.vehicle.color,
    plate: user.vehicle.plate,
    avatar: user.avatar
  });

  // Sync state if user prop changes (e.g. external updates)
  useEffect(() => {
    setProfile({
      name: user.name,
      phone: user.phone,
      email: user.email,
      model: user.vehicle.model,
      color: user.vehicle.color,
      plate: user.vehicle.plate,
      avatar: user.avatar
    });
  }, [user]);

  // Documents State (Local only for this demo)
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, label: "Driver's License Image", status: "Verified", statusColor: "text-green-500", icon: "check_circle" },
    { id: 2, label: "Car Image", status: "Verified", statusColor: "text-green-500", icon: "check_circle" },
    { id: 3, label: "Car Legal Document", status: "Pending Review", statusColor: "text-yellow-500", icon: "hourglass_top" },
  ]);

  const [newDocName, setNewDocName] = useState('');
  const [showAddDoc, setShowAddDoc] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setShowAddDoc(false);
    
    // Update Parent State
    onUpdateUser({
        ...user,
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        avatar: profile.avatar,
        vehicle: {
            model: profile.model,
            color: profile.color,
            plate: profile.plate
        }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowAddDoc(false);
    setNewDocName('');
    // Revert state
    setProfile({
      name: user.name,
      phone: user.phone,
      email: user.email,
      model: user.vehicle.model,
      color: user.vehicle.color,
      plate: user.vehicle.plate,
      avatar: user.avatar
    });
  };

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAddDocument = () => {
    if (newDocName.trim()) {
      const newDoc: Document = {
        id: Date.now(),
        label: newDocName,
        status: "Pending Review",
        statusColor: "text-yellow-500",
        icon: "hourglass_top"
      };
      setDocuments([...documents, newDoc]);
      setNewDocName('');
      setShowAddDoc(false);
    }
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F3F4F6] dark:bg-[#101922] overflow-hidden">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1F2937] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        {isEditing ? (
          <button 
            onClick={handleCancel} 
            className="text-red-500 font-medium px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
        ) : (
          <button onClick={onBack} className="flex size-10 items-center justify-center text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
        )}
        
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          {isEditing ? 'Edit Profile' : 'Profile'}
        </h1>
        
        {isEditing ? (
          <button 
            onClick={handleSave} 
            className="flex h-10 px-4 items-center justify-center font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors shadow-sm"
          >
            Save
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)} 
            className="flex h-10 px-2 items-center justify-center font-bold text-[#10B981] hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-8 relative">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1F2937] pb-8 pt-6 rounded-b-3xl shadow-sm mb-6 transition-all">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
               <div 
                 className="size-32 rounded-full bg-cover bg-center border-4 border-white dark:border-[#1F2937] shadow-md transition-all group-hover:shadow-lg"
                 style={{ backgroundImage: `url("${profile.avatar}")` }}
               ></div>
               {isEditing && (
                 <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                   <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
                 </div>
               )}
               {!isEditing && (
                 <div className="absolute bottom-0 right-0 bg-[#10B981] p-2 rounded-full border-2 border-white dark:border-[#1F2937] text-white shadow-sm">
                   <span className="material-symbols-outlined text-sm font-bold block">camera_alt</span>
                 </div>
               )}
            </div>
            
            <div className="text-center w-full px-8">
              {isEditing ? (
                 <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="text-2xl font-bold text-slate-900 dark:text-white text-center bg-transparent border-b-2 border-gray-200 dark:border-gray-600 focus:border-[#10B981] focus:outline-none w-full pb-1"
                />
              ) : (
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
              )}
              
              {!isEditing && (
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-yellow-400 text-xl fill-current">star</span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{user.rating} <span className="text-slate-400 mx-1">•</span> {user.rides.toLocaleString()} rides</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 space-y-6">
           {/* App Settings Section */}
           <section className="bg-white dark:bg-[#1F2937] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white px-5 pt-5 pb-2">App Settings</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 size-10 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-xl">dark_mode</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Dark Mode</p>
                </div>
                {/* Toggle Switch */}
                <button
                  onClick={onToggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    theme === 'dark' ? 'bg-[#10B981]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Personal Information Section */}
          <section className="bg-white dark:bg-[#1F2937] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white px-5 pt-5 pb-2">Personal Information</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <InfoRow 
                icon="person" 
                label="Full Name" 
                value={profile.name} 
                isEditing={isEditing} 
                onChange={(val) => handleChange('name', val)}
              />
              <InfoRow 
                icon="phone" 
                label="Phone" 
                value={profile.phone} 
                isEditing={isEditing}
                onChange={(val) => handleChange('phone', val)}
              />
              <InfoRow 
                icon="mail" 
                label="Email" 
                value={profile.email} 
                isEditing={isEditing}
                onChange={(val) => handleChange('email', val)}
              />
            </div>
          </section>

          {/* Vehicle Section */}
          <section className="bg-white dark:bg-[#1F2937] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white px-5 pt-5 pb-2">Vehicle Information</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <InfoRow 
                icon="directions_car" 
                label="Model" 
                value={profile.model} 
                isEditing={isEditing}
                onChange={(val) => handleChange('model', val)}
              />
              <InfoRow 
                icon="palette" 
                label="Color" 
                value={profile.color} 
                isEditing={isEditing}
                onChange={(val) => handleChange('color', val)}
              />
              <InfoRow 
                icon="pin" 
                label="Plate" 
                value={profile.plate} 
                isEditing={isEditing}
                onChange={(val) => handleChange('plate', val)}
              />
            </div>
          </section>

          {/* Documents Section */}
          <section className="bg-white dark:bg-[#1F2937] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Documents</h3>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
               {documents.map((doc) => (
                 <DocRow 
                    key={doc.id} 
                    label={doc.label} 
                    status={doc.status} 
                    statusColor={doc.statusColor} 
                    icon={doc.icon}
                    isEditing={isEditing}
                    onDelete={() => handleDeleteDocument(doc.id)}
                 />
               ))}
            </div>

            {/* Add Credential UI */}
            {isEditing && (
              <div className="p-4 bg-gray-50 dark:bg-[#101922]/30">
                {!showAddDoc ? (
                  <button 
                    onClick={() => setShowAddDoc(true)}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-slate-500 dark:text-slate-400 font-semibold hover:border-[#10B981] hover:text-[#10B981] hover:bg-[#10B981]/5 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">add_circle</span>
                    Add Credential
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Document Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Insurance Policy"
                      autoFocus
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowAddDoc(false)}
                        className="flex-1 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAddDocument}
                        className="flex-1 py-2.5 rounded-lg bg-[#10B981] text-white font-semibold hover:bg-[#059669]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {!isEditing && (
            <div className="pt-2 pb-8 flex flex-col gap-4">
               <button className="flex w-full items-center justify-center h-14 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                 Log Out
               </button>
               <button className="text-[#10B981] font-semibold text-sm hover:underline">
                 Help & Support
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, isEditing, onChange }) => (
  <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
    <div className="flex items-center gap-4 flex-1">
      <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 size-10 text-slate-500 dark:text-slate-400 shrink-0">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium shrink-0 w-24">{label}</p>
      
      {isEditing ? (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white font-semibold focus:border-[#10B981] focus:outline-none py-1"
        />
      ) : (
        <p className="text-slate-900 dark:text-white font-semibold text-right flex-1 truncate">{value}</p>
      )}
    </div>
  </div>
);

interface DocRowProps {
  label: string;
  status: string;
  statusColor: string;
  icon: string;
  isEditing: boolean;
  onDelete: () => void;
}

const DocRow: React.FC<DocRowProps> = ({ label, status, statusColor, icon, isEditing, onDelete }) => (
  <div className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
    <div className="flex flex-col items-start gap-1 flex-1">
      <p className="text-slate-900 dark:text-white font-semibold">{label}</p>
      <div className={`flex items-center gap-1.5 ${statusColor}`}>
        <span className="material-symbols-outlined text-sm">{icon}</span>
        <p className="text-xs font-bold uppercase tracking-wide">{status}</p>
      </div>
    </div>
    
    {isEditing ? (
      <button 
        onClick={onDelete}
        className="size-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">delete</span>
      </button>
    ) : (
      <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
    )}
  </div>
);

export default Profile;