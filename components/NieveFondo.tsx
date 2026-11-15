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

    const copos: Array<{ x: number; y: number; r: number; d: number; velocidad: number }> = [];
    const numCopos = 50;

    for (let i = 0; i < numCopos; i++) {
      copos.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        d: Math.random() * numCopos,
        velocidad: Math.random() * 0.7 + 0.3,
      });
    }

    let animId: number;

    const animar = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.beginPath();
      for (let i = 0; i < numCopos; i++) {
        const c = copos[i];
        ctx.moveTo(c.x, c.y);
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, true);
      }
      ctx.fill();

      for (let i = 0; i < numCopos; i++) {
        const c = copos[i];
        c.y += c.velocidad;
        c.x += Math.sin(c.d) * 0.5;
        if (c.y > height) {
          copos[i] = { x: Math.random() * width, y: -10, r: c.r, d: c.d, velocidad: c.velocidad };
        }
      }
      animId = requestAnimationFrame(animar);
    };

    animar();

    const alRedimensionar = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', alRedimensionar);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', alRedimensionar);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 opacity-70" />;
}