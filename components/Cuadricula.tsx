'use client';

import LucesNavidenas from './LucesNavidenas';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Heart, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import RelojCuentaAtras from './RelojCuentaAtras';
import BotonNotificaciones from './BotonNotificaciones';
import { SORPRESAS_SUPABASE_FALLBACK, Sorpresa } from '@/lib/sorpresasData';

interface CuadriculaProps {
  nombrePareja?: string;
  onAbrirSorpresa: (sorpresa: Sorpresa) => void;
}

export default function Cuadricula({ nombrePareja = "Lucía", onAbrirSorpresa }: CuadriculaProps) {
  const [alertaBloqueo, setAlertaBloqueo] = useState<string | null>(null);
  const [cargandoDia, setCargandoDia] = useState<number | null>(null);
  const [abriendoDia, setAbriendoDia] = useState<number | null>(null);
  const [diasAbiertos, setDiasAbiertos] = useState<number[]>([]);
  const [modoPreview, setModoPreview] = useState(false);
  const [toquesTitulo, setToquesTitulo] = useState(0);

  // Casilla roja idéntica al diseño de tu captura
  const diasRojos = [2];

  useEffect(() => {
    try {
      const guardados = localStorage.getItem('adviento_dias_abiertos');
      if (guardados) setDiasAbiertos(JSON.parse(guardados));

      // Comprobar si hay parámetro de vista previa en la URL (?preview=true o ?admin=lucia)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (
          params.get('preview') === 'true' ||
          params.get('admin') === 'lucia' ||
          params.get('test') === 'true'
        ) {
          setModoPreview(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Toque secreto: 5 toques sobre el título desbloquean el modo creador
  const tocarTitulo = () => {
    const nuevo = toquesTitulo + 1;
    setToquesTitulo(nuevo);
    if (nuevo >= 5) {
      setModoPreview((prev) => !prev);
      setToquesTitulo(0);
    }
  };

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

    // Desbloqueado si: está en modo preview, o es diciembre y el día ya llegó, o ya pasó el 24 de diciembre
    const esPermitido =
      modoPreview ||
      (mesActual === 11 && diaActual >= dia) ||
      (mesActual === 11 && diaActual > 24) ||
      (mesActual > 11);

    if (!esPermitido) {
      setAlertaBloqueo(`🔒 Todavía no 🔒 Esta sorpresa se abre el ${dia} de diciembre.`);
      return;
    }

    setAlertaBloqueo(null);
    setCargandoDia(dia);
    setAbriendoDia(dia);

    try {
      // Iniciar fetch de datos y dar 380ms para ver la puertecita 3D rotar en su bisagra
      const esperaGiro = new Promise((resolve) => setTimeout(resolve, 380));
      const fetchSupabase = supabase
        .from('sorpresas')
        .select('*')
        .eq('dia', dia)
        .single();

      const [{ data, error }] = await Promise.all([fetchSupabase, esperaGiro]);

      marcarDiaVisto(dia);

      if (error || !data || !data.titulo) {
        // En caso de fallo o retardo en Supabase, usar el respaldo fiel de los 24 textos de Hugo
        const respaldo = SORPRESAS_SUPABASE_FALLBACK.find((s) => s.dia === dia) || {
          dia,
          titulo: `Sorpresa del Día ${dia}`,
          mensaje: `¡Has desbloqueado la sorpresa del día ${dia}!`,
          url_imagen: dia === 3 ? '/fotos/dia-03.jpg' : undefined,
        };
        onAbrirSorpresa(respaldo);
      } else {
        onAbrirSorpresa({
          ...data,
          url_imagen: data.url_imagen || (dia === 3 ? '/fotos/dia-03.jpg' : undefined),
        });
      }
    } catch (err) {
      console.error("Error al consultar Supabase, cargando respaldo local:", err);
      const respaldo = SORPRESAS_SUPABASE_FALLBACK.find((s) => s.dia === dia) || {
        dia,
        titulo: `Sorpresa del Día ${dia}`,
        mensaje: `¡Has desbloqueado la sorpresa del día ${dia}!`,
      };
      marcarDiaVisto(dia);
      onAbrirSorpresa(respaldo);
    } finally {
      setCargandoDia(null);
      setAbriendoDia(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-start py-10 px-4 relative z-20 select-none">
      
      <header className="text-center mb-6 max-w-lg">
        {/* Guirnalda de Luces LED */}
        <LucesNavidenas />

        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 bg-[#F4EBE1] border border-[#E2D5C7] px-4 py-1 rounded-full text-xs font-serif text-[#B83232] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#B83232]" />
            <span>24 sorpresas para {nombrePareja}</span>
          </div>
          <BotonNotificaciones />
        </div>

        <h1 
          onClick={tocarTitulo}
          className="text-3xl sm:text-4xl font-serif text-[#3D2E2B] mb-2 tracking-tight font-normal cursor-pointer select-none"
          title="Toca 5 veces para activar modo prueba"
        >
          Feliz Navidad mi Amor
        </h1>
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

      {/* Cuadrícula de casillas (01 a 24) con bisagra 3D tradicional */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3.5 max-w-2xl w-full">
        {Array.from({ length: 24 }, (_, i) => i + 1).map((dia) => {
          const esRojo = diasRojos.includes(dia);
          const yaAbierto = diasAbiertos.includes(dia);
          const numeroFormateado = dia < 10 ? `0${dia}` : `${dia}`;
          const estaAbriendo = abriendoDia === dia;

          return (
            <div
              key={dia}
              className="aspect-square relative"
              style={{ perspective: '900px' }}
            >
              {/* Cavidad interior del calendario de adviento (revelada tras la puerta) */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2E1815] to-[#1C0E0C] border border-[#4A2822] flex flex-col items-center justify-center shadow-inner overflow-hidden">
                <Sparkles className="w-5 h-5 text-[#FFD700] animate-pulse" />
              </div>

              {/* Tapa / Puertecita que rota hacia afuera sobre la bisagra izquierda */}
              <motion.button
                whileHover={!estaAbriendo ? { scale: 1.04, y: -2 } : {}}
                whileTap={!estaAbriendo ? { scale: 0.96 } : {}}
                onClick={() => intentarAbrirDia(dia)}
                disabled={cargandoDia === dia}
                animate={{
                  rotateY: estaAbriendo ? -118 : 0,
                }}
                transition={{
                  duration: 0.42,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center font-serif text-2xl font-bold shadow-sm transition-shadow z-10 ${
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

                {cargandoDia === dia && !estaAbriendo ? (
                  <span className="text-xs animate-pulse">...</span>
                ) : (
                  <span>{numeroFormateado}</span>
                )}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
