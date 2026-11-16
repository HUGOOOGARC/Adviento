'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Gift } from 'lucide-react';

export default function RelojCuentaAtras() {
  const [tiempo, setTiempo] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [terminado, setTerminado] = useState(false);
  const [mensajeCabecera, setMensajeCabecera] = useState('Próxima sorpresa en:');

  useEffect(() => {
    const calcular = () => {
      const ahora = new Date();
      const ano = ahora.getFullYear();
      const mes = ahora.getMonth(); // 11 = Diciembre
      const dia = ahora.getDate();

      // Caso 1: Pasado el 24 de diciembre (Navidad en adelante o año siguiente)
      if ((mes === 11 && dia > 24) || mes > 11 || (mes === 0 && ahora.getFullYear() > ano)) {
        setTerminado(true);
        return;
      }

      let objetivo: Date;

      // Caso 2: Antes del 1 de diciembre
      if (mes < 11) {
        objetivo = new Date(ano, 11, 1, 0, 0, 0);
        setMensajeCabecera('El calendario comienza en:');
      } 
      // Caso 3: Entre el 1 y el 24 de diciembre
      else {
        // Próximo día a las 00:00:00
        objetivo = new Date(ano, 11, dia + 1, 0, 0, 0);
        setMensajeCabecera(dia === 24 ? '¡Nochebuena! Fin de cuenta atrás:' : 'Próxima sorpresa en:');
      }

      const diff = objetivo.getTime() - ahora.getTime();

      if (diff > 0) {
        setTerminado(false);
        setTiempo({
          dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((diff / 1000 / 60) % 60),
          segundos: Math.floor((diff / 1000) % 60),
        });
      } else {
        if (mes === 11 && dia >= 24) {
          setTerminado(true);
        }
      }
    };

    calcular();
    const timer = setInterval(calcular, 1000);
    return () => clearInterval(timer);
  }, []);

  if (terminado) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-[#EAD7C5] px-4 py-2 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-xs font-serif text-[#B83232] mb-5 select-none font-semibold">
        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        <span>¡Feliz Navidad! Todas las sorpresas están disponibles ✨🎄</span>
      </div>
    );
  }

  return (
    <div className="bg-white/85 backdrop-blur-sm border border-[#EAD7C5] px-4 py-2 rounded-2xl shadow-sm flex items-center justify-center gap-2.5 text-xs font-serif text-[#3D2E2B] mb-5 select-none">
      <Clock className="w-4 h-4 text-[#B83232] animate-spin" style={{ animationDuration: '10s' }} />
      <span>{mensajeCabecera}</span>
      <div className="flex gap-1.5 font-bold text-[#B83232]">
        {tiempo.dias > 0 && <span>{tiempo.dias}d</span>}
        {tiempo.dias > 0 && <span>:</span>}
        <span>{tiempo.horas < 10 ? `0${tiempo.horas}` : tiempo.horas}h</span>:
        <span>{tiempo.minutos < 10 ? `0${tiempo.minutos}` : tiempo.minutos}m</span>:
        <span>{tiempo.segundos < 10 ? `0${tiempo.segundos}` : tiempo.segundos}s</span>
      </div>
    </div>
  );
}
