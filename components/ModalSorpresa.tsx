'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, CheckCircle2, Sparkles, Scissors, Ticket } from 'lucide-react';
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

  // Detección de cupones
  const esCupon =
    sorpresa.titulo.toLowerCase().includes('cupón') ||
    sorpresa.titulo.toLowerCase().includes('cupon');

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
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#B83232', '#EAD7C5', '#FFD700'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

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
    gradiente.addColorStop(0.3, '#FFF6E9');
    gradiente.addColorStop(0.7, '#D4AF37');
    gradiente.addColorStop(1, '#AA7A1E');

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
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();

      trazos++;
      if (trazos === 1) {
        setRevelado(true);
        dispararConfeti();
      }

      // Auto-revelado suave si se rasca más del 40%
      if (trazos % 12 === 0) {
        try {
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = img.data;
          let transparentes = 0;
          for (let i = 3; i < data.length; i += 32) {
            if (data[i] === 0) transparentes++;
          }
          if (transparentes > (data.length / 32) * 0.4) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        } catch (e) {}
      }
    };

    // Coordenadas táctiles exactas para móvil
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#F0E6DF] relative text-center my-auto overflow-hidden"
      >
        {/* Botón cerrar */}
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#3D2E2B] transition-colors rounded-full hover:bg-gray-100 z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Etiqueta superior */}
        <div className="inline-flex items-center gap-1.5 bg-[#FDF8F2] border border-[#EAD7C5] px-4 py-1.5 rounded-full text-xs font-serif text-[#B83232] font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-[#B83232]" />
          <span>Día {sorpresa.dia < 10 ? `0${sorpresa.dia}` : sorpresa.dia} de Diciembre</span>
        </div>

        {/* Título de la sorpresa */}
        <h2 className="text-2xl sm:text-[26px] font-serif text-[#3D2E2B] mb-4 tracking-tight leading-snug font-bold">
          {sorpresa.titulo}
        </h2>

        {/* Tarjeta interior interactiva (Carta / Pergamino / Cupón) */}
        <div className="relative rounded-2xl overflow-hidden mb-4 border border-[#EAD7C5] bg-gradient-to-b from-[#FFFDF9] to-[#FDF8F2] shadow-sm min-h-[170px] flex items-center justify-center">
          
          {/* Capa de rascado */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-20 cursor-pointer touch-none"
          />

          {/* Contenido revelado */}
          <div className="p-5 text-left z-10 w-full">
            {/* Foto Polaroid si tiene imagen */}
            {sorpresa.url_imagen && (
              <div className="bg-white p-2.5 pb-3.5 rounded-xl shadow-md border border-[#EAD7C5] mb-4">
                <img
                  src={sorpresa.url_imagen}
                  alt={`Recuerdo ${sorpresa.dia}`}
                  className="w-full max-h-48 object-cover rounded-lg"
                />
                <p className="text-center text-xs font-serif text-[#7A6A65] italic mt-2">
                  Recuerdo especial para Lucía ❤️
                </p>
              </div>
            )}

            {/* Caso 1: Cupón / Vale de regalo */}
            {esCupon ? (
              <div className="border border-dashed border-[#B83232]/50 bg-[#FDF8F2] rounded-xl p-4 relative">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EAD7C5]">
                  <div className="flex items-center gap-1 text-[11px] font-serif font-bold text-[#B83232] uppercase tracking-wider">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Vale Especial</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#7A5A4A] font-mono bg-[#F4EBE1] px-2 py-0.5 rounded">
                    <Scissors className="w-2.5 h-2.5" />
                    <span>LUCIA-{sorpresa.dia < 10 ? `0${sorpresa.dia}` : sorpresa.dia}</span>
                  </div>
                </div>

                <p className="text-sm font-serif text-[#3D2E2B] leading-relaxed mb-1">
                  {mensajeLimpio}
                </p>
                <p className="text-[11px] font-serif text-[#7A6A65] italic">
                  Condición: Canjeable con un beso ❤️
                </p>
              </div>
            ) : esListaNumerada ? (
              /* Caso 2: Lista formateada de cosas (como "5 cosas que amo de ti") */
              <div className="space-y-2 py-1">
                {lineas.map((linea, idx) => {
                  const match = linea.match(/^(\d+)[\.\)]\s*(.*)$/);
                  if (match) {
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 bg-white/90 border border-[#EAD7C5] rounded-xl p-2.5 shadow-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#B83232] text-white font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          {match[1]}
                        </span>
                        <p className="text-sm font-serif text-[#3D2E2B] leading-snug">
                          {match[2]}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-sm font-serif text-[#5C4D4A] leading-relaxed">
                      {linea}
                    </p>
                  );
                })}
              </div>
            ) : (
              /* Caso 3: Carta o mensaje personal */
              <div className="py-2 px-1">
                <p className="text-sm sm:text-[15px] font-serif text-[#4A3B37] leading-relaxed whitespace-pre-line">
                  {mensajeLimpio}
                </p>
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
              <button
                onClick={ejecutarCanje}
                className="w-full bg-[#FDF8F2] hover:bg-[#F5EBE1] border border-[#B83232] text-[#B83232] py-2.5 px-4 rounded-xl text-xs font-serif font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-[#B83232]" />
                <span>Canjear este cupón con un beso ❤️</span>
              </button>
            ) : (
              <div className="w-full bg-red-50/80 border border-red-200 text-[#B83232] py-2.5 px-3 rounded-xl text-xs font-serif font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>¡Canjeado con un beso el {fechaCanje}! ❤️</span>
              </div>
            )}
          </div>
        )}

        {/* Botón inferior principal */}
        <button
          onClick={onCerrar}
          className="w-full bg-[#B83232] hover:bg-[#A02828] text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-md text-sm"
        >
          Guardar recuerdo ❤️
        </button>
      </motion.div>
    </div>
  );
}
