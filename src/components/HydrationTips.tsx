import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Sun, Brain, Heart, Shield } from 'lucide-react';

export const HydrationTips: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const tips = [
    {
      title: 'Waktu Terbaik Minum Air Putih',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      content: (
        <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed list-disc list-inside">
          <li><strong>1 Gelas Setelah Bangun Tidur:</strong> Mengaktifkan organ internal dan membuang racun malam.</li>
          <li><strong>1 Gelas 30 Menit Sebelum Makan:</strong> Membantu pencernaan dan mencegah makan berlebihan.</li>
          <li><strong>1 Gelas Saat Mengantuk di Meja Kerja:</strong> Dehidrasi sering disalahartikan sebagai rasa lelah atau kantuk.</li>
          <li><strong>1 Gelas Sebelum Tidur (Secukupnya):</strong> Mencegah kram otot dan dehidrasi ringan selama istirahat malam.</li>
        </ul>
      ),
    },
    {
      title: 'Tanda Tubuh Mulai Kekurangan Cairan',
      icon: <Brain className="w-4 h-4 text-sky-500" />,
      content: (
        <p className="text-xs text-slate-600 leading-relaxed">
          Jangan tunggu sampai merasa sangat haus! Rasa haus sebenarnya adalah sinyal darurat bahwa tubuh sudah kehilangan 1-2% cairan tubuh. Tanda lainnya meliputi: bibir pecah-pecah, sakit kepala di bagian belakang, urin berwarna kuning pekat, dan sulit konsentrasi.
        </p>
      ),
    },
    {
      title: 'Manfaat Nyata Rutin Minum Air',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      content: (
        <p className="text-xs text-slate-600 leading-relaxed">
          Mencukupi 2 liter cairan sehari membantu ginjal menyaring racun lebih ringan, menjaga elastisitas kulit tetap kenyal, melumasi sendi, dan menstabilkan tekanan darah serta suhu tubuh secara alami.
        </p>
      ),
    },
    {
      title: 'Tips Konsistensi Bagi yang Sering Lupa',
      icon: <Shield className="w-4 h-4 text-emerald-500" />,
      content: (
        <p className="text-xs text-slate-600 leading-relaxed">
          Gunakan fitur notifikasi otomatis aplikasi ini! Selalu letakkan botol minum atau tumbler di dekat meja kerja Anda. Jika bosan dengan rasa tawar, Anda bisa menambahkan irisan lemon atau daun mint (infused water).
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-sky-600" />
        <h2 className="text-base font-bold text-slate-900">Panduan & Fakta Hidrasi Sehat</h2>
      </div>

      <div className="space-y-2">
        {tips.map((item, index) => {
          const isOpen = openSection === index;
          return (
            <div
              key={item.title}
              className="border border-slate-100 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
            >
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer hover:bg-sky-50/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{item.title}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="p-3.5 pt-0 border-t border-slate-100 bg-white">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
