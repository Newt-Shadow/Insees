"use client";
import React, { useState, useEffect } from "react";
import { Upload, Trash2, Calendar, Clock, Plus, Eye, Save } from "lucide-react";
import { EventCard } from "@/components/EventCard";

// --- TYPES (Synced with Prisma Schema) ---
type EventForm = {
    title: string;
    description: string;
    fullDescription: string;
    category: string;
    date: string; // ISO or formatted string
    year: string;
    registrationOpen: string; // ISO string
    status: "upcoming" | "live" | "completed";
    location: string;
    sponsor: string;
    registrationLink: string;
    image: string; // URL
    registrationEnabled?: boolean;
};

type AdminEvent = EventForm & {
    id: string; // ✅ Changed to String to match Prisma CUID
    createdAt?: string;
};

export default function AdminEventsPage() {
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
    const [uploading, setUploading] = useState(false);

    // Initial State
    const initialState: EventForm = {
        title: "",
        description: "",
        fullDescription: "",
        category: "Technical",
        date: "",
        year: new Date().getFullYear().toString(),
        registrationOpen: "",
        status: "upcoming",
        location: "NIT Silchar",
        sponsor: "",
        registrationLink: "",
        image: "",
        registrationEnabled: true,
    };

    const [formData, setFormData] = useState<EventForm>(initialState);

    // --- FETCH EVENTS ---
    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events");
            if (res.ok) {
                const data: AdminEvent[] = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to load events");
        }
    };

    // Load on mount
    useEffect(() => {
        fetchEvents();
    }, []);

    // --- HANDLE UPLOAD ---
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        const file = e.target.files[0];
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload,
            });
            const data = await res.json();
            // Support multiple return formats depending on your upload route
            const url = data.url || data.secure_url || data.data?.url;
            
            if (url) {
                setFormData((prev) => ({ ...prev, image: url }));
            } else {
                alert("Upload succeeded but URL was missing");
            }
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    // --- SUBMIT EVENT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const toISODate = (input: string) => {
            if (!input) return null;
            // Basic check if it's already ISO or standard date string
            if (input.includes("T") || !input.includes("-")) return input;

            // Manual parse for DD-MM-YYYY HH:MM
            try {
                const [date, time = "00:00"] = input.split(" ");
                const [dd, mm, yyyy] = date.split("-");
                const [hh, min] = time.split(":");
                return new Date(
                    Number(yyyy),
                    Number(mm) - 1,
                    Number(dd),
                    Number(hh),
                    Number(min)
                ).toISOString();
            } catch (e) {
                return new Date().toISOString(); // Fallback
            }
        };

        const method = editingEvent ? "PATCH" : "POST";

        try {
            const payload = {
                ...formData,
                registrationEnabled: editingEvent ? editingEvent.registrationEnabled : true,
                date: toISODate(formData.date),
                registrationOpen: formData.registrationOpen
                    ? new Date(formData.registrationOpen).toISOString()
                    : null,
            };

            const res = await fetch("/api/events", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    editingEvent
                        ? { id: editingEvent.id, ...payload }
                        : payload
                ),
            });

            if (res.ok) {
                // alert(editingEvent ? "Event Updated Successfully" : "Event Created Successfully");
                fetchEvents();
                setEditingEvent(null);
                setFormData(initialState);
            } else {
                alert("Operation failed. Check server logs.");
            }
        } catch (error) {
            alert("System Error");
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE EVENT ---
    const handleDelete = async (id: string) => {
        if (!confirm("Confirm Deletion?")) return;
        try {
            await fetch(`/api/events?id=${id}`, { method: "DELETE" });
            fetchEvents();
        } catch (error) {
            alert("Delete failed");
        }
    };

    // --- POPULATE EDIT FORM ---
    useEffect(() => {
        if (!editingEvent) return;

        setFormData({
            title: editingEvent.title,
            description: editingEvent.description,
            fullDescription: editingEvent.fullDescription || "",
            category: editingEvent.category,
            year: editingEvent.year,
            location: editingEvent.location,
            sponsor: editingEvent.sponsor || "",
            registrationLink: editingEvent.registrationLink || "",
            image: editingEvent.image,
            status: editingEvent.status,
            registrationEnabled: editingEvent.registrationEnabled ?? true,

            // Convert stored ISO date back to readable format if needed
            date: editingEvent.date
                ? new Date(editingEvent.date).toLocaleDateString("en-GB").replace(/\//g, "-") + " " + new Date(editingEvent.date).toLocaleTimeString("en-GB", {hour: '2-digit', minute:'2-digit'})
                : "",

            registrationOpen: editingEvent.registrationOpen
                ? editingEvent.registrationOpen.slice(0, 16)
                : "",
        });
    }, [editingEvent]);

    // --- DATE FORMATTER HELPER ---
    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (raw.length < formData.date.length) {
            setFormData(prev => ({ ...prev, date: raw }));
            return;
        }
        const digits = raw.replace(/\D/g, "").slice(0, 12);
        let formatted = "";
        if (digits.length >= 1) formatted += digits.slice(0, 2);
        if (digits.length >= 3) formatted += "-" + digits.slice(2, 4);
        if (digits.length >= 5) formatted += "-" + digits.slice(4, 8);
        if (digits.length >= 9) formatted += " " + digits.slice(8, 10);
        if (digits.length >= 11) formatted += ":" + digits.slice(10, 12);
        setFormData(prev => ({ ...prev, date: formatted }));
    };

    return (
        <div className="min-h-screen text-white font-sans">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold font-orbitron text-oz-emerald">EVENT CONTROL CENTER</h1>
                        <p className="text-xs text-gray-500 mt-1">Manage global event modules and registrations</p>
                    </div>
                    <div className="bg-zinc-900 px-4 py-2 rounded border border-zinc-800">
                        <span className="text-xl font-bold text-white">{events.length}</span>
                        <span className="text-[10px] text-gray-500 ml-2 uppercase">Modules Active</span>
                    </div>
                </div>

                {/* 3-COLUMN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- COLUMN 1: CREATE FORM (4 Cols) --- */}
                    <div className="lg:col-span-4 bg-zinc-900/50 border border-white/10 rounded-2xl p-6 h-fit sticky top-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            {editingEvent ? <Save size={18} className="text-blue-400"/> : <Plus size={18} className="text-green-400"/>}
                            {editingEvent ? "Edit Module" : "Initialize Module"}
                        </h2>
                        
                        {editingEvent && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingEvent(null);
                                    setFormData(initialState);
                                }}
                                className="text-xs text-red-400 hover:text-red-300 mb-4 block w-full text-right"
                            >
                                Cancel Editing
                            </button>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Event Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded p-3 text-sm focus:border-oz-emerald outline-none transition-colors"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 mb-1 block uppercase font-bold">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-black border border-white/20 rounded p-3 text-sm text-gray-300"
                                    >
                                        {["Technical", "Flagship", "Cultural", "Managerial", "Gaming", "Social"].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 mb-1 block uppercase font-bold">Year</label>
                                    <input
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full bg-black border border-white/20 rounded p-3 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 mb-1 block uppercase font-bold">Status Protocol</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as EventForm["status"], })}
                                    className="w-full bg-black border border-white/20 rounded p-3 text-sm text-gray-300"
                                >
                                    <option value="upcoming">INCOMING</option>
                                    <option value="live">LIVE</option>
                                    <option value="completed">COMPLETED</option>
                                </select>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 mb-1 flex gap-1 uppercase font-bold"><Calendar size={10} /> Date</label>
                                    <input
                                        type="text"
                                        placeholder="DD-MM-YYYY HH:MM"
                                        value={formData.date}
                                        onChange={handleDateInput}
                                        className="w-full bg-black border border-white/20 rounded p-2 text-xs text-gray-300 focus:border-oz-emerald outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 mb-1 flex gap-1 uppercase font-bold"><Clock size={10} /> Reg Open</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.registrationOpen}
                                        onChange={e => setFormData({ ...formData, registrationOpen: e.target.value })}
                                        className="w-full bg-black border border-white/20 rounded p-2 text-xs text-gray-300"
                                    />
                                </div>
                            </div>

                            <textarea
                                placeholder="Short Description (Card View)"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded p-3 text-sm h-20 focus:border-oz-emerald outline-none transition-colors"
                            />
                            <textarea
                                placeholder="Full Mission Brief (Modal View)"
                                value={formData.fullDescription}
                                onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded p-3 text-sm h-32 focus:border-oz-emerald outline-none transition-colors"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Location"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-black border border-white/20 rounded p-3 text-sm"
                                />
                                <input
                                    placeholder="Sponsor Name"
                                    value={formData.sponsor}
                                    onChange={e => setFormData({ ...formData, sponsor: e.target.value })}
                                    className="w-full bg-black border border-white/20 rounded p-3 text-sm"
                                />
                            </div>

                            <input
                                placeholder="Registration Link"
                                value={formData.registrationLink}
                                onChange={e => setFormData({ ...formData, registrationLink: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded p-3 text-sm"
                            />

                            <div className="border-2 border-dashed border-white/20 rounded p-6 text-center cursor-pointer hover:border-oz-emerald transition relative group">
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                {uploading ? (
                                    <span className="text-oz-emerald animate-pulse text-xs font-bold">UPLOADING ASSETS...</span>
                                ) : formData.image ? (
                                    <div className="relative z-0">
                                        <img src={formData.image} alt="Preview" className="h-20 w-full object-cover rounded opacity-50 group-hover:opacity-20 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-green-400 font-bold">IMAGE SECURED</div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <Upload size={20} className="group-hover:text-white transition-colors" />
                                        <span className="text-xs">DROP BANNER HERE</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                            >
                                {loading
                                    ? "PROCESSING DATA..."
                                    : editingEvent
                                        ? "UPDATE MODULE"
                                        : "DEPLOY MODULE"}
                            </button>
                        </form>
                    </div>

                    {/* --- COLUMN 2: LIVE PREVIEW (3 Cols) --- */}
                    <div className="lg:col-span-3 sticky top-6 h-fit hidden xl:block">
                        <div className="mb-6 flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-widest">
                            <Eye size={14} /> Visual Confirmation
                        </div>
                        <div className="border border-dashed border-white/10 rounded-xl p-4 bg-black/50 flex justify-center min-h-[400px] items-center">
                            {/* Renders the actual card component used on frontend */}
                            <div className="scale-90 origin-top">
                                <EventCard
                                    event={{
                                        ...formData,
                                        id: "preview",
                                        date: formData.date || "TBA",
                                        // Ensure required fields for preview aren't undefined
                                        fullDescription: formData.fullDescription || "",
                                        sponsor: formData.sponsor || "",
                                        registrationLink: formData.registrationLink || "",
                                        registrationEnabled: true
                                    }}
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-4 text-center font-mono">
                            // LIVE RENDER SIMULATION
                        </p>
                    </div>

                    {/* --- COLUMN 3: LIST VIEW (5 Cols) --- */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Active Modules</h2>
                            <button onClick={fetchEvents} className="text-xs text-oz-emerald hover:underline">Refresh Data</button>
                        </div>
                        
                        <div className="space-y-3 h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                            {events.map((event: AdminEvent) => (
                                <div key={event.id} className="flex gap-4 bg-zinc-900/30 border border-white/10 rounded-xl p-4 hover:border-oz-emerald/30 transition group">
                                    <img src={event.image || "/placeholder.jpg"} alt="" className="w-20 h-20 object-cover rounded bg-black shrink-0 border border-zinc-800" />
                                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-sm truncate text-white max-w-[150px]">{event.title}</h3>
                                            
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingEvent(event)}
                                                    className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded"
                                                    title="Edit"
                                                >
                                                    <Save size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(event.id)} 
                                                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs text-gray-500 line-clamp-1">{event.description}</p>
                                        
                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex gap-2 items-center">
                                                <span className={`text-[9px] px-1.5 py-px rounded border uppercase font-mono ${
                                                    event.status === 'live' ? 'border-red-500 text-red-500 bg-red-500/10' : 
                                                    event.status === 'completed' ? 'border-zinc-700 text-zinc-500' : 'border-blue-500 text-blue-500'
                                                }`}>
                                                    {event.status}
                                                </span>
                                            </div>
                                            
                                            <button
                                                disabled={editingEvent?.id === event.id}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    await fetch("/api/events", {
                                                        method: "PATCH",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            id: event.id,
                                                            registrationEnabled: !event.registrationEnabled,
                                                        }),
                                                    });
                                                    fetchEvents();
                                                }}
                                                className={`text-[9px] font-bold uppercase tracking-wider ${
                                                    event.registrationEnabled
                                                    ? "text-green-500 hover:text-green-400"
                                                    : "text-red-500 hover:text-red-400"
                                                }`}
                                            >
                                                {event.registrationEnabled ? "[ REG ACTIVE ]" : "[ REG LOCKED ]"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && (
                                <div className="text-center py-20 text-zinc-600 font-mono text-sm border border-dashed border-zinc-800 rounded-xl">
                                    NO MODULES DETECTED
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}