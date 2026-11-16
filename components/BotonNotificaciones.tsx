'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BotonNotificaciones() {
  const [permiso, setPermiso] = useState<NotificationPermission>('default');
  const [soportado, setSoportado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setSoportado(true);
      setPermiso(Notification.permission);

      // Registrar Service Worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Si el permiso ya está concedido, programar comprobación matutina
          if (Notification.permission === 'granted') {
            verificarAvisoMatutino(reg);
          }
        })
        .catch((err) => console.log('SW no registrado:', err));
    }
  }, []);

  // Comprobar si hoy ya se envió el aviso de la mañana (a partir de las 09:00)
  const verificarAvisoMatutino = (reg: ServiceWorkerRegistration) => {
    try {
      const ahora = new Date();
      const mes = ahora.getMonth(); // 11 = Diciembre
      const dia = ahora.getDate();
      const hora = ahora.getHours();

      // Solo durante diciembre del 1 al 24
      if (mes === 11 && dia <= 24 && hora >= 9) {
        const ultimoAviso = localStorage.getItem('adviento_ultimo_aviso_dia');
        if (ultimoAviso !== String(dia)) {
          reg.showNotification(`🎄 ¡Día ${dia < 10 ? `0${dia}` : dia} desbloqueado, mi amor! ✨`, {
            body: 'Tu sorpresa de hoy en el calendario de Adviento ya te está esperando ❤️',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
          });
          localStorage.setItem('adviento_ultimo_aviso_dia', String(dia));
        }
      }
    } catch (e) {}
  };

  const solicitarPermiso = async () => {
    if (!soportado) return;

    try {
      const nuevoPermiso = await Notification.requestPermission();
      setPermiso(nuevoPermiso);

      if (nuevoPermiso === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('🎄 ¡Avisos activados con éxito, peque! ✨', {
          body: 'Te recordaré cada mañana que tienes una sorpresa esperándote con todo mi amor ❤️',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
        });

        localStorage.setItem('adviento_notificaciones_activas', 'true');
        setMostrarModal(false);
        setMensajeToast('🔔 ¡Avisos matutinos activados correctamente!');
        setTimeout(() => setMensajeToast(null), 4000);
      } else if (nuevoPermiso === 'denied') {
        setMensajeToast('Los avisos están bloqueados en los ajustes de tu navegador');
        setTimeout(() => setMensajeToast(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const enviarPrueba = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification('✨ ¡Recordatorio matutino de prueba! ❤️', {
        body: 'Así te llegará tu aviso cada mañana a las 09:00 h cuando se desbloquee tu nueva ventanita.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
      });
      setMensajeToast('✓ Notificación de prueba enviada a tu móvil');
      setTimeout(() => setMensajeToast(null), 3500);
    } catch (e) {}
  };

  if (!soportado) return null;

  const estaActivo = permiso === 'granted';

  return (
    <>
      {/* Botón sutil en cabecera */}
      <button
        onClick={() => setMostrarModal(true)}
        className={`p-1.5 rounded-full border transition-all duration-200 flex items-center justify-center relative cursor-pointer ${
          estaActivo
            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
            : 'bg-[#F4EBE1] border-[#E2D5C7] text-[#B83232] hover:bg-[#EBDDCF]'
        }`}
        title={estaActivo ? 'Avisos diarios activos' : 'Activar aviso diario matutino'}
      >
        {estaActivo ? (
          <>
            <BellRing className="w-3.5 h-3.5" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
          </>
        ) : (
          <Bell className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Toast informativo */}
      <AnimatePresence>
        {mensajeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 z-50 bg-[#3D2E2B] text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-serif flex items-center gap-2 border border-[#EAD7C5]"
          >
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span>{mensajeToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal explicativo de Avisos Diarios */}
      <AnimatePresence>
        {mostrarModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMostrarModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-[#F0E6DF] relative text-center"
            >
              <button
                onClick={() => setMostrarModal(false)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#3D2E2B] rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 mx-auto rounded-full bg-[#B83232]/10 text-[#B83232] flex items-center justify-center mb-3">
                {estaActivo ? <BellRing className="w-6 h-6 text-emerald-600" /> : <Bell className="w-6 h-6" />}
              </div>

              <h3 className="text-lg font-serif font-bold text-[#3D2E2B] mb-2">
                {estaActivo ? 'Avisos Matutinos Activos' : 'Avisos Diarios Matutinos'}
              </h3>

              <p className="text-xs font-serif text-[#5C4D4A] leading-relaxed mb-4">
                {estaActivo
                  ? 'Te recordaremos cada mañana a las 09:00 h en tu móvil cuando se desbloquee tu nueva sorpresa del día ❤️'
                  : '¿Quieres recibir un aviso suave cada mañana a las 09:00 h para recordarte que tu sorpresa del día ya está lista para rascar?'}
              </p>

              {estaActivo ? (
                <div className="space-y-2">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 py-2 px-3 rounded-xl text-xs font-serif font-semibold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Avisos diarios activados ✓</span>
                  </div>
                  <button
                    onClick={enviarPrueba}
                    className="w-full bg-[#FDF8F2] hover:bg-[#F4EBE1] border border-[#EAD7C5] text-[#3D2E2B] py-2 px-3 rounded-xl text-xs font-serif font-semibold transition-all"
                  >
                    Probar notificación en mi móvil
                  </button>
                </div>
              ) : (
                <button
                  onClick={solicitarPermiso}
                  className="w-full bg-[#B83232] hover:bg-[#A02828] text-white py-3 px-4 rounded-xl text-xs font-serif font-semibold tracking-wide shadow-md shadow-red-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Activar aviso diario matutino</span>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
