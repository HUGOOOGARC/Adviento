'use client';

import React, { useState } from 'react';
import Bienvenida from '@/components/Bienvenida';
import Cuadricula from '@/components/Cuadricula';
import ModalSorpresa from '@/components/ModalSorpresa';
import NieveFondo from '@/components/NieveFondo';
import EfectoCorazones from '@/components/EfectoCorazones';
import CuentaAtras from '@/components/CuentaAtras';

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
      {/* Explosión de Corazones en Clic */}
      <EfectoCorazones />

      {/* Caída de Nieve Animada */}
      <NieveFondo />

      {!mostrarCuadricula ? (
        <Bienvenida 
          nombrePareja="Lucía" 
          onAceptar={() => setMostrarCuadricula(true)} 
        />
      ) : (
        <div className="flex flex-col items-center">
          <Cuadricula 
            nombrePareja="Lucía" 
            onAbrirSorpresa={(sorpresa) => setSorpresaSeleccionada(sorpresa)} 
          />
        </div>
      )}

      {/* Modal Interactivo con Rasca y Gana */}
      {sorpresaSeleccionada && (
        <ModalSorpresa 
          sorpresa={sorpresaSeleccionada} 
          onCerrar={() => setSorpresaSeleccionada(null)} 
        />
      )}
    </main>
  );
}