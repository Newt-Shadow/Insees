"use client"; // ✅ MUST BE THE VERY FIRST LINE

import { useState } from "react";
import { addMember, updateMember, deleteMember } from "@/app/actions/admin";
import { FaTrash, FaUserPlus, FaEdit, FaTimes } from "react-icons/fa";

type Member = {
  id: string;
  name: string;
  role: string;
  session: string;
  category: string;
  image: string | null;
  linkedin: string | null;
  github: string | null;
};

export default function TeamManager({ initialData }: { initialData: Member[] }) {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const sessions = ["2025-26", "2024-25", "2023-24"];
  const categories = ["Core", "Executive", "Faculty"];

  const handleSubmit = async (formData: FormData) => {
    if (editingMember) {
      formData.append("id", editingMember.id);
      await updateMember(formData);
      setEditingMember(null);
    } else {
      await addMember(formData);
    }
    window.location.reload(); 
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-orbitron text-blue-400">Team Management</h1>

      {/* FORM SECTION */}
      <div className={`bg-zinc-900 p-6 rounded-xl border ${editingMember ? "border-amber-500" : "border-zinc-800"} transition-colors`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2 text-white">
            {editingMember ? <><FaEdit className="text-amber-500" /> Edit Member</> : <><FaUserPlus className="text-green-500" /> Add Member</>}
          </h3>
          {editingMember && (
            <button onClick={() => setEditingMember(null)} className="text-xs text-red-400 flex items-center gap-1 hover:underline">
              <FaTimes /> Cancel Editing
            </button>
          )}
        </div>

        <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" defaultValue={editingMember?.name} placeholder="Full Name" className="bg-black border border-zinc-700 p-3 rounded text-white" required />
          <input name="role" defaultValue={editingMember?.role} placeholder="Position (e.g. President)" className="bg-black border border-zinc-700 p-3 rounded text-white" required />
          
          <select name="session" defaultValue={editingMember?.session || sessions[0]} className="bg-black border border-zinc-700 p-3 rounded text-white">
            {sessions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select name="category" defaultValue={editingMember?.category || categories[1]} className="bg-black border border-zinc-700 p-3 rounded text-white">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input name="image" defaultValue={editingMember?.image || ""} placeholder="Image URL / Cloudinary Link" className="bg-black border border-zinc-700 p-3 rounded text-white" />
          
          <div className="flex gap-2 md:col-span-1">
            <input name="linkedin" defaultValue={editingMember?.linkedin || ""} placeholder="LinkedIn URL" className="bg-black border border-zinc-700 p-3 rounded text-white w-1/2" />
            <input name="github" defaultValue={editingMember?.github || ""} placeholder="GitHub URL" className="bg-black border border-zinc-700 p-3 rounded text-white w-1/2" />
          </div>

          <button className={`md:col-span-2 text-white font-bold p-3 rounded transition-all ${editingMember ? "bg-amber-600 hover:bg-amber-500" : "bg-blue-600 hover:bg-blue-500"}`}>
            {editingMember ? "Update Member Details" : "Add Member"}
          </button>
        </form>
      </div>

      {/* DATA LIST */}
      {sessions.map(session => (
        <div key={session} className="space-y-4">
          <h2 className="text-xl font-bold text-gray-500 border-b border-zinc-800 pb-2">{session}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {initialData.filter(m => m.session === session).map(m => (
              <div key={m.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded flex items-center gap-4 group hover:border-blue-500/30 transition-colors">
                <img src={m.image || "/default.jpg"} className="w-12 h-12 rounded-full object-cover border border-zinc-700" alt={m.name} />
                
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-white truncate">{m.name}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-400 truncate">{m.role}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${m.category === 'Core' ? 'bg-purple-900/50 text-purple-300' : 'bg-zinc-800 text-zinc-400'}`}>
                      {m.category}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => {
                    setEditingMember(m);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} className="p-2 text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10 rounded">
                    <FaEdit />
                  </button>
                  <form action={deleteMember}>
                    <input type="hidden" name="id" value={m.id} />
                    <button className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded">
                      <FaTrash />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}