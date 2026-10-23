/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMagang } from '../../context/MagangContext';
import { ActivePage } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  TrendingUp,
  User,
  LogOut,
  GraduationCap,
  Sparkles,
  X,
  Building,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activePage, setActivePage, logout, student, stats } = useMagang();

  const navItems: { id: ActivePage; label: string; icon: React.FC<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'jurnal',
      label: 'Jurnal Harian',
      icon: BookOpen,
      badge: stats.revisionJournals > 0 ? `${stats.revisionJournals} Revisi` : stats.pendingJournals > 0 ? `${stats.pendingJournals} Baru` : undefined,
      badgeColor: stats.revisionJournals > 0 ? 'bg-[#FCE8E8] text-red-700' : 'bg-[#C5DFFF] text-[#101D3A]',
    },
    {
      id: 'absensi',
      label: 'Absensi',
      icon: CalendarCheck,
      badge: stats.todayAttendance?.checkInTime ? (stats.todayAttendance?.checkOutTime ? 'Lengkap' : 'Check-in') : 'Belum Absen',
      badgeColor: stats.todayAttendance?.checkInTime ? 'bg-[#DDF5E5] text-emerald-800' : 'bg-[#FEF3C7] text-amber-900',
    },
    {
      id: 'jadwal',
      label: 'Jadwal Magang',
      icon: CalendarDays,
    },
    {
      id: 'progres',
      label: 'Progres Magang',
      icon: TrendingUp,
      badge: `${stats.progressPercentage}%`,
      badgeColor: 'bg-[#C5DFFF]/20 text-[#C5DFFF]',
    },
    {
      id: 'profil',
      label: 'Profil Saya',
      icon: User,
    },
  ];

  const handleNavClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#101D3A] text-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1B2B4B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B2B4B] to-[#243B66] border border-[#C5DFFF]/30 flex items-center justify-center text-[#C5DFFF] shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">MagangKu</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#C5DFFF] text-[#101D3A]">
                PKL
              </span>
            </div>
            <p className="text-[11px] text-[#C5DFFF]/80 tracking-wide font-medium">Portal Kegiatan Siswa</p>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-[#C5DFFF] hover:bg-[#1B2B4B]"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Student Mini Profile Info */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-[#1B2B4B]/80 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C5DFFF] text-[#101D3A] flex items-center justify-center font-bold text-sm shrink-0">
            {student.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{student.name}</p>
            <p className="text-[11px] text-[#C5DFFF] truncate">{student.school}</p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-300">
              <Building className="w-3 h-3 text-[#C5DFFF]" />
              <span className="truncate">{student.companyName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#C5DFFF]/60 mb-2">
          Menu Utama
        </p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#1B2B4B] text-white shadow-sm border-l-4 border-[#C5DFFF]'
                  : 'text-[#C5DFFF]/90 hover:bg-[#1B2B4B]/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#C5DFFF]' : 'text-[#C5DFFF]/70'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-tight ${
                    item.badgeColor || 'bg-[#C5DFFF] text-[#101D3A]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer & Logout */}
      <div className="p-3 border-t border-[#1B2B4B] space-y-2">
        <div className="px-3 py-2 rounded-xl bg-[#1B2B4B]/40 flex items-center justify-between text-[11px] text-[#C5DFFF]/80">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5DFFF]" />
            <span>Target: {stats.completedDays}/{stats.totalRequiredDays} Hari</span>
          </div>
          <span className="font-bold text-white">{stats.progressPercentage}%</span>
        </div>

        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            logout();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0 shadow-lg">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
