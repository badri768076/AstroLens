export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold">AstroLens</h1>

        <button className="rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-900">
          About
        </button>
      </nav>

      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-400">
          AI × Astronomy
        </p>

        <h2 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Explore the Universe
          <br />
          with AI.
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          AstroLens uses deep learning to analyze astronomical objects,
          discover similar objects, and identify unusual observations.
        </p>

        <a
  href="/analyze"
  className="mt-10 rounded-xl bg-white px-8 py-4 font-semibold text-black transition hover:bg-zinc-200"
>
  Analyze an Image →
</a>
      </section>
    </main>
  );
}