"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Search, Filter, MoreVertical, CheckCircle2 } from "lucide-react";

interface WatchlistItem {
  id: string | number;
  title: string;
  type: string;
  progress: number;
  image: string;
  provider: string;
  addedAt: string;
}

const PROVIDER_COLORS: Record<string, string> = {
  netflix: "bg-red-600 text-white",
  prime: "bg-blue-500 text-white",
  disney: "bg-indigo-600 text-white",
  hulu: "bg-green-500 text-white",
  max: "bg-purple-600 text-white",
};

export default function WatchlistPage() {
  const [filter, setFilter] = useState("All");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = () => {
    fetch("http://localhost:4000/api/watchlist")
      .then((res) => res.json())
      .then((data) => {
        setWatchlist(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch watchlist:", err);
        setLoading(false);
      });
  };

  const deleteFromWatchlist = async (id: string | number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/watchlist/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        // Optimistically remove from UI
        setWatchlist((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div className="p-8 md:p-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">My Watchlist</h1>
          <p className="text-zinc-400 text-lg">Manage and organize your saved movies and shows.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search watchlist..." 
              className="w-full md:w-64 bg-zinc-900/50 border border-zinc-800 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-100"
            />
          </div>
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 rounded-full h-10 px-4 flex items-center gap-2">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-zinc-900 pb-px overflow-x-auto scrollbar-hide">
        {["All", "Movies", "Series", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2.5 rounded-t-lg font-medium text-sm whitespace-nowrap transition-colors relative ${
              filter === tab ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab}
            {filter === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 translate-y-px" />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {watchlist.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-1">
              {/* Image container */}
            <div className="relative aspect-video w-full overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/20" />
              
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {item.progress === 100 && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={14} className="text-zinc-950" />
                  </div>
                )}
                <button 
                  onClick={() => deleteFromWatchlist(item.id)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-white hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Provider Badge */}
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm ${PROVIDER_COLORS[item.provider]}`}>
                  {item.provider}
                </span>
              </div>
              
              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/20">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-75 group-hover:scale-100 transition-all duration-300 cursor-pointer hover:bg-emerald-500 group/play">
                  <Play fill="currentColor" size={20} className="text-white group-hover/play:text-zinc-950 ml-1" />
                </div>
              </div>
              
              {/* Progress Bar (if watched partially) */}
              {item.progress > 0 && item.progress < 100 && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800/80 backdrop-blur-sm">
                  <div className="h-full bg-emerald-500" style={{ width: `${item.progress}%` }} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-bold text-lg leading-tight truncate text-zinc-100">{item.title}</h3>
                <button className="text-zinc-500 hover:text-zinc-300">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>{item.type}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>Added {item.addedAt}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
