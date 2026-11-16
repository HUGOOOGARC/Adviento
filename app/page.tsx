'use client';

import React, { useState, useEffect } from 'react';
import Bienvenida from '@/components/Bienvenida';
import Cuadricula from '@/components/Cuadricula';
import ModalSorpresa from '@/components/ModalSorpresa';
import NieveFondo from '@/components/NieveFondo';
import EfectoCorazones from '@/components/EfectoCorazones';
import ReproductorMusica from '@/components/ReproductorMusica';
import PantallaAcceso from '@/components/PantallaAcceso';

interface Sorpresa {
  dia: number;
  titulo: string;
  mensaje: string;
  url_imagen?: string;
}

export default function Home() {
  // 'acceso' | 'bienvenida' | 'cuadricula'
  const [fase, setFase] = useState<'acceso' | 'bienvenida' | 'cuadricula'>('acceso');
  const [sorpresaSeleccionada, setSorpresaSeleccionada] = useState<Sorpresa | null>(null);

  // Si ya tiene acceso guardado, saltamos la pantalla de acceso
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('adviento_acceso_lucia') === 'true') {
        setFase('bienvenida');
      }
    }
  }, []);

  return (
    <main className="relative min-h-screen bg-[#FDF8F2] overflow-x-hidden">
      {/* 1. Nieve dorada en segundo plano */}
      <NieveFondo />

      {/* 2. Disparo de corazones al pulsar */}
      <EfectoCorazones />

      {/* 3. Reproductor de música festiva */}
      <ReproductorMusica />

      {/* 4. Flujo de pantallas: acceso → bienvenida → cuadrícula */}
      {fase === 'acceso' && (
        <PantallaAcceso onAcceso={() => setFase('bienvenida')} />
      )}

      {fase === 'bienvenida' && (
        <Bienvenida
          nombrePareja="Lucía"
          onAceptar={() => setFase('cuadricula')}
        />
      )}

      {fase === 'cuadricula' && (
        <Cuadricula
          nombrePareja="Lucía"
          onAbrirSorpresa={(sorpresa) => setSorpresaSeleccionada(sorpresa)}
        />
      )}

      {/* 5. Ventana modal interactiva */}
      {sorpresaSeleccionada && (
        <ModalSorpresa
          sorpresa={sorpresaSeleccionada}
          onCerrar={() => setSorpresaSeleccionada(null)}
        />
      )}
    </main>
  );
}
