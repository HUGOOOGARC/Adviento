'use client';

import LucesNavidenas from './LucesNavidenas';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Heart, CheckCircle2, Ticket, Star, Download, Flame } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import RelojCuentaAtras from './RelojCuentaAtras';
import ModalCupones from './ModalCupones';
import { sounds } from '@/lib/audioHelper';
import { SORPRESAS_POR_DEFECTO, Sorpresa } from '@/lib/sorpresasData';

interface CuadriculaProps {
  nombrePareja?: string;
  onAbrirSorpresa: (sorpresa: Sorpresa) => void;
}

export default function Cuadricula({ nombrePareja = "Lucía", onAbrirSorpresa }: CuadriculaProps) {
  const [alertaBloqueo, setAlertaBloqueo] = useState<string | null>(null);
  const [cargandoDia, setCargandoDia] = useState<number | null>(null);
  const [diasAbiertos, setDiasAbiertos] = useState<number[]>([]);
  const [mostrarModalCupones, setMostrarModalCupones] = useState(false);
  const [modoPreview, setModoPreview] = useState(false);
  const [toquesSecretos, setToquesSecretos] = useState(0);
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);

  // Distribución festiva y equilibrada de casillas rojas
  const diasRojos = [2, 6, 9, 13, 16, 21, 23];

  // Comprobar parámetros de URL y localStorage
  useEffect(() => {
    try {
      const guardados = localStorage.getItem('adviento_dias_abiertos');
      if (guardados) setDiasAbiertos(JSON.parse(guardados));

      // Comprobar si en la URL hay modo preview (?preview=true, ?test=true, ?admin=lucia)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (
          params.get('preview') === 'true' ||
          params.get('test') === 'true' ||
          params.get('admin') === 'lucia' ||
          params.get('modo') === 'preview'
        ) {
          setModoPreview(true);
          mostrarNotificacion("✨ Modo Preview activado: todas las casillas disponibles");
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const mostrarNotificacion = (texto: string) => {
    setMensajeToast(texto);
    setTimeout(() => setMensajeToast(null), 4000);
  };

  // Secreto: 5 toques sobre el título o corazón desbloquean el modo preview
  const manejarToqueSecreto = () => {
    const nuevo = toquesSecretos + 1;
    setToquesSecretos(nuevo);
    if (nuevo >= 5) {
      setModoPreview(!modoPreview);
      setToquesSecretos(0);
      sounds.playFanfare();
      mostrarNotificacion(
        !modoPreview
          ? "✨ ¡Modo Creador activado! Todos los días desbloqueados"
          : "🔒 Modo normal restaurado"
      );
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

    // Verificación inteligente de desbloqueo:
    // Si estamos en modo preview, o si ya pasó el 24 de diciembre, o si es diciembre y el día ya llegó
    const esDesbloqueado =
      modoPreview ||
      (mesActual === 11 && diaActual >= dia) ||
      (mesActual === 11 && diaActual > 24) ||
      (mesActual > 11); // Si ya es el año siguiente

    if (!esDesbloqueado) {
      sounds.playScratch();
      setAlertaBloqueo(`🔒 Todavía no, amor 🔒 Esta sorpresa se abrirá el ${dia} de diciembre.`);
      setTimeout(() => setAlertaBloqueo(null), 3500);
      return;
    }

    setAlertaBloqueo(null);
    setCargandoDia(dia);
    sounds.playChime();

    try {
      // Intentar obtener de Supabase
      const { data, error } = await supabase
        .from('sorpresas')
        .select('*')
        .eq('dia', dia)
        .single();

      marcarDiaVisto(dia);

      // Si Supabase devuelve datos válidos, los usamos; si no, usamos el fallback local
      if (!error && data && data.titulo) {
        onAbrirSorpresa({
          dia,
          titulo: data.titulo,
          mensaje: data.mensaje || `Sorpresa especial del día ${dia}`,
          url_imagen: data.url_imagen || data.imagen,
          tipo: data.tipo || (diasRojos.includes(dia) ? 'cupon' : 'mensaje'),
          codigo_cupon: data.codigo_cupon || `LUCIA-${dia}`,
          condicion_cupon: data.condicion_cupon || "Canjeable con un beso ❤️"
        });
      } else {
        const sorpresaLocal = SORPRESAS_POR_DEFECTO.find((s) => s.dia === dia) || {
          dia,
          titulo: `Sorpresa del Día ${dia} ✨`,
          mensaje: `¡Has desbloqueado la sorpresa del día ${dia}! Todo mi amor es para ti hoy y siempre.`,
          tipo: 'mensaje'
        };
        onAbrirSorpresa(sorpresaLocal);
      }
    } catch (err) {
      console.warn("Fallo en Supabase, utilizando respaldo local:", err);
      const sorpresaLocal = SORPRESAS_POR_DEFECTO.find((s) => s.dia === dia) || {
        dia,
        titulo: `Sorpresa del Día ${dia} ✨`,
        mensaje: `¡Has desbloqueado la sorpresa del día ${dia}!`,
        tipo: 'mensaje'
      };
      marcarDiaVisto(dia);
      onAbrirSorpresa(sorpresaLocal);
    } finally {
      setCargandoDia(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-start py-8 px-4 relative z-20 select-none pb-16">
      
      {/* Toast informativo */}
      <AnimatePresence>
        {mensajeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 z-50 bg-[#3D2E2B] text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-serif flex items-center gap-2 border border-[#EAD7C5]"
          >
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span>{mensajeToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="text-center mb-5 max-w-lg w-full">
        {/* Guirnalda de Luces LED */}
        <LucesNavidenas />

        <div 
          onClick={manejarToqueSecreto}
          className="inline-flex items-center gap-1.5 bg-[#F4EBE1] border border-[#E2D5C7] px-4 py-1 rounded-full text-xs font-serif text-[#B83232] font-semibold mb-3 cursor-pointer hover:bg-[#EAD7C5] transition-colors"
          title="Toca 5 veces para activar/desactivar modo creador"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B83232]" />
          <span>24 sorpresas para {nombrePareja}</span>
          {modoPreview && <span className="text-[10px] bg-[#B83232] text-white px-1.5 py-0.2 rounded-full">DEV</span>}
        </div>

        <h1 
          onClick={manejarToqueSecreto}
          className="text-3xl sm:text-4xl font-serif text-[#3D2E2B] mb-2 tracking-tight font-normal cursor-pointer"
        >
          Feliz Navidad mi Amor
        </h1>
      </header>

      {/* Reloj contador regresivo inteligente */}
      <RelojCuentaAtras />

      {/* Barra de progreso interactiva */}
      <div className="w-full max-w-md bg-white border border-[#EAD7C5] p-3.5 rounded-2xl shadow-sm mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#B83232] fill-[#B83232]" />
          <span className="text-xs font-serif text-[#3D2E2B] font-medium">
            Progreso: <strong className="text-[#B83232]">{diasAbiertos.length}</strong> / 24 descubiertos
          </span>
        </div>
        <div className="w-28 sm:w-36 bg-[#F5EBE1] h-2.5 rounded-full overflow-hidden border border-[#EAD7C5]">
          <div 
            className="bg-gradient-to-r from-[#B83232] to-[#D4AF37] h-full transition-all duration-500 rounded-full"
            style={{ width: `${(diasAbiertos.length / 24) * 100}%` }}
          />
        </div>
      </div>

      {/* Botones de Acceso Rápido: Talonario de Cupones y Descargar PDF */}
      <div className="w-full max-w-md grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={() => setMostrarModalCupones(true)}
          className="bg-white hover:bg-[#FDF8F2] border border-[#EAD7C5] text-[#3D2E2B] py-2 px-3 rounded-xl text-xs font-serif font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all"
        >
          <Ticket className="w-3.5 h-3.5 text-[#B83232]" />
          <span>Ver mis Cupones</span>
        </button>

        <a
          href="/Talonario_Cupones_Romanticos_Lucia.pdf"
          download="Talonario_Cupones_Lucia.pdf"
          className="bg-white hover:bg-[#FDF8F2] border border-[#EAD7C5] text-[#3D2E2B] py-2 px-3 rounded-xl text-xs font-serif font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[#B83232]" />
          <span>Talonario PDF</span>
        </a>
      </div>

      {/* Mensaje de candado animado */}
      <AnimatePresence>
        {alertaBloqueo && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-white border border-[#E5D2C5] text-[#3D2E2B] px-6 py-3.5 rounded-2xl shadow-xl mb-6 flex items-center gap-2.5 text-sm font-medium z-30 text-center"
          >
            <Lock className="w-4 h-4 text-[#B83232] shrink-0" />
            <span>{alertaBloqueo}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cuadrícula de casillas (01 a 24) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4 max-w-2xl w-full">
        {Array.from({ length: 24 }, (_, i) => i + 1).map((dia) => {
          const esRojo = diasRojos.includes(dia);
          const esDia24 = dia === 24;
          const yaAbierto = diasAbiertos.includes(dia);
          const numeroFormateado = dia < 10 ? `0${dia}` : `${dia}`;

          return (
            <motion.button
              key={dia}
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => intentarAbrirDia(dia)}
              disabled={cargandoDia === dia}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-serif text-2xl font-bold shadow-sm transition-all border relative overflow-hidden group ${
                esDia24
                  ? 'bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] text-[#3D2E2B] border-[#AA771C] shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/50'
                  : esRojo
                  ? 'bg-[#B83232] text-white border-[#992626] shadow-red-900/15 hover:bg-[#A32828]'
                  : 'bg-[#F4EBE1] text-[#3D2E2B] border-[#E2D5C7] hover:bg-[#EBDDCF]'
              }`}
            >
              {/* Icono especial en día 24 */}
              {esDia24 && (
                <div className="absolute top-1.5 left-1.5 text-[#3D2E2B]">
                  <Star className="w-3.5 h-3.5 fill-[#3D2E2B]" />
                </div>
              )}

              {/* Si es cupón, pequeño icono sutil */}
              {esRojo && !esDia24 && (
                <div className="absolute top-1.5 left-1.5 opacity-60">
                  <Ticket className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Check de día ya abierto */}
              {yaAbierto && (
                <div className="absolute top-1.5 right-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      esDia24
                        ? 'text-[#3D2E2B]'
                        : esRojo
                        ? 'text-white/90'
                        : 'text-[#B83232]'
                    }`}
                  />
                </div>
              )}

              {cargandoDia === dia ? (
                <span className="text-xs animate-pulse">...</span>
              ) : (
                <span className="tracking-tighter">{numeroFormateado}</span>
              )}

              {esDia24 && (
                <span className="text-[9px] font-sans font-bold tracking-wider uppercase text-[#3D2E2B] -mt-1">
                  Nochebuena
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Modal de Cupones */}
      {mostrarModalCupones && (
        <ModalCupones
          onCerrar={() => setMostrarModalCupones(false)}
          onAbrirSorpresa={(sorpresa) => onAbrirSorpresa(sorpresa)}
          diasAbiertos={diasAbiertos}
        />
      )}
    </div>
  );
}
