
import React from 'react';
// Added X to the import list from lucide-react
import { Droplets, Flame, Beef, Salad, BookOpen, Calculator, Target, TrendingDown, TrendingUp, Sparkles, Clock, User, Ruler, Calendar, Heart, Trash2, Plus, X, MessageSquare } from 'lucide-react';
import { AppState, FavoriteItem, LogEntry } from '../types';
import { WATER_GOAL, WATER_STEP } from '../constants';

interface DashboardProps {
  state: AppState;
  onUpdateWater: (amount: number) => void;
  onNavigate: (tab: string) => void;
  onLogFood: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  onRemoveFavorite: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onUpdateWater, onNavigate, onLogFood, onRemoveFavorite }) => {
  const { profile, favorites } = state;
  const today = new Date().setHours(0,0,0,0);
  const todayLogs = state.foodLogs.filter(log => new Date(log.timestamp).setHours(0,0,0,0) === today);
  
  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = todayLogs.reduce((sum, log) => sum + (log.protein || 0), 0);
  const totalCarbs = todayLogs.reduce((sum, log) => sum + (log.carbs || 0), 0);

  const caloriePercentage = Math.min(100, (totalCalories / profile.dailyCalorieGoal) * 100);
  const waterPercentage = Math.min(100, (state.waterIntake / WATER_GOAL) * 100);
  const caloriesRemaining = Math.max(0, profile.dailyCalorieGoal - totalCalories);

  // BMI Calculation
  const heightInMeters = profile.height / 100;
  const bmi = (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);

  const handleQuickLog = (fav: FavoriteItem) => {
    onLogFood({
      foodName: fav.name,
      calories: fav.calories,
      protein: fav.protein,
      carbs: fav.carbs,
      fats: fav.fats
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Profile Summary */}
      <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black">Hi, {profile.name}!</h2>
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-md">{profile.goal}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Heart size={10} className="text-red-500" /> BMI: {bmi}</span>
            </div>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatPill icon={<Calendar size={14} />} label="Age" value={`${profile.age}`} />
          <StatPill icon={<Ruler size={14} />} label="Height" value={`${profile.height}cm`} />
          <StatPill icon={<Calculator size={14} />} label="Goal" value={`${profile.targetWeight}kg`} />
        </div>
      </section>

      {/* Main Energy Tracker */}
      <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
          <Flame size={120} />
        </div>
        
        <div className="flex items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-tighter text-xs">
              <Flame size={16} />
              <span>Energy Status</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-4xl font-black">{totalCalories.toLocaleString()}</div>
              <div className="text-zinc-400 text-sm font-medium">of {profile.dailyCalorieGoal.toLocaleString()} kcal</div>
            </div>

            <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl w-fit">
              <span className="font-black text-sm">{caloriesRemaining.toLocaleString()} kcal</span>
              <span className="opacity-80 text-xs ml-1">left</span>
            </div>
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
                  <circle 
                      cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      className="text-orange-500"
                      strokeDasharray={314.15}
                      strokeDashoffset={314.15 - (314.15 * caloriePercentage) / 100}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                  />
              </svg>
              <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black">{Math.round(caloriePercentage)}%</span>
              </div>
          </div>
        </div>
      </div>

      {/* Favorites / Quick Log */}
      {favorites.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400 ml-1">Quick Log Favorites</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {favorites.map(fav => (
              <div key={fav.id} className="relative shrink-0 group">
                <button 
                  onClick={() => handleQuickLog(fav)}
                  className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] shadow-sm active:scale-95 transition-all w-32"
                >
                  <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-black truncate w-24 capitalize">{fav.name}</div>
                    <div className="text-[9px] text-zinc-400 font-bold">{fav.calories} kcal</div>
                  </div>
                  <div className="p-1 bg-emerald-500 text-white rounded-full">
                    <Plus size={10} />
                  </div>
                </button>
                <button 
                  onClick={() => onRemoveFavorite(fav.id)}
                  className="absolute -top-1 -right-1 p-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full hover:text-red-500 transition-colors"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lab Shortcuts */}
      <section className="space-y-3">
        <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400 ml-1">AI Health Lab</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => onNavigate('plan')}
            className="flex flex-col items-center gap-2 p-4 bg-emerald-500 text-white rounded-[2rem] shadow-lg shadow-emerald-500/10 active:scale-95 transition-all"
          >
            <BookOpen size={20} />
            <div className="text-center">
              <div className="text-[10px] font-black">Plan</div>
            </div>
          </button>
          <button 
            onClick={() => onNavigate('chat')}
            className="flex flex-col items-center gap-2 p-4 bg-zinc-900 text-white rounded-[2rem] shadow-lg active:scale-95 transition-all"
          >
            <MessageSquare size={20} className="text-emerald-400" />
            <div className="text-center">
              <div className="text-[10px] font-black">AI Chat</div>
            </div>
          </button>
          <button 
            onClick={() => onNavigate('bmi')}
            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-700 rounded-[2rem] shadow-sm active:scale-95 transition-all"
          >
            <Calculator size={20} />
            <div className="text-center">
              <div className="text-[10px] font-black">BMI</div>
            </div>
          </button>
        </div>
      </section>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="p-2 w-fit bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-500">
            <Target size={20} />
          </div>
          <div>
            <div className="text-sm font-black">{profile.weight} kg</div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Weight</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-500">
              <Droplets size={20} />
            </div>
            <span className="text-[10px] font-black text-blue-500">{Math.round(waterPercentage)}%</span>
          </div>
          <div>
            <div className="text-lg font-black">{state.waterIntake} <span className="text-xs text-zinc-400">ml</span></div>
            <button 
              onClick={() => onUpdateWater(WATER_STEP)}
              className="mt-1 w-full bg-blue-500 text-white py-1 rounded-xl text-[10px] font-black active:scale-95 transition-all shadow-lg shadow-blue-500/10"
            >
              + {WATER_STEP}ml
            </button>
          </div>
        </div>
      </div>

      {/* Recent History */}
      <section className="space-y-3 pb-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400">Today's Meals</h3>
            <button onClick={() => onNavigate('stats')} className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">See All</button>
        </div>
        {todayLogs.length === 0 ? (
          <div className="p-10 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest">
            No meals logged.
          </div>
        ) : (
          <div className="space-y-2">
            {todayLogs.slice(0, 3).map(log => (
              <div key={log.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl flex items-center justify-between border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl overflow-hidden shadow-inner">
                        {log.image ? <img src={log.image} className="w-full h-full object-cover" /> : <Salad className="m-auto text-emerald-600 h-full p-2" />}
                    </div>
                    <div>
                        <div className="font-bold text-sm capitalize">{log.foodName}</div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>
                <div className="text-sm font-black text-emerald-600">+{log.calories} kcal</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatPill = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 flex flex-col items-center text-center">
    <div className="text-emerald-500 mb-1">{icon}</div>
    <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{label}</div>
    <div className="text-sm font-black">{value}</div>
  </div>
);

export default Dashboard;
