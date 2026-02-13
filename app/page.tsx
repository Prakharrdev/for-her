import ScrollScene from "@/app/components/ScrollScene";
import ValentineProposal from "@/app/components/ValentineProposal";

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

      {/* The Finale */}
      <section className="relative z-20 bg-black/50 backdrop-blur-sm">
        <ValentineProposal />
      </section>
    </main>
  );
}
