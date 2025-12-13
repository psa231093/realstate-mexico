import { SearchBar } from "./SearchBar";

export function SearchHero() {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920')",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Rentas. Casas.
            <br />
            Agentes. Préstamos.
          </h1>
        </div>

        <SearchBar />
      </div>
    </section>
  );
}
