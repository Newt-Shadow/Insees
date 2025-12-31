// src/app/admin/logs/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AuditLogs() {
  const session = await getServerSession(authOptions);

  // 🔒 STRICT SECURITY CHECK
  // Only SUPER_ADMIN can view logs. Regular ADMINs get kicked out.
  // The type error on 'role' is fixed by the new d.ts file you created in Step 1.
  if (!session || session.user?.role !== "SUPER_ADMIN") {
    redirect("/admin"); 
  }

  const logs = await prisma.auditLog.findMany({ 
    include: { user: true }, 
    orderBy: { createdAt: 'desc' }, 
    take: 100 
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-orbitron text-red-400">
          Security Logs <span className="text-sm text-zinc-500 ml-2">(Super Admin Only)</span>
        </h1>
        <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">
          Confidential
        </span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-black text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 text-gray-500 font-mono whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{log.user?.name || "Unknown"}</span>
                    {/* The ? check handles cases where user might be null (deleted users) */}
                    <span className="text-xs text-zinc-500">({log.user?.role ?? "N/A"})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <Badge action={log.action} />
                </td>
                <td className="px-6 py-4 text-gray-400">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
            <div className="p-8 text-center text-zinc-500">No logs found</div>
        )}
      </div>
    </div>
  );
}

function Badge({ action }: { action: string }) {
  let color = "bg-zinc-800 text-gray-400";
  if (action === "LOGIN") color = "bg-green-500/10 text-green-400 border border-green-500/20";
  if (action === "LOGOUT") color = "bg-orange-500/10 text-orange-400 border border-orange-500/20";
  if (action.includes("DELETE")) color = "bg-red-500/10 text-red-400 border border-red-500/20";
  if (action.includes("CREATE") || action.includes("UPDATE")) color = "bg-blue-500/10 text-blue-400 border border-blue-500/20";

  return (
    <span className={`${color} px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wider`}>
      {action}
    </span>
  );
}