"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [deviceInfo, setDeviceInfo] = useState<string>("Detecting");

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        setBackendStatus("online");
        setDeviceInfo(data.gpu_name || data.device || "CUDA");
      })
      .catch(() => {
        setBackendStatus("offline");
        setDeviceInfo("Offline Demo Mode");
      });
  }, []);

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/analyze", label: "Analyze Pipeline" },
    { href: "/models", label: "Model Performance" },
    { href: "/datasets", label: "Dataset Explorer" },
    { href: "/methodology", label: "Methodology" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-950/60 bg-[#07090e]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)] group-hover:border-cyan-400/60 transition">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.5-6.5-2.1 2.1m-8.8 8.8-2.1 2.1m0-13 2.1 2.1m8.8 8.8 2.1 2.1" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition">
                AstroLens
              </span>
              <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 text-[10px] font-mono font-medium tracking-wide text-cyan-400 border border-cyan-800/40">
                DL v1.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-wider font-mono">
              Deep Learning Astronomy Lab
            </p>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium tracking-wide transition ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* System Status Pill */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                backendStatus === "online"
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  : backendStatus === "checking"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-zinc-500"
              }`}
            />
            <span className="text-[11px] font-mono text-zinc-300">
              {backendStatus === "online" ? `API: ${deviceInfo}` : backendStatus === "checking" ? "Connecting API..." : "API Standby"}
            </span>
          </div>

          <Link
            href="/analyze"
            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition"
          >
            Launch Analysis
          </Link>
        </div>
      </div>
    </header>
  );
}
