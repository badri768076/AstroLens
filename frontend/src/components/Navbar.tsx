"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [deviceInfo, setDeviceInfo] = useState<string>("STANDBY");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:8000/health")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (isMounted) {
          setBackendStatus("online");
          setDeviceInfo(data.gpu_name || data.device || "GPU ENGINE");
        }
      })
      .catch(() => {
        if (isMounted) {
          setBackendStatus("offline");
          setDeviceInfo("STANDBY");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Explore" },
    { href: "/analyze", label: "Analyze Workstation" },
    { href: "/models", label: "Instruments" },
    { href: "/datasets", label: "Archive" },
    { href: "/methodology", label: "Methodology" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#020306]/95 backdrop-blur-md">
      <div className="max-w-[1680px] mx-auto flex items-center justify-between px-4 py-2 text-xs font-mono">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 border border-zinc-700 bg-zinc-900/60 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="12" r="8" strokeOpacity="0.6" />
              <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold tracking-widest text-white uppercase text-sm group-hover:text-cyan-300 transition">
              ASTROLENS
            </span>
            <span className="text-[10px] text-zinc-500 uppercase hidden sm:inline">
              // OBSERVATION AI
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 transition uppercase tracking-wider text-[11px] ${
                  isActive
                    ? "text-cyan-300 border-b-2 border-cyan-400 font-bold bg-white/[0.02]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Telemetry Status & Action */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 border border-zinc-800 bg-[#04060c] text-[10px]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendStatus === "online"
                  ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                  : backendStatus === "checking"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-zinc-600"
              }`}
            />
            <span className="text-zinc-400">
              {backendStatus === "online" ? `FASTAPI: ${deviceInfo}` : "STANDBY"}
            </span>
          </div>

          <Link
            href="/analyze"
            className="px-3.5 py-1 border border-cyan-400 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase tracking-wider transition text-[11px]"
          >
            Stage Observation
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center md:hidden gap-2">
          <Link
            href="/analyze"
            className="px-2 py-0.5 border border-cyan-400 bg-cyan-500 text-zinc-950 font-bold text-[10px] uppercase"
          >
            Analyze
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
            className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-800 bg-[#03060c] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2 font-mono text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1.5 px-2 transition ${
                    isActive ? "text-cyan-300 font-bold bg-white/5" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
