'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Volume1 } from 'lucide-react';

export default function ReproductorMusica() {
  const [sonando, setSonando] = useState(false);
  const [volumen, setVolumen] = useState(0.4);
  const [mostrarVolumen, setMostrarVolumen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumen;
    }
  }, [volumen]);

  const alternarMusica = () => {
    if (!audioRef.current) return;

    if (sonando) {
      audioRef.current.pause();
      setSonando(false);
    } else {
      audioRef.current
        .play()
        .then(() => setSonando(true))
        .catch((err) => {
          console.warn("Reproducción requiere interacción de usuario:", err);
        });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 select-none">
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc69a37a.mp3?filename=christmas-background-music-128269.mp3"
        loop
        preload="none"
      />

      {/* Control desplegable de volumen */}
      {mostrarVolumen && (
        <div className="bg-white/95 backdrop-blur-md border border-[#EAD7C5] px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
          <Volume1 className="w-3.5 h-3.5 text-[#B83232]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumen}
            onChange={(e) => setVolumen(parseFloat(e.target.value))}
            className="w-16 sm:w-20 accent-[#B83232] h-1.5 cursor-pointer bg-gray-200 rounded-lg"
          />
        </div>
      )}

      {/* Botón flotante de reproducción */}
      <div className="flex items-center">
        <button
          onClick={alternarMusica}
          onMouseEnter={() => setMostrarVolumen(true)}
          className={`p-3 rounded-full shadow-lg border transition-all duration-300 flex items-center justify-center ${
            sonando
              ? 'bg-[#B83232] text-white border-[#992626] scale-105 shadow-red-900/20'
              : 'bg-white/90 text-[#3D2E2B] border-[#EAD7C5] hover:scale-105 backdrop-blur-md'
          }`}
          title={sonando ? 'Pausar villancicos' : 'Poner música navideña de fondo'}
        >
          <Music className={`w-4 h-4 mr-1 ${sonando ? 'animate-bounce' : ''}`} />
          {sonando ? (
            <Volume2 className="w-4 h-4 text-white" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}
