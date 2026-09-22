"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Settings, Download, Info, X } from "lucide-react";
import { marcas, Marca } from "@/data/marcas";

export default function AdivinaMarcaMenu() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    // 1. Extraer todas las categorías posibles y contar marcas
    const counts: Record<string, number> = {};
    const addCount = (cat?: string) => {
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    };

    // Categorías base
    marcas.forEach(m => addCount(m.categoria));

    try {
      // Categorías de paquetes instalados
      const installedStr = localStorage.getItem("installed_packages");
      if (installedStr) {
        const installedIds = JSON.parse(installedStr) as string[];
        installedIds.forEach(pid => {
          const pkgData = localStorage.getItem(`package_${pid}`);
          if (pkgData) {
            const pkgMarcas = JSON.parse(pkgData) as Marca[];
            pkgMarcas.forEach(m => addCount(m.categoria));
          }
        });
      }

      // Categorías custom (Personalizadas)
      const customStr = localStorage.getItem("custom_marcas");
      if (customStr) {
        const customMarcas = JSON.parse(customStr) as Marca[];
        customMarcas.forEach(m => addCount(m.categoria));
      }
    } catch (e) {
      console.error(e);
    }

    const uniqueCategories = Object.keys(counts).sort();
    setAvailableCategories(uniqueCategories);
    setCategoryStats(counts);

    // 2. Cargar selección del usuario o activar todas por defecto
    const savedActiveStr = localStorage.getItem("active_categories");
    if (savedActiveStr) {
      setActiveCategories(JSON.parse(savedActiveStr));
    } else {
      setActiveCategories(uniqueCategories);
      localStorage.setItem("active_categories", JSON.stringify(uniqueCategories));
    }
  }, [isSettingsOpen]); // Recalcular al abrir por si instaló algo nuevo

  const toggleCategory = (cat: string) => {
    const newActive = activeCategories.includes(cat)
      ? activeCategories.filter(c => c !== cat)
      : [...activeCategories, cat];

    setActiveCategories(newActive);
    localStorage.setItem("active_categories", JSON.stringify(newActive));
  };

  const selectAll = () => {
    setActiveCategories(availableCategories);
    localStorage.setItem("active_categories", JSON.stringify(availableCategories));
  };

  const deselectAll = () => {
    setActiveCategories([]);
    localStorage.setItem("active_categories", JSON.stringify([]));
  };

  return (
    <main className="relative flex h-[100dvh] flex-col items-center p-6 bg-black text-white overflow-hidden">

      {/* Glow ambientales en el fondo */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] rounded-full bg-pink-600/10 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col h-full relative z-10">

        {/* Header / Back button (Fijo arriba) */}
        <div className="flex items-center justify-between w-full shrink-0">
          <Link
            href="/"
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl backdrop-blur-md transition-all border border-white/10 group"
          >
            <ArrowLeft className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
          </Link>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl backdrop-blur-md transition-all border border-white/10 group"
          >
            <Settings className="w-6 h-6 text-white/70 group-hover:text-white transition-transform group-hover:rotate-45" />
          </button>
        </div>

        {/* Contenedor principal que se adapta a vertical / horizontal */}
        <div className="flex-1 flex flex-col landscape:flex-row items-center justify-center gap-6 landscape:gap-12 w-full mt-4">

          {/* Game Title & Branding (Mitad Izquierda en landscape) */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 landscape:space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 rounded-full" />
              <div className="relative p-6 landscape:p-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-[2rem] landscape:rounded-[2.5rem] shadow-2xl transform -rotate-3 border border-white/20">
                <span className="text-5xl landscape:text-6xl font-black tracking-tighter text-white leading-none">?</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl landscape:text-5xl md:text-6xl font-extrabold tracking-tighter mb-2 landscape:mb-3">
                Adivina la <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Marca</span>
              </h1>
              <p className="text-white/40 text-sm md:text-lg font-medium max-w-sm mx-auto leading-relaxed">
                Coloca el teléfono en tu frente y descubre la marca que tus amigos describen.
              </p>
            </div>
          </div>

          {/* Action Buttons (Mitad Derecha en landscape) */}
          <div className="flex-1 w-full max-w-sm flex flex-col justify-center gap-4 shrink-0">
            <Link
              href="/games/adivina-marca/play"
              onClick={(e) => {
                if (activeCategories.length === 0) {
                  e.preventDefault();
                  alert("¡Debes seleccionar al menos una categoría en Configuración!");
                  setIsSettingsOpen(true);
                }
              }}
              className="group relative w-full bg-white text-black font-extrabold text-xl py-5 rounded-2xl flex items-center justify-center gap-3 overflow-hidden transition-all active:scale-[0.98] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-white to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Play className="w-7 h-7 fill-black relative z-10" />
              <span className="relative z-10 tracking-tight">JUGAR AHORA</span>
            </Link>

            <Link
              href="/games/adivina-marca/store"
              className="group w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm md:text-base py-4 rounded-2xl transition-all border border-white/10 active:scale-[0.98]"
            >
              <Download className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              <span className="text-white/80 group-hover:text-white transition-colors">
                Tienda / Más Marcas
              </span>
            </Link>

          </div>

        </div>
      </div>

      {/* Modal de Configuración */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-full">

            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">Seleccionar Barajas</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              <p className="text-sm text-white/40 mb-2">
                Elige qué categorías quieres incluir en la ruleta de marcas.
              </p>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={selectAll}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors text-white"
                >
                  Seleccionar Todas
                </button>
                <button
                  onClick={deselectAll}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors text-white/70 hover:text-white"
                >
                  Deseleccionar Todas
                </button>
              </div>

              {availableCategories.map((cat) => {
                const isActive = activeCategories.includes(cat);
                const count = categoryStats[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${isActive
                        ? "bg-pink-500/10 border-pink-500/30"
                        : "bg-white/5 border-transparent hover:bg-white/10"
                      }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className={`font-semibold ${isActive ? "text-pink-100" : "text-white/60"}`}>
                        {cat}
                      </span>
                      <span className="text-xs text-white/40 font-medium">
                        {count} {count === 1 ? 'marca' : 'marcas'}
                      </span>
                    </div>

                    {/* iOS-like Switch */}
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${isActive ? "bg-pink-500" : "bg-white/20"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isActive ? "left-7" : "left-1"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
