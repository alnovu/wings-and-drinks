"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Download, CheckCircle2, Loader2, Package, SearchX } from "lucide-react";
import { Marca } from "@/data/marcas";

interface StorePackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  marcas: Marca[];
}

export default function StorePage() {
  // Estado de los paquetes
  const [packages, setPackages] = useState<StorePackage[]>([]);
  const [installedPackages, setInstalledPackages] = useState<string[]>([]);
  const [loadingPkgId, setLoadingPkgId] = useState<string | null>(null);

  // Estado del buscador individual
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customBrands, setCustomBrands] = useState<Marca[]>([]);
  const [loadingBrandId, setLoadingBrandId] = useState<string | null>(null);
  
  // Estado para la asignación de categoría
  const [brandToCategorize, setBrandToCategorize] = useState<Record<string, unknown> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Personalizadas");
  const [newCategory, setNewCategory] = useState<string>("");

  useEffect(() => {
    // Cargar paquetes disponibles
    fetch("/api/packages")
      .then(res => res.json())
      .then(data => setPackages(data.packages || []))
      .catch(console.error);

    // Cargar estado de instalados
    const installed = localStorage.getItem("installed_packages");
    if (installed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInstalledPackages(JSON.parse(installed));
    }

    const custom = localStorage.getItem("custom_marcas");
    if (custom) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomBrands(JSON.parse(custom));
    }
  }, []);

  // Funciones para Paquetes
  const installPackage = async (pkg: StorePackage) => {
    setLoadingPkgId(pkg.id);
    // Simular un pequeño tiempo de descarga para mejor UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Guardar las marcas del paquete
    localStorage.setItem(`package_${pkg.id}`, JSON.stringify(pkg.marcas));
    
    // Actualizar lista de instalados
    const newInstalled = [...installedPackages, pkg.id];
    localStorage.setItem("installed_packages", JSON.stringify(newInstalled));
    setInstalledPackages(newInstalled);
    
    setLoadingPkgId(null);
  };

  // Funciones para Búsqueda
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        // Filtrar los que tienen icono
        setSearchResults(data.filter((item: Record<string, unknown>) => item.icon && item.name));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const confirmAddCustomBrand = async () => {
    if (!brandToCategorize) return;
    
    const brandId = brandToCategorize.brandId as string;
    const icon = brandToCategorize.icon as string;
    const name = brandToCategorize.name as string;
    
    const finalCategory = newCategory.trim() !== "" ? newCategory.trim() : selectedCategory;

    setBrandToCategorize(null);
    setNewCategory("");
    setLoadingBrandId(brandId);
    
    try {
      // Pedimos a nuestro proxy que baje la imagen y la pase a base64
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: icon })
      });
      const data = await res.json();
      
      if (data.base64) {
        const newMarca: Marca = {
          id: brandId,
          nombre: name,
          logoUrl: data.base64,
          isLocal: true,
          categoria: finalCategory
        };
        const newCustoms = [...customBrands, newMarca];
        localStorage.setItem("custom_marcas", JSON.stringify(newCustoms));
        setCustomBrands(newCustoms);
      }
    } catch (e) {
      console.error("Error guardando marca custom:", e);
    } finally {
      setLoadingBrandId(null);
    }
  };

  const isBrandInstalled = (id: string) => customBrands.some(b => b.id === id);

  // Extraer categorías únicas para el dropdown
  const allCategories = Array.from(new Set([
    "Personalizadas",
    ...packages.flatMap(p => p.marcas.map(m => m.categoria)),
    ...customBrands.map(m => m.categoria)
  ])).filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-20 relative">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <Link 
          href="/games/adivina-marca"
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl backdrop-blur-md transition-all border border-white/10"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tienda de Marcas</h1>
          <p className="text-sm text-white/50">Personaliza tu mazo (Juego Offline)</p>
        </div>
      </header>

      {/* Buscador de Marcas */}
      <section className="mb-12 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text" 
            placeholder="Busca cualquier marca del mundo (Ej. Netflix, Ford)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:bg-white/10 transition-all shadow-inner"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-pink-400 transition-colors" />
          <button 
            type="submit" 
            disabled={isSearching}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </form>

        {/* Resultados de Búsqueda */}
        {searchResults.length > 0 && (
          <div className="mt-4 bg-white/[0.02] border border-white/5 rounded-2xl p-2 max-h-[60vh] overflow-y-auto">
            {searchResults.map((result) => {
              const installed = isBrandInstalled(result.brandId);
              const isLoading = loadingBrandId === result.brandId;
              
              return (
                <div key={result.brandId} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={result.icon} alt={result.name} className="w-10 h-10 object-contain bg-white/10 p-1 rounded-lg" />
                    <div>
                      <h4 className="font-bold">{result.name}</h4>
                      <p className="text-xs text-white/40">{result.domain}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setBrandToCategorize(result)}
                    disabled={installed || isLoading}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                      installed 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-pink-600 hover:bg-pink-500 text-white"
                    }`}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> :
                     installed ? <CheckCircle2 className="w-4 h-4" /> : "+ Añadir"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="mt-4 text-center text-white/40 text-sm py-4">
            Presiona buscar para encontrar marcas.
          </div>
        )}
      </section>

      {/* Colecciones Temáticas */}
      <section className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-6 h-6 text-pink-400" />
          <h2 className="text-xl font-bold">Paquetes Temáticos</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => {
            const isInstalled = installedPackages.includes(pkg.id);
            const isLoading = loadingPkgId === pkg.id;

            return (
              <div key={pkg.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col hover:bg-white/[0.07] transition-colors relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  {pkg.icon}
                </div>
                
                <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                  <span>{pkg.icon}</span>
                  {pkg.name}
                </h3>
                <p className="text-sm text-white/50 mb-6 flex-1 pr-12">
                  {pkg.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-white/30 uppercase tracking-wider">
                    {pkg.count} marcas
                  </span>
                  
                  <button 
                    onClick={() => installPackage(pkg)}
                    disabled={isInstalled || isLoading}
                    className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                      isInstalled 
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-white text-black hover:bg-pink-100"
                    }`}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Descargando...</>
                    ) : isInstalled ? (
                      <><CheckCircle2 className="w-4 h-4" /> Instalado</>
                    ) : (
                      <><Download className="w-4 h-4" /> Descargar</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal para elegir Categoría */}
      {brandToCategorize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/10 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-center">¿A qué categoría pertenece?</h3>
            
            <div className="flex items-center justify-center gap-3 bg-white/5 p-3 rounded-xl mb-2">
              <img src={brandToCategorize.icon as string} alt="logo" className="w-10 h-10 object-contain bg-white/10 p-1 rounded-lg" />
              <span className="font-bold text-lg">{brandToCategorize.name as string}</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 font-bold uppercase ml-2">Elegir Existente</label>
                <select 
                  className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 mt-1"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setNewCategory(""); // reset new
                  }}
                >
                  {allCategories.map(cat => (
                    <option key={cat} value={cat} className="bg-black text-white">{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/30 text-xs font-bold uppercase">o crea una nueva</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Escribe una nueva categoría..."
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setSelectedCategory(""); // deselect exist
                    } else {
                      setSelectedCategory("Personalizadas");
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => {
                  setBrandToCategorize(null);
                  setNewCategory("");
                  setSelectedCategory("Personalizadas");
                }}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmAddCustomBrand}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-pink-600 hover:bg-pink-500 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
