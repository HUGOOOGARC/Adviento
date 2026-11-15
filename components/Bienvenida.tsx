'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BienvenidaProps {
  nombrePareja?: string;
  onAceptar: () => void;
}

export default function Bienvenida({ nombrePareja = "Lucía", onAceptar }: BienvenidaProps) {
  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-[#F0E6DF] relative overflow-hidden"
      >
        {/* --- ILUSTRACIÓN DEL SOBRE ANIMADO --- */}
        <motion.div 
          className="relative mb-8 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAceptar}
        >
          {/* Cuerpo principal del sobre */}
          <div className="w-44 h-32 bg-[#E6D5C3] rounded-b-xl border-2 border-[#D4C1AE] shadow-inner relative flex items-center justify-center">
            {/* Solapa superior triangular */}
            <div 
              className="absolute top-0 left-0 right-0 h-0 border-l-[88px] border-l-transparent border-r-[88px] border-r-transparent border-t-[60px] border-t-[#D9C4B0] drop-shadow-sm"
              style={{ transformOrigin: "top" }}
            />

            {/* Tarjeta / Etiqueta interior sobresaliente */}
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: -12 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.8, ease: "easeInOut" }}
              className="bg-white px-4 py-2 rounded-md border border-[#D4C1AE] shadow-md z-10"
            >
              <p className="text-xs font-serif text-[#7A5A4A] tracking-wide font-semibold">
                Noelli - Para {nombrePareja}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* --- TEXTOS PRINCIPALES --- */}
        <h1 className="text-3xl sm:text-4xl font-serif text-[#3D2E2B] mb-2 tracking-tight">
          Un poquito de cariño para ti.
        </h1>
        
        <p className="text-sm font-serif text-gray-500 mb-8 tracking-wide">
          Para {nombrePareja}
        </p>

        {/* --- BOTÓN PRINCIPAL REDONDEADO --- */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAceptar}
          className="w-full bg-[#B83232] hover:bg-[#A02828] text-white font-medium py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-red-900/10 mb-4 text-base tracking-wide"
        >
          Aceptar mi regalo
        </motion.button>

        {/* --- ENLACE SECUNDARIO --- */}
        <button
          onClick={onAceptar}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors hover:underline tracking-wide"
        >
          Omitir animación
        </button>
      </motion.div>
    </div>
  );
}