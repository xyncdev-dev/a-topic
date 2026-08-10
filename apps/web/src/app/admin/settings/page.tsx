'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';

export default function AdminSettingsPage() {
  const [multiplier, setMultiplier] = useState<string>('10');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get('/admin/settings') as any;
        if (res.coins_multiplier) {
          setMultiplier(res.coins_multiplier);
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const val = parseInt(multiplier, 10);
      if (isNaN(val) || val <= 0) {
        throw new Error('El multiplicador debe ser un número entero mayor que 0');
      }

      await api.put('/admin/settings', {
        key: 'coins_multiplier',
        value: val
      });
      setMessage({ text: 'Ajustes guardados correctamente.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Error al guardar los ajustes.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-[coin-spin_1s_ease-out_infinite] text-2xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-white uppercase tracking-wider">
          Configuración General
        </h2>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 p-6">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
          Recompensas por Compras
        </h3>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs text-[#A1A1AA] mb-2 uppercase tracking-wider">
              Multiplicador de Coins
            </label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-[200px]">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>
              <p className="text-sm text-[#777]">
                coins por cada 1 euro gastado.
              </p>
            </div>
            <p className="text-xs text-[#555] mt-2">
              Ejemplo: Si está en 10, una compra de 5 euros otorgará 50 coins al cliente automáticamente.
            </p>
          </div>

          {message && (
            <div className={`p-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
              {message.text}
            </div>
          )}

          <div className="pt-4 border-t border-white/5">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
