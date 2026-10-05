/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ModuleMultiplesFactors } from './components/ModuleMultiplesFactors';
import { ModulePrimesFactorTree } from './components/ModulePrimesFactorTree';
import { ModuleKPK } from './components/ModuleKPK';
import { ModuleFPB } from './components/ModuleFPB';
import { ModuleContextualApp } from './components/ModuleContextualApp';
import { ModuleQuizGame } from './components/ModuleQuizGame';
import { Footer } from './components/Footer';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { sfx } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('m5_stars');
      return saved ? parseInt(saved, 10) : 10;
    } catch {
      return 10;
    }
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('m5_stars', stars.toString());
    } catch {}
  }, [stars]);

  const earnStars = (amount: number) => {
    setStars((prev) => prev + amount);
  };

  const handleResetProgress = () => {
    setStars(0);
    try {
      localStorage.removeItem('m5_stars');
    } catch {}
  };

  // Scroll to top on tab change
  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateToTab}
        stars={stars}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* Navigation Breadcrumb / Back button if not on home */}
        {activeTab !== 'home' && (
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => {
                navigateToTab('home');
                sfx.playPop();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>

            <div className="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
              <span>/</span>
              <span className="text-slate-700 capitalize font-semibold">
                {activeTab.replace('-', ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Tab Routing */}
        {activeTab === 'home' && (
          <HeroSection onSelectModule={navigateToTab} stars={stars} />
        )}

        {activeTab === 'kelipatan-faktor' && <ModuleMultiplesFactors />}

        {activeTab === 'prima-pohon' && <ModulePrimesFactorTree />}

        {activeTab === 'kpk' && <ModuleKPK />}

        {activeTab === 'fpb' && <ModuleFPB />}

        {activeTab === 'aplikasi' && <ModuleContextualApp />}

        {activeTab === 'kuis-game' && <ModuleQuizGame onEarnStars={earnStars} />}
      </main>

      {/* Footer */}
      <Footer
        onSelectModule={navigateToTab}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
