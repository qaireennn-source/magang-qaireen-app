/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMagang } from '../../context/MagangContext';
import { Bell, User, LogOut, CheckCircle2, AlertCircle, Menu, Calendar, Building2 } from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { student, notifications, markNotificationAsRead, markAllNotificationsAsRead, logout, setActivePage } = useMagang();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Format today's Indonesian date
  const now = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const dateFormatted = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Mobile hamburger & Today date */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-[#101D3A] hover:bg-slate-100 transition-colors"
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-[#101D3A]" />
              <span>{dateFormatted}</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] bg-[#EAF3FF] text-[#1B2B4B] font-semibold">
                Semester Ganjil 2026/2027
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-[#101D3A] flex items-center gap-1.5">
              <span>Halo, {student.name.split(' ')[0]}!</span>
              <span className="text-base">👋</span>
            </h1>
          </div>
        </div>

        {/* Right: Place badge, Notification bell & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7FB] border border-slate-200/60 text-xs text-slate-600">
            <Building2 className="w-3.5 h-3.5 text-[#101D3A]" />
            <span className="font-medium text-[#101D3A] truncate max-w-[200px]">{student.companyName}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-[#101D3A] hover:bg-[#EAF3FF] transition-all"
              aria-label="Pemberitahuan"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#101D3A]">Notifikasi</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#101D3A] font-semibold">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-[#1B2B4B] hover:underline"
                    >
                      Tandai sudah dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-center text-slate-400 py-4">Belum ada notifikasi.</p>
                  ) : (
                    notifications.map(item => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationAsRead(item.id)}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          item.read ? 'bg-slate-50 text-slate-600' : 'bg-[#EAF3FF]/80 text-[#101D3A] font-medium'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {item.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[13px]">{item.title}</span>
                              <span className="text-[10px] text-slate-400">{item.time}</span>
                            </div>
                            <p className="text-[12px] mt-0.5 leading-relaxed text-slate-600">{item.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-[#101D3A] text-[#C5DFFF] flex items-center justify-center font-bold text-xs ring-2 ring-[#C5DFFF]/40">
                {student.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-[#101D3A] leading-tight truncate max-w-[120px]">
                  {student.name}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">NIS: {student.nis}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-[#101D3A]">{student.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{student.email}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#DDF5E5] text-emerald-800 font-semibold">
                    {student.grade}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActivePage('profil');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-[#EAF3FF] hover:text-[#101D3A] rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-[#101D3A]" />
                  <span>Profil Saya</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-[#FCE8E8] rounded-xl transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
