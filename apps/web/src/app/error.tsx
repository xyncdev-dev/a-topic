'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#0A0A0A] text-white p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h2 className="text-2xl font-bold font-display">Algo salio mal</h2>
        <p className="text-sm text-[#A1A1AA]">
          Ha ocurrido un error inesperado al cargar la aplicacion.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-[#E11D48] text-white rounded-lg text-sm font-medium hover:bg-[#BE123C] transition cursor-pointer"
          >
            Reintentar
          </button>
          <a
            href="/home"
            className="px-4 py-2 bg-[#27272A] text-white rounded-lg text-sm font-medium hover:bg-[#3F3F46] transition inline-block"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}