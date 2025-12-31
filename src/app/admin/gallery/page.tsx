"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, Database, Folder } from "lucide-react";

interface UploadedImage {
  id: string;
  src: string;
  category: string;
}

const categories = ["Alpha Crescendo", "Orientation", "Freshers", "Farewell"] as const;

export default function MediaGalleryPage() {
  const [manageCategory, setManageCategory] = useState<string>("");
  const [selectedCategoryImages, setSelectedCategoryImages] = useState<UploadedImage[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!manageCategory) return;
    const loadImages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/upload?category=${encodeURIComponent(manageCategory)}`);
            const data = await res.json();
            setSelectedCategoryImages(data.images ?? []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };
    loadImages();
  }, [manageCategory]);

  const handleUpload = async () => {
    if (!files.length || !uploadCategory) return alert("Select files and category");
    setUploading(true);
    const formData = new FormData();
    formData.append("category", uploadCategory);
    files.forEach(f => formData.append("files", f));

    try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if(data.success) {
            setFiles([]);
            alert("Upload Successful");
            if(manageCategory === uploadCategory) {
               // Refresh if viewing same category
               const res2 = await fetch(`/api/upload?category=${encodeURIComponent(manageCategory)}`);
               const data2 = await res2.json();
               setSelectedCategoryImages(data2.images ?? []);
            }
        }
    } catch (e) { alert("Upload Failed"); }
    setUploading(false);
  };

  const handleBulkDelete = async () => {
    if(!confirm(`Delete ${selectedToDelete.length} images?`)) return;
    const toDelete = selectedToDelete.map(id => ({ id }));
    await fetch("/api/upload/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: toDelete })
    });
    setSelectedCategoryImages(prev => prev.filter(img => !selectedToDelete.includes(img.id)));
    setSelectedToDelete([]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold font-orbitron text-green-400 mb-6">Media Database</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Control */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-fit">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><UploadCloud size={20}/> Ingest Data</h3>
            <div className="space-y-4">
                <select className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-green-500"
                    value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}>
                    <option value="">Select Target Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-green-500 rounded-lg p-8 text-center cursor-pointer transition-all">
                    <p className="text-xs text-gray-500 uppercase">{files.length > 0 ? `${files.length} Files` : "Click to Select"}</p>
                    <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={e => setFiles(Array.from(e.target.files || []))} className="hidden"/>
                </div>
                <button onClick={handleUpload} disabled={uploading || files.length === 0}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-black font-bold py-3 rounded uppercase text-sm">
                    {uploading ? "Uploading..." : "Start Upload"}
                </button>
            </div>
        </div>
        {/* Gallery View */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-xl min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center border-b border-zinc-700 pb-4 mb-4">
                <select className="bg-black border border-zinc-700 text-sm p-1 rounded"
                    value={manageCategory} onChange={e => setManageCategory(e.target.value)}>
                    <option value="">Select Category to View...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {selectedToDelete.length > 0 && (
                    <button onClick={handleBulkDelete} className="text-red-500 text-xs font-bold flex items-center gap-2">
                        <Trash2 size={14}/> DELETE SELECTION
                    </button>
                )}
            </div>
            <div className="flex-1 bg-black/50 rounded-lg p-4 overflow-y-auto max-h-[600px]">
                {loading ? <div className="text-center text-green-500 animate-pulse mt-20">Reading Database...</div> : 
                 selectedCategoryImages.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedCategoryImages.map(img => (
                            <div key={img.id} onClick={() => setSelectedToDelete(prev => prev.includes(img.id) ? prev.filter(i => i !== img.id) : [...prev, img.id])}
                                className={`relative aspect-square rounded overflow-hidden cursor-pointer border-2 ${selectedToDelete.includes(img.id) ? 'border-red-500' : 'border-transparent hover:border-green-500'}`}>
                                <Image src={img.src} alt="" fill className="object-cover"/>
                                {selectedToDelete.includes(img.id) && <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center"><Trash2 className="text-white"/></div>}
                            </div>
                        ))}
                    </div>
                ) : <div className="text-center py-20 opacity-50"><Database className="mx-auto mb-2"/>No Assets Found</div>}
            </div>
        </div>
      </div>
    </div>
  );
}