"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Plus, ChevronRight, Info } from "lucide-react";

// Mock data
const FEATURED = {
  title: "Dune: Part Two",
  description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
  match: "98% Match",
  year: "2024",
  rating: "PG-13",
  duration: "2h 46m",
  tags: ["Sci-Fi", "Adventure", "Action"],
  provider: "max"
};

const TRENDING = [
  { id: 1, title: "Shogun", image: "https://images.unsplash.com/photo-1578589318433-39b511d5633f?q=80&w=800&auto=format&fit=crop", provider: "hulu" },
  { id: 2, title: "The Bear", image: "https://images.unsplash.com/photo-1583338917451-fade2751e5e5?q=80&w=800&auto=format&fit=crop", provider: "hulu" },
  { id: 3, title: "Fallout", image: "https://images.unsplash.com/photo-1542382124-7eb3268846c8?q=80&w=800&auto=format&fit=crop", provider: "prime" },
  { id: 4, title: "3 Body Problem", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", provider: "netflix" },
  { id: 5, title: "Loki", image: "https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=800&auto=format&fit=crop", provider: "disney" },
];

const CONTINUE_WATCHING = [
  { id: 101, title: "Stranger Things", episode: "S4:E8 Papa", progress: 65, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop", provider: "netflix" },
  { id: 102, title: "Succession", episode: "S4:E3 Connor's Wedding", progress: 15, image: "https://images.unsplash.com/photo-1507676184212-d0330a156f97?q=80&w=800&auto=format&fit=crop", provider: "max" },
];

const PROVIDER_COLORS: Record<string, string> = {
  netflix: "bg-red-600 text-white",
  prime: "bg-blue-500 text-white",
  disney: "bg-indigo-600 text-white",
  hulu: "bg-green-500 text-white",
  max: "bg-purple-600 text-white",
};

export default function Dashboard() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const addToWatchlist = async (item: { title: string, type: string, image: string, provider: string }) => {
    try {
      const res = await fetch("http://localhost:4000/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        // Could show a toast notification here
        console.log("Added to watchlist!");
      }
    } catch (error) {
      console.error("Failed to add to watchlist", error);
    }
  };

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[500px]">
        {/* Placeholder background instead of actual image for now */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${PROVIDER_COLORS[FEATURED.provider]}`}>
              {FEATURED.provider}
            </span>
            <span className="text-emerald-500 font-semibold text-sm">{FEATURED.match}</span>
            <span className="text-zinc-400 text-sm">{FEATURED.year}</span>
            <span className="border border-zinc-600 text-zinc-400 text-xs px-1 rounded">{FEATURED.rating}</span>
            <span className="text-zinc-400 text-sm">{FEATURED.duration}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            {FEATURED.title}
          </h1>
          
          <p className="text-lg text-zinc-300 mb-6 line-clamp-3">
            {FEATURED.description}
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <Button size="lg" className="h-14 px-8 text-lg font-bold bg-white text-black hover:bg-zinc-200 rounded-full flex items-center gap-2 transition-transform hover:scale-105">
              <Play fill="currentColor" size={20} />
              Play
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => addToWatchlist({ title: FEATURED.title, type: "Movie", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000&auto=format&fit=crop", provider: FEATURED.provider })}
              className="h-14 px-8 text-lg font-bold border-zinc-700 hover:bg-zinc-800 rounded-full flex items-center gap-2 transition-transform hover:scale-105 bg-black/40 backdrop-blur-sm"
            >
              <Plus size={20} />
              Watchlist
            </Button>
            <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-sm border border-zinc-700 hover:bg-zinc-800">
              <Info size={24} />
            </Button>
          </div>
          
          <div className="flex gap-2">
            {FEATURED.tags.map(tag => (
              <span key={tag} className="text-xs font-medium text-zinc-400 bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 md:px-12 mt-8 space-y-12 z-30 relative">
        {/* Continue Watching Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Continue Watching</h2>
            <button className="text-zinc-400 hover:text-white flex items-center text-sm font-medium transition-colors">
              See All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTINUE_WATCHING.map((item) => (
              <div key={item.id} className="group cursor-pointer relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all hover:border-zinc-600 hover:shadow-xl">
                <div className="flex h-32">
                  <div className="w-1/3 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <Play fill="white" size={16} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg leading-tight truncate">{item.title}</h3>
                      <p className="text-zinc-400 text-sm truncate">{item.episode}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${PROVIDER_COLORS[item.provider]}`}>
                        {item.provider}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                  <div className="h-full bg-emerald-500" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <button className="text-zinc-400 hover:text-white flex items-center text-sm font-medium transition-colors">
              See All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {TRENDING.map((item) => (
              <div 
                key={item.id} 
                className="relative flex-none w-48 md:w-56 aspect-[2/3] rounded-xl overflow-hidden snap-start group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${PROVIDER_COLORS[item.provider]} shadow-sm`}>
                    {item.provider}
                  </span>
                </div>
                
                <div className="absolute bottom-0 left-0 p-4 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-bold text-lg mb-1 truncate text-white">{item.title}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-emerald-400 transition-colors">
                      <Play fill="currentColor" size={14} className="ml-0.5" />
                    </button>
                    <button 
                      onClick={() => addToWatchlist({ title: item.title, type: "Series", image: item.image, provider: item.provider })}
                      className="w-8 h-8 rounded-full bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center text-white border border-zinc-600 hover:bg-zinc-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
