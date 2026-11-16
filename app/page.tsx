'use client';

import React, { useState } from 'react';
import Bienvenida from '@/components/Bienvenida';
import Cuadricula from '@/components/Cuadricula';
import ModalSorpresa from '@/components/ModalSorpresa';
import NieveFondo from '@/components/NieveFondo';
import EfectoCorazones from '@/components/EfectoCorazones';
import ReproductorMusica from '@/components/ReproductorMusica';
import { Sorpresa } from '@/lib/sorpresasData';

export default function Home() {
  const [mostrarCuadricula, setMostrarCuadricula] = useState(false);
  const [sorpresaSeleccionada, setSorpresaSeleccionada] = useState<Sorpresa | null>(null);

  return (
    <main className="relative min-h-screen bg-[#FDF8F2] overflow-x-hidden">
      {/* 1. Nieve dorada animada en segundo plano */}
      <NieveFondo />

      {/* 2. Disparo de corazones al pulsar en pantalla */}
      <EfectoCorazones />

      {/* 3. Reproductor flotante de música festiva */}
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

      {/* 5. Ventana modal interactiva con rascado, cupones y reacciones */}
      {sorpresaSeleccionada && (
        <ModalSorpresa 
          sorpresa={sorpresaSeleccionada} 
          onCerrar={() => setSorpresaSeleccionada(null)} 
        />
      )}
    </main>
  );
}
