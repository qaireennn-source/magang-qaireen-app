/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMagang } from '../../context/MagangContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  TrendingUp,
  Building2,
  GraduationCap,
  PlusCircle,
  CalendarCheck,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Megaphone,
  Briefcase,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { student, stats, journals, schedule, announcements, setActivePage, checkInToday, checkOutToday } = useMagang();

  const todaySchedule = schedule.filter(s => s.isToday || s.dayName.includes('Hari Ini'));
  const recentJournals = journals.slice(0, 4);

  // Status badge styling helper
  const getJournalBadge = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return 'bg-[#DDF5E5] text-emerald-800 border-emerald-200';
      case 'Perlu Revisi':
        return 'bg-[#FCE8E8] text-rose-800 border-rose-200';
      default:
        return 'bg-[#FEF3C7] text-amber-900 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Student Identity Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101D3A] via-[#1B2B4B] to-[#243B66] text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-[#C5DFFF]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#C5DFFF] text-[#101D3A] font-extrabold text-2xl sm:text-3xl flex items-center justify-center shrink-0 ring-4 ring-white/10 shadow-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5DFFF] text-[#101D3A]">
                  Siswa PKL Aktif
                </span>
                <span className="text-xs text-[#C5DFFF]/80 font-mono">
                  NIS: {student.nis}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Halo, {student.name}! 👋
              </h2>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-[#C5DFFF]/90 mt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-[#C5DFFF]" />
                  {student.grade} - {student.major} ({student.school})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/80 mt-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-[#C5DFFF]" />
                <span className="text-white font-semibold">{student.companyName}</span>
                <span className="text-white/40">•</span>
                <span className="text-[#C5DFFF]">Pembimbing: {student.mentorCompany.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons Group */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActivePage('jurnal')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#C5DFFF] text-[#101D3A] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-white transition-all shadow-md active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#101D3A]" />
              <span>Isi Jurnal</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePage('absensi')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CalendarCheck className="w-4 h-4 text-[#C5DFFF]" />
              <span>Absen Hari Ini</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePage('jadwal')}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/10 flex items-center justify-center gap-1.5 transition-all"
              title="Lihat Jadwal"
            >
              <CalendarDays className="w-4 h-4 text-[#C5DFFF]" />
              <span className="hidden sm:inline">Jadwal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Revision Alert Banner (if any journal requires revision) */}
      {stats.revisionJournals > 0 && (
        <div className="p-4 rounded-2xl bg-[#FCE8E8] border border-rose-300 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-rose-900">
                Perhatian: Ada {stats.revisionJournals} Jurnal Yang Perlu Direvisi
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                Pembimbing lapangan memberikan catatan perbaikan pada jurnal kegiatanmu. Segera periksa dan perbarui.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActivePage('jurnal')}
            className="px-3 py-1.5 rounded-xl bg-white text-rose-800 text-xs font-bold border border-rose-200 hover:bg-rose-50 shrink-0 transition-colors"
          >
            Periksa Jurnal
          </button>
        </div>
      )}

      {/* 3. 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Hari Magang */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Hari</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
              <Calendar className="w-4 h-4 text-[#101D3A]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#101D3A]">{stats.completedDays}</span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">/ {stats.totalRequiredDays} hari</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-emerald-700 font-semibold">{stats.totalRequiredDays - stats.completedDays} hari</span> tersisa
          </p>
        </div>

        {/* Kehadiran */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kehadiran</span>
            <div className="w-8 h-8 rounded-xl bg-[#DDF5E5] flex items-center justify-center text-emerald-800">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#101D3A]">{stats.attendanceRate}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {stats.countHadir} Hadir • {stats.countIzin} Izin • {stats.countSakit} Sakit
          </p>
        </div>

        {/* Jurnal Terisi */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jurnal Terisi</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
              <BookOpen className="w-4 h-4 text-[#101D3A]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#101D3A]">{stats.totalJournals}</span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">entri</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{stats.approvedJournals} telah disetujui</span>
          </p>
        </div>

        {/* Progres PKL */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progres PKL</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
              <TrendingUp className="w-4 h-4 text-[#101D3A]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#101D3A]">{stats.progressPercentage}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            {stats.completedTargets} dari {stats.totalTargets} target kompetensi selesai
          </p>
        </div>
      </div>

      {/* 4. Progress Bar Card with Milestones */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#101D3A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#101D3A]" />
              <span>Persentase Penyelesaian Program Magang</span>
            </h3>
            <p className="text-xs text-slate-500">
              Berdasarkan akumulasi kehadiran hari kerja dan penyelesaian modul kompetensi PKL
            </p>
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-[#101D3A]">
            {stats.progressPercentage}%
          </span>
        </div>

        {/* Progress bar container */}
        <div className="w-full bg-[#EAF3FF] rounded-full h-4 sm:h-5 p-0.5 overflow-hidden">
          <div
            className="bg-[#101D3A] h-full rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${Math.min(100, Math.max(5, stats.progressPercentage))}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Milestones markers */}
        <div className="grid grid-cols-4 text-center mt-3 text-[11px] text-slate-400 font-medium">
          <div className="text-left font-semibold text-[#101D3A]">0% Mulai</div>
          <div className="text-center">25% Orientasi</div>
          <div className="text-center">50% Pertengahan</div>
          <div className="text-right font-semibold text-emerald-700">100% Sidang PKL</div>
        </div>
      </div>

      {/* 5. Today's Attendance Quick Status Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] text-[#101D3A] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-[#101D3A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Status Kehadiran Hari Ini
              </span>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                  stats.todayAttendance?.checkInTime
                    ? stats.todayAttendance?.checkOutTime
                      ? 'bg-[#DDF5E5] text-emerald-800'
                      : 'bg-[#C5DFFF] text-[#101D3A]'
                    : 'bg-[#FEF3C7] text-amber-900'
                }`}
              >
                {stats.todayAttendance?.checkInTime
                  ? stats.todayAttendance?.checkOutTime
                    ? 'Absensi Lengkap'
                    : 'Sudah Check-In'
                  : 'Belum Absen'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {stats.todayAttendance?.checkInTime ? (
                <>
                  Check-In: <span className="font-bold text-[#101D3A]">{stats.todayAttendance.checkInTime} WIB</span>
                  {stats.todayAttendance.checkOutTime ? (
                    <> • Check-Out: <span className="font-bold text-[#101D3A]">{stats.todayAttendance.checkOutTime} WIB</span></>
                  ) : (
                    <span className="text-slate-500 font-medium"> (Belum absen pulang)</span>
                  )}
                </>
              ) : (
                'Anda belum melakukan absen masuk hari ini. Pastikan absen tepat waktu.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!stats.todayAttendance?.checkInTime ? (
            <button
              type="button"
              onClick={() => checkInToday()}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#101D3A] hover:bg-[#1B2B4B] text-[#C5DFFF] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-[#C5DFFF]" />
              <span>Absen Masuk Sekarang</span>
            </button>
          ) : !stats.todayAttendance?.checkOutTime ? (
            <button
              type="button"
              onClick={() => checkOutToday()}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1B2B4B] hover:bg-[#101D3A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-[#C5DFFF]" />
              <span>Absen Pulang Sekarang</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold px-3 py-1.5 rounded-xl bg-[#DDF5E5]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kehadiran Hari Ini Selesai</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setActivePage('absensi')}
            className="p-2.5 rounded-xl text-slate-500 hover:text-[#101D3A] hover:bg-slate-100 transition-colors"
            title="Buka Halaman Absensi"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 6. Two-Column Layout: Jadwal Hari Ini & Aktivitas Magang Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Jadwal Kegiatan Hari Ini */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#101D3A]" />
                <h3 className="font-bold text-sm sm:text-base text-[#101D3A]">
                  Jadwal Kegiatan Hari Ini
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('jadwal')}
                className="text-xs font-semibold text-[#101D3A] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySchedule.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-xs font-medium">Tidak ada agenda khusus hari ini.</p>
                <p className="text-[11px] text-slate-400">Fokus pada aktivitas rutin di tempat magang.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySchedule.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-slate-100 hover:border-[#C5DFFF] transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#101D3A] bg-[#EAF3FF] px-2 py-0.5 rounded-md">
                        {item.timeRange} WIB
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.location}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#101D3A] mt-1.5">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-[#101D3A]" />
                      <span>Pembimbing: {item.mentor}</span>
                    </p>
                    {item.notes && (
                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg mt-2 border border-slate-100 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActivePage('jadwal')}
              className="w-full py-2.5 rounded-xl bg-[#EAF3FF] hover:bg-[#C5DFFF]/50 text-[#101D3A] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Buka Jadwal Mingguan Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Aktivitas Magang Terbaru */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#101D3A]" />
                <h3 className="font-bold text-sm sm:text-base text-[#101D3A]">
                  Aktivitas Magang Terbaru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('jurnal')}
                className="text-xs font-semibold text-[#101D3A] hover:underline flex items-center gap-1"
              >
                <span>Lihat Jurnal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentJournals.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-xs font-medium">Belum ada jurnal yang ditulis.</p>
                <button
                  type="button"
                  onClick={() => setActivePage('jurnal')}
                  className="mt-2 text-xs font-bold text-[#101D3A] underline"
                >
                  Tulis Jurnal Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJournals.map(journal => (
                  <div
                    key={journal.id}
                    className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-slate-100 hover:border-slate-200 transition-all cursor-pointer"
                    onClick={() => setActivePage('jurnal')}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {journal.date} • {journal.startTime} - {journal.endTime} WIB
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getJournalBadge(
                          journal.status
                        )}`}
                      >
                        {journal.status}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#101D3A] leading-snug line-clamp-1">
                      {journal.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {journal.description}
                    </p>
                    {journal.status === 'Perlu Revisi' && journal.feedback && (
                      <div className="mt-2 text-[10px] bg-[#FCE8E8] text-rose-800 p-2 rounded-lg font-medium">
                        Catatan revisi: {journal.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActivePage('jurnal')}
              className="w-full py-2.5 rounded-xl bg-[#101D3A] hover:bg-[#1B2B4B] text-[#C5DFFF] font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-[#C5DFFF]" />
              <span>Tulis Jurnal Aktivitas Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Pengumuman Pembimbing */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
              <Megaphone className="w-4 h-4 text-[#101D3A]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#101D3A]">
                Pengumuman dari Guru & Pembimbing
              </h3>
              <p className="text-[11px] text-slate-500">Informasi resmi seputar pelaksanaan PKL dan pelaporan</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                ann.isImportant
                  ? 'bg-[#EAF3FF]/80 border-[#C5DFFF] shadow-xs'
                  : 'bg-[#F5F7FB] border-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#101D3A] border border-slate-200">
                    {ann.role}
                  </span>
                  <span className="text-[10px] text-slate-400">{ann.date}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#101D3A] leading-snug">
                  {ann.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-4">
                  {ann.content}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/50 text-[11px] text-[#101D3A] font-semibold flex items-center justify-between">
                <span>{ann.sender}</span>
                {ann.isImportant && (
                  <span className="text-[10px] text-rose-600 font-bold">Penting</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
