'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Check, Send, Ticket, Scissors, CheckCircle, Eye } from 'lucide-react';
import { sounds } from '@/lib/audioHelper';
import { Sorpresa } from '@/lib/sorpresasData';

interface ModalSorpresaProps {
  sorpresa: Sorpresa;
  onCerrar: () => void;
  onCuponCanjeado?: (dia: number) => void;
}

export default function ModalSorpresa({ sorpresa, onCerrar, onCuponCanjeado }: ModalSorpresaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revelado, setRevelado] = useState(false);
  const [canjeado, setCanjeado] = useState(false);
  const [fechaCanje, setFechaCanje] = useState<string | null>(null);
  const [reaccionSeleccionada, setReaccionSeleccionada] = useState<string | null>(null);
  const [notaPersonal, setNotaPersonal] = useState('');
  const [notaGuardada, setNotaGuardada] = useState(false);
  const [porcentajeRascado, setPorcentajeRascado] = useState(0);

  // Cargar estado de canje y reacciones de localStorage
  useEffect(() => {
    try {
      const cupones = JSON.parse(localStorage.getItem('adviento_cupones_canjeados') || '{}');
      if (cupones[sorpresa.dia]) {
        setCanjeado(true);
        setFechaCanje(cupones[sorpresa.dia]);
      }

      const reacciones = JSON.parse(localStorage.getItem('adviento_reacciones') || '{}');
      if (reacciones[sorpresa.dia]) {
        setReaccionSeleccionada(reacciones[sorpresa.dia].emoji || null);
        setNotaPersonal(reacciones[sorpresa.dia].nota || '');
        if (reacciones[sorpresa.dia].nota) setNotaGuardada(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [sorpresa.dia]);

  // Cerrar con tecla Escape
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B83232', '#EAD7C5', '#FFD700', '#D4AF37'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Función para revelar completamente
  const completarRevelado = useCallback(() => {
    if (revelado) return;
    setRevelado(true);
    setPorcentajeRascado(100);
    sounds.playChime();
    dispararConfeti();

    // Limpiar canvas visualmente
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [revelado, dispararConfeti]);

  // Inicialización y lógica de la capa de rascado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revelado) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Pintar fondo metalizado dorado
    const gradiente = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradiente.addColorStop(0, '#D4AF37');
    gradiente.addColorStop(0.3, '#FDF3E3');
    gradiente.addColorStop(0.7, '#D4AF37');
    gradiente.addColorStop(1, '#AA771C');

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto guía
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillStyle = '#3D2E2B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Rasca aquí con tu dedo o ratón ✨', canvas.width / 2, canvas.height / 2);

    let rascando = false;
    let contadorMovimientos = 0;

    const verificarProgreso = () => {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        let pixelesTransparentes = 0;
        const total = pixels.length;

        // Comprobar canal alfa cada 32 bytes para rendimiento
        for (let i = 3; i < total; i += 32) {
          if (pixels[i] === 0) pixelesTransparentes++;
        }

        const porcentaje = Math.round((pixelesTransparentes / (total / 32)) * 100);
        setPorcentajeRascado(porcentaje);

        // Si se rasca más del 40%, auto-revelar el resto
        if (porcentaje > 40) {
          completarRevelado();
        }
      } catch (e) {
        // En caso de fallo de lectura de canvas, no interrumpir
      }
    };

    const rascar = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();

      contadorMovimientos++;
      if (contadorMovimientos % 3 === 0) {
        sounds.playScratch();
      }
      if (contadorMovimientos % 12 === 0) {
        verificarProgreso();
      }
    };

    const obtenerPosicion = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clienteX = 0;
      let clienteY = 0;

      // CORRECCIÓN TÁCTIL EXACTA: e.touches[0]
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
      rascando = true;
      const pos = obtenerPosicion(e);
      rascar(pos.x, pos.y);
    };

    const alMover = (e: MouseEvent | TouchEvent) => {
      if (!rascando) return;
      const pos = obtenerPosicion(e);
      rascar(pos.x, pos.y);
    };

    const alDetener = () => {
      if (rascando) {
        rascando = false;
        verificarProgreso();
      }
    };

    canvas.addEventListener('mousedown', alIniciar);
    canvas.addEventListener('mousemove', alMover);
    canvas.addEventListener('mouseup', alDetener);
    canvas.addEventListener('touchstart', alIniciar, { passive: true });
    canvas.addEventListener('touchmove', alMover, { passive: true });
    canvas.addEventListener('touchend', alDetener);

    return () => {
      canvas.removeEventListener('mousedown', alIniciar);
      canvas.removeEventListener('mousemove', alMover);
      canvas.removeEventListener('mouseup', alDetener);
      canvas.removeEventListener('touchstart', alIniciar);
      canvas.removeEventListener('touchmove', alMover);
      canvas.removeEventListener('touchend', alDetener);
    };
  }, [revelado, completarRevelado]);

  // Canjear cupón
  const ejecutarCanje = () => {
    const ahora = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    setCanjeado(true);
    setFechaCanje(ahora);

    try {
      const cupones = JSON.parse(localStorage.getItem('adviento_cupones_canjeados') || '{}');
      cupones[sorpresa.dia] = ahora;
      localStorage.setItem('adviento_cupones_canjeados', JSON.stringify(cupones));
    } catch (e) {
      console.error(e);
    }

    sounds.playFanfare();
    dispararConfeti();
    if (onCuponCanjeado) onCuponCanjeado(sorpresa.dia);
  };

  // Guardar reacción
  const guardarReaccion = (emoji: string) => {
    setReaccionSeleccionada(emoji);
    sounds.playChime();
    try {
      const reacciones = JSON.parse(localStorage.getItem('adviento_reacciones') || '{}');
      reacciones[sorpresa.dia] = {
        ...(reacciones[sorpresa.dia] || {}),
        emoji,
        fecha: new Date().toISOString()
      };
      localStorage.setItem('adviento_reacciones', JSON.stringify(reacciones));
    } catch (e) {
      console.error(e);
    }
  };

  const guardarNota = () => {
    if (!notaPersonal.trim()) return;
    try {
      const reacciones = JSON.parse(localStorage.getItem('adviento_reacciones') || '{}');
      reacciones[sorpresa.dia] = {
        ...(reacciones[sorpresa.dia] || {}),
        nota: notaPersonal.trim(),
        fechaNota: new Date().toISOString()
      };
      localStorage.setItem('adviento_reacciones', JSON.stringify(reacciones));
      setNotaGuardada(true);
      sounds.playChime();
    } catch (e) {
      console.error(e);
    }
  };

  const esCupon = sorpresa.tipo === 'cupon' || !!sorpresa.codigo_cupon;

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
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border border-[#F0E6DF] relative text-center my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Botón cerrar */}
        <button
          onClick={onCerrar}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#3D2E2B] transition-colors rounded-full hover:bg-gray-100 z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Etiqueta superior */}
        <div className="inline-flex items-center gap-1.5 bg-[#FDF8F2] border border-[#EAD7C5] px-4 py-1.5 rounded-full text-xs font-serif text-[#B83232] font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-[#B83232]" />
          <span>Día {sorpresa.dia < 10 ? `0${sorpresa.dia}` : sorpresa.dia} de Diciembre</span>
        </div>

        {/* Título */}
        <h2 className="text-xl sm:text-2xl font-serif text-[#3D2E2B] mb-3 tracking-tight font-bold">
          {sorpresa.titulo}
        </h2>

        {/* Contenedor interactivo (Capa de rascado o Contenido revelado) */}
        <div className="relative rounded-2xl overflow-hidden mb-4 border border-[#EAD7C5] bg-[#FDF8F2] shadow-inner min-h-[180px] flex items-center justify-center">
          
          {/* Canvas de rascado */}
          {!revelado && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full z-20 cursor-pointer touch-none"
            />
          )}

          {/* Contenido tras el rascado */}
          <div className="p-4 sm:p-5 text-left z-10 w-full">
            {/* Foto Polaroid */}
            {sorpresa.url_imagen && (
              <motion.div 
                initial={{ rotate: -1, scale: 0.96 }}
                animate={{ rotate: 1, scale: 1 }}
                className="bg-white p-2.5 pb-4 rounded-xl shadow-md border border-[#EAD7C5] mb-4 mx-auto max-w-sm"
              >
                <img
                  src={sorpresa.url_imagen}
                  alt={`Recuerdo día ${sorpresa.dia}`}
                  className="w-full h-44 sm:h-52 object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="pt-2 text-center text-xs font-serif text-[#7A6A65] italic">
                  Recuerdo especial para Lucía ❤️
                </div>
              </motion.div>
            )}

            {/* Formato Cupón si es tipo cupón */}
            {esCupon ? (
              <div className="bg-[#FFFDF9] border-2 border-dashed border-[#B83232] rounded-2xl p-4 sm:p-5 relative shadow-sm my-1">
                <div className="flex items-center justify-between border-b border-[#EAD7C5] pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#B83232] uppercase tracking-wider">
                    <Ticket className="w-4 h-4" />
                    <span>Vale Oficial Canjeable</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#7A5A4A] font-mono font-bold bg-[#F4EBE1] px-2 py-0.5 rounded">
                    <Scissors className="w-3 h-3" />
                    <span>{sorpresa.codigo_cupon || `LUCIA-${sorpresa.dia}`}</span>
                  </div>
                </div>

                <p className="text-sm font-serif text-[#3D2E2B] leading-relaxed mb-3">
                  {sorpresa.mensaje}
                </p>

                <div className="text-[11px] font-serif italic text-[#7A6A65] mb-4">
                  {sorpresa.condicion_cupon || "Condición: Canjeable con un beso ❤️"}
                </div>

                {/* Botón o sello de canje */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#EAD7C5]">
                  {!canjeado ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={ejecutarCanje}
                      className="w-full bg-[#B83232] hover:bg-[#A02828] text-white py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide shadow-md flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Canjear este cupón ahora</span>
                    </motion.button>
                  ) : (
                    <div className="w-full bg-red-50 border border-red-200 text-[#B83232] py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>¡CANJEADO EL {fechaCanje}! ❤️</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm sm:text-base font-serif text-[#5C4D4A] leading-relaxed whitespace-pre-line text-center py-2">
                {sorpresa.mensaje}
              </p>
            )}
          </div>
        </div>

        {/* Botón de ayuda para revelar si aún no se ha rascado */}
        {!revelado && (
          <div className="mb-4">
            <button
              onClick={completarRevelado}
              className="inline-flex items-center gap-1.5 text-xs text-[#7A5A4A] hover:text-[#B83232] transition-colors underline font-medium"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver sorpresa directamente sin rascar</span>
            </button>
          </div>
        )}

        {/* Sección de Reacciones de Lucía */}
        {revelado && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FDF8F2] border border-[#EAD7C5] rounded-2xl p-3.5 mb-4 text-left"
          >
            <p className="text-xs font-serif font-bold text-[#3D2E2B] mb-2 flex items-center gap-1.5">
              <span>¿Qué te ha parecido, mi amor?</span>
              <Heart className="w-3 h-3 text-[#B83232] fill-[#B83232]" />
            </p>

            {/* Emojis rápidos */}
            <div className="flex items-center justify-between gap-1 mb-3">
              {['❤️', '😍', '🥹', '💋', '🥂', '🎁'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => guardarReaccion(emoji)}
                  className={`text-xl p-2 rounded-xl transition-all ${
                    reaccionSeleccionada === emoji
                      ? 'bg-white shadow-md scale-125 border border-[#B83232]'
                      : 'hover:bg-white/70 hover:scale-110'
                  }`}
                  title={`Reaccionar con ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Mensajito opcional */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escríbeme una nota o cuándo lo quieres..."
                value={notaPersonal}
                onChange={(e) => {
                  setNotaPersonal(e.target.value);
                  setNotaGuardada(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') guardarNota();
                }}
                className="flex-1 bg-white border border-[#EAD7C5] rounded-xl px-3 py-1.5 text-xs text-[#3D2E2B] focus:outline-none focus:ring-1 focus:ring-[#B83232]"
              />
              <button
                onClick={guardarNota}
                className="bg-[#3D2E2B] hover:bg-[#251A18] text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 font-medium shadow-sm transition-colors"
                title="Guardar nota"
              >
                {notaGuardada ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
            {notaGuardada && (
              <p className="text-[10px] text-green-700 font-serif mt-1">✓ Nota guardada con cariño</p>
            )}
          </motion.div>
        )}

        {/* Botón principal inferior */}
        <button
          onClick={onCerrar}
          className="w-full bg-[#B83232] hover:bg-[#A02828] text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
        >
          <span>Guardar recuerdo ❤️</span>
        </button>
      </motion.div>
    </div>
  );
}
