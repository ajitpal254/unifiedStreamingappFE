import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 blur-xl"></div>
        <SignUp fallbackRedirectUrl="/onboarding" appearance={{
          elements: {
            card: "bg-zinc-900 border border-zinc-800 shadow-2xl",
            headerTitle: "text-zinc-100",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton: "text-zinc-300 border-zinc-700 hover:bg-zinc-800",
            socialButtonsBlockButtonText: "text-zinc-300",
            dividerLine: "bg-zinc-800",
            dividerText: "text-zinc-500",
            formFieldLabel: "text-zinc-300",
            formFieldInput: "bg-zinc-950 border-zinc-800 text-zinc-100",
            footerActionText: "text-zinc-400",
            footerActionLink: "text-emerald-400 hover:text-emerald-300"
          }
        }} />
      </div>
    </div>
  );
}
