// src/app/admin/logs/LogFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { useDebouncedCallback } from "use-debounce"; // Install: npm i use-debounce

export default function LogFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper to update URL params
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("q", term);
    else params.delete("q");
    router.replace(`/admin/logs?${params.toString()}`);
  }, 300);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`/admin/logs?${params.toString()}`);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by User, Email, or Action Details..."
            className="w-full bg-black border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("q")?.toString()}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select 
            className="bg-zinc-800 border border-zinc-700 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
            onChange={(e) => handleFilter("action", e.target.value)}
            defaultValue={searchParams.get("action")?.toString()}
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="CREATE">Created Items</option>
            <option value="DELETE">Deleted Items</option>
            <option value="UPDATE">Updates</option>
            <option value="REJECT">Rejections</option>
          </select>

          <select 
            className="bg-zinc-800 border border-zinc-700 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
            onChange={(e) => handleFilter("role", e.target.value)}
            defaultValue={searchParams.get("role")?.toString()}
          >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>
        
        {/* Clear Button */}
        {(searchParams.has("q") || searchParams.has("action") || searchParams.has("role")) && (
          <button 
            onClick={() => router.push("/admin/logs")}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30"
          >
            <FaTimes /> Clear
          </button>
        )}
      </div>
    </div>
  );
}