'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Heart, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import RelojCuentaAtras from './RelojCuentaAtras';

interface Sorpresa {
  dia: number;
  titulo: string;
  mensaje: string;
  url_imagen?: string;
}

interface CuadriculaProps {
  nombrePareja?: string;
  onAbrirSorpresa: (sorpresa: Sorpresa) => void;
}

export default function Cuadricula({ nombrePareja = "Lucía", onAbrirSorpresa }: CuadriculaProps) {
  const [alertaBloqueo, setAlertaBloqueo] = useState<string | null>(null);
  const [cargandoDia, setCargandoDia] = useState<number | null>(null);
  const [diasAbiertos, setDiasAbiertos] = useState<number[]>([]);

  // 🔴 MODO PRUEBA EN FALSE PARA PRODUCCIÓN
  const MODO_PRUEBA = false;

  // Distribución de casillas rojas según la interfaz gráfica observada
  const diasRojos = [2, 10-14];

  useEffect(() => {
    try {
      const guardados = localStorage.getItem('adviento_dias_abiertos');
      if (guardados) setDiasAbiertos(JSON.parse(guardados));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const marcarDiaVisto = (dia: number) => {
    if (!diasAbiertos.includes(dia)) {
      const nuevos = [...diasAbiertos, dia];
      setDiasAbiertos(nuevos);
      try {
        localStorage.setItem('adviento_dias_abiertos', JSON.stringify(nuevos));
      } catch (e) {}
    }
  };

  const intentarAbrirDia = async (dia: number) => {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth(); // 11 = Diciembre
    const diaActual = fechaActual.getDate();

    const esPermitidoPrueba = MODO_PRUEBA && dia === 1;

    // Lógica estricta de control de fechas
    if (!esPermitidoPrueba && (mesActual < 11 || (mesActual === 11 && dia > diaActual))) {
      setAlertaBloqueo(`🔒 Todavía no 🔒 Esta sorpresa se abre el ${dia} de diciembre.`);
      return;
    }

    setAlertaBloqueo(null);
    setCargandoDia(dia);

    try {
      const { data, error } = await supabase
        .from('sorpresas')
        .select('*')
        .eq('dia', dia)
        .single();

      marcarDiaVisto(dia);

      if (error || !data) {
        onAbrirSorpresa({
          dia,
          titulo: `Sorpresa del Día ${dia}`,
          mensaje: `¡Has desbloqueado la sorpresa del día ${dia}!`,
        });
      } else {
        onAbrirSorpresa(data);
      }
    } catch (err) {
      console.error("Error al consultar Supabase:", err);
    } finally {
      setCargandoDia(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-start py-10 px-4 relative z-20 select-none">
      
      <header className="text-center mb-6 max-w-lg">
        <div className="inline-flex items-center gap-1.5 bg-[#F4EBE1] border border-[#E2D5C7] px-4 py-1 rounded-full text-xs font-serif text-[#B83232] font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#B83232]" />
          <span>24 sorpresas para {nombrePareja}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-[#3D2E2B] mb-2 tracking-tight font-normal">
          Feliz Navidad mi Amor
        </h1>
        
        <p className="text-sm font-serif text-[#6E5A54] italic">
          He guardado un poquito de nosotros detrás de cada puerta.
        </p>
      </header>

      {/* Reloj contador regresivo */}
      <RelojCuentaAtras />

      {/* Barra de progreso */}
      <div className="w-full max-w-md bg-white border border-[#EAD7C5] p-3 rounded-2xl shadow-sm mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#B83232] fill-[#B83232]" />
          <span className="text-xs font-serif text-[#3D2E2B] font-medium">
            Progreso: <strong className="text-[#B83232]">{diasAbiertos.length}</strong> / 24 descubiertos
          </span>
        </div>
        <div className="w-28 bg-[#F5EBE1] h-2 rounded-full overflow-hidden border border-[#EAD7C5]">
          <div 
            className="bg-[#B83232] h-full transition-all duration-500 rounded-full"
            style={{ width: `${(diasAbiertos.length / 24) * 100}%` }}
          />
        </div>
      </div>

      {/* Mensaje de candado */}
      <AnimatePresence>
        {alertaBloqueo && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-white border border-[#E5D2C5] text-[#3D2E2B] px-6 py-3.5 rounded-2xl shadow-xl mb-6 flex items-center gap-2.5 text-sm font-medium z-30"
          >
            <Lock className="w-4 h-4 text-[#B83232]" />
            <span>{alertaBloqueo}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cuadrícula de casillas (01 a 24) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3.5 max-w-2xl w-full">
        {Array.from({ length: 24 }, (_, i) => i + 1).map((dia) => {
          const esRojo = diasRojos.includes(dia);
          const yaAbierto = diasAbiertos.includes(dia);
          const numeroFormateado = dia < 10 ? `0${dia}` : `${dia}`;

          return (
            <motion.button
              key={dia}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => intentarAbrirDia(dia)}
              disabled={cargandoDia === dia}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-serif text-2xl font-bold shadow-sm transition-all border relative overflow-hidden ${
                esRojo
                  ? 'bg-[#B83232] text-white border-[#992626] shadow-red-900/10'
                  : 'bg-[#F4EBE1] text-[#3D2E2B] border-[#E2D5C7]'
              }`}
            >
              {yaAbierto && (
                <div className="absolute top-1.5 right-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${esRojo ? 'text-white/80' : 'text-[#B83232]'}`} />
                </div>
              )}

              {cargandoDia === dia ? (
                <span className="text-xs animate-pulse">...</span>
              ) : (
                <span>{numeroFormateado}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}