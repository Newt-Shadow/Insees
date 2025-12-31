"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Uses your existing upload API
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      // Supports standard Cloudinary response or your custom response
      const url = data.url || data.secure_url || data.data?.url; 
      
      if (url) {
        onChange(url);
      } else {
        alert("Upload successful but no URL returned.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-4">
        {/* Preview / Upload Box */}
        {value ? (
          <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-zinc-700 group bg-black">
            <Image src={value} alt="Preview" fill className="object-cover" />
            <button
              onClick={() => onChange("")}
              type="button"
              className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-24 h-24 shrink-0 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-zinc-800/50 transition-all group">
            <div className="flex flex-col items-center justify-center pt-2 pb-3">
              {uploading ? (
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-zinc-500 group-hover:text-blue-400 mb-1" />
                  <span className="text-[10px] text-zinc-500 uppercase font-bold group-hover:text-blue-400">Upload</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleUpload} 
              accept="image/*" 
              disabled={uploading} 
            />
          </label>
        )}

        {/* Manual URL Input (Fallback) */}
        <div className="flex-1 space-y-1">
          <label className="text-xs text-zinc-500 uppercase font-bold flex items-center gap-2">
            <ImageIcon size={12} /> Image Source
          </label>
          <input 
            type="text"
            name="image" // Important for FormData
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Upload file OR paste URL..."
            className="w-full bg-black border border-zinc-700 p-3 rounded text-white text-sm focus:border-blue-500 transition-colors placeholder:text-zinc-600" 
          />
        </div>
      </div>
    </div>
  );
}