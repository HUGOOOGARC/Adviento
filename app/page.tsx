'use client';

import React, { useState } from 'react';
import Bienvenida from '@/components/Bienvenida';
import Cuadricula from '@/components/Cuadricula';
import ModalSorpresa from '@/components/ModalSorpresa';

export default function Home() {
  const [pantalla, setPantalla] = useState<'bienvenida' | 'grid'>('bienvenida');
  const [sorpresaSeleccionada, setSorpresaSeleccionada] = useState<any | null>(null);

  if (pantalla === 'bienvenida') {
    return <Bienvenida nombrePareja="Lucía" onAceptar={() => setPantalla('grid')} />;
  }

  return (
    <>
      <Cuadricula onAbrirSorpresa={(sorpresa) => setSorpresaSeleccionada(sorpresa)} />
      
      {sorpresaSeleccionada && (
        <ModalSorpresa
          sorpresa={sorpresaSeleccionada}
          onCerrar={() => setSorpresaSeleccionada(null)}
        />
      )}
    </>
  );
}