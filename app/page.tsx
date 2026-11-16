'use client';

import React, { useState } from 'react';
import Bienvenida from '@/components/Bienvenida';
import Cuadricula from '@/components/Cuadricula';
import ModalSorpresa from '@/components/ModalSorpresa';
import NieveFondo from '@/components/NieveFondo';
import EfectoCorazones from '@/components/EfectoCorazones';
import ReproductorMusica from '@/components/ReproductorMusica';

interface Sorpresa {
  dia: number;
  titulo: string;
  mensaje: string;
  url_imagen?: string;
}

export default function Home() {
  const [mostrarCuadricula, setMostrarCuadricula] = useState(false);
  const [sorpresaSeleccionada, setSorpresaSeleccionada] = useState<Sorpresa | null>(null);

  return (
    <main className="relative min-h-screen bg-[#FDF8F2] overflow-x-hidden">
      {/* 1. Nieve dorada en segundo plano */}
      <NieveFondo />

      {/* 2. Disparo de corazones al pulsar */}
      <EfectoCorazones />

      {/* 3. Reproductor de música festiva */}
      <ReproductorMusica />

      {/* 4. Alternancia entre portada y cuadrícula */}
      {!mostrarCuadricula ? (
        <Bienvenida 
          nombrePareja="Lucía" 
          onAceptar={() => setMostrarCuadricula(true)} 
        />
      ) : (
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