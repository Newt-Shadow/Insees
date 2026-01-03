// src/app/admin/logs/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogFilters from "./LogFilters";
import { Prisma } from "@prisma/client";
import { FaFilter } from "react-icons/fa";
import { Role } from "@prisma/client";


// Define the shape of search params
// interface SearchParams {
//   q?: string;
//   action?: string;
//   role?: string;
// }

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AuditLogs(props: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession(authOptions);

  // 🔒 STRICT SECURITY CHECK
  if (!session || session.user?.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const params = await props.searchParams;

  // 🔍 BUILD QUERY DYNAMICALLY
  const where: Prisma.AuditLogWhereInput = {};

  const q = typeof params.q === 'string' ? params.q : undefined;
  const action = typeof params.action === 'string' ? params.action : undefined;
  const role = typeof params.role === 'string' ? params.role : undefined;

  // 1. Search Query (User Name, Email, or Action Details)
  if (q) {
    
    where.OR = [
      { user: { name: { contains: q, mode: "insensitive" } } },
      { user: { email: { contains: q, mode: "insensitive" } } },
      { details: { contains: q, mode: "insensitive" } },
      { action: { contains: q, mode: "insensitive" } },
    ];
  }

  // 2. Filter by Action Type
  if (action) {
    where.action = { contains: action, mode: "insensitive" };
  }

  // 3. Filter by User Role
  if (role && Object.values(Role).includes(role as Role)) {
  where.user = {
    role: role as Role,
  };
}


  // Fetch Logs (Increased limit to 500 for better history)
  const logs = await prisma.auditLog.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 500, 
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-orbitron text-red-400 flex items-center gap-3">
             Security Audit Logs
           </h1>
           <p className="text-zinc-500 text-sm mt-1">
             Tracking all system activity, logins, and modifications.
           </p>
        </div>
        
      </div>

      {/* ⚡ CLIENT FILTER COMPONENT */}
      <LogFilters />

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-black text-zinc-500 uppercase text-xs sticky top-0">
              <tr>
                <th className="px-6 py-4">Time (IST)</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-zinc-800/50 transition-colors group"
                >
                  {/* Time */}
                  <td className="px-6 py-4 text-zinc-500 font-mono whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                        {log.user?.image ? (
                          <img src={log.user.image} alt={log.user.name || ""} className="w-full h-full object-cover"/>
                        ) : (
                          <span className="text-xs text-zinc-500">?</span>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {log.user?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {log.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                     <span className={`text-[10px] px-2 py-1 rounded border ${
                        log.user?.role === 'SUPER_ADMIN' ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' :
                        log.user?.role === 'ADMIN' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
                        'bg-zinc-800 text-zinc-400 border-zinc-700'
                     }`}>
                       {log.user?.role}
                     </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <Badge action={log.action} />
                  </td>

                  {/* Details */}
                  <td className="px-6 py-4 text-zinc-400 max-w-md truncate group-hover:whitespace-normal group-hover:break-words">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {logs.length === 0 && (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-2">
            <FaFilter className="text-4xl text-zinc-700" />
            <p>No logs found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ action }: { action: string }) {
  let color = "bg-zinc-800 text-zinc-400 border-zinc-700";
  
  if (action === "LOGIN") color = "bg-green-500/10 text-green-400 border-green-500/20";
  else if (action === "LOGOUT") color = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  else if (action.includes("DELETE") || action.includes("REJECT")) color = "bg-red-500/10 text-red-400 border-red-500/20";
  else if (action.includes("UPDATE")) color = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  else if (action.includes("CREATE") || action.includes("PROMOTE")) color = "bg-blue-500/10 text-blue-400 border-blue-500/20";

  return (
    <span className={`${color} px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border`}>
      {action}
    </span>
  );
}