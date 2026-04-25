"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Clock, 
  Calendar, 
  ChevronLeft,
  Info,
  Users
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

interface TitleDetails {
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  runtime?: number;
  episode_run_time?: number[];
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string }[];
    crew: { id: number; name: string; job: string }[];
  };
  trailer: { key: string } | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TMDB_IMG_LARGE = "https://image.tmdb.org/t/p/original";
const TMDB_IMG_POSTER = "https://image.tmdb.org/t/p/w500";

interface Provider {
  name: string;
  type: string;
  url: string;
  format: string;
}

export default function TitleDetailPage() {
  const { type, id } = useParams();
  const { getToken } = useAuth();
  const [data, setData] = useState<TitleDetails | null>(null);
  const [availability, setAvailability] = useState<Provider[]>([]);
  const [userSubs, setUserSubs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    // Fetch details
    fetch(`${API_URL}/api/titles/${type}/${id}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch availability
    getToken().then(token => {
      fetch(`${API_URL}/api/titles/${type}/${id}/availability`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(setAvailability)
      .catch(console.error)
      .finally(() => setLoadingAvailability(false));
    });

    // Fetch user subscriptions
    getToken().then(token => {
      if (!token) return;
      fetch(`${API_URL}/api/providers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setUserSubs(data.map((p: any) => p.provider)))
      .catch(console.error);
    });
  }, [type, id, getToken]);

  const addToWatchlist = async () => {
    if (!data) return;
    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title || data.name,
          type: type === "movie" ? "Movie" : "Series",
          image: `${TMDB_IMG_POSTER}${data.poster_path}`,
          provider: availability[0]?.name || "unknown",
          tmdbId: id,
        }),
      });
      setIsAdded(true);
    } catch (e) {
      console.error("Failed to add to watchlist", e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 animate-pulse">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg">Fetching cinematic details...</p>
      </div>
    );
  }

  if (!data) return <div className="p-12 text-center text-zinc-400">Title not found.</div>;

  const title = data.title || data.name;
  const year = (data.release_date || data.first_air_date || "").slice(0, 4);
  const runtime = data.runtime || (data.episode_run_time?.[0]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* Hero Backdrop */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={`${TMDB_IMG_LARGE}${data.backdrop_path}`} 
            alt={title}
            className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-8 md:px-12 pb-12 flex flex-col md:flex-row gap-8 items-end">
            {/* Poster */}
            <div className="hidden md:block w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 translate-y-6">
              <img src={`${TMDB_IMG_POSTER}${data.poster_path}`} alt={title} className="w-full h-auto" />
            </div>

            {/* Text Details */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Link href="/dashboard/search" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium mb-4 transition-colors">
                  <ChevronLeft size={16} /> Back to Search
                </Link>
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {type === "movie" ? "Movie" : "Series"}
                  </span>
                  {data.status !== "Released" && data.status !== "Returning Series" && (
                    <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {data.status}
                    </span>
                  )}
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">
                  {title}
                </h1>
                {data.tagline && <p className="text-xl text-zinc-400 font-medium italic opacity-80">{data.tagline}</p>}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-300">
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <Star size={18} className="fill-yellow-400" />
                  <span className="font-bold text-lg">{data.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={18} className="text-zinc-500" />
                  <span>{year}</span>
                </div>
                {runtime && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={18} className="text-zinc-500" />
                    <span>{runtime} min</span>
                  </div>
                )}
                <div className="flex gap-2">
                  {data.genres.map(g => (
                    <span key={g.id} className="text-zinc-500 px-2 py-0.5 border border-zinc-800 rounded-md bg-zinc-900/50">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={addToWatchlist}
                  className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                    isAdded 
                    ? "bg-zinc-800 text-zinc-400 cursor-default" 
                    : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                  }`}
                >
                  {isAdded ? <Check size={20} /> : <Plus size={20} />}
                  {isAdded ? "In Watchlist" : "Add to Watchlist"}
                </button>
                {data.trailer && (
                  <a 
                    href={`https://www.youtube.com/watch?v=${data.trailer.key}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold transition-all"
                  >
                    <Play size={20} className="fill-white" />
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left Column: Overview & Cast */}
        <div className="lg:col-span-2 space-y-16">
          <section>
            <div className="flex items-center gap-2 mb-6 text-zinc-400 uppercase tracking-widest text-xs font-bold">
              <Info size={14} className="text-emerald-500" /> Storyline
            </div>
            <p className="text-xl text-zinc-300 leading-relaxed max-w-3xl">
              {data.overview}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-8 text-zinc-400 uppercase tracking-widest text-xs font-bold">
              <Users size={14} className="text-emerald-500" /> Starring
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {data.credits.cast.map(person => (
                <div key={person.id} className="group text-center">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-3 group-hover:border-emerald-500/50 transition-colors">
                    {person.profile_path ? (
                      <img 
                        src={`${TMDB_IMG_POSTER}${person.profile_path}`} 
                        alt={person.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Users size={30} />
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{person.name}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Watch Providers & Director */}
        <div className="space-y-12">
          <section className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 italic uppercase">
              <Play size={18} className="text-emerald-500 fill-emerald-500" /> Where to Watch
            </h3>
            
            <div className="space-y-3">
              {loadingAvailability ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                    <p className="text-sm text-zinc-500">Checking availability...</p>
                    <div className="w-full bg-zinc-900 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-emerald-500 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ) : availability.length > 0 ? (
                availability.map((source) => {
                  const isSubscribed = userSubs.includes(source.name);
                  return (
                    <a
                      key={source.name}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                        isSubscribed 
                          ? "bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                          : "bg-zinc-950 border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border uppercase transition-colors ${
                          isSubscribed ? "bg-emerald-500 text-zinc-950 border-emerald-400" : "bg-zinc-900 text-zinc-400 border-zinc-800"
                        }`}>
                          {source.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-bold transition-colors ${isSubscribed ? "text-emerald-400" : "text-zinc-200 group-hover:text-emerald-400"}`}>
                              {source.name}
                            </p>
                            {isSubscribed && (
                              <span className="text-[9px] bg-emerald-500 text-zinc-950 px-1.5 py-0.5 rounded-sm font-black uppercase tracking-tighter">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                            {source.type === "sub" ? "Subscription" : "Free"} • {source.format}
                          </p>
                        </div>
                      </div>
                      <Play size={14} className={isSubscribed ? "text-emerald-500" : "text-zinc-600 group-hover:text-emerald-500"} />
                    </a>
                  );
                })
              ) : (
                <div className="p-6 rounded-2xl bg-zinc-950/50 border border-dashed border-zinc-800 text-center">
                  <p className="text-sm text-zinc-500">Not available for streaming in your region.</p>
                </div>
              )}
            </div>
          </section>

          {data.credits.crew.length > 0 && (
            <section>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Direction</h4>
              <div className="space-y-4">
                {data.credits.crew.map(person => (
                  <div key={person.id + person.job} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                      {person.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-200">{person.name}</p>
                      <p className="text-xs text-zinc-500">{person.job}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
