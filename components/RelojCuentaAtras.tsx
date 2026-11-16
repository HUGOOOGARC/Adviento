'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function RelojCuentaAtras() {
  const [tiempo, setTiempo] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    const calcular = () => {
      const ahora = new Date();
      const ano = ahora.getFullYear();
      let objetivo = new Date(ano, 11, 1, 0, 0, 0); // 1 de Diciembre

      if (ahora.getTime() > objetivo.getTime() && ahora.getDate() <= 24) {
        objetivo = new Date(ano, 11, ahora.getDate() + 1, 0, 0, 0);
      }

      const diff = objetivo.getTime() - ahora.getTime();

      if (diff > 0) {
        setTiempo({
          dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((diff / 1000 / 60) % 60),
          segundos: Math.floor((diff / 1000) % 60),
        });
      }
    };

    calcular();
    const timer = setInterval(calcular, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-[#EAD7C5] px-4 py-2 rounded-2xl shadow-sm flex items-center justify-center gap-3 text-xs font-serif text-[#3D2E2B] mb-6 select-none">
      <Clock className="w-4 h-4 text-[#B83232] animate-spin" style={{ animationDuration: '8s' }} />
      <span>Próxima sorpresa en:</span>
      <div className="flex gap-1.5 font-bold text-[#B83232]">
        <span>{tiempo.dias}d</span>:
        <span>{tiempo.horas < 10 ? `0${tiempo.horas}` : tiempo.horas}h</span>:
        <span>{tiempo.minutos < 10 ? `0${tiempo.minutos}` : tiempo.minutos}m</span>:
        <span>{tiempo.segundos < 10 ? `0${tiempo.segundos}` : tiempo.segundos}s</span>
      </div>
    </div>
  );
}