import { prisma } from "@/lib/prisma";
import { deleteUser, updateUserRole } from "@/app/actions/admin";
import { FaUserShield, FaBan, FaCheck, FaTimes } from "react-icons/fa";

export default async function ManageUsers() {
  const users = await prisma.user.findMany({ orderBy: { role: 'asc' } });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-orbitron mb-6 text-purple-400">Access Control</h1>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {users.map((user) => (
          <div key={user.id} className="p-4 flex items-center justify-between border-b border-zinc-800 last:border-0">
            <div className="flex items-center gap-3">
              <img src={user.image || "/default.jpg"} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-white font-mono">{user.role}</span>
              <form action={updateUserRole} className="flex gap-2">
                <input type="hidden" name="userId" value={user.id} />
                {user.role === 'USER' && (
                  <>
                    {/* Approve Button */}
                    <form action={updateUserRole}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button name="role" value="ADMIN" className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs flex gap-1 items-center transition-colors">
                        <FaCheck /> Approve
                      </button>
                    </form>

                    {/* ✅ Reject Button */}
                    <form action={deleteUser}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 px-3 py-1.5 rounded text-xs flex gap-1 items-center transition-all">
                        <FaTimes /> Reject
                      </button>
                    </form>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <>
                    <button name="role" value="SUPER_ADMIN" className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-xs flex gap-1 items-center"><FaUserShield /> Make Super</button>
                    <button name="role" value="USER" className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs flex gap-1 items-center"><FaBan /> Revoke</button>
                  </>
                )}
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}