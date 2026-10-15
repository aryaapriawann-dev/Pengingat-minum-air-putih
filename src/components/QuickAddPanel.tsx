import React, { useState } from 'react';
import { GlassWater, CupSoda, Milk, Wine, Plus } from 'lucide-react';
import { DrinkLog } from '../types';

interface QuickAddPanelProps {
  onAddDrink: (amount: number, container: DrinkLog['container'], label: string) => void;
}

export const QuickAddPanel: React.FC<QuickAddPanelProps> = ({ onAddDrink }) => {
  const [customMl, setCustomMl] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  const presets: Array<{
    amount: number;
    label: string;
    container: DrinkLog['container'];
    icon: React.ReactNode;
    desc: string;
  }> = [
    {
      amount: 150,
      label: 'Cangkir',
      container: 'cangkir',
      icon: <CupSoda className="w-5 h-5 text-sky-600" />,
      desc: 'Cangkir teh / kopi',
    },
    {
      amount: 250,
      label: 'Gelas Standar',
      container: 'gelas',
      icon: <GlassWater className="w-5 h-5 text-sky-600" />,
      desc: 'Gelas beling biasa',
    },
    {
      amount: 500,
      label: 'Botol Sedang',
      container: 'botol',
      icon: <Milk className="w-5 h-5 text-sky-600" />,
      desc: 'Botol air mineral',
    },
    {
      amount: 750,
      label: 'Tumbler',
      container: 'tumbler',
      icon: <Wine className="w-5 h-5 text-sky-600" />,
      desc: 'Tumbler olahraga',
    },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMl, 10);
    if (val && val > 0 && val <= 3000) {
      onAddDrink(val, 'custom', `Kustom (${val} ml)`);
      setCustomMl('');
      setShowCustomModal(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Catat Minuman</h2>
          <p className="text-xs text-slate-500">Pilih takaran cepat sekali sentuh</p>
        </div>
        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Takaran Lain</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {presets.map((item) => (
          <button
            key={item.amount}
            onClick={() => onAddDrink(item.amount, item.container, item.label)}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/60 active:scale-95 transition-all cursor-pointer text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-2 group-hover:bg-sky-100 transition-colors">
              {item.icon}
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
              +{item.amount} ml
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Custom Drink Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tambah Takaran Kustom</h3>
            <p className="text-xs text-slate-500 mb-4">
              Masukkan volume air yang Anda minum (dalam mililiter).
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="3000"
                    step="10"
                    autoFocus
                    placeholder="misal: 330"
                    value={customMl}
                    onChange={(e) => setCustomMl(e.target.value)}
                    className="w-full px-4 py-2.5 text-lg font-bold font-mono text-center bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="absolute right-4 top-3 text-xs font-semibold text-slate-400">
                    ml
                  </span>
                </div>
                {/* Quick picker pills */}
                <div className="flex justify-center gap-1.5 mt-2">
                  {[200, 330, 400, 600, 1000].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setCustomMl(String(preset))}
                      className="px-2 py-1 text-[11px] font-mono text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!customMl || parseInt(customMl, 10) <= 0}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-40 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Tambahkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
