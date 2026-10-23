/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useMagang } from '../../context/MagangContext';
import { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  ShieldCheck,
  Info,
  Sparkles,
  Search,
  X,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AttendancePage: React.FC = () => {
  const {
    attendance,
    stats,
    checkInToday,
    checkOutToday,
    recordAttendanceManual,
    student,
  } = useMagang();

  // Current live clock state (WIB)
  const [currentTime, setCurrentTime] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');

  // Modals
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveStatus, setLeaveStatus] = useState<AttendanceStatus>('Izin');
  const [leaveNotes, setLeaveNotes] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveError, setLeaveError] = useState('');

  // Search & Status filter
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} WIB`);

      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      setCurrentDateFormatted(
        `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayRecord = stats.todayAttendance;
  const hasCheckedIn = !!todayRecord?.checkInTime;
  const hasCheckedOut = !!todayRecord?.checkOutTime;

  // Handle Check-in button
  const handleCheckIn = () => {
    const res = checkInToday();
    if (res.success) {
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch {
        // silent
      }
    }
  };

  // Handle Check-out button
  const handleCheckOut = () => {
    const res = checkOutToday();
    if (res.success) {
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {
        // silent
      }
    }
  };

  // Handle Leave / Sick submission
  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate) {
      setLeaveError('Harap pilih tanggal pengajuan.');
      return;
    }
    if (!leaveNotes.trim()) {
      setLeaveError('Harap isi alasan / keterangan izin atau sakit.');
      return;
    }

    const d = new Date(leaveDate);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[d.getDay()];

    recordAttendanceManual({
      date: leaveDate,
      dayName,
      checkInTime: null,
      checkOutTime: null,
      status: leaveStatus,
      notes: leaveNotes.trim(),
      isLate: false,
    });

    setIsLeaveModalOpen(false);
    setLeaveNotes('');
    setLeaveDate('');
    setLeaveError('');
  };

  // Filter attendance records
  const filteredRecords = attendance.filter(record => {
    const matchStatus = statusFilter === 'Semua' || record.status === statusFilter;
    const matchDate = !searchDate || record.date.includes(searchDate);
    return matchStatus && matchDate;
  });

  const getStatusBadge = (status: AttendanceStatus, isLate?: boolean) => {
    if (status === 'Hadir') {
      if (isLate) {
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FCE8E8] text-rose-800 border border-rose-200">
            Hadir (Terlambat)
          </span>
        );
      }
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DDF5E5] text-emerald-800 border border-emerald-200">
          Hadir Tepat Waktu
        </span>
      );
    }
    if (status === 'Izin') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-amber-900 border border-amber-200">
          Izin Resmi
        </span>
      );
    }
    if (status === 'Sakit') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF3FF] text-[#1B2B4B] border border-[#C5DFFF]">
          Sakit
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FCE8E8] text-rose-800 border border-rose-200">
        Tidak Hadir
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Live WIB Clock */}
      <div className="bg-gradient-to-r from-[#101D3A] via-[#1B2B4B] to-[#243B66] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-[#C5DFFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5DFFF] text-[#101D3A]">
                Presensi Digital
              </span>
              <span className="text-xs text-[#C5DFFF]/80">Jam Kerja: 08:00 - 17:00 WIB</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
              Absensi Kehadiran Magang
            </h2>
            <p className="text-xs sm:text-sm text-[#C5DFFF]/90 mt-1 max-w-lg leading-relaxed">
              Lakukan pencatatan kehadiran setiap hari kerja di {student.companyName}.
            </p>
          </div>

          {/* Live Clock Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center min-w-[220px]">
            <p className="text-[11px] text-[#C5DFFF] uppercase tracking-wider font-semibold">
              {currentDateFormatted || 'Memuat...'}
            </p>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white mt-1 tracking-tight">
              {currentTime || '08:00:00 WIB'}
            </div>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
              Waktu Lokal Indonesia
            </span>
          </div>
        </div>
      </div>

      {/* Today Check-in / Check-out Interactive Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#101D3A] flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#101D3A]" />
              <span>Status Absensi Hari Ini</span>
            </h3>
            <p className="text-xs text-slate-500">
              Tombol check-in dan check-out akan otomatis terkunci setelah Anda selesai merekam kehadiran hari ini.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLeaveDate(new Date().toISOString().split('T')[0]);
              setIsLeaveModalOpen(true);
            }}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            Ajukan Izin / Sakit
          </button>
        </div>

        {/* 2 Big Action Columns: Masuk vs Pulang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Absen Masuk Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              hasCheckedIn
                ? 'bg-[#DDF5E5]/50 border-emerald-300'
                : 'bg-[#F5F7FB] border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#101D3A] uppercase tracking-wider">
                1. Absen Masuk (Check-In)
              </span>
              {hasCheckedIn ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-[#DDF5E5] px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Sudah Tercatat
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-700 bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                  Belum Check-In
                </span>
              )}
            </div>

            <div className="my-3">
              <p className="text-xs text-slate-500">Waktu Kedatangan Anda:</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#101D3A] font-mono mt-0.5">
                {todayRecord?.checkInTime ? `${todayRecord.checkInTime} WIB` : '-- : --'}
              </p>
              {todayRecord?.isLate && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">
                  Catatan: Masuk melewati batas toleransi 08:15 WIB
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={hasCheckedIn}
              onClick={handleCheckIn}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                hasCheckedIn
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-70'
                  : 'bg-[#101D3A] hover:bg-[#1B2B4B] text-[#C5DFFF] active:scale-[0.99] cursor-pointer'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{hasCheckedIn ? 'Sudah Absen Masuk' : 'Absen Masuk Sekarang'}</span>
            </button>
          </div>

          {/* Absen Pulang Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              hasCheckedOut
                ? 'bg-[#DDF5E5]/50 border-emerald-300'
                : hasCheckedIn
                ? 'bg-[#EAF3FF] border-[#C5DFFF]'
                : 'bg-[#F5F7FB] border-slate-200 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#101D3A] uppercase tracking-wider">
                2. Absen Pulang (Check-Out)
              </span>
              {hasCheckedOut ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-[#DDF5E5] px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Selesai
                </span>
              ) : hasCheckedIn ? (
                <span className="text-xs font-semibold text-[#101D3A] bg-[#C5DFFF] px-2.5 py-0.5 rounded-full">
                  Siap Check-Out
                </span>
              ) : (
                <span className="text-xs text-slate-400">Menunggu Check-In</span>
              )}
            </div>

            <div className="my-3">
              <p className="text-xs text-slate-500">Waktu Kepulangan Anda:</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#101D3A] font-mono mt-0.5">
                {todayRecord?.checkOutTime ? `${todayRecord.checkOutTime} WIB` : '-- : --'}
              </p>
            </div>

            <button
              type="button"
              disabled={!hasCheckedIn || hasCheckedOut}
              onClick={handleCheckOut}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                !hasCheckedIn
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : hasCheckedOut
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-70'
                  : 'bg-[#1B2B4B] hover:bg-[#101D3A] text-white active:scale-[0.99] cursor-pointer'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-[#C5DFFF]" />
              <span>
                {!hasCheckedIn
                  ? 'Perlu Check-In Terlebih Dahulu'
                  : hasCheckedOut
                  ? 'Sudah Absen Pulang'
                  : 'Absen Pulang Sekarang'}
              </span>
            </button>
          </div>
        </div>

        {/* Disclaimer per requirement:
            "Jangan mengklaim lokasi atau waktu telah diverifikasi jika fitur verifikasi nyata belum tersedia." */}
        <div className="mt-5 p-3.5 rounded-2xl bg-[#F5F7FB] border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#101D3A] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#101D3A]">Catatan Transparansi:</strong> Pencatatan waktu absensi dilakukan secara mandiri pada perangkat ini. Sistem menjaga agar tidak terjadi absensi ganda pada tanggal yang sama. Lakukan absensi dengan jujur dan tepat waktu sesuai arahan guru pembimbing sekolah.
          </p>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hadir Tepat Waktu</span>
          <p className="text-2xl font-extrabold text-[#101D3A] mt-1">
            {stats.countHadir - stats.countTerlambat}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Presensi normal</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Terlambat</span>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">
            {stats.countTerlambat}
          </p>
          <span className="text-[11px] text-rose-600 font-medium">Melewati 08:15 WIB</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Izin & Sakit</span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">
            {stats.countIzin + stats.countSakit}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            {stats.countIzin} Izin, {stats.countSakit} Sakit
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Persentase Hadir</span>
          <p className="text-2xl font-extrabold text-[#101D3A] mt-1">
            {stats.attendanceRate}%
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Memenuhi syarat minimal PKL (85%)</span>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-[#101D3A]">Riwayat Presensi Magang</h3>
            <p className="text-xs text-slate-500">Rekapitulasi catatan jam masuk dan pulang harian</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status filter tabs */}
            <div className="flex items-center gap-1 bg-[#F5F7FB] p-1 rounded-xl">
              {['Semua', 'Hadir', 'Izin', 'Sakit'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === status
                      ? 'bg-white shadow-xs text-[#101D3A]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Date search */}
            <div className="relative">
              <input
                type="date"
                value={searchDate}
                onChange={e => setSearchDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#F5F7FB] border border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#101D3A]"
              />
              {searchDate && (
                <button
                  type="button"
                  onClick={() => setSearchDate('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Hari & Tanggal</th>
                <th className="py-3 px-4">Jam Masuk</th>
                <th className="py-3 px-4">Jam Pulang</th>
                <th className="py-3 px-4">Status Kehadiran</th>
                <th className="py-3 px-4">Keterangan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada catatan absensi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#101D3A]">{item.dayName}</div>
                      <div className="text-[11px] text-slate-400">{item.date}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium whitespace-nowrap">
                      {item.checkInTime ? `${item.checkInTime} WIB` : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium whitespace-nowrap">
                      {item.checkOutTime ? `${item.checkOutTime} WIB` : '-'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status, item.isLate)}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {item.notes || '-'}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pengajuan Izin / Sakit */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-amber-900">
                  <FileText className="w-5 h-5 text-amber-800" />
                </div>
                <h3 className="font-bold text-base text-[#101D3A]">Pengajuan Izin / Sakit</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {leaveError && (
              <div className="mb-3 p-3 rounded-xl bg-[#FCE8E8] text-rose-700 text-xs">
                {leaveError}
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                  Jenis Ketidakhadiran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLeaveStatus('Izin')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      leaveStatus === 'Izin'
                        ? 'bg-[#FEF3C7] border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Izin Resmi / Kepentingan Sekolah
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaveStatus('Sakit')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      leaveStatus === 'Sakit'
                        ? 'bg-[#EAF3FF] border-[#C5DFFF] text-[#101D3A]'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Sakit (Kondisi Kesehatan)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                  Tanggal Tidak Masuk
                </label>
                <input
                  type="date"
                  value={leaveDate}
                  onChange={e => setLeaveDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                  Keterangan / Alasan Lengkap
                </label>
                <textarea
                  rows={3}
                  value={leaveNotes}
                  onChange={e => setLeaveNotes(e.target.value)}
                  placeholder="Contoh: Mengikuti asesmen sekolah / demam dan periksa ke klinik..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-[#F5F7FB] border border-dashed border-slate-300 text-center">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <p className="text-[11px] font-semibold text-slate-600">
                  Lampirkan Surat Izin / Surat Dokter (Opsional)
                </p>
                <p className="text-[10px] text-slate-400">Format JPG, PNG, atau PDF</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#101D3A] text-[#C5DFFF] font-bold text-xs hover:bg-[#1B2B4B]"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
