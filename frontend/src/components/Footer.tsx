import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#010204] py-10 text-zinc-400 text-xs select-none">
      <div className="mx-auto max-w-[1720px] px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-[0.2em] text-white uppercase text-sm">
              ASTROLENS
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              ASTRONOMICAL EXPLORATION INSTRUMENT
            </span>
          </div>
          <p className="text-zinc-500 max-w-xl text-xs font-sans leading-relaxed">
            Scientific image exploration instrument connecting optical telescope exposures with deep morphological
            classification, Vision Transformer metric retrieval, and CDS SIMBAD equatorial astrometry.
          </p>
          <div className="text-[10px] font-mono text-zinc-600 flex items-center gap-4">
            <span>EPOCH: J2000.0</span>
            <span>•</span>
            <span>SYSTEM: ICRS EQUATORIAL</span>
            <span>•</span>
            <span>CDS SIMBAD ASTROMETRY</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
          <Link href="/" className="hover:text-white transition-colors">Explore</Link>
          <Link href="/analyze" className="hover:text-white transition-colors">Analyze</Link>
          <Link href="/models" className="hover:text-white transition-colors">Models</Link>
          <Link href="/datasets" className="hover:text-white transition-colors">Archive</Link>
          <Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="border border-white/10 hover:border-white/30 px-3 py-1 text-zinc-400 hover:text-white transition-colors"
          >
            API Docs ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
