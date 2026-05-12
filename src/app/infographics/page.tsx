export default function InfographicsPage() {
  const pages = Array.from({ length: 7 }, (_, i) => `/infographics/rr25-page-${i + 1}.png`);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">INFOGRAPHICS</h1>
        <p className="mt-2 text-slate-600 text-sm">
          Scroll down to view each page like a photo feed.
        </p>
      </div>

      <div className="glass-card p-4">
        <div className="space-y-5">
          {pages.map((src, index) => (
            <article key={src} className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Page {index + 1}
              </div>
              <img
                src={src}
                alt={`Infographics page ${index + 1}`}
                className="w-full h-auto block"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
