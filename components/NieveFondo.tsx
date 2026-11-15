'use client';

import React, { useEffect, useRef } from 'react';

export default function NieveFondo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const copoS: Array<{ x: number; y: number; r: number; d: number; velocidad: number }> = [];
    const numCopos = 45;

    for (let i = 0; i < numCopos; i++) {
      copoS.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        d: Math.random() * numCopos,
        velocidad: Math.random() * 0.8 + 0.3,
      });
    }

    let animacionId: number;

    const dibujar = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(218, 165, 32, 0.4)'; // Copos dorados suaves
      ctx.beginPath();
      for (let i = 0; i < numCopos; i++) {
        const c = copoS[i];
        ctx.moveTo(c.x, c.y);
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, true);
      }
      ctx.fill();

      // Mover los copos
      for (let i = 0; i < numCopos; i++) {
        const c = copoS[i];
        c.y += c.velocidad;
        c.x += Math.sin(c.d) * 0.5;

        if (c.y > height) {
          copoS[i] = { x: Math.random() * width, y: -10, r: c.r, d: c.d, velocidad: c.velocidad };
        }
      }
      animacionId = requestAnimationFrame(dibujar);
    };

    dibujar();

    const alRedimensionar = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', alRedimensionar);
    return () => {
      cancelAnimationFrame(animacionId);
      window.removeEventListener('resize', alRedimensionar);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-70"
    />
  );
}