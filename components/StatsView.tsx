
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LogEntry } from '../types';

interface StatsViewProps {
  logs: LogEntry[];
  calorieGoal: number;
}

const StatsView: React.FC<StatsViewProps> = ({ logs, calorieGoal }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    return d;
  }).reverse();

  const chartData = last7Days.map(date => {
    const dailyLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      logDate.setHours(0,0,0,0);
      return logDate.getTime() === date.getTime();
    });
    return {
      name: date.toLocaleDateString([], { weekday: 'short' }),
      intake: dailyLogs.reduce((sum, log) => sum + log.calories, 0),
      goal: calorieGoal
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <section>
        <h2 className="text-2xl font-bold">Weekly Performance</h2>
        <p className="text-zinc-500 text-sm">Review your consistency over the last 7 days.</p>
      </section>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-sm">Intake vs Goal</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Intake</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Goal</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: 'white'
                }}
                itemStyle={{ padding: '2px 0' }}
                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area 
                type="monotone" 
                dataKey="goal" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorGoal)" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="intake" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIntake)" 
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Avg Daily Cal" value={Math.round(chartData.reduce((s, d) => s + d.intake, 0) / 7).toLocaleString()} trend="+12%" />
        <StatCard label="Goal Adherence" value={`${Math.round((chartData.filter(d => d.intake <= d.goal && d.intake > 0).length / Math.max(1, chartData.filter(d => d.intake > 0).length)) * 100)}%`} trend="Stable" />
      </div>

      <section className="space-y-4">
        <h3 className="font-bold">Detailed History</h3>
        <div className="space-y-3">
            {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-all hover:scale-[1.01]">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                        {log.image ? <img src={log.image} alt={log.foodName} className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-sm capitalize">{log.foodName}</div>
                        <div className="text-[10px] text-zinc-400 font-semibold">
                            {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-black text-emerald-600">+{log.calories}</div>
                        <div className="text-[8px] text-zinc-400 font-bold uppercase">kcal</div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-zinc-400 text-sm font-medium">No meals logged in your history yet.</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; trend: string }> = ({ label, value, trend }) => (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-xl font-black">{value}</div>
        <div className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          {trend}
        </div>
    </div>
);

export default StatsView;
