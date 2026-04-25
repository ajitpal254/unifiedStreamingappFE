import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-600/20 blur-[120px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center max-w-3xl px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          Search once. <br /> Watch anywhere.
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
          The ultimate streaming hub. Connect your Netflix, Prime Video, Disney+, and more. Stop searching through multiple apps and maintain a single universal watchlist.
        </p>
        <div className="flex gap-4 items-center">
          <Link href="/sign-up">
            <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-[0_0_40px_8px_rgba(16,185,129,0.3)] transition-all hover:scale-105">
              Get Started for Free
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" size="lg" className="h-14 px-8 text-lg font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
