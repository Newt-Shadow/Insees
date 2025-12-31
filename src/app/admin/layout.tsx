import { getServerSession } from "next-auth";
// ✅ FIXED IMPORT: Uses absolute path with @ alias
import { authOptions } from "@/lib/auth"

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FaChartPie, FaCalendarAlt, FaImages, FaUsers,
  FaCode, FaUserShield, FaSignOutAlt,
  FaEnvelope
} from "react-icons/fa";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/api/auth/signin");

  // @ts-expect-error - Role is injected by authOptions
  const role = session.user.role;
  const user = session.user;

  // Double check security
  if (role === "USER") redirect("/access-denied");

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <FaChartPie /> },
    { name: "Inbox", href: "/admin/inbox", icon: <FaEnvelope /> }, // Added
    { name: "Events", href: "/admin/events", icon: <FaCalendarAlt /> },
    { name: "Gallery", href: "/admin/gallery", icon: <FaImages /> },
    { name: "Team", href: "/admin/team", icon: <FaUsers /> },
    { name: "Resources", href: "/admin/resources", icon: <FaUserShield /> }, // Added
    { name: "Developers", href: "/admin/developers", icon: <FaCode /> },
  ];

  return role === "SUPER_ADMIN" && (
    <div className="min-h-screen flex bg-black text-white font-sans selection:bg-green-500/30">
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed h-full z-50">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            INSEES <span className="text-xs text-white bg-zinc-700 px-1.5 py-0.5 rounded ml-1">{role}</span>
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-zinc-800 hover:text-green-400 transition-all"
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}

          {role === "SUPER_ADMIN" && (
            <>
              <div className="my-4 border-t border-zinc-800" />
              <p className="px-4 text-xs text-zinc-600 uppercase tracking-wider mb-2">Super Admin</p>
              <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-all">
                <FaUserShield />
                <span>Access Control</span>
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3 mb-3">
            <img src={user?.image || "/default.jpg"} className="w-10 h-10 rounded-full border border-zinc-700" alt="Avatar" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Link href="/api/auth/signout" className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-md text-sm transition-colors">
            <FaSignOutAlt /> Log Out
          </Link>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 bg-black min-h-screen">
        {children}
      </main>
    </div>
  );
}