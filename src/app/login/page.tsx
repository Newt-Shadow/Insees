"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaMicrochip, FaUserAstronaut, FaLock, FaBuilding, FaEnvelope, FaArrowLeft, FaBolt } from "react-icons/fa";
import Link from "next/link";

export default function LoginPage() {
  const [view, setView] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HANDLERS ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      alert("Access Denied: " + res.error);
      setLoading(false);
    } else {
      router.push("/admin"); // Redirect to admin dashboard
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Auto login after signup
      await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      router.push("/admin");
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder logic - requires Email Service (SendGrid/Resend) implementation
    alert("Reset link sent to neural network (Check your email console - Feature pending API integration)");
    setView("login");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden font-[Poppins]">
      
      {/* --- BACKGROUND FX --- */}
      {/* Radial Gradient (The Emerald Glow) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,rgba(0,0,0,1)_70%)]" />
      
      {/* Circuit Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-yellow-500 rounded-full animate-pulse" />

      {/* --- MAIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-1"
      >
        {/* Holographic Border */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl blur opacity-40 animate-pulse" />
        
        <div className="relative bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4 p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:scale-110 transition-transform">
              <FaMicrochip size={32} />
            </Link>
            <h1 className="text-3xl font-orbitron font-bold text-white tracking-widest">
              INSEES <span className="text-emerald-500">GATEWAY</span>
            </h1>
            <p className="text-xs text-gray-400 mt-2 font-mono">SECURE AUTHENTICATION PROTOCOL</p>
          </div>

          <AnimatePresence mode="wait">
            
            {/* --- LOGIN VIEW --- */}
            {view === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <InputGroup icon={<FaEnvelope />} name="email" type="email" placeholder="Access ID (Email)" onChange={handleChange} />
                  <InputGroup icon={<FaLock />} name="password" type="password" placeholder="Passcode" onChange={handleChange} />
                  
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setView("forgot")} className="text-xs text-emerald-400 hover:text-emerald-300">
                      Forgot Passcode?
                    </button>
                  </div>

                  <button disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
                    {loading ? "AUTHENTICATING..." : "INITIATE LOGIN"}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OR CONNECT VIA</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <button 
                  onClick={() => signIn("google", { callbackUrl: "/admin" })}
                  className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition-all"
                >
                  <FcGoogle size={20} /> Google Neural Link
                </button>

                <p className="text-center text-sm text-gray-400 mt-4">
                  New Personnel? <button onClick={() => setView("signup")} className="text-emerald-400 font-bold hover:underline">Register Data</button>
                </p>
              </motion.div>
            )}

            {/* --- SIGNUP VIEW --- */}
            {view === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <form onSubmit={handleSignup} className="space-y-4">
                  <InputGroup icon={<FaUserAstronaut />} name="name" type="text" placeholder="Full Designation (Name)" onChange={handleChange} />
                  <InputGroup icon={<FaBuilding />} name="department" type="text" placeholder="Department / Unit" onChange={handleChange} />
                  <InputGroup icon={<FaEnvelope />} name="email" type="email" placeholder="Access ID (Email)" onChange={handleChange} />
                  <InputGroup icon={<FaLock />} name="password" type="password" placeholder="Set Passcode" onChange={handleChange} />

                  <button disabled={loading} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all flex items-center justify-center gap-2">
                    <FaBolt /> {loading ? "PROCESSING..." : "ESTABLISH IDENTITY"}
                  </button>
                </form>

                <button onClick={() => setView("login")} className="w-full text-sm text-gray-400 hover:text-white mt-2 flex items-center justify-center gap-2">
                  <FaArrowLeft size={10} /> Return to Login
                </button>
              </motion.div>
            )}

            {/* --- FORGOT PASSWORD VIEW --- */}
            {view === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30 text-red-500">
                  <FaLock size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Recovery Protocol</h3>
                <p className="text-sm text-gray-400">Enter your Access ID. We will transmit a reset token to your neural link.</p>
                
                <form onSubmit={handleForgot} className="space-y-4">
                  <InputGroup icon={<FaEnvelope />} name="email" type="email" placeholder="Access ID (Email)" onChange={handleChange} />
                  <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg border border-white/10">
                    TRANSMIT LINK
                  </button>
                </form>

                <button onClick={() => setView("login")} className="text-sm text-gray-500 hover:text-white">
                  Cancel Protocol
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// --- REUSABLE INPUT COMPONENT ---
function InputGroup({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono text-sm"
      />
    </div>
  );
}