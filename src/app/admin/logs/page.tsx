import { prisma } from "@/lib/prisma";

export default async function AuditLogs() {
  const logs = await prisma.auditLog.findMany({ 
    include: { user: true }, 
    orderBy: { createdAt: 'desc' }, 
    take: 100 
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-orbitron mb-6 text-red-400">Security Logs</h1>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-black text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Admin</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-zinc-800/50">
                <td className="px-6 py-4 text-gray-500 font-mono">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-white">{log.user.name}</td>
                <td className="px-6 py-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">{log.action}</span></td>
                <td className="px-6 py-4 text-gray-400">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}