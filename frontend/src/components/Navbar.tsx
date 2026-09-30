"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:8000/health")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(() => {
        if (isMounted) setIsOnline(true);
      })
      .catch(() => {
        if (isMounted) setIsOnline(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Explore" },
    { href: "/analyze", label: "Analyze" },
    { href: "/models", label: "Models" },
    { href: "/datasets", label: "Archive" },
    { href: "/methodology", label: "Methodology" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#010204]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between px-5 py-3 text-xs">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold tracking-[0.2em] text-white uppercase text-sm group-hover:text-cyan-200 transition-colors">
              ASTROLENS
            </span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider hidden sm:inline">
              ASTRONOMICAL EXPLORER
            </span>
          </div>
        </Link>

        {/* Clean Instrument Navigation */}
        <nav className="hidden md:flex items-center gap-7 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors tracking-wider uppercase text-[11px] py-1 ${
                  isActive
                    ? "text-white font-medium border-b border-cyan-400"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Status Indicator & Quick Action */}
        <div className="hidden sm:flex items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline === true
                  ? "bg-emerald-400"
                  : isOnline === false
                  ? "bg-zinc-600"
                  : "bg-amber-400 animate-pulse"
              }`}
            />
            <span className="text-zinc-500">
              {isOnline === true ? "INSTRUMENT ACTIVE" : isOnline === false ? "STANDBY" : "CONNECTING"}
            </span>
          </div>

          <Link
            href="/analyze"
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 hover:text-white uppercase tracking-wider text-[11px] transition"
          >
            Open Observation
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center md:hidden gap-3">
          <Link
            href="/analyze"
            className="px-2.5 py-1 bg-white/10 border border-white/20 text-white text-[11px] uppercase tracking-wider font-mono"
          >
            Analyze
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
            className="p-1 text-zinc-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/[0.08] bg-[#020306] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3 font-mono text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1.5 transition-colors uppercase tracking-wider ${
                    isActive ? "text-cyan-300 font-medium" : "text-zinc-400 hover:text-white"
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
