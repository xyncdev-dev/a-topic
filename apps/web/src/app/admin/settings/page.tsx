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
    <div className="max-w-[800px] mx-auto font-mono">
      {/* Settings Window */}
      <div className="win-frame">
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>⚙</span>
            <span>C:\SYSTEM\CONFIG.CFG // SYSTEM_PARAMETERS</span>
          </span>
          <span className="text-[10px]">READ/WRITE</span>
        </div>

        <div className="p-5 sm:p-6 bg-[#0a0a0a]">
          <div className="retro-inset p-4 mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              PARÁMETROS DE EMISIÓN DE RECOMPENSAS
            </h3>
            <p className="text-[11px] text-[#A1A1AA]">
              Configuración de la tasa de conversión global para pedidos procesados en Shopify.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
                MULTIPLICADOR DE COINS POR EURO
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative max-w-[160px]">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(e.target.value)}
                    className="retro-input w-full text-center text-lg font-black tracking-widest"
                  />
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  coins asignados por cada <span className="text-white font-bold">1,00 €</span> gastado.
                </p>
              </div>
              <p className="text-[11px] text-[#666] mt-2">
                Ejemplo: Con valor en 10, un pedido de 45,00 € acreditará automáticamente 450 coins al comprador.
              </p>
            </div>

            {message && (
              <div
                className={`p-3 text-xs font-bold border ${
                  message.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-[#1a0505] text-[#ff6b6b] border-[#ca3a3a]'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="pt-4 border-t border-[#1a0505]">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
              >
                GUARDAR CAMBIOS [APPLY]
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
