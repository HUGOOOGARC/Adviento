'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';

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
  useEffect(() => {
    // Carga asíncrona de confeti al abrir el modal en el navegador
    const lanzarConfeti = async () => {
      try {
        // @ts-ignore
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B83232', '#EAD7C5', '#F5EBE1', '#FFD700', '#D4AF37'],
        });
      } catch (err) {
        console.error(err);
      }
    };
    lanzarConfeti();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#F0E6DF] relative overflow-hidden text-center"
      >
        {/* Botón de cierre */}
        <button
          onClick={onCerrar}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#3D2E2B] transition-colors rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Día del calendario */}
        <div className="inline-flex items-center gap-1.5 bg-[#FDF8F2] border border-[#EAD7C5] px-4 py-1.5 rounded-full text-xs font-serif text-[#B83232] font-semibold mb-4">
          <Heart className="w-3.5 h-3.5 fill-[#B83232]" />
          <span>Día {sorpresa.dia < 10 ? `0${sorpresa.dia}` : sorpresa.dia} de Diciembre</span>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-serif text-[#3D2E2B] mb-4 tracking-tight leading-snug">
          {sorpresa.titulo}
        </h2>

        {/* Fotografía de recuerdo (si existe en Supabase) */}
        {sorpresa.url_imagen && (
          <div className="mb-4 rounded-2xl overflow-hidden max-h-60 border border-gray-100 shadow-sm relative group">
            <img
              src={sorpresa.url_imagen}
              alt={`Recuerdo día ${sorpresa.dia}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Texto del mensaje */}
        <div className="bg-[#FDF8F2] p-4 rounded-2xl border border-[#F0E6DF] mb-6">
          <p className="text-sm font-serif text-[#5C4D4A] leading-relaxed whitespace-pre-line text-left">
            {sorpresa.mensaje}
          </p>
        </div>

        {/* Botón principal del modal */}
        <button
          onClick={onCerrar}
          className="w-full bg-[#B83232] hover:bg-[#A02828] text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
        >
          <span>Guardar recuerdo ❤️</span>
        </button>
      </motion.div>
    </div>
  );
}