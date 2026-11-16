'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Heart, CheckCircle2, Sparkles, Scissors, Ticket, Music, 
  Camera, Flame, Star, Quote, Award 
} from 'lucide-react';
import { Sorpresa } from '@/lib/sorpresasData';

interface ModalSorpresaProps {
  sorpresa: Sorpresa;
  onCerrar: () => void;
}

export default function ModalSorpresa({ sorpresa, onCerrar }: ModalSorpresaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revelado, setRevelado] = useState(false);
  const [canjeado, setCanjeado] = useState(false);
  const [fechaCanje, setFechaCanje] = useState<string | null>(null);
  const [mostrarLightbox, setMostrarLightbox] = useState(false);

  // Clasificación del contenido
  const tituloLower = (sorpresa.titulo || '').toLowerCase();
  const esCupon = tituloLower.includes('cupón') || tituloLower.includes('cupon');
  const esMusica = sorpresa.dia === 8 || tituloLower.includes('canción') || tituloLower.includes('cancion');
  const esNochebuena = sorpresa.dia === 24;
  const esRecuerdoFoto = sorpresa.dia === 3 || !!sorpresa.url_imagen;

  // Limpiar y formatear saltos de línea literales (\n)
  const mensajeLimpio = (sorpresa.mensaje || '').replace(/\\n/g, '\n');
  const lineas = mensajeLimpio
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Detección de listas numeradas (ej. "1. Tu risa...", "2. Cómo intentas...")
  const esListaNumerada =
    lineas.length > 1 && lineas.some((l) => /^\d+[\.\)]/.test(l));

  useEffect(() => {
    try {
      const guardados = JSON.parse(
        localStorage.getItem('adviento_cupones_canjeados') || '{}'
      );
      if (guardados[sorpresa.dia]) {
        setCanjeado(true);
        setFechaCanje(guardados[sorpresa.dia]);
      }
    } catch (e) {
      console.error(e);
    }
  }, [sorpresa.dia]);

  // Cerrar con Escape
  useEffect(() => {
    const alPulsarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', alPulsarTecla);
    return () => window.removeEventListener('keydown', alPulsarTecla);
  }, [onCerrar]);

  const dispararConfeti = useCallback(async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: esNochebuena ? 120 : 75,
        spread: esNochebuena ? 90 : 65,
        origin: { y: 0.6 },
        colors: esNochebuena 
          ? ['#D4AF37', '#FFD700', '#B83232', '#FFFDF8'] 
          : ['#B83232', '#EAD7C5', '#FFD700'],
      });
    } catch (e) {
      console.error(e);
    }
  }, [esNochebuena]);

  const revelarDirecto = () => {
    setRevelado(true);
    dispararConfeti();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const ejecutarCanje = () => {
    const hoy = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
    setCanjeado(true);
    setFechaCanje(hoy);
    try {
      const cupones = JSON.parse(
        localStorage.getItem('adviento_cupones_canjeados') || '{}'
      );
      cupones[sorpresa.dia] = hoy;
      localStorage.setItem('adviento_cupones_canjeados', JSON.stringify(cupones));
    } catch (e) {
      console.error(e);
    }
    dispararConfeti();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fondo metalizado dorado enriquecido
    const gradiente = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradiente.addColorStop(0, '#D4AF37');
    gradiente.addColorStop(0.25, '#FFF6E9');
    gradiente.addColorStop(0.65, '#D4AF37');
    gradiente.addColorStop(1, '#9E6D13');

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillStyle = '#3D2E2B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Rasca aquí con tu dedo o ratón ✨', canvas.width / 2, canvas.height / 2);

    let rascando = false;
    let trazos = 0;

    const rascar = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      trazos++;
      if (trazos === 1) {
        setRevelado(true);
        dispararConfeti();
      }

      // Auto-revelado suave si se rasca más del 38%
      if (trazos % 10 === 0) {
        try {
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = img.data;
          let transparentes = 0;
          for (let i = 3; i < data.length; i += 32) {
            if (data[i] === 0) transparentes++;
          }
          if (transparentes > (data.length / 32) * 0.38) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        } catch (e) {}
      }
    };

    const obtenerPosicion = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clienteX = 0;
      let clienteY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clienteX = e.touches[0].clientX;
        clienteY = e.touches[0].clientY;
      } else {
        clienteX = (e as MouseEvent).clientX;
        clienteY = (e as MouseEvent).clientY;
      }

      return {
        x: clienteX - rect.left,
        y: clienteY - rect.top,
      };
    };

    const alIniciar = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.cancelable) e.preventDefault();
      rascando = true;
      const pos = obtenerPosicion(e);
      rascar(pos.x, pos.y);
    };

    const alMover = (e: MouseEvent | TouchEvent) => {
      if (!rascando) return;
      if ('touches' in e && e.cancelable) e.preventDefault();
      const pos = obtenerPosicion(e);
      rascar(pos.x, pos.y);
    };

    const alDetener = () => {
      rascando = false;
    };

    canvas.addEventListener('mousedown', alIniciar);
    canvas.addEventListener('mousemove', alMover);
    canvas.addEventListener('mouseup', alDetener);
    canvas.addEventListener('touchstart', alIniciar, { passive: false });
    canvas.addEventListener('touchmove', alMover, { passive: false });
    canvas.addEventListener('touchend', alDetener);

    return () => {
      canvas.removeEventListener('mousedown', alIniciar);
      canvas.removeEventListener('mousemove', alMover);
      canvas.removeEventListener('mouseup', alDetener);
      canvas.removeEventListener('touchstart', alIniciar);
      canvas.removeEventListener('touchmove', alMover);
      canvas.removeEventListener('touchend', alDetener);
    };
  }, [dispararConfeti]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl border border-[#F0E6DF] relative text-center my-auto overflow-hidden"
      >
        {/* Botón cerrar */}
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#3D2E2B] transition-colors rounded-full hover:bg-gray-100 z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Etiqueta superior con estilo festivo */}
        <div className="inline-flex items-center gap-1.5 bg-[#FDF8F2] border border-[#EAD7C5] px-4 py-1.5 rounded-full text-xs font-serif text-[#B83232] font-semibold mb-3 shadow-xs">
          {esNochebuena ? (
            <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
          ) : esCupon ? (
            <Ticket className="w-3.5 h-3.5 text-[#B83232]" />
          ) : esMusica ? (
            <Music className="w-3.5 h-3.5 text-[#B83232]" />
          ) : (
            <Heart className="w-3.5 h-3.5 fill-[#B83232]" />
          )}
          <span>
            {esNochebuena
              ? '✨ 24 de Diciembre • Nochebuena ✨'
              : `Día ${sorpresa.dia < 10 ? `0${sorpresa.dia}` : sorpresa.dia} de Diciembre`}
          </span>
        </div>

        {/* Título de la sorpresa */}
        <h2 className="text-xl sm:text-2xl font-serif text-[#3D2E2B] mb-3.5 tracking-tight leading-snug font-bold">
          {sorpresa.titulo}
        </h2>

        {/* Contenedor interactivo (Capa de rascado y contenido revelado) */}
        <div className="relative rounded-2xl overflow-hidden mb-4 border border-[#E8D7CA] bg-gradient-to-b from-[#FFFDF9] to-[#FDF8F3] shadow-inner min-h-[180px] flex items-center justify-center">
          
          {/* Capa de rascado dorada */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-20 cursor-pointer touch-none"
          />

          {/* Contenido revelado diseñado a medida para cada tipo */}
          <div className="p-4 sm:p-5 text-left z-10 w-full">
            
            {/* 1. DISEÑO TIPO CUPÓN (Vales oficiales para Lucía) */}
            {esCupon ? (
              <div className="bg-[#FFFDF9] border-2 border-dashed border-[#B83232]/50 rounded-2xl p-4 sm:p-5 relative shadow-xs">
                {/* Cabecera del vale */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#EAD7C5]">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#B83232] uppercase tracking-wider">
                    <Ticket className="w-4 h-4" />
                    <span>Vale Especial de Amor</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#7A5A4A] font-mono font-bold bg-[#F4EBE1] px-2 py-0.5 rounded-md">
                    <Scissors className="w-3 h-3 text-[#B83232]" />
                    <span>LUCIA-{sorpresa.dia < 10 ? `0${sorpresa.dia}` : sorpresa.dia}</span>
                  </div>
                </div>

                {/* Texto del cupón */}
                <p className="text-sm sm:text-[15px] font-serif text-[#3D2E2B] leading-relaxed mb-3">
                  {mensajeLimpio}
                </p>

                {/* Pie de condiciones */}
                <div className="pt-2 border-t border-[#EAD7C5]/70 flex items-center justify-between text-[11px] font-serif text-[#7A6A65] italic">
                  <span>Condición: Canjeable con un beso ❤️</span>
                  <span>Válido siempre</span>
                </div>
              </div>
            ) : esListaNumerada ? (
              /* 2. DISEÑO TIPO LISTA ("5 cosas que amo de ti", etc.) */
              <div className="space-y-2.5 py-1">
                <div className="text-center pb-1">
                  <span className="text-xs font-serif text-[#7A5A4A] italic">
                    — Razones por las que te elijo cada día —
                  </span>
                </div>
                {lineas.map((linea, idx) => {
                  const match = linea.match(/^(\d+)[\.\)]\s*(.*)$/);
                  if (match) {
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3 bg-white/95 border border-[#EAD7C5] rounded-xl p-3 shadow-xs hover:border-[#B83232]/50 transition-colors"
                      >
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B83232] to-[#992424] text-white font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {match[1]}
                        </span>
                        <p className="text-sm font-serif text-[#3D2E2B] leading-relaxed">
                          {match[2]}
                        </p>
                      </motion.div>
                    );
                  }
                  return (
                    <p key={idx} className="text-sm font-serif text-[#5C4D4A] leading-relaxed">
                      {linea}
                    </p>
                  );
                })}
              </div>
            ) : esMusica ? (
              /* 3. DISEÑO TIPO CANCIÓN / MÚSICA (Día 8) */
              <div className="bg-[#FFFDF9] border border-[#EAD7C5] rounded-2xl p-4 sm:p-5 shadow-xs text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#B83232]/10 text-[#B83232] flex items-center justify-center mb-3">
                  <Music className="w-6 h-6" />
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  <span className="bg-[#F4EBE1] border border-[#EAD7C5] text-[#B83232] font-serif font-semibold text-xs px-3 py-1 rounded-full">
                    🎵 Mírame — Al Safir
                  </span>
                  <span className="bg-[#F4EBE1] border border-[#EAD7C5] text-[#B83232] font-serif font-semibold text-xs px-3 py-1 rounded-full">
                    🎵 Tus Ojos — Kinky
                  </span>
                </div>
                <p className="text-sm font-serif text-[#4A3B37] leading-relaxed italic">
                  "{mensajeLimpio}"
                </p>
              </div>
            ) : esRecuerdoFoto ? (
              /* 4. DISEÑO TIPO POLAROID / RECUERDO ÍNTIMO (Día 3) */
              <div className="bg-white p-3 pb-4 rounded-2xl shadow-md border border-[#EAD7C5] text-center transform -rotate-1 transition-transform hover:rotate-0">
                <div 
                  className="relative group cursor-zoom-in overflow-hidden rounded-xl mb-3 shadow-inner bg-black/5"
                  onClick={() => setMostrarLightbox(true)}
                  title="Toca para ver en pantalla completa"
                >
                  <img
                    src={sorpresa.url_imagen || '/fotos/dia-03.jpg'}
                    alt={`Recuerdo ${sorpresa.dia}`}
                    className="w-full max-h-56 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif font-semibold gap-1.5 backdrop-blur-[1px]">
                    <Sparkles className="w-4 h-4 text-[#FFD700]" />
                    <span>Toca para ampliar foto</span>
                  </div>
                </div>
                <p className="text-sm font-serif text-[#3D2E2B] leading-relaxed px-2">
                  {mensajeLimpio}
                </p>
                <div className="text-[11px] font-serif text-[#7A6A65] italic mt-2">
                  — Un momento guardado en el corazón ❤️ —
                </div>
              </div>
            ) : esNochebuena ? (
              /* 5. DISEÑO ESPECIAL NOCHEBUENA (Día 24) */
              <div className="bg-gradient-to-br from-[#FFFDF0] via-white to-[#FDF5E6] border-2 border-[#D4AF37] rounded-2xl p-5 text-center shadow-md relative">
                <div className="flex justify-center gap-1 text-[#D4AF37] mb-2">
                  <Star className="w-4 h-4 fill-[#D4AF37]" />
                  <Star className="w-5 h-5 fill-[#D4AF37] -mt-1" />
                  <Star className="w-4 h-4 fill-[#D4AF37]" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#B83232] mb-2">
                  El mejor regalo de mi vida eres tú
                </h3>
                <p className="text-sm sm:text-[15px] font-serif text-[#3D2E2B] leading-relaxed mb-3">
                  {mensajeLimpio}
                </p>
                <div className="text-xs font-serif text-[#B83232] font-semibold">
                  ¡Feliz Navidad, mi pequeña! ❤️🎄
                </div>
              </div>
            ) : (
              /* 6. DISEÑO CARTA ROMÁNTICA ARTESANAL */
              <div className="bg-white/80 border border-[#EAD7C5] rounded-2xl p-4 sm:p-5 relative shadow-xs">
                <Quote className="w-6 h-6 text-[#D4AF37]/40 mb-1" />
                <p className="text-sm sm:text-[15px] font-serif text-[#3D2E2B] leading-relaxed whitespace-pre-line px-1">
                  {mensajeLimpio}
                </p>
                <div className="pt-3 mt-2 border-t border-[#F0E6DF] text-right">
                  <span className="text-xs font-serif text-[#7A6A65] italic">
                    Siempre tuyo ❤️
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón sutil para ver sin rascar */}
        {!revelado && (
          <button
            onClick={revelarDirecto}
            className="text-xs text-[#7A6A65] hover:text-[#B83232] underline mb-3 transition-colors inline-block"
          >
            Ver sorpresa sin rascar
          </button>
        )}

        {/* Acción interactiva si es cupón */}
        {esCupon && (
          <div className="mb-4">
            {!canjeado ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={ejecutarCanje}
                className="w-full bg-gradient-to-r from-[#B83232] to-[#A32525] hover:from-[#A32525] hover:to-[#8E1F1F] text-white py-3 px-4 rounded-xl text-xs font-serif font-semibold tracking-wide transition-all flex items-center justify-center gap-2 shadow-md shadow-red-900/15"
              >
                <Award className="w-4 h-4 text-white" />
                <span>Canjear y sellar este cupón con un beso ❤️</span>
              </motion.button>
            ) : (
              <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 py-2.5 px-3 rounded-xl text-xs font-serif font-semibold flex items-center justify-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Sello oficial: Canjeado con un beso el {fechaCanje}! ❤️</span>
              </div>
            )}
          </div>
        )}

        {/* Botón inferior principal */}
        <button
          onClick={onCerrar}
          className="w-full bg-[#B83232] hover:bg-[#A02828] text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-md text-sm cursor-pointer"
        >
          Guardar recuerdo ❤️
        </button>
      </motion.div>

      {/* Visor Lightbox a Pantalla Completa para fotos */}
      <AnimatePresence>
        {mostrarLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6"
            onClick={() => setMostrarLightbox(false)}
          >
            <button
              onClick={() => setMostrarLightbox(false)}
              aria-label="Cerrar visor de foto"
              className="absolute top-4 right-4 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white p-2.5 sm:p-3 pb-5 rounded-2xl shadow-2xl border border-white/20 max-w-full">
                <img
                  src={sorpresa.url_imagen || '/fotos/dia-03.jpg'}
                  alt={`Recuerdo ${sorpresa.dia}`}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
                />
                <p className="text-center font-serif text-xs sm:text-sm text-[#3D2E2B] font-semibold mt-3">
                  Nuestra foto favorita ❤️ • Concierto inolvidable
                </p>
              </div>
              <p className="text-white/60 text-xs font-serif mt-3">
                Toca en cualquier parte para cerrar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
