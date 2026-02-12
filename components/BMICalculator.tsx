
import React, { useMemo } from 'react';
import { UserProfile } from '../types';
import { Calculator, ArrowLeft } from 'lucide-react';

interface BMICalculatorProps {
  profile: UserProfile;
  onBack: () => void;
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ profile, onBack }) => {
  const bmi = useMemo(() => {
    const heightM = profile.height / 100;
    return profile.weight / (heightM * heightM);
  }, [profile.weight, profile.height]);

  const getStatus = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10', info: 'Consider increasing calorie intake with nutrient-dense foods.' };
    if (val < 25) return { label: 'Healthy Weight', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10', info: 'Great job! Maintain your current balanced diet and exercise.' };
    if (val < 30) return { label: 'Overweight', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10', info: 'Try to incorporate more fiber and cardiovascular activity.' };
    return { label: 'Obesity', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10', info: 'Consult with a health professional for a tailored plan.' };
  };

  const status = getStatus(bmi);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
            <Calculator size={40} />
        </div>
        <h2 className="text-2xl font-bold">BMI Calculator</h2>
        <p className="text-zinc-500 text-sm">Body Mass Index provides an estimate of body fat.</p>
      </section>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl flex flex-col items-center text-center space-y-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-100 dark:text-zinc-800" />
                <circle 
                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    className={status.color.replace('text', 'stroke')}
                    strokeDasharray={439.8}
                    strokeDashoffset={439.8 - (439.8 * Math.min(100, (bmi/40)*100)) / 100}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black">{bmi.toFixed(1)}</span>
                <span className="text-[10px] uppercase font-bold text-zinc-400">Index</span>
            </div>
          </div>

          <div className={`px-6 py-2 rounded-2xl ${status.bg} ${status.color} font-black text-lg`}>
              {status.label}
          </div>

          <div className="text-sm text-zinc-500 leading-relaxed italic">
              "{status.info}"
          </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-4">
          <h4 className="font-bold">Metric Breakdown</h4>
          <div className="space-y-2">
            <BreakdownRow label="Weight" value={`${profile.weight} kg`} />
            <BreakdownRow label="Height" value={`${profile.height} cm`} />
            <BreakdownRow label="Age" value={`${profile.age} years`} />
          </div>
          <p className="text-[10px] text-zinc-400 leading-tight">BMI does not directly measure body fat, but it correlates with more direct measures of body fat. It is a tool for screening.</p>
      </div>

      <button onClick={onBack} className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold shadow-lg shadow-zinc-900/20 active:scale-95 transition-all">
          Done
      </button>
    </div>
  );
};

const BreakdownRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-zinc-400 font-medium">{label}</span>
        <span className="font-bold">{value}</span>
    </div>
);

export default BMICalculator;
