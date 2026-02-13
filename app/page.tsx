import ScrollScene from "@/app/components/ScrollScene";
import SeasonCanvas from "@/app/components/SeasonCanvas";
import MemoryLane from "@/app/components/MemoryLane";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <section className="h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="text-center p-8">
            <h1 className="text-5xl font-bold mb-4">Prologue</h1>
            <p className="text-xl text-zinc-400">Scroll down to witness the eternal bloom.</p>
        </div>
      </section>
      
      <ScrollScene />

      {/* Scene 3 — Memory Lane over Seasonal Background */}
      <section className="relative">
        {/* The Background (Stays fixed while we scroll this section) */}
        <div className="sticky top-0 h-screen w-full -z-10">
          <SeasonCanvas />
        </div>

        {/* The Content (Scrolls naturally over the seasonal background) */}
        <MemoryLane />
      </section>
      
      <section className="h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
        {/* Sakura petal background effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-8 h-8 bg-pink-300 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute top-32 right-32 w-6 h-6 bg-pink-200 rounded-full blur-sm animate-pulse delay-100"></div>
          <div className="absolute bottom-40 left-40 w-10 h-10 bg-pink-400 rounded-full blur-md animate-pulse delay-200"></div>
          <div className="absolute bottom-20 right-20 w-7 h-7 bg-pink-300 rounded-full blur-sm animate-pulse delay-300"></div>
        </div>
        
        <div className="text-center p-8 z-10">
            <h2 className="text-4xl md:text-5xl font-light text-pink-200/80 mb-6">
              Epilogue
            </h2>
            <p className="text-xl text-pink-200/60 mt-4 font-light max-w-2xl mx-auto">
              The moment passes, but the memory remains forever.
            </p>
        </div>
      </section>
    </main>
  );
}
