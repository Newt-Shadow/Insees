import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center p-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Access Restricted</h1>
      <p className="text-gray-400 max-w-md mb-8">
        Your account is registered but does not have Admin privileges.
        Contact a Super Admin to approve your access.
      </p>
      <Link href="/" className="bg-zinc-800 px-6 py-2 rounded hover:bg-zinc-700 transition">
        Return Home
      </Link>
    </div>
  );
}