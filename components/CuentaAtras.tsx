'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CuentaAtras() {
  const [tiempoRestante, setTiempoRestante] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    const calcularTiempo = () => {
      const ahora = new Date();
      const anoActual = ahora.getFullYear();
      let objetivo = new Date(anoActual, 11, 1, 0, 0, 0); // 1 de Diciembre

      if (ahora.getTime() > objetivo.getTime() && ahora.getDate() <= 24) {
        // Si ya estamos en diciembre, contar hasta la medianoche del siguiente día
        objetivo = new Date(anoActual, 11, ahora.getDate() + 1, 0, 0, 0);
      }

      const diferencia = objetivo.getTime() - ahora.getTime();

      if (diferencia > 0) {
        setTiempoRestante({
          dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((diferencia / 1000 / 60) % 60),
          segundos: Math.floor((diferencia / 1000) % 60),
        });
      }
    };

    calcularTiempo();
    const intervalo = setInterval(calcularTiempo, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-[#EAD7C5] px-4 py-2 rounded-2xl shadow-sm flex items-center justify-center gap-3 text-xs font-serif text-[#3D2E2B] mb-6">
      <Clock className="w-4 h-4 text-[#B83232] animate-spin-slow" />
      <span>Siguiente sorpresa en:</span>
      <div className="flex gap-1.5 font-bold text-[#B83232]">
        <span>{tiempoRestante.dias}d</span>:
        <span>{tiempoRestante.horas < 10 ? `0${tiempoRestante.horas}` : tiempoRestante.horas}h</span>:
        <span>{tiempoRestante.minutos < 10 ? `0${tiempoRestante.minutos}` : tiempoRestante.minutos}m</span>:
        <span>{tiempoRestante.segundos < 10 ? `0${tiempoRestante.segundos}` : tiempoRestante.segundos}s</span>
      </div>
    </div>
  );
}