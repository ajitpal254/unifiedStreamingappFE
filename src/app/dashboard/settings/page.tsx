"use client";

import { UserProfile, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Check, Plus, Loader2 } from "lucide-react";

const POPULAR_PROVIDERS = [
  "Netflix", "Prime Video", "Disney+", "Hulu", "HBO Max", "Apple TV+", "Paramount+", "Peacock", "YouTube TV", "Discovery+"
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface UserProvider {
  provider: string;
}

interface MeResponse {
  providers?: UserProvider[];
  region?: string;
}

export default function ProfilePage() {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "subs" | "region">("profile");
  const [mySubs, setMySubs] = useState<string[]>([]);
  const [region, setRegion] = useState("US");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data: MeResponse = await res.json();
        setMySubs(data.providers?.map((p) => p.provider) || []);
        setRegion(data.region || "US");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [getToken]);

  const updateRegion = async (newRegion: string) => {
    setRegion(newRegion);
    setSaving(true);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/me`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ region: newRegion })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const toggleProvider = async (name: string) => {
    const newSubs = mySubs.includes(name) 
      ? mySubs.filter(s => s !== name)
      : [...mySubs, name];
    
    setMySubs(newSubs);
    setSaving(true);

    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/providers`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ providers: newSubs })
      });
    } catch (e) {
      console.error("Failed to save providers", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 md:p-12 pb-24 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 italic uppercase">Settings</h1>
        <p className="text-zinc-400 text-lg">Manage your profile and streaming subscriptions.</p>
      </div>

      {/* Custom Tabs */}
      <div className="flex gap-4 mb-8 border-b border-zinc-900 pb-4 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === "profile" ? "bg-emerald-500 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Account Profile
        </button>
        <button 
          onClick={() => setActiveTab("subs")}
          className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === "subs" ? "bg-emerald-500 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          My Subscriptions
        </button>
        <button 
          onClick={() => setActiveTab("region")}
          className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === "region" ? "bg-emerald-500 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Home Region
          {saving && <Loader2 size={14} className="animate-spin text-emerald-400" />}
        </button>
      </div>

      {activeTab === "profile" ? (
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl w-full",
              navbar: "hidden", // We use our own tabs
              pageScrollBox: "bg-zinc-900 p-0",
              headerTitle: "text-zinc-100",
              headerSubtitle: "text-zinc-400",
              formFieldLabel: "text-zinc-300",
              formFieldInput: "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500",
              formButtonPrimary: "bg-emerald-600 hover:bg-emerald-500 text-white",
              profileSectionTitle: "text-zinc-100",
              profileSectionContent: "text-zinc-400",
            },
          }}
        />
      ) : activeTab === "subs" ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Streaming Platforms</h2>
            <p className="text-zinc-500">Select the services you currently pay for. We&apos;ll prioritize these in your search results.</p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-zinc-500 italic animate-pulse">
              <Loader2 className="animate-spin" /> Loading your preferences...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {POPULAR_PROVIDERS.map(name => {
                const isActive = mySubs.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleProvider(name)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 group ${
                      isActive 
                        ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isActive ? "bg-emerald-500 text-zinc-950" : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                    }`}>
                      {isActive ? <Check size={24} strokeWidth={3} /> : <Plus size={24} />}
                    </div>
                    <span className={`text-sm font-bold transition-colors ${isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Home Region</h2>
            <p className="text-zinc-500">Select your country to get the most accurate streaming links and localized content availability.</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Select Country</label>
            <select 
              value={region}
              onChange={(e) => updateRegion(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none appearance-none"
            >
              <option value="US">United States (US)</option>
              <option value="CA">Canada (CA)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="IN">India (IN)</option>
              <option value="AU">Australia (AU)</option>
              <option value="DE">Germany (DE)</option>
              <option value="FR">France (FR)</option>
            </select>
            <p className="text-xs text-zinc-600 italic">
              Don&apos;t see your country? We&apos;re adding more regions soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
