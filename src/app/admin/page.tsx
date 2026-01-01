import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUserRole, deleteUser } from "@/app/actions/admin"; // ✅ Import deleteUser
import { FaUserShield, FaBan, FaCheck, FaTimes } from "react-icons/fa"; // ✅ Import FaTimes for X icon

import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  const eventCount = await prisma.event.count();
  const teamCount = await prisma.teamMember.count();
  const logs = await prisma.auditLog.findMany({ 
    take: 5, 
    orderBy: { createdAt: 'desc' }, 
    include: { user: true } 
  });

  return (
    <div>
      <h1 className="text-4xl font-orbitron mb-2">Welcome Back, {session?.user?.name}</h1>
      <p className="text-gray-400 mb-8">System operational. Ready for input.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <p className="text-xs text-gray-500 uppercase">Total Events</p>
          <p className="text-3xl font-bold text-green-400">{eventCount}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <p className="text-xs text-gray-500 uppercase">Team Members</p>
          <p className="text-3xl font-bold text-blue-400">{teamCount}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <p className="text-xs text-gray-500 uppercase">System Status</p>
          <p className="text-3xl font-bold text-emerald-400">ONLINE</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="font-bold text-white mb-4">Recent Activity Log</h3>
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="flex items-center gap-4 text-sm border-b border-zinc-800 pb-2 last:border-0">
               <span className="text-xs text-gray-500 font-mono w-40">{new Date(log.createdAt).toLocaleString()}</span>
               <span className="font-bold text-white">{log.user.name}</span>
               <span className="text-gray-400">{log.details || log.action}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-gray-500 italic">No recent activity recorded.</p>}
        </div>
      </div>
    </div>
  );
}