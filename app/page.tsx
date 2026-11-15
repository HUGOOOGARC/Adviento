'use client';

import React, { useState } from 'react';
import Bienvenida from '@/components/Bienvenida';
import Cuadricula from '@/components/Cuadricula';
import ModalSorpresa from '@/components/ModalSorpresa';
import NieveFondo from '@/components/NieveFondo';

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
    <main className="relative min-h-screen bg-[#FDF8F2]">
      {/* Efecto de Nieve en Vivo */}
      <NieveFondo />

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

      {/* Ventana Modal Emergente */}
      {sorpresaSeleccionada && (
        <ModalSorpresa 
          sorpresa={sorpresaSeleccionada} 
          onCerrar={() => setSorpresaSeleccionada(null)} 
        />
      )}
    </main>
  );
}