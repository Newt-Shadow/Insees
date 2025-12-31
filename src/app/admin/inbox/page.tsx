import { prisma } from "@/lib/prisma";
import { deleteMessage } from "@/app/actions/admin";
import { FaTrash, FaEnvelope } from "react-icons/fa";

export default async function AdminInbox() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-orbitron mb-6 text-purple-400">Inbox ({messages.length})</h1>
      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-zinc-800 rounded-full text-purple-400"><FaEnvelope /></div>
                <div>
                  <h3 className="font-bold text-white">{msg.name}</h3>
                  <p className="text-xs text-gray-500">{msg.email}</p>
                </div>
              </div>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={msg.id} />
                <button className="text-red-500 hover:text-red-400"><FaTrash /></button>
              </form>
            </div>
            <p className="text-gray-300 bg-black/30 p-4 rounded">{msg.message}</p>
            <p className="text-right text-[10px] text-gray-600 mt-2">{msg.createdAt.toLocaleString()}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-gray-500">No messages.</p>}
      </div>
    </div>
  );
}