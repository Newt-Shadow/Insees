// src/app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import { deleteUser, updateUserRole } from "@/app/actions/admin";
import { FaUserShield, FaBan, FaCheck, FaTimes, FaCircle } from "react-icons/fa";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";


export default async function ManageUsers() {
  const session = await getServerSession(authOptions);

  // 🔒 STRICT VISIBILITY CHECK: SUPER_ADMIN ONLY
  if (!session || session.user?.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({ orderBy: { lastActive: 'desc' } });

  // 5 minute threshold for "Online"
  const ONLINE_THRESHOLD = 5 * 60 * 1000;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-orbitron text-purple-400">Access Control & Live Status</h1>
        <span className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
          Super Admin Restricted
        </span>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Active (IST)</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => {
              const isOnline = new Date().getTime() - new Date(user.lastActive).getTime() < ONLINE_THRESHOLD;

              return (
                <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                  {/* User Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.image || "/default.jpg"}
                        alt={user.name || "User Avatar"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        unoptimized
                      />

                      <div>
                        <p className="font-bold text-white text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded font-mono ${user.role === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                        user.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-zinc-700 text-zinc-300'
                      }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* ✅ ONLINE STATUS */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FaCircle className={`text-[10px] ${isOnline ? 'text-green-500 animate-pulse' : 'text-zinc-600'}`} />
                      <span className={`text-xs font-medium ${isOnline ? 'text-green-400' : 'text-zinc-500'}`}>
                        {isOnline ? 'Online Now' : 'Offline'}
                      </span>
                    </div>
                  </td>

                  {/* ✅ LAST ACTIVE (IST) */}
                  <td className="p-4 text-xs text-zinc-400 font-mono">
                    {new Date(user.lastActive).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      {user.role === "USER" && (
                        <>
                          <form>
                            <input type="hidden" name="userId" value={user.id} />
                            <button formAction={updateUserRole} name="role" value="ADMIN" className="p-2 bg-green-600 hover:bg-green-500 text-white rounded text-xs" title="Approve">
                              <FaCheck />
                            </button>
                          </form>
                          <form>
                            <input type="hidden" name="userId" value={user.id} />
                            <button formAction={deleteUser} className="p-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 rounded text-xs" title="Reject">
                              <FaTimes />
                            </button>
                          </form>
                        </>
                      )}

                      {user.role === "ADMIN" && (
                        <form className="flex gap-2">
                          <input type="hidden" name="userId" value={user.id} />
                          <button formAction={updateUserRole} name="role" value="SUPER_ADMIN" className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs flex gap-1 items-center">
                            <FaUserShield /> Promote
                          </button>
                          <button formAction={updateUserRole} name="role" value="USER" className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs flex gap-1 items-center">
                            <FaBan /> Revoke
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}