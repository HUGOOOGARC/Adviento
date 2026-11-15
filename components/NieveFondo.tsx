'use client';

import React, { useEffect, useRef } from 'react';

interface CopoNieve {
  x: number;
  y: number;
  radio: number;
  densidad: number;
  velocidadY: number;
  velocidadX: number;
  opacidad: number;
}

export default function NieveFondo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ancho = (canvas.width = window.innerWidth);
    let alto = (canvas.height = window.innerHeight);

    const cantidadCopos = 70;
    const copos: CopoNieve[] = [];

    // Inicializar copos con atributos aleatorios
    for (let i = 0; i < cantidadCopos; i++) {
      copos.push({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        radio: Math.random() * 3 + 1,
        densidad: Math.random() * cantidadCopos,
        velocidadY: Math.random() * 0.7 + 0.3,
        velocidadX: Math.random() * 0.4 - 0.2,
        opacidad: Math.random() * 0.5 + 0.3,
      });
    }

    let idAnimacion: number;

    const renderizar = () => {
      ctx.clearRect(0, 0, ancho, alto);

      for (let i = 0; i < cantidadCopos; i++) {
        const c = copos[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(212, 175, 55, ${c.opacidad})`;
        ctx.arc(c.x, c.y, c.radio, 0, Math.PI * 2, true);
        ctx.fill();

        // Actualizar coordenadas
        c.y += c.velocidadY;
        c.x += Math.sin(c.densidad) * 0.5 + c.velocidadX;
        c.densidad += 0.01;

        // Reiniciar copo arriba al salir de la pantalla
        if (c.y > alto) {
          copos[i] = {
            x: Math.random() * ancho,
            y: -10,
            radio: c.radio,
            densidad: c.densidad,
            velocidadY: c.velocidadY,
            velocidadX: c.velocidadX,
            opacidad: c.opacidad,
          };
        }
      }

      idAnimacion = requestAnimationFrame(renderizar);
    };

    renderizar();

    const alRedimensionar = () => {
      if (!canvas) return;
      ancho = canvas.width = window.innerWidth;
      alto = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', alRedimensionar);
    return () => {
      cancelAnimationFrame(idAnimacion);
      window.removeEventListener('resize', alRedimensionar);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-80"
    />
  );
}