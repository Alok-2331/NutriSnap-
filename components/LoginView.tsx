
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  User, 
  Target, 
  Scale, 
  Calendar, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Heart, 
  Beef, 
  CheckCircle2, 
  Zap,
  ChevronLeft,
  Stars,
  Loader2
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { UserProfile, Gender, FitnessGoal, ActivityLevel } from '../types';

interface LoginViewProps {
  onComplete: (profile: UserProfile) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0 is Splash, 1 is Name Onboarding
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    weight: 70,
    targetWeight: 65,
    selectedGoal: FitnessGoal.WEIGHT_LOSS,
    gender: Gender.MALE
  });

  const goals = [
    { id: FitnessGoal.WEIGHT_LOSS, label: 'Weight Loss', icon: <TrendingDown size={18} />, description: 'Burn fat & get lean', color: 'bg-orange-500', shadow: 'shadow-orange-500/30' },
    { id: FitnessGoal.WEIGHT_GAIN, label: 'Weight Gain', icon: <TrendingUp size={18} />, description: 'Healthy bulk up', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/30' },
    { id: FitnessGoal.MAINTENANCE, label: 'Maintenance', icon: <Heart size={18} />, description: 'Keep current weight', color: 'bg-blue-500', shadow: 'shadow-blue-500/30' },
    { id: FitnessGoal.MUSCLE_GAIN, label: 'Muscle Gain', icon: <Beef size={18} />, description: 'Strength & power', color: 'bg-purple-500', shadow: 'shadow-purple-500/30' },
  ];

  const estimatedCalories = useMemo(() => {
    const assumedHeight = 170;
    let bmr = (10 * formData.weight) + (6.25 * assumedHeight) - (5 * formData.age);
    bmr = formData.gender === Gender.MALE ? bmr + 5 : bmr - 161;
    let tdee = bmr * 1.55; // Moderately Active multiplier

    if (formData.selectedGoal === FitnessGoal.WEIGHT_LOSS) tdee -= 500;
    if (formData.selectedGoal === FitnessGoal.WEIGHT_GAIN) tdee += 400;
    if (formData.selectedGoal === FitnessGoal.MUSCLE_GAIN) tdee += 200;

    return Math.round(tdee);
  }, [formData]);

  const handleNext = () => {
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => setStep(prev => Math.max(0, prev - 1));

  const handleFinish = () => {
    if (!formData.name) return;

    const profile: UserProfile = {
      name: formData.name,
      age: formData.age,
      weight: formData.weight,
      targetWeight: formData.targetWeight,
      gender: formData.gender, 
      height: 170, // Default assumed height
      goal: formData.selectedGoal,
      activityLevel: ActivityLevel.MODERATELY_ACTIVE,
      dailyCalorieGoal: estimatedCalories
    };

    onComplete(profile);
  };

  const progress = (step / 5) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-700 overflow-hidden relative">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[40%] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-[100px] animate-pulse delay-700" />

      {/* Progress Bar */}
      {step >= 1 && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-zinc-100 dark:bg-zinc-800 z-50">
          <div 
            className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}

      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full relative z-10 pt-12">
        
        {/* Step Navigation Header */}
        {step >= 1 && (
          <div className="flex items-center justify-between mb-8 h-10">
            <button onClick={handleBack} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-zinc-900/50 rounded-full backdrop-blur-sm">
              <ChevronLeft size={24} />
            </button>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-600">Phase {Math.floor(step)} of 5</div>
            <div className="w-10" />
          </div>
        )}

        {/* Splash Step */}
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 bg-emerald-500 rounded-[3rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 rotate-12 relative z-10">
                  <BrandLogo size="lg" className="rotate-0 shadow-none scale-150" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 shadow-xl -rotate-12 z-20">
                  <Sparkles size={24} />
                </div>
              </div>

              <div className="text-center group">
                <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                  Nutri<span className="text-emerald-500">Snap</span>
                </h1>
                <div className="h-1.5 w-16 bg-emerald-500 rounded-full mx-auto mt-2 animate-all duration-1000 group-hover:w-24" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tighter leading-none italic opacity-90">
                Eat <span className="text-emerald-500">Smarter</span>.<br/>
                Live <span className="text-emerald-500">Better</span>.
              </h2>
              <p className="text-zinc-500 font-medium px-8 text-lg">
                Your AI companion for nutrition, health, and a balanced lifestyle.
              </p>
            </div>

            <button 
              onClick={handleNext}
              className="group w-full py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 text-sm"
            >
              Get Started Now <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
        
        {/* Step 1: Name */}
        {step === 1 && (
          <div className="flex-1 space-y-10 py-4 animate-in slide-in-from-right duration-700">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                <User size={32} />
              </div>
              <h2 className="text-4xl font-black tracking-tighter">What's your <br/><span className="text-emerald-500">identity?</span></h2>
              <p className="text-zinc-500 font-medium">To personalize your logs and insights.</p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Full Name</label>
              <div className="relative group">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Alok Pandey"
                  className="w-full px-6 py-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] font-bold text-2xl border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all shadow-inner"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Body Metrics */}
        {step === 2 && (
          <div className="flex-1 space-y-10 py-4 animate-in slide-in-from-right duration-700">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center">
                <Scale size={32} />
              </div>
              <h2 className="text-4xl font-black tracking-tighter">The <span className="text-blue-500">Numbers</span></h2>
              <p className="text-zinc-500 font-medium">We need your current and target metrics.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MetricInput label="Current (kg)" value={formData.weight} onChange={(v) => setFormData({...formData, weight: v})} />
              <MetricInput label="Target (kg)" value={formData.targetWeight} onChange={(v) => setFormData({...formData, targetWeight: v})} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Age</label>
                <span className="text-4xl font-black text-emerald-500 leading-none">{formData.age}</span>
              </div>
              <input 
                type="range" min="15" max="90" 
                className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Gender</label>
              <div className="flex gap-3">
                {[Gender.MALE, Gender.FEMALE].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${formData.gender === g ? 'bg-zinc-900 border-zinc-900 dark:bg-white dark:border-white text-white dark:text-zinc-900 shadow-2xl' : 'bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-100 dark:border-zinc-800'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="flex-1 space-y-8 py-4 animate-in slide-in-from-right duration-700">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter">Your <span className="text-emerald-500">Mission</span></h2>
              <p className="text-zinc-500 font-medium text-sm">Select your primary nutritional objective.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setFormData({ ...formData, selectedGoal: goal.id })}
                  className={`group flex items-center gap-4 p-5 rounded-[2.5rem] border-2 transition-all ${
                    formData.selectedGoal === goal.id 
                    ? `border-emerald-500 bg-white dark:bg-zinc-900 shadow-2xl ${goal.shadow} scale-[1.03]` 
                    : 'border-transparent bg-zinc-50 dark:bg-zinc-900/50 opacity-60'
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${goal.color} text-white group-hover:rotate-12 transition-transform shadow-lg`}>
                    {goal.icon}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-base font-black tracking-tight">{goal.label}</div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{goal.description}</div>
                  </div>
                  {formData.selectedGoal === goal.id && (
                    <div className="p-1 bg-emerald-500 text-white rounded-full">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Final Summary & Launch */}
        {step === 4 && (
          <div className="flex-1 space-y-12 py-4 flex flex-col items-center text-center animate-in slide-in-from-bottom duration-1000">
            <div className="space-y-4">
              <div className="relative">
                <div className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/30 animate-pulse">
                  <Stars size={48} />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 shadow-xl rotate-12">
                  <Zap size={24} />
                </div>
              </div>
              <h2 className="text-4xl font-black tracking-tighter leading-none">Perfectly <span className="text-emerald-500">Calculated</span>.</h2>
              <p className="text-zinc-500 font-medium px-4">We've dialed in your targets for maximum efficiency.</p>
            </div>

            <div className="w-full bg-zinc-900 text-white rounded-[3.5rem] p-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-50" />
              <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:rotate-45 transition-transform duration-1000">
                 <Target size={200} />
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.5em]">
                  <Sparkles size={12} /> Daily Budget
                </div>
                <div className="flex flex-col">
                  <div className="text-7xl font-black tabular-nums tracking-tighter drop-shadow-lg">{estimatedCalories.toLocaleString()}</div>
                  <div className="text-zinc-400 font-black uppercase tracking-[0.2em] text-xs">kilocalories</div>
                </div>
                
                <div className="pt-4 flex justify-center gap-6">
                   <MiniMacro label="Prot" val="150g" />
                   <div className="w-px h-8 bg-white/10" />
                   <MiniMacro label="Carb" val="220g" />
                   <div className="w-px h-8 bg-white/10" />
                   <MiniMacro label="Fat" val="70g" />
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-[2.5rem] w-full border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-5">
              <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={24} />
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">System Optimized</div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium leading-relaxed">
                  Calculated using NutriSnap's AI dynamic baseline algorithm.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {step >= 1 && (
          <div className="pt-10 sticky bottom-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-4">
            <button 
              onClick={step === 4 ? handleFinish : handleNext}
              disabled={step === 1 && !formData.name}
              className={`group w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 text-sm ${
                step === 4 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 disabled:opacity-20'
              }`}
            >
              {step === 4 ? 'Launch Experience' : 'Continue'} 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const MetricInput = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">{label}</label>
    <div className="relative">
      <input 
        type="number" 
        className="w-full p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] font-black text-3xl text-center outline-none border-2 border-transparent focus:border-blue-500/50 shadow-inner transition-all"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  </div>
);

const MiniMacro = ({ label, val }: { label: string; val: string }) => (
  <div className="text-center">
    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{label}</div>
    <div className="text-xs font-black">{val}</div>
  </div>
);

export default LoginView;
