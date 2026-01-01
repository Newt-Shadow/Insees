"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDev, updateDev, deleteDev } from "@/app/actions/admin";
import { FaTrash, FaUserPlus, FaEdit, FaTimes, FaGithub, FaLinkedin } from "react-icons/fa";
import ImageUpload from "./ImageUpload";

type Developer = {
  id: string;
  name: string;
  role: string;
  image: string | null;
  linkedin: string | null;
  github: string | null;
  category: string; // Added
};

export default function DeveloperManager({ initialData }: { initialData: Developer[] }) {
  const router = useRouter();
  const [editingDev, setEditingDev] = useState<Developer | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const categories = ["Senior", "Junior"];

  useEffect(() => {
    if (editingDev) {
      setImageUrl(editingDev.image || "");
    } else {
      setImageUrl("");
    }
  }, [editingDev]);

  const handleSubmit = async (formData: FormData) => {
    formData.set("image", imageUrl);

    if (editingDev) {
      formData.append("id", editingDev.id);
      await updateDev(formData);
      setEditingDev(null);
      setImageUrl("");
    } else {
      await addDev(formData);
      setImageUrl("");
    }
    
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-orbitron text-purple-400">Developer Management</h1>

      {/* FORM SECTION */}
      <div className={`bg-zinc-900 p-6 rounded-xl border ${editingDev ? "border-purple-500" : "border-zinc-800"} transition-colors shadow-xl`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold flex items-center gap-2 text-white text-lg">
            {editingDev ? <><FaEdit className="text-purple-500" /> Edit Developer</> : <><FaUserPlus className="text-green-500" /> Add New Developer</>}
          </h3>
          {editingDev && (
            <button onClick={() => setEditingDev(null)} className="text-sm text-red-400 flex items-center gap-1 hover:text-red-300 transition-colors bg-red-500/10 px-3 py-1 rounded-full">
              <FaTimes /> Cancel
            </button>
          )}
        </div>

        <form key={editingDev ? editingDev.id : "new"} action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Name</label>
            <input name="name" defaultValue={editingDev?.name} placeholder="e.g. Jane Doe" className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-purple-500 transition-colors" required />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Role</label>
            <input name="role" defaultValue={editingDev?.role} placeholder="e.g. Frontend Engineer" className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-purple-500 transition-colors" required />
          </div>

           {/* Category Dropdown */}
           <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Level</label>
            <select name="category" defaultValue={editingDev?.category || "Junior"} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-purple-500 transition-colors cursor-pointer">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>
          
          {/* Social Links */}
          <div className="flex gap-4 md:col-span-2">
            <div className="w-1/2 space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold ml-1">LinkedIn</label>
              <input name="linkedin" defaultValue={editingDev?.linkedin || ""} placeholder="https://linkedin.com/in/..." className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-purple-500 transition-colors" />
            </div>
            <div className="w-1/2 space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold ml-1">GitHub</label>
              <input name="github" defaultValue={editingDev?.github || ""} placeholder="https://github.com/..." className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-purple-500 transition-colors" />
            </div>
          </div>

          {/* Submit Button */}
          <button className={`md:col-span-2 text-white font-bold p-4 rounded-lg shadow-lg transform transition-all active:scale-[0.98] ${editingDev ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"}`}>
            {editingDev ? "Update Developer" : "Add Developer"}
          </button>
        </form>
      </div>

      {/* DATA LIST */}
      <div className="space-y-8">
        {categories.map(cat => (
             <div key={cat} className="space-y-4">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 border-l-4 border-purple-500 pl-4">
                    {cat} Developers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {initialData.filter(d => d.category === cat).map(d => (
                    <div key={d.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 group hover:border-purple-500/30 transition-colors shadow-sm hover:shadow-md hover:shadow-purple-900/5">
                        <div className="relative w-14 h-14 shrink-0">
                            <img src={d.image || "/default.jpg"} className="w-full h-full rounded-full object-cover border-2 border-zinc-800 group-hover:border-purple-500 transition-colors" alt={d.name} />
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-white truncate text-sm">{d.name}</p>
                        <div className="flex flex-col">
                            <span className="text-xs text-purple-400 truncate">{d.role}</span>
                            <div className="flex gap-2 mt-1">
                                {d.github && <a href={d.github} target="_blank" className="text-zinc-500 hover:text-white"><FaGithub size={12}/></a>}
                                {d.linkedin && <a href={d.linkedin} target="_blank" className="text-zinc-500 hover:text-blue-400"><FaLinkedin size={12}/></a>}
                            </div>
                        </div>
                        </div>

                        <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => {
                            setEditingDev(d);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded transition-colors" title="Edit">
                            <FaEdit />
                        </button>
                        <form action={deleteDev}>
                            <input type="hidden" name="id" value={d.id} />
                            <button className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete">
                            <FaTrash />
                            </button>
                        </form>
                        </div>
                    </div>
                    ))}
                    {initialData.filter(d => d.category === cat).length === 0 && (
                        <div className="col-span-full py-6 text-center text-zinc-600 italic border border-dashed border-zinc-800 rounded-xl">
                            No {cat.toLowerCase()} developers found.
                        </div>
                    )}
                </div>
             </div>
        ))}
      </div>
    </div>
  );
}