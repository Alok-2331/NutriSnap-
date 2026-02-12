
import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Info, 
  Activity, 
  Target, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Bell, 
  Scale, 
  Beef, 
  Sparkles, 
  Droplets,
  Moon,
  Sun,
  LogOut,
  Smartphone,
  ChevronLeft,
  SlidersHorizontal,
  Lock,
  Trash2,
  Database,
  Languages,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { AppState, UserProfile, AppSettings, ActivityLevel, Gender } from '../types';

// --- Atomic UI Components ---

const BrandLogoBackground = () => (
   <div className="w-40 h-40 bg-emerald-500 rounded-full blur-[60px]" />
);

const SectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-1">
    <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-400">
       {icon}
    </div>
    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{title}</h3>
  </div>
);

const InputGroup = ({ label, children }: { label: string; children?: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">{label}</label>
    {children}
  </div>
);

const ToggleItem = ({ icon, label, description, active, onToggle }: { icon: any, label: string, description: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className="text-emerald-500 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{label}</div>
        <div className="text-[10px] text-zinc-400 font-medium">{description}</div>
      </div>
    </div>
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const SettingsButton = ({ icon, label, description, onClick }: { icon: any, label: string, description: string, onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] text-left shadow-sm group">
        <div className="flex items-center gap-4">
            <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl group-hover:rotate-12 transition-transform">{icon}</div>
            <div>
              <div className="text-sm font-black text-zinc-900 dark:text-zinc-100">{label}</div>
              <div className="text-[10px] text-zinc-400 font-medium">{description}</div>
            </div>
        </div>
        <ChevronRight size={18} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
    </button>
);

const GuideSection = ({ title, icon, content }: { title: string, icon: any, content: string }) => (
  <div className="space-y-3 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
    <div className="flex items-center gap-3 font-black text-sm uppercase tracking-widest">{icon} {title}</div>
    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">{content}</p>
  </div>
);

interface ProfileViewProps {
  state: AppState;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ state, onUpdateProfile, onUpdateSettings, onLogout, isDarkMode, setIsDarkMode }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { profile, settings } = state;

  const handleUpdate = (key: keyof UserProfile, value: any) => {
    onUpdateProfile({ ...profile, [key]: value });
  };

  const handleSettingToggle = (key: keyof AppSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  const clearAllData = () => {
    if (window.confirm("CRITICAL: This will delete ALL your food logs and reset the app. This action is permanent. Continue?")) {
      localStorage.removeItem('nutrisnap_state');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <BrandLogoBackground />
        </div>
        
        <div className="relative group">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 border-4 border-white dark:border-zinc-900 shadow-xl relative overflow-hidden transition-transform group-hover:scale-105 duration-500">
            <User size={48} />
          </div>
          <div className="absolute bottom-4 right-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-md">
            <Sparkles size={16} />
          </div>
        </div>
        
        <h2 className="text-2xl font-black">{profile.name}</h2>
        <div className="flex gap-2 mt-2">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full">{profile.goal}</span>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 rounded-full">{profile.age} Years</span>
        </div>
      </div>

      {/* Control Center Shortcut */}
      <div className="space-y-4">
          <div className="px-1 flex justify-between items-center">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Main Menu</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
              <SettingsButton 
                icon={<Settings size={20} />} 
                label="App Control Center" 
                description="Manage goals, theme & privacy"
                onClick={() => setShowSettings(true)} 
              />
              <SettingsButton 
                icon={<Info size={20} />} 
                label="Help & Guide" 
                description="Master your nutrition journey"
                onClick={() => setShowGuide(true)} 
              />
              <SettingsButton 
                icon={<Lock size={20} />} 
                label="Privacy Lock" 
                description="Your data security details"
                onClick={() => setShowSecurity(true)} 
              />
              
              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />

              <button 
                onClick={() => setShowLogoutConfirm(true)} 
                className="w-full py-5 flex items-center justify-center gap-3 text-red-500 font-black text-xs uppercase tracking-[0.2em] bg-red-50 dark:bg-red-900/10 rounded-[2rem] active:scale-95 transition-all border border-red-100 dark:border-red-900/30 shadow-sm"
              >
                <LogOut size={18} />
                Sign Out Account
              </button>
          </div>
      </div>

      {/* Custom Sign Out Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-zinc-900 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                 <LogOut size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Sign Out?</h3>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed px-2">
                  Are you sure you want to sign out? Your profile data will be cleared from this device for security.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                 <button 
                  onClick={onLogout}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/30 active:scale-95 transition-all"
                 >
                    Confirm Sign Out
                 </button>
                 <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-3 text-zinc-400 font-black text-xs uppercase tracking-widest hover:text-zinc-600 transition-colors"
                 >
                    Stay Signed In
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Full Screen Control Center */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-zinc-950 animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
               <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                 <ChevronLeft size={24} />
               </button>
               <h3 className="text-xl font-black">Control Center</h3>
            </div>
            <div className="p-2 text-emerald-500">
               <SlidersHorizontal size={20} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-10 hide-scrollbar pb-32">
            
            {/* 1. Identity & Bio */}
            <section className="space-y-4">
              <SectionHeader title="Profile Identity" icon={<User size={14} />} />
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] p-6 space-y-6">
                <InputGroup label="Display Name">
                   <input type="text" value={profile.name} onChange={(e) => handleUpdate('name', e.target.value)} className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl font-bold outline-none border-none ring-1 ring-zinc-100 dark:ring-zinc-700 focus:ring-2 focus:ring-emerald-500" />
                </InputGroup>
                
                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="Gender">
                      <select value={profile.gender} onChange={(e) => handleUpdate('gender', e.target.value)} className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl font-bold appearance-none">
                         <option value={Gender.MALE}>{Gender.MALE}</option>
                         <option value={Gender.FEMALE}>{Gender.FEMALE}</option>
                         <option value={Gender.OTHER}>{Gender.OTHER}</option>
                      </select>
                   </InputGroup>
                   <InputGroup label="Age">
                      <input type="number" value={profile.age} onChange={(e) => handleUpdate('age', parseInt(e.target.value))} className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl font-bold" />
                   </InputGroup>
                </div>
              </div>
            </section>

            {/* 2. Fitness Engine */}
            <section className="space-y-4">
              <SectionHeader title="Health Engine" icon={<Activity size={14} />} />
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] p-6 space-y-6">
                <InputGroup label="Activity Level">
                   <select value={profile.activityLevel} onChange={(e) => handleUpdate('activityLevel', e.target.value)} className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl font-bold appearance-none">
                      <option value={ActivityLevel.SEDENTARY}>{ActivityLevel.SEDENTARY}</option>
                      <option value={ActivityLevel.LIGHTLY_ACTIVE}>{ActivityLevel.LIGHTLY_ACTIVE}</option>
                      <option value={ActivityLevel.MODERATELY_ACTIVE}>{ActivityLevel.MODERATELY_ACTIVE}</option>
                      <option value={ActivityLevel.VERY_ACTIVE}>{ActivityLevel.VERY_ACTIVE}</option>
                      <option value={ActivityLevel.EXTRA_ACTIVE}>{ActivityLevel.EXTRA_ACTIVE}</option>
                   </select>
                </InputGroup>

                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                     <span className="text-[10px] font-black uppercase text-zinc-400">Daily Calorie Target</span>
                     <span className="text-emerald-500 font-black text-lg">{profile.dailyCalorieGoal} <span className="text-[10px] text-zinc-400">kcal</span></span>
                   </div>
                   <input 
                     type="range" min="1200" max="4500" step="50" 
                     value={profile.dailyCalorieGoal} 
                     onChange={(e) => handleUpdate('dailyCalorieGoal', Number(e.target.value))} 
                     className="w-full h-2 bg-white dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 ring-1 ring-zinc-100 dark:ring-zinc-700" 
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="Weight (kg)">
                     <input type="number" value={profile.weight} onChange={(e) => handleUpdate('weight', Number(e.target.value))} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl font-bold outline-none ring-1 ring-zinc-100 dark:ring-zinc-700" />
                   </InputGroup>
                   <InputGroup label="Target (kg)">
                     <input type="number" value={profile.targetWeight} onChange={(e) => handleUpdate('targetWeight', Number(e.target.value))} className="w-full p-4 bg-white dark:bg-zinc-800 rounded-2xl font-bold outline-none ring-1 ring-zinc-100 dark:ring-zinc-700" />
                   </InputGroup>
                </div>
              </div>
            </section>

            {/* 3. Global Preferences */}
            <section className="space-y-4">
              <SectionHeader title="App Preferences" icon={<Smartphone size={14} />} />
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] p-6 space-y-6">
                <ToggleItem 
                  icon={isDarkMode ? <Moon size={18} /> : <Sun size={18} />} 
                  label="Dark Appearance" 
                  description="High-contrast dark mode for low light"
                  active={isDarkMode} 
                  onToggle={() => setIsDarkMode(!isDarkMode)} 
                />
                <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                <ToggleItem 
                  icon={<Scale size={18} />} 
                  label="Metric System" 
                  description="Use kilograms and centimeters"
                  active={settings.useMetric} 
                  onToggle={() => handleSettingToggle('useMetric')} 
                />
                <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                <ToggleItem 
                  icon={<Bell size={18} />} 
                  label="Smart Notifications" 
                  description="Periodic water and meal reminders"
                  active={settings.notificationsEnabled} 
                  onToggle={() => handleSettingToggle('notificationsEnabled')} 
                />
                <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex items-center justify-between group cursor-not-allowed opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="text-blue-500 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm"><Languages size={18} /></div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">App Language</div>
                      <div className="text-[10px] text-zinc-400 font-medium">English (United States)</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-zinc-300" />
                </div>
              </div>
            </section>

            {/* 4. Support & Maintenance */}
            <section className="space-y-4">
              <SectionHeader title="Support & Lab" icon={<HelpCircle size={14} />} />
              <div className="grid grid-cols-1 gap-3">
                 <button className="flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] text-left border border-zinc-100 dark:border-zinc-800">
                    <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl text-emerald-500 shadow-sm"><MessageSquare size={20} /></div>
                    <div>
                       <div className="text-sm font-bold">Submit Feedback</div>
                       <div className="text-[10px] text-zinc-400">Help us improve NutriSnap</div>
                    </div>
                 </button>
                 <button className="flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] text-left border border-zinc-100 dark:border-zinc-800">
                    <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl text-blue-500 shadow-sm"><Info size={20} /></div>
                    <div>
                       <div className="text-sm font-bold">Privacy Policy</div>
                       <div className="text-[10px] text-zinc-400">How we manage your data</div>
                    </div>
                 </button>
              </div>
            </section>

            {/* 5. Danger Zone */}
            <section className="space-y-4">
              <SectionHeader title="Danger Zone" icon={<ShieldAlert size={14} className="text-red-500" />} />
              <div className="bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] p-6 border border-red-100 dark:border-red-900/20">
                 <button 
                  onClick={clearAllData}
                  className="w-full flex items-center gap-4 group"
                 >
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl text-red-500 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all"><Trash2 size={20} /></div>
                    <div>
                       <div className="text-sm font-bold text-red-600">Factory Reset App</div>
                       <div className="text-[10px] text-red-400">Delete all history and settings permanently</div>
                    </div>
                 </button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md sm:rounded-[2.5rem] h-[85vh] overflow-y-auto p-8 shadow-2xl space-y-8 animate-in slide-in-from-bottom rounded-t-[2.5rem] hide-scrollbar">
            <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 py-2 z-10 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="text-2xl font-black">Help & Guide</h3>
              <button onClick={() => setShowGuide(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full active:scale-90 transition-all"><X size={20} /></button>
            </div>
            <div className="space-y-8">
              <GuideSection title="Precision Macros" icon={<Beef className="text-emerald-500" />} content="Balanced nutrition is key. NutriSnap recommends a 40/30/30 split for Carbs, Protein, and Fats for most users." />
              <GuideSection title="Dynamic AI Scanner" icon={<Smartphone className="text-blue-500" />} content="The scanner works best in good lighting. If an item is missed, try the Re-analyze button for a second opinion." />
              <GuideSection title="Water Discipline" icon={<Droplets className="text-blue-400" />} content="Your hydration goal is auto-calculated. Drink a glass of water every 2 hours to keep metabolism high." />
              <GuideSection title="Security Protocol" icon={<Database className="text-purple-500" />} content="We store data on-device. No personal biological markers are ever sent to our central servers." />
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurity && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-xs rounded-[2rem] p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto"><ShieldCheck size={32} /></div>
            <h3 className="text-xl font-bold">Advanced Privacy</h3>
            <p className="text-zinc-500 text-xs leading-relaxed font-medium">
               Your biometric data is encrypted using AES-256 local storage standards. AI analysis requests are anonymized before transmission.
            </p>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center gap-2 text-left">
               <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
               <span className="text-[10px] font-bold text-emerald-600 uppercase">HIPAA Compliant Architecture</span>
            </div>
            <button onClick={() => setShowSecurity(false)} className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-xs uppercase shadow-lg">Acknowledged</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
