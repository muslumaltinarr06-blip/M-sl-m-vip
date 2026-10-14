import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { RaceView } from './components/RaceView';
import { VipModal } from './components/VipModal';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { MyPaymentsModal } from './components/MyPaymentsModal';
import { AdminPanel } from './components/AdminPanel';
import { VipPlanId } from './types';
import { Crown, Shield, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

function AppContent() {
  const { user, isVip, isAdmin } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('races');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMyPaymentsModalOpen, setIsMyPaymentsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<VipPlanId>('weekly');

  const handleSelectPlan = (planId: VipPlanId) => {
    setSelectedPlanId(planId);
    setIsVipModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenVip={() => setIsVipModalOpen(true)}
        onOpenAdmin={() => setCurrentTab('admin')}
        onOpenMyPayments={() => setIsMyPaymentsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12">
        {currentTab === 'admin' ? (
          <AdminPanel onBackToApp={() => setCurrentTab('races')} />
        ) : (
          <RaceView
            onOpenVip={() => setIsVipModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Luxury Footer */}
      <footer className="border-t border-[#D4AF37]/15 bg-[#0A0A0C] py-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏇</span>
            <span className="cinzel font-bold text-sm gold-gradient-text">MÜSLÜM VIP</span>
            <span className="text-[10px] text-gray-500">© 2026 Tüm Hakları Saklıdır.</span>
          </div>

          <div className="flex items-center gap-6 text-gray-400">
            <button onClick={() => setIsVipModalOpen(true)} className="hover:text-amber-300 transition-colors">
              VIP Üyelik Paketleri
            </button>
            <button onClick={() => setIsMyPaymentsModalOpen(true)} className="hover:text-amber-300 transition-colors">
              Ödeme Bildirimi
            </button>
            {isAdmin ? (
              <button onClick={() => setCurrentTab('admin')} className="text-amber-400 font-bold hover:underline">
                👑 Yönetici Paneli
              </button>
            ) : !user ? (
              <button onClick={() => setIsAuthModalOpen(true)} className="text-gray-500 hover:text-amber-300 transition-colors">
                Yönetici Girişi
              </button>
            ) : null}
          </div>

          <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Yalnızca 18 yaş ve üzeri içindir. Bilgilendirme ve analiz amaçlıdır.</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (iPhone ergonomic) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        onOpenVip={() => setIsVipModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenMyPayments={() => setIsMyPaymentsModalOpen(true)}
        onOpenAdmin={() => setCurrentTab('admin')}
      />

      {/* Modals */}
      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        planId={selectedPlanId}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          // Success handled in modal view
        }}
        onRequireAuth={() => {
          setIsPaymentModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          // user logged in
        }}
      />

      <MyPaymentsModal
        isOpen={isMyPaymentsModalOpen}
        onClose={() => setIsMyPaymentsModalOpen(false)}
        onNewPayment={() => setIsVipModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
