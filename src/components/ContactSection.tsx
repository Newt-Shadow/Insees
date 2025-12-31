"use client";
import React, { useState } from "react";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { useEffect } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed");
      }

      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Email failed. Please try again.");
    } finally {
      // SAFETY NET — ensures UI never hangs
      setTimeout(() => {
        setStatus((s) => (s === "sending" ? "idle" : s));
      }, 3000);
    }

  };

  useEffect(() => {
    if (status === "sent") {
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 4000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [status]);



  return (
    <section  className="py-24  px-6 bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Info Column */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold font-orbitron text-white mb-2">ESTABLISH UPLINK</h2>
            <p className="text-oz-emerald font-mono text-sm">  {"// SECURE CONNECTION"}</p>
          </div>

          <p className="text-gray-400 leading-relaxed">
            Have a query about sponsorship, events, or membership?
            Transmit your message directly to our core team.
          </p>

          <div className="space-y-6 pt-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-900 rounded-lg border border-white/10 text-oz-emerald">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white">Base Coordinates</h4>
                <p className="text-sm text-gray-500">NIT Silchar, Assam, India - 788010</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-900 rounded-lg border border-white/10 text-oz-gold">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white">Electronic Mail</h4>
                <p className="text-sm text-gray-500">inseessociety.nits@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column (Terminal Style) */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-oz-emerald to-cyan-500 rounded-lg blur opacity-20" />
          <div className="relative bg-zinc-950 border border-white/10 rounded-lg p-8 shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-auto text-xs font-mono text-gray-600">bash --contact</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Input.Name</label>
                <input
                  type="text"
                  className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-oz-emerald focus:outline-none focus:ring-1 focus:ring-oz-emerald transition-all font-mono text-sm"
                  placeholder="_enter_identity"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Input.Email</label>
                <input
                  type="email"
                  className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-oz-emerald focus:outline-none focus:ring-1 focus:ring-oz-emerald transition-all font-mono text-sm"
                  placeholder="_enter_address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Input.Message</label>
                <textarea
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-oz-emerald focus:outline-none focus:ring-1 focus:ring-oz-emerald transition-all font-mono text-sm resize-none"
                  placeholder="_type_transmission..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 bg-oz-emerald/10 border border-oz-emerald/50 text-oz-emerald font-bold font-mono hover:bg-oz-emerald  transition-all flex items-center justify-center gap-2 group"
              >
                {status === "idle" && (
                  <>EXECUTE_SEND() <Send size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}

                {status === "sending" && (
                  <span className="animate-pulse">TRANSMITTING...</span>
                )}

                {status === "sent" && (
                  <span className="text-green-400">TRANSMITTED ✓</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}