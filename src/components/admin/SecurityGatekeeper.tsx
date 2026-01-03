"use client";

import { useEffect, useRef, useState } from "react";
import { signOut, useSession, getCsrfToken } from "next-auth/react";
import { FaUserClock } from "react-icons/fa";

const MAX_TABS = 3;
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 Minutes
const WARNING_MS = 60 * 1000; // Warning 1 min before logout
const HEARTBEAT_INTERVAL_MS = 3000; // Local Tab Communication (Fast)
const PEER_TIMEOUT_MS = 10000; 
const DB_HEARTBEAT_MS = 2 * 60 * 1000; // ✅ Database Update (Slow - Every 2 mins)

type Peer = {
  id: string;
  lastSeen: number;
};

export default function SecurityGatekeeper() {
  const lastActivityRef = useRef<number>(Date.now());
  const { data: session } = useSession();
  const [warning, setWarning] = useState(false);
  
  // Refs
  const peers = useRef<Map<string, number>>(new Map());
  const tabId = useRef<string>(Math.random().toString(36).substring(7));
  const csrfToken = useRef<string | undefined>(undefined);
  
  // Timers
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);
  const pruneTimer = useRef<NodeJS.Timeout | null>(null);
  const dbHeartbeatTimer = useRef<NodeJS.Timeout | null>(null); // ✅ New Timer

  useEffect(() => {
    if (!session) return;

    getCsrfToken().then((token) => {
      csrfToken.current = token;
    });

    // --- 1. CHANNEL SETUP ---
    const channel = new BroadcastChannel("insees_admin_security");

    const handleMessage = (msg: MessageEvent) => {
      const { type, sender } = msg.data;
      if (sender === tabId.current) return;

      const now = Date.now();

      if (type === "HEARTBEAT" || type === "PING") {
        peers.current.set(sender, now);
      }

      if (type === "PING") {
        channel.postMessage({ type: "HEARTBEAT", sender: tabId.current });
      }

      if (type === "GOODBYE") {
        peers.current.delete(sender);
      }
    };

    channel.onmessage = handleMessage;

    // --- 2. LOCAL TAB HEARTBEAT & PRUNING ---
    channel.postMessage({ type: "PING", sender: tabId.current });

    // Send Local Heartbeat (Fast)
    heartbeatTimer.current = setInterval(() => {
      channel.postMessage({ type: "HEARTBEAT", sender: tabId.current });
    }, HEARTBEAT_INTERVAL_MS);

    // ✅ DATABASE HEARTBEAT (Slow & Efficient)
    // This prevents the "Connection Pool Timeout" crash
    const sendDbHeartbeat = () => {
      // Only update if tab is visible to save resources
      if (document.visibilityState === 'visible') {
        fetch("/api/admin/heartbeat", { method: "POST" }).catch((err) => {
            console.warn("Background heartbeat failed", err);
        });
      }
    };
    // Send one immediately, then every 2 mins
    sendDbHeartbeat(); 
    dbHeartbeatTimer.current = setInterval(sendDbHeartbeat, DB_HEARTBEAT_MS);


    // Prune dead peers
    pruneTimer.current = setInterval(() => {
      const now = Date.now();
      let activePeers = 0;
      
      peers.current.forEach((lastSeen, id) => {
        if (now - lastSeen > PEER_TIMEOUT_MS) {
          peers.current.delete(id);
        } else {
          activePeers++;
        }
      });

      // 🔒 MAX TAB PROTECTION
      if (activePeers >= MAX_TABS) {
         console.warn(`Too many admin tabs open (${activePeers + 1}). Closing this session.`);
         signOut({ callbackUrl: "/login?error=max_tabs" });
      }
    }, HEARTBEAT_INTERVAL_MS);


    // --- 3. INACTIVITY TIMER ---
    const logout = () => signOut({ callbackUrl: "/login?error=session_expired" });

    const updateActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current < 1000) return;
      
      lastActivityRef.current = now;

      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      setWarning(false);

      warningTimer.current = setTimeout(() => setWarning(true), INACTIVITY_LIMIT_MS - WARNING_MS);
      inactivityTimer.current = setTimeout(logout, INACTIVITY_LIMIT_MS);
    };
    
    const onUserActivity = () => {
        requestAnimationFrame(updateActivity);
    };
    
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach(event => window.addEventListener(event, onUserActivity, { passive: true }));
    updateActivity();


    // --- 4. EXIT HANDLER (Last Tab Logic) ---
    const handleUnload = () => {
      channel.postMessage({ type: "GOODBYE", sender: tabId.current });

      const now = Date.now();
      let activePeers = 0;
      peers.current.forEach((lastSeen) => {
        if (now - lastSeen < PEER_TIMEOUT_MS) activePeers++;
      });

      if (activePeers === 0 && csrfToken.current) {
        const params = new URLSearchParams();
        params.append("csrfToken", csrfToken.current);
        params.append("callbackUrl", "/login");
        params.append("json", "true");

        const blob = new Blob([params.toString()], { type: "application/x-www-form-urlencoded" });
        
        // Try Beacon first
        const sent = navigator.sendBeacon("/api/auth/signout", blob);

        // Fallback
        if (!sent) {
            fetch("/api/auth/signout", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params,
                keepalive: true,
            });
        }
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      channel.close();
      window.removeEventListener("beforeunload", handleUnload);
      events.forEach(event => window.removeEventListener(event, onUserActivity));
      
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
      if (pruneTimer.current) clearInterval(pruneTimer.current);
      if (dbHeartbeatTimer.current) clearInterval(dbHeartbeatTimer.current); // ✅ Clear DB Timer
    };
  }, [session]);

  if (!warning) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-red-500/50 p-8 rounded-2xl max-w-md text-center shadow-2xl">
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500 text-3xl animate-pulse">
          <FaUserClock />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Session Expiring</h2>
        <p className="text-zinc-400 mb-6">
          You have been inactive. For security, you will be logged out in <span className="text-red-400 font-mono font-bold">60 seconds</span>.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all"
        >
          I&apos;m still here
        </button>
      </div>
    </div>
  );
}