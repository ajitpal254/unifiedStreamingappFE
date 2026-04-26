"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { 
  Check, 
  Plus, 
  ChevronRight, 
  Globe, 
  Tv, 
  Sparkles,
  Loader2
} from "lucide-react";

const REGIONS = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
];

const PROVIDERS = [
  "Netflix", "Prime Video", "Disney+", "Hulu", "HBO Max", "Apple TV+", "Paramount+", "Peacock"
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [region, setRegion] = useState("US");
  const [mySubs, setMySubs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleProvider = (name: string) => {
    setMySubs(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

  const finishOnboarding = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      
      // 1. Save Region
      await fetch(`${API_URL}/api/me`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ region })
      });

      // 2. Save Providers
      await fetch(`${API_URL}/api/providers`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ providers: mySubs })
      });

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? "bg-emerald-500" : "bg-zinc-800"}`} 
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mb-6">
                <Globe size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Where are you?</h1>
              <p className="text-zinc-400 text-lg">We use your location to find the right streaming links for your region.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REGIONS.map(r => (
                <button
                  key={r.code}
                  onClick={() => setRegion(r.code)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    region === r.code ? "bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <p className={`font-bold text-lg ${region === r.code ? "text-emerald-400" : "text-zinc-300"}`}>{r.name}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{r.code}</p>
                </button>
              ))}
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-white text-black h-16 rounded-full font-black uppercase italic text-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-95"
            >
              Continue <ChevronRight size={24} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mb-6">
                <Tv size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Your Services</h1>
              <p className="text-zinc-400 text-lg">Select the services you pay for to get personalized recommendations.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PROVIDERS.map(name => {
                const isActive = mySubs.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleProvider(name)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      isActive ? "bg-emerald-500/10 border-emerald-500" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isActive ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 text-zinc-500"}`}>
                      {isActive ? <Check size={20} /> : <Plus size={20} />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tighter text-center ${isActive ? "text-emerald-400" : "text-zinc-500"}`}>{name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-zinc-900 text-zinc-400 h-16 rounded-full font-bold uppercase text-sm hover:bg-zinc-800">Back</button>
              <button 
                onClick={() => setStep(3)}
                className="flex-[2] bg-white text-black h-16 rounded-full font-black uppercase italic text-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-xl"
              >
                Almost Done <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-10 animate-in zoom-in-95 duration-500">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-zinc-950 mx-auto shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                <Sparkles size={48} />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Ready for Action</h1>
              <p className="text-zinc-400 text-xl max-w-md mx-auto">We&apos;ve tailored your dashboard with your region and {mySubs.length} services.</p>
            </div>

            <button 
              onClick={finishOnboarding}
              disabled={loading}
              className="w-full bg-emerald-500 text-zinc-950 h-20 rounded-full font-black uppercase italic text-2xl flex items-center justify-center gap-3 hover:bg-emerald-400 hover:scale-[1.03] transition-all shadow-2xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={32} /> : "Enter the Hub"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
