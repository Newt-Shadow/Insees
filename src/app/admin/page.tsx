"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UploadCloud, Trash2, ShieldAlert, CheckCircle, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadedImage {
  id: string;
  src: string;
  category: string;
}

const categories = ["Alpha Crescendo", "Orientation", "Freshers", "Farewell"] as const;

export default function AdminPage() {
  const router = useRouter();
  const isProd = process.env.NODE_ENV === "production";

  // Redirect to home in production (Security)
  useEffect(() => {
    if (isProd) router.push("/");
  }, [isProd, router]);

  const [files, setFiles] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState<string>("");
  const [manageCategory, setManageCategory] = useState<string>("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [selectedCategoryImages, setSelectedCategoryImages] = useState<UploadedImage[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<string[]>([]);
  const [statusLog, setStatusLog] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setStatusLog(prev => [`> ${msg}`, ...prev].slice(0, 5));

  // --- Handlers (Logic remains similar, UI upgraded) ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      addLog(`Selected ${e.target.files.length} files for ingestion.`);
    }
  };

  const handleUpload = async () => {
    if (!files.length || !uploadCategory) return alert("MISSING PARAMETERS");
    setLoadingUpload(true);
    addLog("Initiating upload sequence...");

    const formData = new FormData();
    formData.append("category", uploadCategory);
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setSelectedCategoryImages((prev) => [...data.uploadedImages!, ...prev]);
        setFiles([]);
        addLog("Upload complete. Assets secured.");
      } else {
        addLog(`ERROR: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`CRITICAL FAILURE: ${err.message}`);
    }
    setLoadingUpload(false);
  };

  // Fetch logic...
  useEffect(() => {
    if (!manageCategory) return;
    const fetchImages = async () => {
      setLoadingCategory(true);
      addLog(`Querying database for ${manageCategory}...`);
      try {
        const res = await fetch(`/api/upload?category=${encodeURIComponent(manageCategory)}`);
        const data = await res.json();
        setSelectedCategoryImages(data.images ?? []);
        addLog(`Retrieved ${data.images?.length || 0} assets.`);
      } catch (err) {
        console.error(err);
      }
      setLoadingCategory(false);
    };
    fetchImages();
  }, [manageCategory]);

  const handleBulkDelete = async () => {
    if (!confirm(`CONFIRM DELETION OF ${selectedToDelete.length} ASSETS?`)) return;
    addLog("Executing purge sequence...");
    // ... existing delete logic ...
    const toDelete = selectedToDelete.map((id) => ({ id }));
    setSelectedCategoryImages((prev) => prev.filter((img) => !selectedToDelete.includes(img.id)));
    setSelectedToDelete([]);
    
    await fetch("/api/upload/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: toDelete }),
    });
    addLog("Purge complete.");
  };

  const handleKillSwitch = async () => {
    const code = prompt("ENTER OVERRIDE CODE TO NUKE DATABASE:");
    if (code !== "NUKE-ALL-2025") return alert("ACCESS DENIED");
    
    addLog("WARNING: KILL SWITCH ACTIVATED.");
    await fetch("/api/upload/kill", { method: "POST" });
    setSelectedCategoryImages([]);
    addLog("SYSTEM RESET. ALL DATA LOST.");
  };

  if (isProd) return null;

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 selection:bg-green-900 selection:text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-1 space-y-8">
          <div className="border border-green-800 bg-black p-6 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.1)]">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Database className="text-green-500" /> COMMAND DECK
            </h1>
            
            {/* Status Log */}
            <div className="bg-zinc-900/50 p-4 rounded border border-green-900/50 h-32 overflow-y-auto text-xs mb-6 font-mono text-green-400">
               {statusLog.length === 0 && <span className="opacity-50">Waiting for input...</span>}
               {statusLog.map((log, i) => <div key={i}>{log}</div>)}
            </div>

            {/* Upload Control */}
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-gray-500">Target Sector</label>
              <select
                className="w-full bg-black border border-green-800 text-green-500 p-2 focus:ring-1 focus:ring-green-500 rounded"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
              >
                <option value="">-- SELECT SECTOR --</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-green-900 hover:border-green-500 hover:bg-green-900/10 transition-all rounded-lg p-8 text-center cursor-pointer group"
              >
                <UploadCloud className="mx-auto mb-2 text-gray-500 group-hover:text-green-500 transition-colors" />
                <p className="text-xs text-gray-500 group-hover:text-green-400">CLICK TO INGEST DATA</p>
                <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              </div>

              {files.length > 0 && (
                <button
                  onClick={handleUpload}
                  disabled={loadingUpload}
                  className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded transition-all uppercase tracking-widest"
                >
                  {loadingUpload ? "UPLOADING..." : "INITIATE TRANSFER"}
                </button>
              )}
            </div>
          </div>

          {/* Kill Switch Panel */}
          <div className="border border-red-900/50 bg-red-950/10 p-6 rounded-lg">
             <div className="flex items-center gap-2 text-red-500 mb-4 font-bold">
               <ShieldAlert /> DANGER ZONE
             </div>
             <p className="text-xs text-red-400 mb-4">Action is irreversible. Use with extreme caution.</p>
             <button
               onClick={handleKillSwitch}
               className="w-full border border-red-600 text-red-500 py-2 hover:bg-red-600 hover:text-black transition-colors uppercase text-xs font-bold"
             >
               ACTIVATE KILL SWITCH
             </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Visualization */}
        <div className="lg:col-span-2 border border-green-800 bg-zinc-950 rounded-lg p-6 min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-green-900 pb-4">
             <div className="flex items-center gap-4">
               <select
                  className="bg-black border border-green-800 text-green-500 p-1 text-sm rounded"
                  value={manageCategory}
                  onChange={(e) => setManageCategory(e.target.value)}
               >
                 <option value="">VIEW SECTOR...</option>
                 {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
               </select>
             </div>
             
             {selectedToDelete.length > 0 && (
               <button onClick={handleBulkDelete} className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1">
                 <Trash2 size={14} /> PURGE ({selectedToDelete.length})
               </button>
             )}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto bg-black/50 rounded-lg p-4 border border-green-900/30">
             {loadingCategory ? (
                <div className="text-center py-20 animate-pulse text-green-500">SCANNING DATABASE...</div>
             ) : selectedCategoryImages.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {selectedCategoryImages.map((img) => (
                   <div 
                     key={img.id} 
                     onClick={() => {
                        setSelectedToDelete(prev => prev.includes(img.id) ? prev.filter(i => i !== img.id) : [...prev, img.id]);
                     }}
                     className={`relative aspect-square cursor-pointer group border ${
                        selectedToDelete.includes(img.id) ? "border-red-500 opacity-50" : "border-green-900 hover:border-green-500"
                     } rounded-md overflow-hidden transition-all`}
                   >
                     <Image src={img.src} alt="Admin" fill className="object-cover" />
                     {selectedToDelete.includes(img.id) && (
                       <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                         <Trash2 className="text-white" />
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             ) : (
               <div className="flex items-center justify-center h-full text-green-900">
                  <span className="text-4xl opacity-20">NO SIGNAL</span>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}