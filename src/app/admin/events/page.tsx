"use client";
import React, { useState, useEffect } from "react";
import { Upload, Trash2, Plus, Eye, Save } from "lucide-react";
import { EventCard } from "@/components/EventCard";

type AdminEvent = {
  id?: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  date: string;
  year: string;
  registrationOpen: string;
  status: "upcoming" | "live" | "completed";
  location: string;
  sponsor: string;
  registrationLink: string;
  image: string;
  registrationEnabled: boolean;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [uploading, setUploading] = useState(false);

  const initialState: AdminEvent = {
    title: "", description: "", fullDescription: "", category: "Technical",
    date: "", year: new Date().getFullYear().toString(), registrationOpen: "",
    status: "upcoming", location: "NIT Silchar", sponsor: "", registrationLink: "",
    image: "", registrationEnabled: true,
  };

  const [formData, setFormData] = useState<AdminEvent>(initialState);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) setEvents(await res.json());
    } catch (error) { console.error("Failed to fetch events"); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", e.target.files[0]);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) setFormData(prev => ({ ...prev, image: data.url }));
    } catch { alert("Upload Failed"); } 
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const method = editingEvent ? "PATCH" : "POST";
        const body = editingEvent ? { ...formData, id: editingEvent.id } : formData;
        const res = await fetch("/api/events", {
            method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
        if (res.ok) {
            fetchEvents();
            setEditingEvent(null);
            setFormData(initialState);
        } else alert("Operation failed");
    } catch (err) { alert("Error submitting"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if(confirm("Delete this event permanently?")) {
        await fetch(`/api/events?id=${id}`, { method: "DELETE" });
        fetchEvents();
    }
  };

  useEffect(() => { if(editingEvent) setFormData(editingEvent); }, [editingEvent]);

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold font-orbitron text-oz-emerald">Events Module</h1>
        <div className="text-right"><span className="text-2xl font-bold">{events.length}</span> <p className="text-xs text-gray-500 uppercase">Total Events</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM */}
        <div className="lg:col-span-4 bg-zinc-900 border border-white/10 rounded-xl p-6 h-fit sticky top-6">
           <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             {editingEvent ? <Save size={18} className="text-blue-400"/> : <Plus size={18} className="text-green-400"/>}
             {editingEvent ? "Edit Event" : "Create Event"}
           </h2>
           <form onSubmit={handleSubmit} className="space-y-4">
             <input className="w-full bg-black border border-white/20 rounded p-3 text-white" placeholder="Event Title"
                 value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
             
             <div className="relative border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                {uploading ? <span className="text-green-500 animate-pulse text-sm">Uploading...</span> : 
                 formData.image ? <div className="text-xs text-green-400">Image Set</div> : <div className="text-gray-500"><Upload className="mx-auto mb-2"/><span className="text-xs">Upload Banner</span></div>}
             </div>

             <div className="grid grid-cols-2 gap-4">
                <select className="bg-black border border-white/20 rounded p-3 text-sm text-gray-300"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Technical</option><option>Cultural</option><option>Managerial</option>
                </select>
                <select className="bg-black border border-white/20 rounded p-3 text-sm text-gray-300"
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="completed">Completed</option>
                </select>
             </div>
             <textarea className="w-full bg-black border border-white/20 rounded p-3 text-sm h-24" placeholder="Short Description"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
             <button disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg">
                {loading ? "Processing..." : editingEvent ? "Update" : "Deploy"}
             </button>
             {editingEvent && <button type="button" onClick={() => { setEditingEvent(null); setFormData(initialState); }} className="w-full text-xs text-red-400 mt-2">Cancel</button>}
           </form>
        </div>
        {/* LIST */}
        <div className="lg:col-span-8 space-y-4">
            {events.map((event) => (
                <div key={event.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-4">
                    <img src={event.image || "/placeholder.jpg"} className="w-20 h-20 object-cover rounded bg-black" alt="" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-white truncate">{event.title}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingEvent(event)} className="text-blue-400 hover:text-blue-300 text-xs font-bold">Edit</button>
                                <button onClick={() => handleDelete(event.id!)} className="text-zinc-600 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}