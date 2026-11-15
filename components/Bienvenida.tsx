'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gift } from 'lucide-react';

interface BienvenidaProps {
  nombrePareja?: string;
  onAceptar: () => void;
}

export default function Bienvenida({ nombrePareja = "Lucía", onAceptar }: BienvenidaProps) {
  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      <div className="absolute top-12 left-12 text-[#EAD7C5] animate-pulse">
        <Sparkles className="w-8 h-8" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-md w-full bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#F0E6DF] relative z-20"
      >
        {/* Sobre animado */}
        <motion.div 
          className="relative mb-8 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAceptar}
        >
          <div className="w-48 h-34 bg-gradient-to-b from-[#E6D5C3] to-[#D9C4B0] rounded-b-2xl border-2 border-[#C9B39F] shadow-lg relative flex items-center justify-center overflow-hidden">
            <div 
              className="absolute top-0 left-0 right-0 h-0 border-l-[96px] border-l-transparent border-r-[96px] border-r-transparent border-t-[66px] border-t-[#CBB5A1] drop-shadow-md z-10"
              style={{ transformOrigin: "top" }}
            />
            <motion.div 
              initial={{ y: 4 }}
              animate={{ y: -12 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.8, ease: "easeInOut" }}
              className="bg-white px-5 py-2 rounded-lg border border-[#D4C1AE] shadow-md z-20 flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-[#B83232] fill-[#B83232]" />
              <p className="text-xs font-serif text-[#3D2E2B] tracking-wide font-bold">
                Para {nombrePareja}
              </p>
            </motion.div>
            <div className="absolute top-10 z-30 w-8 h-8 rounded-full bg-[#B83232] border-2 border-white/80 shadow-md flex items-center justify-center">
              <Gift className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Textos */}
        <div className="inline-flex items-center gap-1 bg-[#FDF8F2] border border-[#EAD7C5] px-3 py-1 rounded-full text-xs font-serif text-[#B83232] font-semibold mb-3">
          <span>24 sorpresas preparadas</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-[#3D2E2B] mb-2 tracking-tight leading-tight">
          Un poquito de cariño para ti.
        </h1>
        
        <p className="text-sm font-serif text-[#7A6A65] mb-8 italic">
          Especialmente para {nombrePareja} ❤️
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAceptar}
          className="w-full bg-[#B83232] hover:bg-[#A02828] text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-red-900/15 mb-4 text-base tracking-wide flex items-center justify-center gap-2"
        >
          <span>Aceptar mi regalo</span>
          <Heart className="w-4 h-4 fill-white" />
        </motion.button>

        <button
          onClick={onAceptar}
          className="text-xs text-gray-400 hover:text-[#3D2E2B] transition-colors hover:underline tracking-wide"
        >
          Entrar al calendario directamente
        </button>
      </motion.div>
    </div>
  );
}