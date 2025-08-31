"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UploadedImage {
  id: number;
  src: string;
  key: string;
  category: string;
}

type BulkDeleteResult = {
  id: number;
  deleted: boolean;
};

const categories = ["Alpha Cresando", "Orientation", "Freshers", "Farewell"] as const;

export default function AdminPage() {
  const router = useRouter();
  const isProd = process.env.NODE_ENV === "production";

  // Redirect to home in production
  useEffect(() => {
    if (isProd) router.push("/");
  }, [isProd, router]);

  const [files, setFiles] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState<string>("");
  const [manageCategory, setManageCategory] = useState<string>("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [selectedCategoryImages, setSelectedCategoryImages] = useState<UploadedImage[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------------- Upload ----------------
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!files.length || !uploadCategory) return alert("Select files and category");

    setLoadingUpload(true);
    const formData = new FormData();
    formData.append("category", uploadCategory);
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data: {
        success: boolean;
        uploadedImages?: UploadedImage[];
        error?: string;
      } = await res.json();

      if (data.success && data.uploadedImages?.length) {
        setSelectedCategoryImages((prev) => [...(data.uploadedImages ?? []), ...prev]);
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        alert("Upload failed: " + (data.error ?? "Unknown error"));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert("Upload failed: " + message);
    }

    setLoadingUpload(false);
  };

  // ---------------- Fetch Images ----------------
  useEffect(() => {
    if (!manageCategory) return setSelectedCategoryImages([]);

    const fetchImages = async () => {
      setLoadingCategory(true);
      try {
        const res = await fetch(
          `/api/upload?category=${encodeURIComponent(manageCategory)}&t=${Date.now()}`
        );
        const data: { images?: UploadedImage[] } = await res.json();
        setSelectedCategoryImages((data.images ?? []).filter((img) => !!img.src));
        setSelectedToDelete([]);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        alert("Failed to fetch images: " + message);
        setSelectedCategoryImages([]);
      }
      setLoadingCategory(false);
    };

    fetchImages();
  }, [manageCategory]);

  // ---------------- Toggle Select ----------------
  const toggleSelectImage = (id: number) => {
    setSelectedToDelete((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ---------------- Bulk Delete ----------------
  const handleBulkDelete = async () => {
    if (!selectedToDelete.length) return alert("Select at least one image to delete");
    if (!confirm(`Delete ${selectedToDelete.length} images?`)) return;

    const toDelete = selectedCategoryImages
      .filter((img) => selectedToDelete.includes(img.id))
      .map((img) => ({ id: img.id, url: img.src }));

    // Optimistically remove images from UI
    setSelectedCategoryImages((prev) => prev.filter((img) => !selectedToDelete.includes(img.id)));
    setSelectedToDelete([]);

    try {
      const res = await fetch("/api/upload/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: toDelete }),
      });
      const data: {
        success: boolean;
        results?: BulkDeleteResult[];
        error?: string;
      } = await res.json();
      if (!data.success) {
        alert("Some images could not be deleted: " + (data.error ?? "Unknown error"));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert("Failed to delete: " + message);
    }
  };

  if (isProd) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-12">
      {/* Upload Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">📤 Upload Gallery Images</h1>

        <select
          className="border text-cyan-600 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={uploadCategory}
          onChange={(e) => setUploadCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            📁 Select Images
          </button>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {files.map((file, idx) => (
              <div key={idx} className="relative border rounded overflow-hidden">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={200}
                  height={200}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 w-full text-center">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loadingUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 hover:bg-blue-700 transition"
        >
          {loadingUpload ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Manage Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-4">🖼 Manage Images by Category</h1>

        <div className="flex gap-4 items-center mb-4">
          <select
            className="border text-cyan-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={manageCategory}
            onChange={(e) => setManageCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {selectedToDelete.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete Selected ({selectedToDelete.length})
            </button>
          )}
        </div>

        {loadingCategory && <p>Loading images...</p>}

        {!loadingCategory && selectedCategoryImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-2">
            {selectedCategoryImages.map((img) => (
              <div key={img.id} className="relative border rounded overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.category}
                  width={200}
                  height={200}
                  className="w-full h-24 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <input
                  type="checkbox"
                  checked={selectedToDelete.includes(img.id)}
                  onChange={() => toggleSelectImage(img.id)}
                  className="absolute top-1 left-1 w-4 h-4"
                />
              </div>
            ))}
          </div>
        )}

        {!loadingCategory && selectedCategoryImages.length === 0 && manageCategory && (
          <p>No images found for {manageCategory}.</p>
        )}
      </div>
    </div>
  );
}
