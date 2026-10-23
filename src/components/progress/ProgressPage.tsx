/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMagang } from '../../context/MagangContext';
import { TargetStatus } from '../../types';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  CircleDashed,
  Award,
  Sparkles,
  BookCheck,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProgressPage: React.FC = () => {
  const { stats, targets, updateTargetStatus, student } = useMagang();
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(targets.map(t => t.category)))];

  const filteredTargets = targets.filter(t => {
    return filterCategory === 'Semua' || t.category === filterCategory;
  });

  const handleStatusChange = (id: string, newStatus: TargetStatus) => {
    updateTargetStatus(id, newStatus);
    if (newStatus === 'Selesai') {
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      } catch {
        // silent
      }
    }
  };

  const getTargetBadge = (status: TargetStatus) => {
    switch (status) {
      case 'Selesai':
        return 'bg-[#DDF5E5] text-emerald-800 border-emerald-300';
      case 'Sedang Berjalan':
        return 'bg-[#EAF3FF] text-[#101D3A] border-[#C5DFFF]';
      case 'Belum Dimulai':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getTargetIcon = (status: TargetStatus) => {
    switch (status) {
      case 'Selesai':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Sedang Berjalan':
        return <Clock className="w-4 h-4 text-[#101D3A]" />;
      case 'Belum Dimulai':
      default:
        return <CircleDashed className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Progress Hero Banner with Navy background and Pale Blue accents */}
      <div className="bg-[#101D3A] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#C5DFFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5DFFF] text-[#101D3A]">
                Evaluasi & Capaian PKL
              </span>
              <span className="text-xs text-[#C5DFFF]/80">
                {student.school} • {student.companyName}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Perkembangan Magang
            </h2>
            <p className="text-xs sm:text-sm text-[#C5DFFF]/90 mt-1 max-w-xl leading-relaxed">
              Pantau capaian hari magang, akumulasi jurnal yang telah disetujui guru, dan checklist target kompetensi keahlian.
            </p>

            {/* Overall Progress Gauge */}
            <div className="mt-6 bg-[#1B2B4B] p-4 sm:p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#C5DFFF] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5DFFF]" />
                  <span>Capaian Keseluruhan Program</span>
                </span>
                <span className="text-2xl font-extrabold text-[#C5DFFF]">
                  {stats.progressPercentage}%
                </span>
              </div>

              {/* Progress bar with pale light blue */}
              <div className="w-full bg-[#101D3A] rounded-full h-4 p-0.5 overflow-hidden">
                <div
                  className="bg-[#C5DFFF] h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${Math.min(100, Math.max(5, stats.progressPercentage))}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-300">
                <span>{stats.completedDays} dari {stats.totalRequiredDays} Hari Diselesaikan</span>
                <span>Tersisa {Math.max(0, stats.totalRequiredDays - stats.completedDays)} Hari</span>
              </div>
            </div>
          </div>

          {/* Quick Trophy Card */}
          <div className="bg-[#1B2B4B]/80 backdrop-blur-md rounded-3xl p-5 border border-white/10 text-center shrink-0 w-full md:w-60">
            <div className="w-14 h-14 rounded-2xl bg-[#C5DFFF]/20 text-[#C5DFFF] mx-auto flex items-center justify-center mb-2">
              <Award className="w-8 h-8 text-[#C5DFFF]" />
            </div>
            <p className="text-xs font-bold text-white">Kelayakan Sidang PKL</p>
            <p className="text-[11px] text-[#C5DFFF]/80 mt-1">
              {stats.progressPercentage >= 80
                ? 'Siap mengikuti sidang akhir'
                : 'Penuhi minimal 80% hari & jurnal'}
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Status: On Track</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Metric Breakdowns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Hari Wajib */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Hari Wajib</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
              <Calendar className="w-4 h-4 text-[#101D3A]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#101D3A]">{stats.completedDays} / {stats.totalRequiredDays}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Hari kerja terselesaikan</p>
        </div>

        {/* Jurnal Terkumpul */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jurnal Terkumpul</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
              <BookCheck className="w-4 h-4 text-[#101D3A]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#101D3A]">{stats.totalJournals}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Total catatan tersimpan</p>
        </div>

        {/* Jurnal Disetujui */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jurnal Disetujui</span>
            <div className="w-8 h-8 rounded-xl bg-[#DDF5E5] flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-800">{stats.approvedJournals}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            {stats.pendingJournals > 0 ? `${stats.pendingJournals} masih menunggu review` : 'Semua terverifikasi'}
          </p>
        </div>

        {/* Target Kompetensi */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Kompetensi</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
              <Layers className="w-4 h-4 text-[#101D3A]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#101D3A]">{stats.completedTargets} / {stats.totalTargets}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Modul kurikulum industri</p>
        </div>
      </div>

      {/* 3. Target & Kompetensi Magang List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#101D3A]">
              Target Capaian & Kompetensi Magang
            </h3>
            <p className="text-xs text-slate-500">
              Daftar target capaian pembelajaran PKL siswa SMK/SMA. Anda dapat memperbarui status capaian.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#101D3A] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Target Items List */}
        <div className="space-y-3.5">
          {filteredTargets.map((target, idx) => (
            <div
              key={target.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#F5F7FB] border border-slate-100 hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 flex-1">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-[#101D3A] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EAF3FF] text-[#101D3A]">
                      {target.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Batas Target: {target.dueDate}
                    </span>
                    {target.completedDate && (
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        • Selesai {target.completedDate}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#101D3A] leading-snug">
                    {target.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {target.description}
                  </p>
                </div>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${getTargetBadge(
                    target.status
                  )}`}
                >
                  {getTargetIcon(target.status)}
                  <span>{target.status}</span>
                </span>

                {/* Change status menu */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(target.id, 'Belum Dimulai')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                      target.status === 'Belum Dimulai'
                        ? 'bg-slate-200 text-slate-800'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Set Belum Dimulai"
                  >
                    Belum
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(target.id, 'Sedang Berjalan')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                      target.status === 'Sedang Berjalan'
                        ? 'bg-[#EAF3FF] text-[#101D3A] font-bold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Set Sedang Berjalan"
                  >
                    Proses
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(target.id, 'Selesai')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                      target.status === 'Selesai'
                        ? 'bg-[#DDF5E5] text-emerald-800 font-bold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Set Selesai"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
