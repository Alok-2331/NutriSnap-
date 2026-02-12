
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, X, ChevronRight, Share2, Droplets, RefreshCcw, Lightbulb, Info, Pill, CircleDot, ShieldCheck, ShieldAlert, HeartPulse, Clock, Scale, Zap, Image as ImageIcon, Heart, PartyPopper, Sparkles } from 'lucide-react';
import { analyzeFoodImage } from '../geminiService';
import { UserProfile, NutritionData, LogEntry, NutrientInfo, FavoriteItem } from '../types';

interface FoodScannerProps {
  profile: UserProfile;
  onLogFood: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  onAddFavorite: (item: Omit<FavoriteItem, 'id'>) => void;
  favorites: FavoriteItem[];
  onBack: () => void;
}

const FoodScanner: React.FC<FoodScannerProps> = ({ profile, onLogFood, onAddFavorite, favorites, onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [justFavorited, setJustFavorited] = useState(false);
  const [isLoggedSuccess, setIsLoggedSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Effect to handle video stream attachment once the video element is rendered
  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(newStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check your browser permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
        analyze(dataUrl);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);
        if (isCameraOpen) stopCamera();
        analyze(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async (base64Image: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeFoodImage(base64Image.split(',')[1], profile);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. We couldn't recognize the food. Try a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFavorite = () => {
    if (result) {
      onAddFavorite({
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fats: result.fats
      });
      setJustFavorited(true);
      setTimeout(() => setJustFavorited(false), 2000);
    }
  };

  const isAlreadyFavorite = result ? favorites.some(f => f.name.toLowerCase() === result.name.toLowerCase()) : false;

  const handleShare = async () => {
    if (!result) return;
    const shareText = `Check out my NutriSnap AI analysis for ${result.name}!\n` +
      `🔥 Calories: ${result.calories} kcal\n` +
      `💪 Protein: ${result.protein}g\n` +
      `🥖 Carbs: ${result.carbs}g\n` +
      `🥑 Fats: ${result.fats}g`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `NutriSnap: ${result.name}`, text: shareText });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Nutrition info copied!");
    }
  };

  const confirmLog = () => {
    if (result) {
      setShowConfirmModal(false);
      setIsLoggedSuccess(true);
      
      // Complete the log callback after showing animation
      onLogFood({
        foodName: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fats: result.fats,
        image: image || undefined
      });

      // Delay to show the success message before going back
      setTimeout(() => {
        onBack();
      }, 1800);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setShowConfirmModal(false);
    setIsLoggedSuccess(false);
    stopCamera();
  };

  if (isLoggedSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6 overflow-hidden">
        {/* Animated Background Confetti Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={`absolute w-2 h-2 rounded-full bg-emerald-500/40 animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative group">
          <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 animate-in zoom-in-50 duration-500">
            <CheckCircle2 size={56} className="animate-in slide-in-from-bottom-2 duration-300" />
          </div>
          <div className="absolute -top-6 -right-6 text-emerald-400 animate-bounce">
            <PartyPopper size={40} />
          </div>
          <div className="absolute -bottom-4 -left-6 text-emerald-500 animate-pulse">
            <Sparkles size={24} />
          </div>
        </div>

        <div className="mt-10 text-center space-y-3 animate-in slide-in-from-bottom duration-500 delay-100">
          <h2 className="text-4xl font-black tracking-tight">Logged!</h2>
          <div className="flex flex-col items-center">
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em] mb-1">Nutrition Captured</p>
            <div className="h-1 w-12 bg-emerald-500 rounded-full animate-all duration-1000 w-24" />
          </div>
          <p className="text-zinc-400 text-xs font-medium pt-2 max-w-[200px] mx-auto leading-relaxed">
            Your daily dashboard is being updated with your latest scan.
          </p>
        </div>
      </div>
    );
  }

  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-6">
        <div className="w-full flex justify-between items-center text-white">
          <button onClick={stopCamera} className="p-2 bg-white/10 rounded-full active:scale-90 transition-all"><X size={24} /></button>
          <span className="font-bold text-xs tracking-[0.3em] uppercase opacity-70">Live AI Scanner</span>
          <div className="w-10" />
        </div>
        
        <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-8 border-2 border-emerald-500/30 rounded-3xl pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl" />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Center food in frame</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-around pb-12">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all border border-white/20"
          >
            <ImageIcon size={20} />
          </button>

          <button onClick={takePhoto} className="w-20 h-20 rounded-full bg-white border-4 border-zinc-800 p-1 active:scale-95 transition-all">
            <div className="w-full h-full rounded-full border-2 border-zinc-300 bg-white" />
          </button>

          <div className="w-12" />
        </div>
        
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-pulse">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-500/20 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
            <Zap size={24} className="animate-bounce" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="font-black text-xl tracking-tight">AI Thinking...</p>
          <p className="text-zinc-400 text-xs font-medium px-12 leading-relaxed">Identifying nutrients and health impact. This usually takes 2-3 seconds.</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-6 pb-8 animate-in slide-in-from-bottom duration-500">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black capitalize">{result.name}</h2>
            <div className="flex gap-2">
                <button 
                  onClick={handleFavorite} 
                  disabled={isAlreadyFavorite || justFavorited}
                  className={`p-2 rounded-full active:scale-90 transition-all ${isAlreadyFavorite || justFavorited ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-red-50 dark:bg-red-900/30 text-red-600'}`}
                >
                    <Heart size={20} fill={(isAlreadyFavorite || justFavorited) ? "currentColor" : "none"} />
                </button>
                <button onClick={handleShare} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full active:scale-90 transition-all">
                    <Share2 size={20} />
                </button>
                <button 
                  onClick={() => image && analyze(image)}
                  title="Re-analyze Image"
                  className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full active:scale-90 transition-all"
                >
                    <RefreshCcw size={20} />
                </button>
                <button onClick={reset} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full active:scale-90 transition-all">
                    <X size={20} />
                </button>
            </div>
        </div>

        {justFavorited && (
          <div className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl text-center animate-in zoom-in-95 flex items-center justify-center gap-2">
            <Heart size={12} fill="white" /> Added to Favorites!
          </div>
        )}

        <div className="relative h-60 w-full rounded-[2.5rem] overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800">
            {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Camera size={48} /></div>}
            <div className="absolute top-4 left-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <ShieldCheck size={14} /> AI Verified
            </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-6">
            <div className="flex justify-between items-end border-b dark:border-zinc-800 pb-4">
                <div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-black">Energy</div>
                    <div className="text-4xl font-black">{result.calories} <span className="text-xl font-normal text-zinc-400">kcal</span></div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5 ${result.healthAdvice.isHealthy ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {result.healthAdvice.isHealthy ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    {result.healthAdvice.isHealthy ? 'Healthy' : 'Caution'}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
                <MacroPill label="Prot" value={`${result.protein}g`} color="bg-emerald-500" />
                <MacroPill label="Carbs" value={`${result.carbs}g`} color="bg-yellow-500" />
                <MacroPill label="Fats" value={`${result.fats}g`} color="bg-orange-500" />
                <MacroPill label="Fiber" value={`${result.fiber}g`} color="bg-blue-500" />
            </div>
        </div>

        {(result.vitamins.length > 0 || result.minerals.length > 0) && (
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-zinc-100 dark:border-zinc-800 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                <Zap size={18} className="text-yellow-500" /> Vitamins & Minerals
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[...result.vitamins, ...result.minerals].map((nutrient, idx) => (
                <NutrientCard key={idx} nutrient={nutrient} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-zinc-100 dark:border-zinc-800 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                <HeartPulse size={18} className="text-emerald-500" /> Health Advice
            </div>
            
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic">"{result.healthAdvice.reasoning}"</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                  <Clock size={20} className="shrink-0" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Best Time</div>
                    <div className="text-sm font-bold">{result.healthAdvice.bestTimeToEat}</div>
                  </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20">
                  <Scale size={20} className="shrink-0" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Portion</div>
                    <div className="text-sm font-bold">{result.healthAdvice.portionRecommendation}</div>
                  </div>
              </div>
            </div>
        </div>

        <div className="flex gap-4 pt-4 sticky bottom-4">
            <button onClick={reset} className="flex-1 bg-white dark:bg-zinc-800 py-4 rounded-2xl font-black text-xs text-zinc-400 border border-zinc-100 dark:border-zinc-700 active:scale-95 transition-all">Discard</button>
            <button onClick={() => setShowConfirmModal(true)} className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Log Meal</button>
        </div>

        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-xs rounded-[2rem] p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={32} /></div>
              <h3 className="text-xl font-bold">Add to log?</h3>
              <p className="text-zinc-500 text-xs">Confirm addition of <span className="font-bold text-zinc-900 dark:text-zinc-100">{result.name}</span> to your history.</p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmLog} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase shadow-lg active:scale-95 transition-all">Confirm</button>
                <button onClick={() => setShowConfirmModal(false)} className="w-full py-2 text-zinc-400 font-bold text-xs uppercase">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 py-10 text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/20 rotate-3">
        <Camera size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight">Food Scanner</h2>
        <p className="text-zinc-500 text-xs px-12 leading-relaxed">Capture any meal for an instant breakdown of calories, macros, and AI-powered health advice.</p>
      </div>

      {error && (
        <div className="mx-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3 text-left">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <p className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase leading-tight">{error}</p>
        </div>
      )}

      <div className="space-y-4 px-4">
        <button 
          onClick={startCamera} 
          className="group w-full flex items-center justify-center gap-3 p-6 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          <Camera size={24} className="group-hover:rotate-12 transition-transform" /> 
          Open Camera
        </button>
        
        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">or</span>
          <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="w-full flex items-center justify-center gap-3 p-5 bg-white dark:bg-zinc-900 text-zinc-500 rounded-[2rem] font-black uppercase tracking-widest shadow-sm border border-zinc-100 dark:border-zinc-800 active:scale-95 transition-all"
        >
          <ImageIcon size={20} className="text-emerald-500" /> 
          Access Photos
        </button>
        
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      </div>
      
      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl mx-6 border border-emerald-100 dark:border-emerald-800/30">
        <div className="flex gap-3 text-left">
          <Info size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium leading-normal">
            Our AI analysis is most accurate when the food is clearly visible and well-lit. Multiple items are supported!
          </p>
        </div>
      </div>
    </div>
  );
};

const MacroPill: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="flex flex-col items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
        <div className={`w-1.5 h-1.5 rounded-full ${color} mb-1.5`} />
        <div className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">{label}</div>
        <div className="text-xs font-black">{value}</div>
    </div>
);

const NutrientCard: React.FC<{ nutrient: NutrientInfo }> = ({ nutrient }) => {
  const isHigh = nutrient.percent >= 20;
  return (
    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-1.5">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate max-w-[80px]">{nutrient.name}</span>
        {isHigh && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" title="High source" />}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{nutrient.percent}%</span>
        <span className="text-[8px] text-zinc-400 font-bold uppercase mb-0.5">DV</span>
      </div>
      <div className="h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${isHigh ? 'bg-emerald-500' : 'bg-emerald-400'}`} 
          style={{ width: `${Math.min(100, nutrient.percent)}%` }} 
        />
      </div>
    </div>
  );
};

export default FoodScanner;
