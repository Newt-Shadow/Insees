import { prisma } from "@/lib/prisma";
import { addDev, deleteDev } from "@/app/actions/admin";
import { FaTrash, FaCode } from "react-icons/fa";

export default async function AdminDevelopersPage() {
  const devs = await prisma.developer.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-orbitron text-purple-400">Developer Management</h1>
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <form action={addDev} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" className="bg-black border border-zinc-700 p-3 rounded text-white" required />
          <input name="role" placeholder="Role (e.g. Frontend)" className="bg-black border border-zinc-700 p-3 rounded text-white" required />
          <input name="image" placeholder="Image URL" className="bg-black border border-zinc-700 p-3 rounded text-white" />
          <input name="github" placeholder="GitHub URL" className="bg-black border border-zinc-700 p-3 rounded text-white" />
          <button className="md:col-span-2 bg-purple-600 hover:bg-purple-500 text-white font-bold p-3 rounded">Add Developer</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devs.map(d => (
            <div key={d.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded flex items-center gap-4">
                <img src={d.image || "/default.jpg"} className="w-12 h-12 rounded-full object-cover" alt={d.name}/>
                <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-white truncate">{d.name}</p>
                    <p className="text-xs text-purple-400 truncate">{d.role}</p>
                </div>
                <form action={deleteDev}>
                    <input type="hidden" name="id" value={d.id} />
                    <button className="text-zinc-600 hover:text-red-500"><FaTrash /></button>
                </form>
            </div>
        ))}
      </div>
    </div>
  );
}