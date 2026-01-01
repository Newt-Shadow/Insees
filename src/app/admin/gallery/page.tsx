"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, RefreshCw, Plus, Filter, CheckCircle, Database, CheckSquare, Square, AlertTriangle } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  year: string;
  event: string;
}

interface FilterData {
  years: string[];
  events: string[];
}

export default function AdminGallery() {
  // --- STATE ---
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filters, setFilters] = useState<FilterData>({ years: [], events: [] });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Upload State
  const [uploadYear, setUploadYear] = useState(new Date().getFullYear().toString());
  const [uploadEvent, setUploadEvent] = useState("");
  const [newEventMode, setNewEventMode] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // View & Delete State
  const [viewYear, setViewYear] = useState("All");
  const [viewEvent, setViewEvent] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(data.images || []);
      setFilters(data.filters || { years: [], events: [] });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. UPLOAD HANDLER ---
  const handleUpload = async () => {
    if (!files.length) return alert("Please select files");
    if (!uploadEvent) return alert("Please select or enter an event name");
    
    setUploading(true);
    const formData = new FormData();
    formData.append("year", uploadYear);
    formData.append("event", uploadEvent);
    files.forEach(f => formData.append("files", f));

    try {
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully uploaded ${data.data.length} images!`);
        setFiles([]);
        setNewEventMode(false);
        fetchData(); // Refresh UI
      } else {
        alert("Upload failed");
      }
    } catch (e) {
      console.error(e);
      alert("Error uploading");
    }
    setUploading(false);
  };

  // --- 3. SYNC HANDLER (The "Safe" Logic) ---
  const handleSync = async () => {
    if (!confirm("⚠️ This will scan Cloudinary and add all existing images to the database under Year: 'Legacy'.\n\nThis is safe to do! You can delete them later by filtering for 'Legacy'.")) return;
    
    setSyncing(true);
    try {
      const res = await fetch("/api/gallery/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(`Sync Complete! Added ${data.count} images to 'Legacy' archive.`);
        fetchData();
      } else {
        alert("Sync failed or no new images found.");
      }
    } catch (e) {
      alert("Error executing sync.");
    }
    setSyncing(false);
  };

  // --- 4. BULK DELETE HANDLER ---
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} images? This cannot be undone.`)) return;
    
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchData(); 
      }
    } catch (e) {
      alert("Delete failed");
    }
  };

  // --- HELPER: FILTER LOGIC ---
  const filteredImages = images.filter(img => {
    const matchYear = viewYear === "All" || img.year === viewYear;
    const matchEvent = viewEvent === "All" || img.event === viewEvent;
    return matchYear && matchEvent;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredImages.length && filteredImages.length > 0) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(filteredImages.map(img => img.id)); // Select all visible
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 p-6">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 gap-6">
        <div>
          <h1 className="text-3xl font-bold font-orbitron text-green-400 mb-1">Gallery Command Center</h1>
          <p className="text-gray-500 text-xs font-mono">Manage Insees Visual Database</p>
        </div>
        
        <div className="flex items-center gap-3">
           {/* SYNC BUTTON */}
           <button 
             onClick={handleSync} 
             disabled={syncing}
             className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
           >
             {syncing ? <RefreshCw size={14} className="animate-spin" /> : <Database size={14} />}
             {syncing ? "SYNCING..." : "SYNC CLOUDINARY"}
           </button>

           <button onClick={fetchData} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700">
             <RefreshCw size={16} className="text-white"/>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* === LEFT: UPLOAD PANEL === */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl sticky top-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
              <UploadCloud className="text-oz-emerald" size={20} /> Upload New Data
            </h2>

            {/* 1. Year Input */}
            <div className="mb-5">
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-2 tracking-wider">Target Year</label>
              <input 
                type="text" 
                value={uploadYear} 
                onChange={e => setUploadYear(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-oz-emerald outline-none font-mono text-sm"
                placeholder="YYYY"
              />
            </div>

            {/* 2. Event Selection */}
            <div className="mb-6">
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-2 tracking-wider">Target Event</label>
              
              {!newEventMode ? (
                <div className="flex gap-2">
                  <select 
                    value={uploadEvent} 
                    onChange={e => setUploadEvent(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-oz-emerald outline-none text-sm appearance-none"
                  >
                    <option value="">-- Select Event --</option>
                    {filters.events.map(evt => (
                      <option key={evt} value={evt}>{evt}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => { setNewEventMode(true); setUploadEvent(""); }}
                    className="bg-zinc-800 hover:bg-zinc-700 px-3 rounded-lg border border-zinc-700 text-white"
                    title="Add New Event"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={uploadEvent} 
                    onChange={e => setUploadEvent(e.target.value)}
                    placeholder="Enter Event Name..."
                    className="w-full bg-black border border-oz-emerald/50 rounded-lg p-3 text-white focus:border-oz-emerald outline-none animate-pulse-border text-sm"
                    autoFocus
                  />
                  <button 
                    onClick={() => setNewEventMode(false)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                     Cancel
                  </button>
                </div>
              )}
            </div>

            {/* 3. File Drop Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-oz-emerald bg-oz-emerald/5' : 'border-zinc-700 hover:border-zinc-500'}`}
            >
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={e => setFiles(Array.from(e.target.files || []))}
              />
              {files.length > 0 ? (
                <div>
                  <CheckCircle className="mx-auto text-oz-emerald mb-2" size={32} />
                  <p className="font-bold text-white text-sm">{files.length} Files Ready</p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">Click to change selection</p>
                </div>
              ) : (
                <div>
                  <UploadCloud className="mx-auto text-gray-500 mb-3" size={32} />
                  <p className="text-gray-400 text-sm font-bold">Click to Upload</p>
                  <p className="text-[10px] text-gray-600 mt-1 uppercase">Supports JPG, PNG, WEBP</p>
                </div>
              )}
            </div>

            {/* 4. Submit Button */}
            <button 
              onClick={handleUpload} 
              disabled={uploading || files.length === 0 || !uploadEvent}
              className="w-full mt-6 bg-oz-emerald hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-lg uppercase tracking-wider transition-all text-sm flex items-center justify-center gap-2"
            >
              {uploading ? <RefreshCw className="animate-spin" /> : <UploadCloud />}
              {uploading ? "Uploading..." : "Initiate Upload"}
            </button>
          </div>
        </div>

        {/* === RIGHT: MEDIA LIBRARY === */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Filters & Tools Bar */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl sticky top-6 z-10 flex flex-wrap gap-4 items-center justify-between shadow-lg">
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Filter size={16} /> <span className="text-[10px] font-bold uppercase tracking-wider">Filters</span>
              </div>
              
              {/* Year Filter */}
              <select 
                value={viewYear} 
                onChange={e => { setViewYear(e.target.value); setSelectedIds([]); }}
                className="bg-black border border-zinc-700 text-xs text-white rounded px-3 py-1.5 outline-none focus:border-white"
              >
                <option value="All">All Years</option>
                {filters.years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              {/* Event Filter */}
              <select 
                value={viewEvent} 
                onChange={e => { setViewEvent(e.target.value); setSelectedIds([]); }}
                className="bg-black border border-zinc-700 text-xs text-white rounded px-3 py-1.5 outline-none focus:border-white"
              >
                <option value="All">All Events</option>
                {filters.events.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button 
                 onClick={toggleSelectAll}
                 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded"
              >
                 {selectedIds.length === filteredImages.length && filteredImages.length > 0 ? <CheckSquare size={14}/> : <Square size={14}/>}
                 Select All
              </button>

              {selectedIds.length > 0 && (
                <button 
                  onClick={handleBulkDelete} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-red-900/20"
                >
                  <Trash2 size={14} /> Delete ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Image Grid */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 min-h-[600px] max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                <RefreshCw className="animate-spin text-oz-emerald" size={32} />
                <p className="font-mono text-xs uppercase tracking-widest">Accessing Database...</p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 opacity-60">
                <Database size={48} />
                <p className="font-mono">No images found for these filters.</p>
                {images.length === 0 && (
                  <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-center gap-3 max-w-md">
                     <AlertTriangle className="text-blue-400" />
                     <div className="text-left">
                       <p className="text-blue-200 text-sm font-bold">Database Empty?</p>
                       <p className="text-blue-400/80 text-xs">Click &quot;Sync Cloudinary&quot; at the top right to restore your existing images as &quot;Legacy&quot;.</p>
                     </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {filteredImages.map(img => {
                  const isSelected = selectedIds.includes(img.id);
                  return (
                    <div 
                      key={img.id}
                      onClick={() => setSelectedIds(prev => 
                        isSelected ? prev.filter(id => id !== img.id) : [...prev, img.id]
                      )}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 group ${isSelected ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-800 hover:border-oz-emerald'}`}
                    >
                      <Image src={img.src} alt="" unoptimized={true} fill className={`object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-110'}`} />
                      
                      {/* Selection Overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="bg-red-500 p-2 rounded-full shadow-xl">
                            <Trash2 size={16} className="text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Info Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        {isSelected ? (
                          <CheckCircle size={18} className="text-red-500 fill-white" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-white/70 bg-black/40 backdrop-blur-sm group-hover:border-oz-emerald" />
                        )}
                      </div>

                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[9px] text-white font-mono truncate text-center">{img.event}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}