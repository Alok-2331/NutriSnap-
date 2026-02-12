
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  BarChart3, 
  User, 
  Calculator, 
  Moon, 
  Sun,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import FoodScanner from './components/FoodScanner';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import BMICalculator from './components/BMICalculator';
import DietPlanGenerator from './components/DietPlanGenerator';
import LoginView from './components/LoginView';
import BrandLogo from './components/BrandLogo';
import ChatBot from './components/ChatBot';
import { AppState, LogEntry, UserProfile, AppSettings, FavoriteItem, ChatMessage } from './types';
import { DEFAULT_PROFILE } from './constants';

const DeveloperFooter: React.FC = () => (
  <footer className="py-12 text-center mt-auto">
    <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800 mx-auto mb-4 opacity-50" />
    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300 dark:text-zinc-700">
      Developer <span className="text-emerald-500/50">Alok Pandey</span>
    </p>
  </footer>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'stats' | 'profile' | 'bmi' | 'plan' | 'chat'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('nutrisnap_theme');
    return saved ? saved === 'dark' : false;
  });

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('nutrisnap_state');
    if (saved) return JSON.parse(saved);
    return {
      profile: DEFAULT_PROFILE,
      waterIntake: 0,
      foodLogs: [],
      favorites: [],
      chatHistory: [],
      settings: {
        useMetric: true,
        notificationsEnabled: true
      },
      hasOnboarded: false
    };
  });

  useEffect(() => {
    localStorage.setItem('nutrisnap_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('nutrisnap_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addFoodLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newEntry: LogEntry = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setState(prev => ({
      ...prev,
      foodLogs: [newEntry, ...prev.foodLogs]
    }));
  };

  const addFavorite = (item: Omit<FavoriteItem, 'id'>) => {
    const newFav: FavoriteItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    setState(prev => ({
      ...prev,
      favorites: [newFav, ...prev.favorites]
    }));
  };

  const removeFavorite = (id: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.filter(f => f.id !== id)
    }));
  };

  const updateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const updateSettings = (settings: AppSettings) => {
    setState(prev => ({ ...prev, settings }));
  };

  const updateChatHistory = (chatHistory: ChatMessage[]) => {
    setState(prev => ({ ...prev, chatHistory }));
  };

  const clearChatHistory = () => {
    setState(prev => ({ ...prev, chatHistory: [] }));
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setState(prev => ({
      ...prev,
      profile,
      hasOnboarded: true
    }));
  };

  const updateWater = (amount: number) => {
    setState(prev => ({ ...prev, waterIntake: Math.max(0, prev.waterIntake + amount) }));
  };

  const handleLogout = () => {
    // No window.confirm needed here as it's triggered from a custom UI modal
    localStorage.removeItem('nutrisnap_state');
    // Reset state to initial to force LoginView to appear
    setState({
      profile: DEFAULT_PROFILE,
      waterIntake: 0,
      foodLogs: [],
      favorites: [],
      chatHistory: [],
      settings: {
        useMetric: true,
        notificationsEnabled: true
      },
      hasOnboarded: false
    });
    setActiveTab('dashboard');
  };

  if (!state.hasOnboarded) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-white dark:bg-zinc-950 flex flex-col">
         <div className="flex-1">
           <LoginView onComplete={handleOnboardingComplete} />
         </div>
         <DeveloperFooter />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            state={state} 
            onUpdateWater={updateWater} 
            onNavigate={(tab: any) => setActiveTab(tab)} 
            onLogFood={addFoodLog}
            onRemoveFavorite={removeFavorite}
          />
        );
      case 'scan':
        return (
          <FoodScanner 
            profile={state.profile} 
            onLogFood={addFoodLog} 
            onAddFavorite={addFavorite}
            favorites={state.favorites}
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      case 'stats':
        return <StatsView logs={state.foodLogs} calorieGoal={state.profile.dailyCalorieGoal} />;
      case 'chat':
        return (
          <ChatBot 
            profile={state.profile} 
            history={state.chatHistory} 
            onUpdateHistory={updateChatHistory}
            onClearHistory={clearChatHistory}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            state={state} 
            onUpdateProfile={updateProfile} 
            onUpdateSettings={updateSettings} 
            onLogout={handleLogout} 
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        );
      case 'bmi':
        return <BMICalculator profile={state.profile} onBack={() => setActiveTab('dashboard')} />;
      case 'plan':
        return <DietPlanGenerator profile={state.profile} onBack={() => setActiveTab('dashboard')} />;
      default:
        return (
          <Dashboard 
            state={state} 
            onUpdateWater={updateWater} 
            onNavigate={(tab: any) => setActiveTab(tab)} 
            onLogFood={addFoodLog}
            onRemoveFavorite={removeFavorite}
          />
        );
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto relative overflow-x-hidden transition-colors duration-300 bg-gray-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-emerald-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          {activeTab !== 'dashboard' ? (
             <button onClick={() => setActiveTab('dashboard')} className="p-1 hover:bg-emerald-50 dark:hover:bg-zinc-800 rounded-full transition-colors">
               <ArrowLeft size={20} className="text-emerald-600" />
             </button>
          ) : (
            <BrandLogo size="sm" className="rotate-0 shadow-none" />
          )}
          <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 uppercase italic">NutriSnap <span className="text-zinc-400 not-italic lowercase">AI</span></h1>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 bg-emerald-50 dark:bg-zinc-800 rounded-full text-emerald-600 dark:text-emerald-400 transition-all hover:scale-110 active:scale-95 shadow-sm"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="p-4 animate-in fade-in duration-500 min-h-[calc(100vh-140px)] flex flex-col">
        <div className="flex-1">
          {renderContent()}
        </div>
        <DeveloperFooter />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 px-4 py-4 flex justify-between items-center shadow-2xl">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={22} />} label="Home" />
        <NavButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<BarChart3 size={22} />} label="Stats" />
        
        <button 
          onClick={() => setActiveTab('scan')}
          className={`-translate-y-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${activeTab === 'scan' ? 'bg-emerald-600' : 'bg-emerald-500'} text-white ring-4 ring-white dark:ring-zinc-900`}
        >
          <Camera size={24} />
        </button>

        <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={22} />} label="Chat" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={22} />} label="Profile" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-emerald-600' : 'text-zinc-400 hover:text-emerald-400'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
