'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';

interface Sorpresa {
  dia: number;
  titulo: string;
  mensaje: string;
  url_imagen?: string;
}

interface ModalSorpresaProps {
  sorpresa: Sorpresa;
  onCerrar: () => void;
}

export default function ModalSorpresa({ sorpresa, onCerrar }: ModalSorpresaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revelado, setRevelado] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const gradiente = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradiente.addColorStop(0, '#D4AF37');
    gradiente.addColorStop(0.5, '#F5EBE1');
    gradiente.addColorStop(1, '#B8860B');

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 15px Georgia';
    ctx.fillStyle = '#3D2E2B';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Rasca aquí con tu dedo o ratón ✨', canvas.width / 2, canvas.height / 2);

    let rascando = false;

    const rascar = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      setRevelado(true);
    };

    // CORREGIDO: Lectura adecuada del primer objeto de TouchList
    const obtenerPosicion = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const esTactil = 'touches' in e && e.touches.length > 0;
      const clienteX = esTactil ? e.touches.clientX : (e as MouseEvent).clientX;
      const clienteY = esTactil ? e.touches.clientY : (e as MouseEvent).clientY;
      return { x: clienteX - rect.left, y: clienteY - rect.top };
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

    const alDetener = () => { rascando = false; };

    canvas.addEventListener('mousedown', alIniciar);
    canvas.addEventListener('mousemove', alMover);
    canvas.addEventListener('mouseup', alDetener);
    canvas.addEventListener('touchstart', alIniciar);
    canvas.addEventListener('touchmove', alMover);
    canvas.addEventListener('touchend', alDetener);

    return () => {
      canvas.removeEventListener('mousedown', alIniciar);
      canvas.removeEventListener('mousemove', alMover);
      canvas.removeEventListener('mouseup', alDetener);
    };
  }, []);

  useEffect(() => {
    if (revelado) {
      const lanzarConfeti = async () => {
        try {
          // @ts-ignore
          const confetti = (await import('canvas-confetti')).default;
          confetti({
            particleCount: 75,
            spread: 65,
            origin: { y: 0.6 },
            colors: ['#B83232', '#EAD7C5', '#FFD700'],
          });
        } catch (e) {}
      };
      lanzarConfeti();
    }
  }, [revelado]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#F0E6DF] relative overflow-hidden text-center"
      >
        <button
          onClick={onCerrar}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#3D2E2B] transition-colors rounded-full hover:bg-gray-100 z-30"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 bg-[#FDF8F2] border border-[#EAD7C5] px-4 py-1.5 rounded-full text-xs font-serif text-[#B83232] font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-[#B83232]" />
          <span>Día {sorpresa.dia < 10 ? `0${sorpresa.dia}` : sorpresa.dia} de Diciembre</span>
        </div>

        <h2 className="text-2xl font-serif text-[#3D2E2B] mb-4 tracking-tight">
          {sorpresa.titulo}
        </h2>

        <div className="relative rounded-2xl overflow-hidden mb-5 min-h-[160px] border border-[#EAD7C5] flex items-center justify-center bg-[#FDF8F2]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-20 cursor-pointer touch-none"
          />

          <div className="p-4 text-left z-10 w-full">
            {sorpresa.url_imagen && (
              <img
                src={sorpresa.url_imagen}
                alt={`Recuerdo ${sorpresa.dia}`}
                className="w-full max-h-48 object-cover rounded-xl mb-3 shadow-sm"
              />
            )}
            <p className="text-sm font-serif text-[#5C4D4A] leading-relaxed whitespace-pre-line">
              {sorpresa.mensaje}
            </p>
          </div>
        </div>

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