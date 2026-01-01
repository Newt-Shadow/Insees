"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addMember, updateMember, deleteMember } from "@/app/actions/admin";
import { FaTrash, FaUserPlus, FaEdit, FaTimes } from "react-icons/fa";
import ImageUpload from "./ImageUpload";

type Member = {
  id: string;
  name: string;
  role: string;
  session: string;
  category: string;
  image: string | null;
  linkedin: string | null;
  github: string | null;
  instagram: string | null; // Added
  facebook: string | null;  // Added
};

export default function TeamManager({ initialData }: { initialData: Member[] }) {
  const router = useRouter();
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const sessions = ["2025-26", "2024-25", "2023-24"];
  const categories = ["Core", "Executive", "Faculty"];

  useEffect(() => {
    if (editingMember) {
      setImageUrl(editingMember.image || "");
    } else {
      setImageUrl("");
    }
  }, [editingMember]);

  const handleSubmit = async (formData: FormData) => {
    formData.set("image", imageUrl);

    if (editingMember) {
      formData.append("id", editingMember.id);
      await updateMember(formData);
      setEditingMember(null);
      setImageUrl("");
    } else {
      await addMember(formData);
      setImageUrl("");
    }
    
    // Soft refresh to update data without reloading the page
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-orbitron text-blue-400">Team Management</h1>

      {/* FORM SECTION */}
      <div className={`bg-zinc-900 p-6 rounded-xl border ${editingMember ? "border-amber-500" : "border-zinc-800"} transition-colors shadow-xl`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold flex items-center gap-2 text-white text-lg">
            {editingMember ? <><FaEdit className="text-amber-500" /> Edit Member</> : <><FaUserPlus className="text-green-500" /> Add New Member</>}
          </h3>
          {editingMember && (
            <button onClick={() => setEditingMember(null)} className="text-sm text-red-400 flex items-center gap-1 hover:text-red-300 transition-colors bg-red-500/10 px-3 py-1 rounded-full">
              <FaTimes /> Cancel
            </button>
          )}
        </div>

        {/* Key forces form reset when switching between 'Add' and 'Edit' modes */}
        <form key={editingMember ? editingMember.id : "new"} action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Name</label>
            <input name="name" defaultValue={editingMember?.name} placeholder="e.g. John Doe" className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-blue-500 transition-colors" required />
          </div>

          {/* Position */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Position</label>
            <input name="role" defaultValue={editingMember?.role} placeholder="e.g. President" className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-blue-500 transition-colors" required />
          </div>
          
          {/* Session Dropdown */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Session</label>
            <select name="session" defaultValue={editingMember?.session || sessions[0]} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-blue-500 transition-colors cursor-pointer">
              {sessions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Category</label>
            <select name="category" defaultValue={editingMember?.category || categories[1]} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-blue-500 transition-colors cursor-pointer">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>
          
          {/* Social Links - Row 1 */}
          <div className="flex gap-4 md:col-span-2">
            <div className="w-1/2 space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold ml-1">LinkedIn</label>
              <input name="linkedin" defaultValue={editingMember?.linkedin || ""} placeholder="https://linkedin.com/in/..." className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-blue-500 transition-colors" />
            </div>
            <div className="w-1/2 space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold ml-1">GitHub</label>
              <input name="github" defaultValue={editingMember?.github || ""} placeholder="https://github.com/..." className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-blue-500 transition-colors" />
            </div>
          </div>

          {/* Social Links - Row 2 (Added) */}
          <div className="flex gap-4 md:col-span-2">
            <div className="w-1/2 space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Instagram</label>
              <input name="instagram" defaultValue={editingMember?.instagram || ""} placeholder="https://instagram.com/..." className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-blue-500 transition-colors" />
            </div>
            <div className="w-1/2 space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Facebook</label>
              <input name="facebook" defaultValue={editingMember?.facebook || ""} placeholder="https://facebook.com/..." className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-blue-500 transition-colors" />
            </div>
          </div>

          {/* Submit Button */}
          <button className={`md:col-span-2 text-white font-bold p-4 rounded-lg shadow-lg transform transition-all active:scale-[0.98] ${editingMember ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"}`}>
            {editingMember ? "Update Member Details" : "Add to Team"}
          </button>
        </form>
      </div>

      {/* DATA LIST */}
      <div className="space-y-12">
        {sessions.map(session => (
          <div key={session} className="space-y-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 border-l-4 border-blue-500 pl-4">{session}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialData.filter(m => m.session === session).map(m => (
                <div key={m.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 group hover:border-blue-500/30 transition-colors shadow-sm hover:shadow-md hover:shadow-blue-900/5">
                  <div className="relative w-14 h-14 shrink-0">
                    <img src={m.image || "/default.jpg"} className="w-full h-full rounded-full object-cover border-2 border-zinc-800 group-hover:border-blue-500 transition-colors" alt={m.name} />
                    {m.category === 'Core' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-zinc-900" title="Core Member"></div>}
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-white truncate text-sm">{m.name}</p>
                    <div className="flex flex-col">
                        <span className="text-xs text-blue-400 truncate">{m.role}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{m.category}</span>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => {
                      setEditingMember(m);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded transition-colors" title="Edit">
                      <FaEdit />
                    </button>
                    <form action={deleteMember}>
                      <input type="hidden" name="id" value={m.id} />
                      <button className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete">
                        <FaTrash />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {initialData.filter(m => m.session === session).length === 0 && (
                <div className="col-span-full py-8 text-center text-zinc-600 italic border border-dashed border-zinc-800 rounded-xl">
                    No members found for this session.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}