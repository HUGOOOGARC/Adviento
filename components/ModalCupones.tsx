'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Ticket, CheckCircle2, Download, Heart, Sparkles } from 'lucide-react';
import { SORPRESAS_POR_DEFECTO, Sorpresa } from '@/lib/sorpresasData';

interface ModalCuponesProps {
  onCerrar: () => void;
  onAbrirSorpresa: (sorpresa: Sorpresa) => void;
  diasAbiertos: number[];
}

export default function ModalCupones({ onCerrar, onAbrirSorpresa, diasAbiertos }: ModalCuponesProps) {
  const [cuponesCanjeados, setCuponesCanjeados] = useState<Record<number, string>>({});

  useEffect(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem('adviento_cupones_canjeados') || '{}');
      setCuponesCanjeados(guardados);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const listaCupones = SORPRESAS_POR_DEFECTO.filter(
    (s) => s.tipo === 'cupon' || s.tipo === 'especial'
  );

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
        className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border border-[#F0E6DF] relative my-auto max-h-[90vh] flex flex-col"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#F0E6DF] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FDF8F2] border border-[#EAD7C5] rounded-xl text-[#B83232]">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-serif font-bold text-[#3D2E2B]">
                Talonario de Cupones de Lucía
              </h3>
              <p className="text-xs text-[#7A6A65]">Tus vales románticos para canjear</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-1.5 text-gray-400 hover:text-[#3D2E2B] rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de cupones con scroll */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
          {listaCupones.map((cupon) => {
            const estaDesbloqueado = diasAbiertos.includes(cupon.dia);
            const canjeado = !!cuponesCanjeados[cupon.dia];
            const fechaCanje = cuponesCanjeados[cupon.dia];

            return (
              <div
                key={cupon.dia}
                className={`border rounded-2xl p-3.5 transition-all relative overflow-hidden ${
                  canjeado
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : estaDesbloqueado
                    ? 'bg-[#FFFDF9] border-[#B83232]/30 hover:border-[#B83232] shadow-sm'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold bg-[#F4EBE1] text-[#7A5A4A] px-2 py-0.5 rounded">
                        DÍA {cupon.dia < 10 ? `0${cupon.dia}` : cupon.dia}
                      </span>
                      {cupon.codigo_cupon && (
                        <span className="text-[10px] font-mono text-[#B83232] font-semibold">
                          {cupon.codigo_cupon}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-serif font-bold text-[#3D2E2B] mb-1">
                      {cupon.titulo}
                    </h4>
                    <p className="text-xs text-[#5C4D4A] line-clamp-2">
                      {cupon.mensaje}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-center min-w-[70px]">
                    {canjeado ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Canjeado
                      </span>
                    ) : estaDesbloqueado ? (
                      <button
                        onClick={() => {
                          onCerrar();
                          onAbrirSorpresa(cupon);
                        }}
                        className="bg-[#B83232] hover:bg-[#A02828] text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-sm transition-all"
                      >
                        Canjear
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">Bloqueado</span>
                    )}
                  </div>
                </div>

                {canjeado && (
                  <div className="mt-2 text-[10px] text-emerald-600 font-serif italic text-left">
                    Canjeado con un beso el {fechaCanje} ❤️
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Acciones inferiores */}
        <div className="pt-4 mt-3 border-t border-[#F0E6DF] flex flex-col sm:flex-row gap-2">
          <a
            href="/Talonario_Cupones_Romanticos_Lucia.pdf"
            download="Talonario_Cupones_Lucia.pdf"
            className="flex-1 bg-[#FDF8F2] hover:bg-[#F5EBE1] border border-[#EAD7C5] text-[#3D2E2B] py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-[#B83232]" />
            <span>Descargar Talonario en PDF</span>
          </a>
          <button
            onClick={onCerrar}
            className="bg-[#3D2E2B] hover:bg-[#251A18] text-white py-2.5 px-5 rounded-xl text-xs font-semibold transition-all"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
