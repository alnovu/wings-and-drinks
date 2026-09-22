import { games } from "@/data/games";
import Link from "next/link";
import { Gamepad2, GlassWater, MessageCircleQuestion } from "lucide-react";

const iconMap = {
  Gamepad2: Gamepad2,
  GlassWater: GlassWater,
  MessageCircleQuestion: MessageCircleQuestion,
};

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center p-6 bg-black text-white overflow-hidden">

      {/* Glow ambientales en el fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl pt-16 pb-12 relative z-10">
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 pb-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-300 drop-shadow-sm">
            Wings and Drinks
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-medium max-w-xl mx-auto leading-relaxed">
            Selecciona un juego
          </p>
        </header>

        <div className="flex justify-center w-full mt-8">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.active ? game.route : "#"}
              className={`group relative overflow-hidden rounded-[2.5rem] p-10 md:p-12 transition-all duration-500 ease-out active:scale-[0.97] max-w-2xl w-full text-center ${game.active
                  ? "bg-white/[0.03] hover:bg-white/[0.06] hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(236,72,153,0.3)] backdrop-blur-2xl border border-white/10 cursor-pointer"
                  : "hidden"
                }`}
            >
              {/* Resplandor interior al hacer hover/tap */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 group-hover:from-pink-100 group-hover:to-white transition-colors duration-500">
                {game.title}
              </h2>

              <p className="text-base md:text-lg text-white/50 leading-relaxed font-medium relative z-10 max-w-md mx-auto">
                {game.description}
              </p>

              {/* Botón flotante sutil de indicación */}
              <div className="mt-8 relative z-10">
                <span className="inline-flex items-center gap-2 text-pink-400/80 font-bold tracking-widest uppercase text-sm group-hover:text-pink-300 transition-colors">
                  Jugar Ahora
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
