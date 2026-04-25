import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Home, 
  TrendingUp, 
  Bookmark, 
  Settings, 
  Search,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-900">
          <Link href="/dashboard" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
              <span className="text-zinc-950 font-black text-sm">U</span>
            </div>
            StreamHub
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">Menu</div>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-medium">
            <Home size={20} />
            Home
          </Link>
          <Link href="/dashboard/trending" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors font-medium">
            <TrendingUp size={20} />
            Trending
          </Link>
          <Link href="/dashboard/watchlist" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors font-medium">
            <Bookmark size={20} />
            Watchlist
          </Link>
          
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-8 mb-4 px-2">General</div>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors font-medium">
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800">
            <h4 className="font-semibold text-sm mb-1">Upgrade to Pro</h4>
            <p className="text-xs text-zinc-400 mb-3">Unlock all streaming platforms and unlimited watchlists.</p>
            <Button size="sm" className="w-full bg-white text-black hover:bg-zinc-200">
              Upgrade
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search movies, shows, or genres..." 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-950"></span>
            </button>
            <div className="w-px h-6 bg-zinc-800"></div>
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
