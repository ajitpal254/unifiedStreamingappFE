"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const COUNTRIES = [
  { id: "US", name: "United States", flag: "🇺🇸" },
  { id: "CA", name: "Canada", flag: "🇨🇦" },
  { id: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { id: "AU", name: "Australia", flag: "🇦🇺" },
];

const PROVIDERS = [
  { id: "netflix", name: "Netflix", color: "bg-red-600" },
  { id: "prime", name: "Prime Video", color: "bg-blue-500" },
  { id: "disney", name: "Disney+", color: "bg-indigo-600" },
  { id: "hulu", name: "Hulu", color: "bg-green-500" },
  { id: "max", name: "Max", color: "bg-purple-600" },
  { id: "youtube", name: "YouTube", color: "bg-red-500" },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("US");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const toggleProvider = (id: string) => {
    setSelectedProviders((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    // Save to user preferences here
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-12">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-bold mb-4">Where are you watching?</h1>
            <p className="text-zinc-400 mb-8 text-lg">
              We need your country to show accurate streaming availability.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCountry(c.id)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-105 active:scale-95 ${
                    country === c.id
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-4xl mb-2 block">{c.flag}</span>
                  <span className="text-lg font-medium">{c.name}</span>
                </button>
              ))}
            </div>
            <Button 
              onClick={() => setStep(2)}
              className="w-full h-14 text-lg bg-white text-zinc-950 hover:bg-zinc-200 rounded-full cursor-pointer"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h1 className="text-4xl font-bold mb-4">What do you subscribe to?</h1>
            <p className="text-zinc-400 mb-8 text-lg">
              Select the services you already pay for to personalize your recommendations.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {PROVIDERS.map((p) => {
                const isSelected = selectedProviders.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProvider(p.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 overflow-hidden group ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                    }`}
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full ${p.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                    <span className="text-lg font-semibold block mt-2 text-left">{p.name}</span>
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-emerald-500">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => setStep(1)}
                variant="ghost"
                className="h-14 px-8 text-lg hover:bg-zinc-800 rounded-full cursor-pointer"
              >
                Back
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex-1 h-14 text-lg bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] cursor-pointer"
              >
                Let's go
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
