import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020408] py-10 text-zinc-400 text-xs">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-widest text-white uppercase text-sm">
              ASTROLENS
            </span>
            <span className="text-[10px] font-mono text-cyan-400 border border-cyan-800/40 bg-cyan-950/30 px-1.5 py-0.5 rounded">
              OBSERVATORY WORKSTATION
            </span>
          </div>
          <p className="mt-2 text-zinc-400 max-w-xl text-xs leading-relaxed">
            AI-powered astronomical image analysis system. Identifies celestial objects, performs morphological classification, resolves catalog references via SIMBAD astrometry, and visualizes sky coordinates.
          </p>
          <div className="mt-2 text-[10px] font-mono text-zinc-500 flex items-center gap-4">
            <span>EPOCH: J2000.0</span>
            <span>SYSTEM: ICRS / EQUATORIAL</span>
            <span>SIMBAD ASTROMETRY</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 font-mono text-xs text-zinc-400">
          <Link href="/" className="hover:text-cyan-300 transition">Explore</Link>
          <Link href="/analyze" className="hover:text-cyan-300 transition">Analyze</Link>
          <Link href="/models" className="hover:text-cyan-300 transition">Models</Link>
          <Link href="/datasets" className="hover:text-cyan-300 transition">Datasets</Link>
          <Link href="/methodology" className="hover:text-cyan-300 transition">Methodology</Link>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded border border-white/15 bg-white/5 px-2.5 py-1 text-zinc-300 hover:text-white hover:border-cyan-500/40 transition"
          >
            API Schema Docs ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
