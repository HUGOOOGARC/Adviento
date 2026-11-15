'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface Sorpresa {
  dia: number;
  titulo: string;
  mensaje: string;
  url_imagen?: string;
}

interface CuadriculaProps {
  onAbrirSorpresa: (sorpresa: Sorpresa) => void;
}

export default function Cuadricula({ onAbrirSorpresa }: CuadriculaProps) {
  const [alertaBloqueo, setAlertaBloqueo] = useState<string | null>(null);
  const [cargandoDia, setCargandoDia] = useState<number | null>(null);

  // Días con diseño en tono rojo según la distribución visual observada en la captura
  const diasRojos = [2-6]; 

  const intentarAbrirDia = async (dia: number) => {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth(); // 11 corresponde a Diciembre en JavaScript
    const diaActual = fechaActual.getDate();

    // 1. Lógica de restricción de fechas: si es anterior a diciembre o es un día futuro
    if (mesActual < 11 || (mesActual === 11 && dia > diaActual)) {
      setAlertaBloqueo(`🔒 Todavía no 🔒 Esta sorpresa se abre el ${dia} de diciembre.`);
      return;
    }

    // 2. Si el día está desbloqueado, consultar el contenido guardado en Supabase
    setAlertaBloqueo(null);
    setCargandoDia(dia);

    try {
      const { data, error } = await supabase
        .from('sorpresas')
        .select('*')
        .eq('dia', dia)
        .single();

      if (error || !data) {
        onAbrirSorpresa({
          dia,
          titulo: `Sorpresa del Día ${dia}`,
          mensaje: `¡Has desbloqueado el día ${dia}! (Puedes editar este contenido en Supabase).`,
        });
      } else {
        onAbrirSorpresa(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargandoDia(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-start py-10 px-4">
      {/* --- ENCABEZADO --- */}
      <header className="text-center mb-8 max-w-lg">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#3D2E2B] mb-2 tracking-tight">
          Feliz Navidad mi Amor
        </h1>
        <p className="text-sm font-serif text-[#6E5A54] italic">
          He guardado un poquito de nosotros detrás de cada puerta.
        </p>
      </header>

      {/* --- ALERTA EMERGENTE DE CANDADO POR FECHA --- */}
      <AnimatePresence>
        {alertaBloqueo && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-white border border-[#E5D2C5] text-[#3D2E2B] px-6 py-3.5 rounded-2xl shadow-xl mb-6 flex items-center gap-2 text-sm font-medium z-20"
          >
            <span>{alertaBloqueo}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CUADRÍCULA DE DÍAS (01 AL 24) --- */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3.5 max-w-2xl w-full">
        {Array.from({ length: 24 }, (_, i) => i + 1).map((dia) => {
          const esRojo = diasRojos.includes(dia);
          const numeroFormateado = dia < 10 ? `0${dia}` : `${dia}`;

          return (
            <motion.button
              key={dia}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => intentarAbrirDia(dia)}
              disabled={cargandoDia === dia}
              className={`aspect-square rounded-2xl flex items-center justify-center font-serif text-2xl font-bold shadow-sm transition-all border relative overflow-hidden ${
                esRojo
                  ? 'bg-[#B83232] text-white border-[#992626] shadow-red-900/10'
                  : 'bg-[#F4EBE1] text-[#3D2E2B] border-[#E2D5C7]'
              }`}
            >
              {cargandoDia === dia ? (
                <span className="text-xs animate-pulse">...</span>
              ) : (
                numeroFormateado
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}