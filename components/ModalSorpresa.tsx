'use client';

import React, { useEffect } from 'react';
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
  useEffect(() => {
    // Carga dinámica en tiempo de ejecución sin import estático en la cabecera
    // @ts-ignore
    import('canvas-confetti').then((module) => {
      const confetti = module.default || module;
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#B83232', '#EAD7C5', '#F5EBE1', '#FFD700'],
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#F0E6DF] relative overflow-hidden text-center"
      >
        <button
          onClick={onCerrar}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#3D2E2B] transition-colors rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 bg-[#FDF8F2] border border-[#EAD7C5] px-4 py-1.5 rounded-full text-xs font-serif text-[#B83232] font-semibold mb-4">
          <Heart className="w-3.5 h-3.5 fill-[#B83232]" />
          <span>Día {sorpresa.dia < 10 ? `0${sorpresa.dia}` : sorpresa.dia} de Diciembre</span>
        </div>

        <h2 className="text-2xl font-serif text-[#3D2E2B] mb-4 tracking-tight">
          {sorpresa.titulo}
        </h2>

        {sorpresa.url_imagen && (
          <div className="mb-4 rounded-2xl overflow-hidden max-h-56 border border-gray-100 shadow-sm">
            <img
              src={sorpresa.url_imagen}
              alt={`Foto del día ${sorpresa.dia}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-sm font-serif text-[#5C4D4A] leading-relaxed mb-6 whitespace-pre-line">
          {sorpresa.mensaje}
        </p>

        <button
          onClick={onCerrar}
          className="w-full bg-[#B83232] hover:bg-[#A02828] text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-md text-sm"
        >
          Guardar recuerdo ❤️
        </button>
      </motion.div>
    </div>
  );
}