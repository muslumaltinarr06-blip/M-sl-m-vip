import React, { useState, useEffect } from 'react';
import { Crown, Lock, Sparkles, Clock, MapPin, Calendar, Award, Zap, ChevronRight, ShieldAlert, CheckCircle2, Ticket } from 'lucide-react';
import { RaceDay, RaceLeg, HorsePrediction } from '../types';
import { useAuth } from '../context/AuthContext';

interface RaceViewProps {
  onOpenVip: () => void;
  onOpenAuth: () => void;
}

export const RaceView: React.FC<RaceViewProps> = ({ onOpenVip, onOpenAuth }) => {
  const { user, isVip, isAdmin } = useAuth();
  const [races, setRaces] = useState<RaceDay[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLegIndex, setActiveLegIndex] = useState<number>(0);

  const fetchRaces = async () => {
    try {
      const token = localStorage.getItem('muslum_vip_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/races', { headers });
      if (res.ok) {
        const data = await res.json();
        setRaces(data.races || []);
        if (data.races && data.races.length > 0 && !selectedRaceId) {
          setSelectedRaceId(data.races[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch races:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaces();
  }, [user, isVip]);

  const currentRace = races.find(r => r.id === selectedRaceId) || races[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-r from-[#18150E] via-[#0E0E10] to-[#12110D] p-5 sm:p-8 shadow-2xl shadow-[#D4AF37]/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wider uppercase">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Müslüm VIP At Yarışı Tahminleri
            </div>
            <h1 className="cinzel text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
              Profesyonel Koşu & <span className="gold-gradient-text">Altılı Ganyan</span> Analizleri
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Titizlikle hazırlanan idman pisti dereceleri, jokey form analizleri ve cazip banko tercihleri.
              Tüm bülten ve kupon şablonları yalnızca onaylı VIP üyelerimize açıktır.
            </p>
          </div>

          {/* Action Badge */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!isVip ? (
              <button
                onClick={onOpenVip}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>VIP Üyelik Başlat (100 TL'den Başlayan)</span>
              </button>
            ) : (
              <div className="px-4 py-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>VIP Erişiminiz Aktiftir</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RACETRACK / HIPODROM SELECTOR TABS */}
      {races.length > 0 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {races.map(race => {
            const isSelected = race.id === selectedRaceId;
            return (
              <button
                key={race.id}
                onClick={() => {
                  setSelectedRaceId(race.id);
                  setActiveLegIndex(0);
                }}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900/90 text-gray-300 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                <span>{race.hipodrom}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-black font-extrabold' : 'bg-neutral-800 text-amber-300'}`}>
                  {race.races.length} Koşu
                </span>
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-gray-400 text-sm">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Yarış bülteni ve VIP analizler yükleniyor...
        </div>
      ) : !currentRace ? (
        <div className="py-16 text-center text-gray-400 bg-neutral-900/60 rounded-3xl border border-neutral-800">
          <Calendar className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-300">Bugün için planlanmış aktif yarış bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* CURRENT RACE DAY HEADER */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#121214] border border-[#D4AF37]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-300/80 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentRace.displayDate}</span>
                <span>•</span>
                <span>{currentRace.city}</span>
              </div>
              <h2 className="cinzel text-xl sm:text-2xl font-bold text-white">
                {currentRace.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Bülten Yayında
              </span>
            </div>
          </div>

          {/* ALTILI GANYAN SUMMARY CARD */}
          {currentRace.altiliGanyanSummary && (
            <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-b from-[#1C180F] via-[#12110D] to-[#0A0A0B] p-5 sm:p-6 shadow-xl shadow-[#D4AF37]/15">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-sm">
                    <Ticket className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="cinzel text-base sm:text-lg font-bold text-white">
                      Müslüm VIP Altılı Ganyan Şablonu
                    </h3>
                    <p className="text-[11px] text-amber-200/70">
                      Günün Tavsiye Edilen Resmi Kuponu ({currentRace.altiliGanyanSummary.programNumber}. Altılı)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Tahmini Kupon Tutarı:</span>
                  <span className="font-mono text-sm font-extrabold text-amber-300 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    {currentRace.altiliGanyanSummary.estimatedCost}
                  </span>
                </div>
              </div>

              {/* TICKET / FORMULA */}
              {isVip ? (
                /* UNLOCKED VIP ALTILI FORMULA */
                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-amber-300 block mb-1.5">
                      Kupon Şablonu & Ayak Sıralamaları:
                    </span>
                    <div className="p-3.5 rounded-2xl bg-black/80 border border-[#D4AF37]/40 font-mono text-xs sm:text-sm font-bold text-amber-200 tracking-wider">
                      {currentRace.altiliGanyanSummary.couponFormula}
                    </div>
                  </div>

                  {currentRace.altiliGanyanSummary.summaryNote && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/30 text-xs text-amber-200/90 leading-relaxed">
                      <strong className="text-amber-300 font-bold">VIP Notu: </strong>
                      {currentRace.altiliGanyanSummary.summaryNote}
                    </div>
                  )}
                </div>
              ) : (
                /* LOCKED VIP OVERLAY */
                <div className="mt-4 p-5 rounded-2xl bg-black/70 border border-amber-500/20 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Bu Kupon Yalnızca VIP Üyelere Özeldir
                  </h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Kupon şablonu, ayak dağılımları ve tek banko tercihlerini görmek için VIP üyeliğinizi başlatın.
                  </p>
                  <button
                    onClick={onOpenVip}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
                  >
                    VIP Üyelik Satın Al (100 TL'den Başlayan)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RACES / LEGS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="cinzel text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Koşu Programı ve Detaylı Analizler</span>
              </h3>
              <span className="text-xs text-gray-400">
                Toplam {currentRace.races.length} Koşu
              </span>
            </div>

            {/* LEGS TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-4">
              {currentRace.races.map((leg, index) => {
                const isActive = activeLegIndex === index;
                return (
                  <button
                    key={leg.id}
                    onClick={() => setActiveLegIndex(index)}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#D4AF37] text-black shadow-md shadow-amber-500/25'
                        : 'bg-neutral-900 border border-neutral-800 text-gray-300 hover:text-white'
                    }`}
                  >
                    <span>{leg.legNumber}. Ayak ({leg.raceNumber}. Koşu)</span>
                    <span className="text-[10px] opacity-75 font-normal">({leg.raceTime})</span>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE LEG CARD */}
            {currentRace.races[activeLegIndex] && (
              <LegCard
                leg={currentRace.races[activeLegIndex]}
                isVip={isVip}
                onOpenVip={onOpenVip}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface LegCardProps {
  leg: RaceLeg;
  isVip: boolean;
  onOpenVip: () => void;
}

const LegCard: React.FC<LegCardProps> = ({ leg, isVip, onOpenVip }) => {
  return (
    <div className="rounded-3xl bg-[#101012] border border-[#D4AF37]/30 p-4 sm:p-6 space-y-5 shadow-xl">
      {/* Leg Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {leg.legNumber}. Ayak • {leg.raceNumber}. Koşu
            </span>
            <span className="flex items-center gap-1 text-gray-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {leg.raceTime}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white">
            {leg.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
          <span>Pist & Mesafe:</span>
          <span className="text-amber-300 font-bold">{leg.distanceAndTrack}</span>
        </div>
      </div>

      {/* HORSES LIST */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Koşacak Safkanlar ve Performans Durumları
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {leg.horses.map(horse => (
            <div
              key={horse.number}
              className={`p-3.5 rounded-2xl border transition-all ${
                isVip && horse.isBanko
                  ? 'bg-gradient-to-r from-[#292212] via-[#1A160E] to-[#121214] border-amber-400 shadow-md shadow-amber-500/20'
                  : isVip && horse.isSurprise
                  ? 'bg-neutral-900/90 border-amber-500/50'
                  : 'bg-neutral-900/80 border-neutral-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Horse Number Badge in Silk Style */}
                  <div className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-md ${
                    isVip && horse.isBanko
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-black border border-white'
                      : 'bg-neutral-800 border border-amber-500/40 text-amber-300'
                  }`}>
                    {horse.number}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm sm:text-base">
                        {horse.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                      <span>Jokey: <strong className="text-gray-200">{horse.jockey}</strong></span>
                      {horse.weight && <span>• {horse.weight}</span>}
                    </div>
                  </div>
                </div>

                {/* VIP BADGES */}
                {isVip ? (
                  <div className="flex flex-col items-end gap-1">
                    {horse.isBanko && (
                      <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        BANKO
                      </span>
                    )}
                    {horse.isSurprise && (
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-500/50 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        BOMBA
                      </span>
                    )}
                    {horse.isPlase && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-500/40 text-[10px] font-bold">
                        PLASE
                      </span>
                    )}
                    {horse.odds && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        G: {horse.odds}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] text-amber-400/80 bg-neutral-800/80 px-2 py-0.5 rounded-md">
                    <Lock className="w-3 h-3" />
                    <span>VIP</span>
                  </div>
                )}
              </div>

              {/* Horse Notes (if VIP) */}
              {isVip && horse.notes && (
                <div className="mt-2.5 pt-2 border-t border-neutral-800/80 text-[11px] text-amber-200/80 leading-relaxed italic">
                  "{horse.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DETAYLI VIP KOŞU ANALİZİ (EXPERT ANALYSIS) */}
      {isVip ? (
        /* UNLOCKED DETAILED ANALYSIS */
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-[#D4AF37]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Müslüm VIP Detaylı Koşu & Taktik Analizi
            </span>

            {leg.recommendedPicks && leg.recommendedPicks.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-400">Öneri Sıralaması:</span>
                <span className="font-mono font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {leg.recommendedPicks.join(' - ')}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            {leg.expertAnalysis}
          </p>
        </div>
      ) : (
        /* LOCKED EXPERT ANALYSIS BANNER */
        <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-950 to-black border border-[#D4AF37]/30 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-5 h-5" />
          </div>

          <div>
            <h5 className="font-bold text-sm text-white">
              Bu Koşunun Detaylı VIP Analizi ve Bankosu Kilitlidir
            </h5>
            <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
              "Ücretsiz tahmin verilmemektedir. Bütün yarış analizleri yalnızca aktif VIP üyelerine gösterilmektedir."
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={onOpenVip}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              VIP Üyelik ile Analizleri Aç
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
