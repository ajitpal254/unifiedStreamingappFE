"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { Play, Plus, ChevronRight, Info, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Title {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
}

interface WatchlistItem {
  id: string;
  title: string;
  type: string;
  image: string;
  provider: string;
  addedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TMDB_IMG_LARGE = "https://image.tmdb.org/t/p/original";
const TMDB_IMG_POSTER = "https://image.tmdb.org/t/p/w500";

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [trending, setTrending] = useState<Title[]>([]);
  const [recommended, setRecommended] = useState<Title[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [featured, setFeatured] = useState<Title | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getToken();
        
        // 1. Fetch Trending
        const trendRes = await fetch(`${API_URL}/api/titles/trending`);
        const trendData = await trendRes.json();
        const results = trendData.results || [];
        setTrending(results);
        
        if (results.length > 0) {
          setFeatured(results[0]);
        }

        if (token) {
          // 2. Fetch Recommended (Subscription-based)
          const recRes = await fetch(`${API_URL}/api/titles/recommended`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const recData = await recRes.json();
          setRecommended(recData.results || []);

          // 3. Fetch Watchlist
          const watchRes = await fetch(`${API_URL}/api/watchlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const watchData = await watchRes.json();
          setWatchlist(watchData.slice(0, 3));
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-zinc-500 animate-pulse">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
        <p className="text-xl font-medium">Curating your experience...</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Featured Section */}
      {featured && (
        <div className="relative w-full h-[70vh] min-h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={`${TMDB_IMG_LARGE}${featured.backdrop_path}`} 
              alt={featured.title || featured.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-4xl z-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                Trending {featured.media_type === "movie" ? "Movie" : "Series"}
              </span>
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                <Star size={14} className="fill-yellow-400" />
                {featured.vote_average.toFixed(1)}
              </div>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter italic uppercase leading-[0.9]">
              {featured.title || featured.name}
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-300 mb-8 line-clamp-3 max-w-2xl font-medium opacity-90 leading-relaxed">
              {featured.overview}
            </p>
            
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/titles/${featured.media_type}/${featured.id}`}>
                <Button size="lg" className="h-14 px-10 text-lg font-black bg-emerald-500 text-zinc-950 hover:bg-emerald-400 rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 uppercase italic">
                  <Play fill="currentColor" size={20} />
                  View Details
                </Button>
              </Link>
              <Button size="icon" variant="outline" className="h-14 w-14 rounded-full border-zinc-700 bg-black/40 backdrop-blur-md hover:bg-zinc-800 text-white">
                <Plus size={24} />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="px-8 md:px-16 -translate-y-12 space-y-16 z-30 relative">
        {/* Continue Reading Section (Real Watchlist) */}
        {watchlist.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black italic uppercase tracking-tight">Your Watchlist</h2>
                <p className="text-zinc-500 text-sm">Pick up where you left off</p>
              </div>
              <Link href="/dashboard/watchlist" className="text-emerald-400 hover:text-emerald-300 flex items-center text-sm font-bold transition-colors uppercase tracking-widest">
                See Full List <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {watchlist.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/dashboard/watchlist`}
                  className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all hover:border-emerald-500/50 hover:shadow-2xl flex h-36"
                >
                  <div className="w-1/3 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play fill="white" size={20} />
                    </div>
                  </div>
                  <div className="w-2/3 p-5 flex flex-col justify-between bg-zinc-900/50 backdrop-blur-sm">
                    <div>
                      <h3 className="font-bold text-lg leading-tight truncate text-zinc-100">{item.title}</h3>
                      <p className="text-zinc-500 text-xs mt-1 uppercase font-bold tracking-widest">{item.type}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 italic">Added {new Date(item.addedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Personalized Recommended Section */}
        {recommended.length > 0 && (
          <section className="relative group/rec-slider">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-2">
                  Just for You
                  <span className="bg-emerald-500 text-zinc-950 text-[10px] px-2 py-0.5 rounded-full not-italic">NEW</span>
                </h2>
                <p className="text-zinc-500 text-sm">Trending on your active services</p>
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => document.getElementById("rec-slider")?.scrollBy({ left: -400, behavior: "smooth" })}
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-white opacity-0 group-hover/rec-slider:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-zinc-950 shadow-2xl backdrop-blur-md"
              >
                <ChevronRight className="rotate-180" size={24} />
              </button>

              <button 
                onClick={() => document.getElementById("rec-slider")?.scrollBy({ left: 400, behavior: "smooth" })}
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-white opacity-0 group-hover/rec-slider:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-zinc-950 shadow-2xl backdrop-blur-md"
              >
                <ChevronRight size={24} />
              </button>

              <div 
                id="rec-slider"
                className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x px-4 -mx-4 scroll-smooth"
              >
                {recommended.map((item) => (
                  <Link 
                    href={`/dashboard/titles/${item.media_type}/${item.id}`}
                    key={`rec-${item.id}`} 
                    className="relative flex-none w-48 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden snap-start group/card cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:z-20 shadow-xl border border-zinc-900 hover:border-emerald-500/50"
                  >
                    <img 
                      src={item.poster_path.startsWith("http") ? item.poster_path : `${TMDB_IMG_POSTER}${item.poster_path}`} 
                      alt={item.title || item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 p-5 w-full">
                      <h3 className="font-bold text-lg leading-tight text-white line-clamp-2 group-hover/card:text-emerald-400">
                        {item.title || item.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Modern Trending Slider (Global) */}
        <section className="relative group/slider">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Trending Now</h2>
              <p className="text-zinc-500 text-sm">The most watched titles this week</p>
            </div>
          </div>
          
          <div className="relative">
            {/* Left Button */}
            <button 
              onClick={() => {
                const el = document.getElementById("trending-slider");
                el?.scrollBy({ left: -400, behavior: "smooth" });
              }}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-400 shadow-2xl backdrop-blur-md"
            >
              <ChevronRight className="rotate-180" size={24} />
            </button>

            {/* Right Button */}
            <button 
              onClick={() => {
                const el = document.getElementById("trending-slider");
                el?.scrollBy({ left: 400, behavior: "smooth" });
              }}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-400 shadow-2xl backdrop-blur-md"
            >
              <ChevronRight size={24} />
            </button>

            <div 
              id="trending-slider"
              className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x px-4 -mx-4 scroll-smooth"
            >
              {trending.map((item) => (
                <Link 
                  href={`/dashboard/titles/${item.media_type}/${item.id}`}
                  key={item.id} 
                  className="relative flex-none w-48 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden snap-start group/card cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:z-20 shadow-xl border border-zinc-900 hover:border-emerald-500/50 hover:shadow-emerald-500/10"
                >
                  <img 
                    src={`${TMDB_IMG_POSTER}${item.poster_path}`} 
                    alt={item.title || item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity" />
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 p-5 w-full transform translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2 opacity-0 group-hover/card:opacity-100 transition-opacity delay-100">
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 uppercase tracking-tighter">
                        {item.media_type}
                      </span>
                      <div className="flex items-center gap-0.5 text-yellow-400 text-[10px] font-bold">
                        <Star size={10} className="fill-yellow-400" />
                        {item.vote_average.toFixed(1)}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg leading-tight text-white line-clamp-2 group-hover/card:text-emerald-400 transition-colors">
                      {item.title || item.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trailers Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-2">
                New Trailers
              </h2>
              <p className="text-zinc-500 text-sm">Watch the latest clips and previews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trending.slice(1, 4).map((item) => (
              <div 
                key={`trailer-${item.id}`}
                className="group relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all shadow-2xl"
              >
                <img 
                  src={`${TMDB_IMG_LARGE}${item.backdrop_path}`} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Link 
                    href={`/dashboard/titles/${item.media_type}/${item.id}`}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-400"
                  >
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </Link>
                  <div className="mt-4 text-center px-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <h4 className="font-black italic uppercase text-lg leading-tight">{item.title || item.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Search CTA */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 p-12 md:p-20 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-white">
              Stop searching.<br />Start watching.
            </h2>
            <p className="text-emerald-100/80 text-lg font-medium">
              We track availability across 50+ platforms so you don't have to.
            </p>
            <div className="pt-4">
              <Link href="/dashboard/search">
                <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-full px-12 h-16 text-xl font-black uppercase italic shadow-2xl shadow-black/20">
                  Find Your Next Show
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
