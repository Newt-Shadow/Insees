"use client";
import React, { useState, useEffect } from "react";
import { Upload, X, Trash2, Calendar, Clock, Plus, Eye } from "lucide-react";
import { EventCard } from "@/components/EventCard"; // Make sure this component exists from the previous step

// Types corresponding to Prisma Model
type EventForm = {
    title: string;
    description: string;
    fullDescription: string;
    category: string;
    date: string;
    // ISO string for input
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
    id: number ;
    registrationEnabled?: boolean;
};


export default function AdminEventsPage() {
    const [authorized, setAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    // const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    //const [editingEvent, setEditingEvent] = useState<any | null>(null);
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);



    // Form State
    const [formData, setFormData] = useState<EventForm>({
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
    });

    const [uploading, setUploading] = useState(false);

    // --- AUTH CHECK ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin") {
            setAuthorized(true);
            fetchEvents();
        } else {
            alert("Access Denied: Incorrect Protocol");
        }
    };

    // --- FETCH EVENTS ---
    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events");
            if (res.ok) {
                const data: AdminEvent[] = await res.json();
                setEvents(data);
                ;
            }
        } catch (error) {
            console.error("Failed to load events");
        }
    };

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
            if (data.url) {
                setFormData((prev) => ({ ...prev, image: data.url }));
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
        };

        const method = editingEvent ? "PATCH" : "POST";



        try {
            // Handle Optional Date: Default to current time if empty
            const payload = {
                ...formData,
                registrationEnabled: editingEvent?.registrationEnabled ?? true,
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
                alert(editingEvent ? "Event Updated Successfully" : "Event Created Successfully");


                fetchEvents();
                setEditingEvent(null);
                // Reset essential fields
                setFormData({
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
                });

            }
        } catch (error) {
            alert("System Error");
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE EVENT ---
    const handleDelete = async (id: number) => {
        if (!confirm("Confirm Deletion?")) return;
        try {
            await fetch(`/api/events?id=${id}`, { method: "DELETE" });
            fetchEvents();
        } catch (error) {
            alert("Delete failed");
        }
    };

    useEffect(() => {
        if (!editingEvent) return;

        setFormData({
            title: editingEvent.title,
            description: editingEvent.description,
            fullDescription: editingEvent.fullDescription,
            category: editingEvent.category,
            year: editingEvent.year,
            location: editingEvent.location,
            sponsor: editingEvent.sponsor || "",
            registrationLink: editingEvent.registrationLink || "",
            image: editingEvent.image,
            status: editingEvent.status,
            registrationEnabled: editingEvent.registrationEnabled ?? true,

            // Convert ISO → DD-MM-YYYY HH:MM
            date: editingEvent.date
                ? new Date(editingEvent.date)
                    .toLocaleString("en-GB")
                    .replace(",", "")
                : "",

            registrationOpen: editingEvent.registrationOpen
                ? editingEvent.registrationOpen.slice(0, 16)
                : "",
        });
    }, [editingEvent]);


    // --- RENDER LOGIN ---
    if (!authorized) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">
                <form onSubmit={handleLogin} className="flex flex-col gap-4 border border-white/20 p-8 rounded-xl bg-zinc-900">
                    <h1 className="text-xl font-bold text-oz-emerald">SYSTEM ACCESS</h1>
                    <input
                        type="password"
                        placeholder="Enter Key"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black border border-white/20 px-4 py-2 text-white focus:border-oz-emerald outline-none rounded"
                    />
                    <button type="submit" className="bg-oz-emerald text-black font-bold py-2 rounded hover:bg-white transition">
                        AUTHENTICATE
                    </button>
                </form>
            </div>
        );
    }

    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        // Allow backspace naturally
        if (raw.length < formData.date.length) {
            setFormData(prev => ({ ...prev, date: raw }));
            return;
        }

        // Digits only for formatting
        const digits = raw.replace(/\D/g, "").slice(0, 12);

        let formatted = "";

        if (digits.length >= 1) formatted += digits.slice(0, 2);
        if (digits.length >= 3) formatted += "-" + digits.slice(2, 4);
        if (digits.length >= 5) formatted += "-" + digits.slice(4, 8);
        if (digits.length >= 9) formatted += " " + digits.slice(8, 10);
        if (digits.length >= 11) formatted += ":" + digits.slice(10, 12);

        setFormData(prev => ({ ...prev, date: formatted }));
    };





    // --- RENDER DASHBOARD ---
    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-bold font-orbitron text-oz-emerald">EVENT CONTROL CENTER</h1>
                    <button onClick={() => setAuthorized(false)} className="text-xs text-red-500 hover:text-white font-mono">LOGOUT</button>
                </div>

                {/* Updated Grid for 3 Columns: Form | Preview | List */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- COLUMN 1: CREATE FORM (4 Cols) --- */}
                    <div className="lg:col-span-4 bg-zinc-900/50 border border-white/10 rounded-2xl p-6 h-fit sticky top-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={18} /> Initialize Event</h2>
                        {editingEvent && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingEvent(null);
                                    setFormData({
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
                                    });
                                }}
                                className="text-xs text-red-400 hover:text-red-300 ml-auto"
                            >
                                Cancel Edit
                            </button>
                        )}


                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Event Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded p-3 text-sm focus:border-oz-emerald outline-none"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-black border border-white/20 rounded p-3 text-sm"
                                    >
                                        {["Technical", "Flagship", "Cultural", "Managerial", "Gaming", "Social"].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Year</label>
                                    <input
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full bg-black border border-white/20 rounded p-3 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">System Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as EventForm["status"], })}
                                    className="w-full bg-black border border-white/20 rounded p-3 text-sm"
                                >
                                    <option value="upcoming">INCOMING</option>
                                    <option value="live">LIVE</option>
                                    <option value="completed">COMPLETED</option>
                                </select>
                            </div>

                            {/* Dates - Removed REQUIRED attribute */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 flex gap-1"><Calendar size={12} /> Date (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="DD-MM-YYYY HH:MM"
                                        value={formData.date}
                                        onChange={handleDateInput}
                                        className="w-full bg-black border border-white/20 rounded p-2 text-xs text-gray-300 focus:border-oz-emerald outline-none"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        Format: DD-MM-YYYY HH:MM (24-hour) • Time optional
                                    </p>

                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 flex gap-1"><Clock size={12} /> Reg Open (Opt)</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.registrationOpen}
                                        onChange={e => setFormData({ ...formData, registrationOpen: e.target.value })}
                                        className="w-full bg-black border border-white/20 rounded p-2 text-xs text-gray-300"
                                    />
                                </div>
                            </div>

                            <textarea
                                placeholder="Short Description (Card)"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded p-3 text-sm h-20"
                            />
                            <textarea
                                placeholder="Full Mission Brief (Modal)"
                                value={formData.fullDescription}
                                onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded p-3 text-sm h-32"
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

                            <div className="border-2 border-dashed border-white/20 rounded p-4 text-center cursor-pointer hover:border-oz-emerald transition relative">
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                {uploading ? (
                                    <span className="text-oz-emerald animate-pulse">Uploading...</span>
                                ) : formData.image ? (
                                    <div className="text-xs text-emerald-400 break-all">Image Set: {formData.image.slice(-15)}</div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <Upload size={20} />
                                        <span className="text-xs">Upload Banner</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-oz-emerald text-white font-bold py-3 rounded transition disabled:opacity-50"
                            >
                                {loading
                                    ? "PROCESSING..."
                                    : editingEvent
                                        ? "UPDATE EVENT"
                                        : "DEPLOY EVENT"}
                            </button>



                        </form>
                    </div>

                    {/* --- COLUMN 2: LIVE PREVIEW (3 Cols) --- */}
                    <div className="lg:col-span-3 sticky top-6 h-fit">
                        <div className="mb-6 flex items-center gap-2 text-blue-400 font-bold">
                            <Eye size={18} /> Live Preview
                        </div>
                        <div className="border border-dashed border-white/20 rounded-xl p-4 bg-black/50 flex justify-center">
                            {/* Renders the actual card component used on frontend */}
                            <EventCard
                                event={{
                                    ...formData,
                                    id: "preview",
                                    // Display "TBA" if no date selected
                                    date: formData.date || "TBA"
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            This is how the card will appear on the main Events Feed.
                        </p>
                    </div>

                    {/* --- COLUMN 3: LIST VIEW (5 Cols) --- */}
                    <div className="lg:col-span-5 space-y-4">
                        <h2 className="text-xl font-bold mb-6">Existing Modules ({events.length})</h2>
                        <div className="space-y-3 h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                            {events.map((event: AdminEvent) => (
                                <div key={event.id} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-oz-emerald/30 transition">
                                    <img src={event.image || "/placeholder.jpg"}  alt="" className="w-24 h-24 object-cover rounded bg-black" />
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-sm truncate text-white">{event.title}</h3>
                                            <button onClick={() => handleDelete(event.id)} className="text-gray-600 hover:text-red-500 transition">
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setEditingEvent(event)}
                                                className="text-xs text-blue-400 hover:text-blue-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                disabled={editingEvent?.id === event.id}
                                                onClick={async () => {
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
                                                className={`text-xs ${editingEvent?.id === event.id
                                                    ? "text-gray-500 cursor-not-allowed"
                                                    : "text-yellow-400 hover:text-yellow-300"
                                                    }`}
                                            >
                                                {event.registrationEnabled ? "Disable Reg" : "Enable Reg"}
                                            </button>


                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{event.description}</p>
                                        <div className="flex gap-3 mt-3 items-center">
                                            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${event.status === 'live' ? 'border-red-500 text-red-500' : 'border-gray-600 text-gray-500'
                                                }`}>
                                                {event.status}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-mono">
                                                {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}

                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}