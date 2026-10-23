/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMagang } from '../../context/MagangContext';
import { ActivePage } from '../../types';
import { LayoutDashboard, BookOpen, CalendarCheck, CalendarDays, TrendingUp } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage, stats } = useMagang();

  const items: { id: ActivePage; label: string; icon: React.FC<{ className?: string }>; badgeDot?: boolean }[] = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'jurnal', label: 'Jurnal', icon: BookOpen, badgeDot: stats.revisionJournals > 0 },
    { id: 'absensi', label: 'Absen', icon: CalendarCheck, badgeDot: !stats.todayAttendance?.checkInTime },
    { id: 'jadwal', label: 'Jadwal', icon: CalendarDays },
    { id: 'progres', label: 'Progres', icon: TrendingUp },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101D3A] border-t border-[#1B2B4B] px-2 py-1 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#C5DFFF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#C5DFFF] scale-110' : 'text-slate-400'}`} />
                {item.badgeDot && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold text-[#C5DFFF]' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#C5DFFF] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
