"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { marcas, Marca } from "@/data/marcas";
import { X, RefreshCw } from "lucide-react";

export default function PlayAdivinaMarca() {
  const router = useRouter();
  const [currentMarca, setCurrentMarca] = useState<Marca | null>(null);
  
  // Estado: "preparing" (cuenta regresiva de 3s) o "playing" (muestra la marca)
  const [gameState, setGameState] = useState<"preparing" | "playing">("preparing");
  const [countdown, setCountdown] = useState(3);

  const [allMarcas, setAllMarcas] = useState<Marca[]>(marcas);
  const [deck, setDeck] = useState<Marca[]>([]);

  // Función para barajar (Fisher-Yates)
  const shuffleArray = (array: Marca[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // Inicializar al montar y cargar marcas extra
  useEffect(() => {
    let combinadas = [...marcas];
    
    try {
      // 1. Cargar paquetes instalados
      const installedStr = localStorage.getItem("installed_packages");
      if (installedStr) {
        const installedIds = JSON.parse(installedStr) as string[];
        for (const pid of installedIds) {
          const pkgData = localStorage.getItem(`package_${pid}`);
          if (pkgData) {
            const pkgMarcas = JSON.parse(pkgData) as Marca[];
            combinadas = [...combinadas, ...pkgMarcas];
          }
        }
      }

      // 2. Cargar marcas custom (individuales del buscador)
      const customStr = localStorage.getItem("custom_marcas");
      if (customStr) {
        const customMarcas = JSON.parse(customStr) as Marca[];
        combinadas = [...combinadas, ...customMarcas];
      }
      
      // 3. Filtrar por categorías seleccionadas
      const activeCatStr = localStorage.getItem("active_categories");
      if (activeCatStr) {
        const activeCategories = JSON.parse(activeCatStr) as string[];
        if (activeCategories.length > 0) {
          const filtered = combinadas.filter(m => m.categoria && activeCategories.includes(m.categoria));
          // Seguro contra fallos: si el filtro deja 0 marcas, ignoramos el filtro
          if (filtered.length > 0) {
            combinadas = filtered;
          }
        }
      }
    } catch (e) {
      console.error("Error leyendo tienda o categorías local", e);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllMarcas(combinadas);

    // Creamos el mazo barajado inicial
    const initialDeck = shuffleArray(combinadas);
    const firstMarca = initialDeck.pop();
    
    if (firstMarca) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentMarca(firstMarca);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeck(initialDeck);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGameState("preparing");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickRandomMarca = () => {
    if (deck.length > 0) {
      const nextDeck = [...deck];
      const nextMarca = nextDeck.pop();
      if (nextMarca) setCurrentMarca(nextMarca);
      setDeck(nextDeck);
    } else {
      // Si nos quedamos sin cartas, volvemos a barajar todas
      const newDeck = shuffleArray(allMarcas);
      
      // Nos aseguramos que la primera carta del nuevo mazo no sea exactamente 
      // la misma última carta que acabamos de jugar
      if (newDeck.length > 1 && currentMarca && newDeck[newDeck.length - 1].id === currentMarca.id) {
         const temp = newDeck[newDeck.length - 1];
         newDeck[newDeck.length - 1] = newDeck[0];
         newDeck[0] = temp;
      }
      
      const nextMarca = newDeck.pop();
      if (nextMarca) setCurrentMarca(nextMarca);
      setDeck(newDeck);
    }
    
    setGameState("preparing");
    setCountdown(3);
  };

  // Lógica del temporizador
  useEffect(() => {
    if (gameState === "preparing") {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGameState("playing");
      }
    }
  }, [countdown, gameState]);

  if (!currentMarca) return null;

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white overflow-hidden relative cursor-pointer selection:bg-transparent"
      onClick={() => {
        if (gameState === "playing") {
          pickRandomMarca();
        }
      }}
    >
      {/* Background Dinámico de Malla (Mesh Gradient) Oscuro */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-violet-900/20 blur-[150px] mix-blend-screen opacity-50 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-pink-900/20 blur-[150px] mix-blend-screen opacity-50 animate-[pulse_10s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-indigo-900/10 blur-[150px] mix-blend-screen opacity-50 animate-[pulse_12s_ease-in-out_infinite]" />
      </div>

      {/* Botón para salir */}
      <div className="absolute top-6 left-6 z-30">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            router.push("/games/adivina-marca");
          }} 
          className="bg-white/5 p-4 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-all border border-white/10 group shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <X className="w-7 h-7 text-white/70 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* PRECARGA: Forzamos al navegador a descargar y decodificar la imagen en segundo plano */}
      {gameState === "preparing" && currentMarca?.logoUrl && (
        <img src={currentMarca.logoUrl} alt="preload" className="hidden" />
      )}

      {gameState === "preparing" ? (
        <div className="flex flex-col items-center justify-center gap-8 relative z-20 animate-in fade-in duration-300 w-full max-w-sm mx-auto">
          {/* Tarjeta Glassmorphism para el temporizador */}
          <div className="relative w-full aspect-square flex flex-col items-center justify-center rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
            <p className="text-xl font-bold text-center text-white/50 tracking-widest uppercase mb-4 relative z-10">
              Prepárate
            </p>
            <div className="text-[8rem] font-black animate-pulse text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] relative z-10 leading-none">
              {countdown}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-8 right-8 z-30 opacity-40 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-1000">
            <RefreshCw className="w-6 h-6 animate-[spin_4s_linear_infinite] text-white/50" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-center text-white/50">Siguiente</span>
          </div>

          {/* Contenedor Glassmorphism Principal */}
          <div className="relative z-20 w-full max-w-2xl px-6 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 ease-out">
            <div className="relative w-full py-20 px-10 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center overflow-hidden">
              
              {/* Reflejo interno de la tarjeta (Gloss) */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />
              
              {/* Glow dinámico sutil detrás de la imagen para separarla del fondo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/10 blur-[80px] rounded-full pointer-events-none" />
              
              {currentMarca.logoUrl && (
                <img 
                  src={currentMarca.logoUrl} 
                  alt={`Logo de ${currentMarca.nombre}`} 
                  className="w-[90%] max-w-sm h-auto max-h-[40vh] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative z-10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
          
          <h1 className="absolute bottom-10 w-full text-center text-[11px] md:text-sm font-bold tracking-[0.4em] text-white/30 uppercase z-20 pointer-events-none">
            {currentMarca.nombre}
          </h1>
        </>
      )}
    </main>
  );
}
