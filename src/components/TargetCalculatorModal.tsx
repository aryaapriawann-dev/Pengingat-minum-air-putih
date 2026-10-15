import React, { useState } from 'react';
import { X, Calculator, HeartPulse, Check } from 'lucide-react';
import { UserSettings } from '../types';
import { calculateRecommendedTarget } from '../utils/storage';

interface TargetCalculatorModalProps {
  settings: UserSettings;
  onSave: (target: number, weight: number, activity: UserSettings['activityLevel']) => void;
  onClose: () => void;
}

export const TargetCalculatorModal: React.FC<TargetCalculatorModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [weight, setWeight] = useState<number>(settings.weight || 60);
  const [activity, setActivity] = useState<UserSettings['activityLevel']>(settings.activityLevel || 'sedang');
  const [customTarget, setCustomTarget] = useState<number>(settings.dailyTarget);
  const [mode, setMode] = useState<'calculator' | 'manual'>('calculator');

  const calculatedTarget = calculateRecommendedTarget(weight, activity);

  const handleApply = () => {
    const finalTarget = mode === 'calculator' ? calculatedTarget : customTarget;
    onSave(finalTarget, weight, activity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Target Air Harian</h3>
              <p className="text-xs text-slate-500">Sesuaikan dengan berat badan & kebutuhan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab toggle between Calculator & Manual */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl my-4">
          <button
            type="button"
            onClick={() => setMode('calculator')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'calculator' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Kalkulator Berat Badan
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'manual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Input Manual
          </button>
        </div>

        {mode === 'calculator' ? (
          <div className="space-y-4">
            {/* Berat Badan */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Berat Badan</span>
                <span className="font-mono text-sky-700 font-bold">{weight} kg</span>
              </div>
              <input
                type="range"
                min="35"
                max="130"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>35 kg</span>
                <span>80 kg</span>
                <span>130 kg</span>
              </div>
            </div>

            {/* Tingkat Aktivitas */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Aktivitas Fisik Harian
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ringan', title: 'Ringan', subtitle: 'Bekerja santai / duduk' },
                  { id: 'sedang', title: 'Sedang', subtitle: 'Jalan kaki / dinamis' },
                  { id: 'berat', title: 'Berat', subtitle: 'Olahraga / panas' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivity(item.id as UserSettings['activityLevel'])}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      activity === item.id
                        ? 'bg-sky-50 border-sky-600 text-sky-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.title}</span>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                      {item.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Recommendation Card */}
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-sky-800 font-medium block">
                    Rekomendasi Kebutuhan
                  </span>
                  <span className="text-lg font-extrabold text-sky-950 font-mono tabular-nums">
                    {calculatedTarget.toLocaleString('id-ID')} ml / hari
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                ~{Math.round(calculatedTarget / 250)} gelas
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Ketik Target Harian (ml)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="500"
                  max="6000"
                  step="100"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-2.5 text-xl font-bold font-mono text-center bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="absolute right-4 top-3 text-xs font-semibold text-slate-400">
                  ml
                </span>
              </div>
            </div>

            {/* Common quick presets */}
            <div className="flex justify-center gap-2">
              {[1500, 2000, 2500, 3000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setCustomTarget(val)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                    customTarget === val
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {val} ml
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-5 border-t border-slate-100 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Target</span>
          </button>
        </div>
      </div>
    </div>
  );
};
