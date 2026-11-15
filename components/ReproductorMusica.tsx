'use client';

import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function ReproductorMusica() {
  const [sonando, setSonando] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const alternarMusica = () => {
    if (!audioRef.current) return;
    if (sonando) {
      audioRef.current.pause();
      setSonando(false);
    } else {
      audioRef.current.play().then(() => setSonando(true)).catch((e) => console.log(e));
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc69a37a.mp3?filename=christmas-background-music-128269.mp3"
        loop
      />
      <button
        onClick={alternarMusica}
        className="bg-white/90 backdrop-blur-md border border-[#EAD7C5] p-3 rounded-full shadow-lg text-[#B83232] hover:scale-110 transition-transform flex items-center gap-2"
        title={sonando ? 'Silenciar música' : 'Activar música navideña'}
      >
        <Music className="w-4 h-4 animate-bounce" />
        {sonando ? <Volume2 className="w-4 h-4 text-[#B83232]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
      </button>
    </div>
  );
}