"use client";

import { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { getSignature } from "@/app/actions/cloudinary";

interface ImageUploadProps {
  value: string;                     // ✅ controlled value
  onChange: (url: string) => void;   // ✅ controlled setter
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
}: ImageUploadProps) {
  const [image, setImage] = useState(value);
  const [uploading, setUploading] = useState(false);

  // ✅ keep internal state in sync with parent
  useEffect(() => {
    setImage(value);
  }, [value]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Get Secure Signature from Server
      const { timestamp, signature } = await getSignature();

      // 2. Prepare Direct Upload Form Data
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "api_key",
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ""
      );
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "gallery");

      // 3. Upload Directly to Cloudinary
      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setImage(data.secure_url);
        onChange(data.secure_url); // ✅ notify parent
      } else {
        console.error("Cloudinary error:", data);
        alert(
          `Upload failed: ${data.error?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400 block">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {image ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-700 group">
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImage("");
                onChange(""); // ✅ keep parent in sync
              }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400"
            >
              <FaTrash />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center bg-zinc-900/50">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaCloudUploadAlt className="text-zinc-600 text-2xl" />
            )}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-green-400 hover:file:bg-zinc-700 cursor-pointer"
        />
      </div>
    </div>
  );
}
