"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Search, Film, Tv, Star, Plus, Check, Loader2 } from "lucide-react";
import Link from "next/link";

interface TMDBResult {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

function ResultCard({
  item,
  onAdd,
  added,
}: {
  item: TMDBResult;
  onAdd: (item: TMDBResult) => void;
  added: boolean;
}) {
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average?.toFixed(1);

  return (
    <Link
      href={`/dashboard/titles/${item.media_type}/${item.id}`}
      className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800">
        {item.poster_path ? (
          <img
            src={`${TMDB_IMG}${item.poster_path}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            {item.media_type === "movie" ? <Film size={40} /> : <Tv size={40} />}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
            item.media_type === "movie"
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 text-white"
          }`}>
            {item.media_type === "movie" ? "Movie" : "Series"}
          </span>
        </div>

        {/* Add to watchlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onAdd(item);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
            added
              ? "bg-emerald-500 text-zinc-950 opacity-100"
              : "bg-black/50 backdrop-blur-md text-zinc-300 hover:bg-emerald-500 hover:text-zinc-950 opacity-0 group-hover:opacity-100"
          }`}
          title={added ? "In watchlist" : "Add to watchlist"}
        >
          {added ? <Check size={14} /> : <Plus size={14} />}
        </button>

        {/* Rating */}
        {rating && Number(rating) > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-medium">{rating}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex-1">
        <h3 className="font-semibold text-sm text-zinc-100 leading-tight line-clamp-2 mb-1">{title}</h3>
        {year && <p className="text-xs text-zinc-500">{year}</p>}
      </div>
    </Link>
  );
}

export default function SearchPage() {
  const { getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBResult[]>([]);
  const [trending, setTrending] = useState<TMDBResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load trending on mount
  useEffect(() => {
    fetch(`${API_URL}/api/titles/trending`)
      .then((r) => r.json())
      .then((d) => setTrending(d.results?.slice(0, 12) ?? []))
      .catch(console.error);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const addToWatchlist = async (item: TMDBResult) => {
    const key = `${item.media_type}-${item.id}`;
    if (addedIds.has(key)) return;
    try {
      const token = await getToken();
      const title = item.title || item.name || "Untitled";
      await fetch(`${API_URL}/api/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          type: item.media_type === "movie" ? "Movie" : "Series",
          image: item.poster_path ? `${TMDB_IMG}${item.poster_path}` : null,
          provider: "unknown",
        }),
      });
      setAddedIds((prev) => new Set(prev).add(key));
    } catch (e) {
      console.error("Failed to add to watchlist:", e);
    }
  };

  const displayItems = query.trim() ? results : trending;
  const sectionTitle = query.trim() ? `Results for "${query}"` : "🔥 Trending This Week";

  return (
    <div className="p-8 md:p-12 pb-24">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Search</h1>
        <p className="text-zinc-400 text-lg">Find movies and shows across all your services.</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-10">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          size={20}
        />
        {loading && (
          <Loader2
            className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin"
            size={18}
          />
        )}
        <input
          type="text"
          placeholder="Search movies, shows, genres..."
          value={query}
          onChange={handleInput}
          autoFocus
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-14 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-500"
        />
      </div>

      {/* Section title */}
      <h2 className="text-xl font-bold text-zinc-100 mb-6">{sectionTitle}</h2>

      {/* Results Grid */}
      {displayItems.length === 0 && !loading && query.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Search size={40} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm mt-1">Try a different title or keyword</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayItems.map((item) => (
            <ResultCard
              key={`${item.media_type}-${item.id}`}
              item={item}
              onAdd={addToWatchlist}
              added={addedIds.has(`${item.media_type}-${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
