import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="p-8 md:p-12 pb-24">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Account Settings</h1>
        <p className="text-zinc-400 text-lg">Manage your profile, security, and connected accounts.</p>
      </div>

      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl w-full",
            navbar: "bg-zinc-950/50 border-r border-zinc-800",
            navbarButton: "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
            navbarButtonActive: "text-emerald-400 bg-zinc-800",
            pageScrollBox: "bg-zinc-900",
            headerTitle: "text-zinc-100",
            headerSubtitle: "text-zinc-400",
            formFieldLabel: "text-zinc-300",
            formFieldInput: "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500",
            formButtonPrimary: "bg-emerald-600 hover:bg-emerald-500 text-white",
            badge: "bg-emerald-500/20 text-emerald-400",
            profileSectionTitle: "text-zinc-100",
            profileSectionContent: "text-zinc-400",
            accordionTriggerButton: "text-zinc-300 hover:text-zinc-100",
            menuItem: "text-zinc-300 hover:bg-zinc-800",
            avatarImageActionsUpload: "text-emerald-400 hover:text-emerald-300",
          },
        }}
      />
    </div>
  );
}
