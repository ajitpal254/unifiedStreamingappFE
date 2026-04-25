"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { 
  Play, 
  Trash2, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar,
  Film,
  Tv,
  Loader2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface WatchlistItem {
  id: string;
  title: string;
  type: string;
  progress: number;
  image: string;
  provider: string;
  addedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function WatchlistPage() {
  const { getToken } = useAuth();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, [getToken]);

  const fetchWatchlist = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWatchlist(data);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFromWatchlist = async (id: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/watchlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setWatchlist((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const filteredWatchlist = watchlist.filter((item) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Movies" && item.type === "Movie") ||
      (filter === "Series" && item.type === "Series") ||
      (filter === "Completed" && item.progress === 100);
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 md:p-12 pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic uppercase">
            My Watchlist
          </h1>
          <p className="text-zinc-500 text-lg font-medium">Your personal cinema library, unified.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Filter by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-600 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Modern Filter Tabs */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto scrollbar-hide pb-2">
        {["All", "Movies", "Series", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all border ${
              filter === tab 
                ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow-lg shadow-emerald-500/20" 
                : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-600 animate-pulse">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
          <p className="font-bold uppercase tracking-widest text-xs">Syncing Library...</p>
        </div>
      ) : filteredWatchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-600 border-2 border-dashed border-zinc-900 rounded-3xl">
          <Film size={48} className="mb-6 opacity-20" />
          <p className="text-xl font-bold text-zinc-400">Empty Library</p>
          <p className="text-sm mt-2 max-w-xs text-center">
            {search ? `No matches for "${search}" in your list.` : "Your watchlist is empty. Go find something to watch!"}
          </p>
          {!search && (
            <Link href="/dashboard/search" className="mt-8 bg-emerald-500 text-zinc-950 px-8 py-3 rounded-full font-black uppercase italic text-sm hover:bg-emerald-400 transition-all hover:scale-105">
              Start Exploring
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredWatchlist.map((item) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col"
            >
              {/* Poster Card */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-500 group-hover:scale-[1.03] group-hover:z-10 group-hover:border-emerald-500/50 shadow-xl shadow-black/40">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                {/* Top Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button
                    onClick={() => deleteFromWatchlist(item.id)}
                    className="w-9 h-9 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                    title="Remove from watchlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 p-4 w-full transform translate-y-2 group-hover:translate-y-0 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 uppercase tracking-tighter">
                      {item.type}
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-tighter line-clamp-1">
                      {item.provider}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm leading-tight text-white mb-1 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Quick Link Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-emerald-500/10 backdrop-blur-[2px]">
                   <Link 
                     href={`/dashboard/search`} // Note: Ideally we store type/id to link to details
                     className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-zinc-950 shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-emerald-400"
                   >
                     <ExternalLink size={20} strokeWidth={3} />
                   </Link>
                </div>
              </div>

              {/* Added Date (Static) */}
              <div className="mt-3 px-1 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  <Calendar size={10} />
                  {new Date(item.addedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
