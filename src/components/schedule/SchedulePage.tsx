/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMagang } from '../../context/MagangContext';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  User,
  Sparkles,
  Trash2,
  X,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const { schedule, addScheduleItem, deleteScheduleItem, student } = useMagang();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    dayName: 'Senin',
    date: '',
    timeRange: '09:00 - 11:30',
    title: '',
    location: 'Ruang Kolaborasi Dev Lt. 14',
    mentor: student.mentorCompany,
    notes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Judul kegiatan wajib diisi.');
      return;
    }

    addScheduleItem({
      dayName: formData.dayName,
      date: formData.date || undefined,
      timeRange: formData.timeRange,
      title: formData.title.trim(),
      location: formData.location.trim(),
      mentor: formData.mentor.trim(),
      notes: formData.notes.trim() || undefined,
      isToday: formData.dayName.toLowerCase().includes('hari ini'),
    });

    setIsAddOpen(false);
    setFormData({
      dayName: 'Senin',
      date: '',
      timeRange: '09:00 - 11:30',
      title: '',
      location: 'Ruang Kolaborasi Dev Lt. 14',
      mentor: student.mentorCompany,
      notes: '',
    });
    setErrorMsg('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#101D3A] px-2.5 py-0.5 rounded-full bg-[#EAF3FF]">
              Agenda & Jadwal PKL
            </span>
            <span className="text-xs text-slate-400">• Semester Ganjil 2026/2027</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#101D3A] tracking-tight">
            Jadwal Kegiatan Magang
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Agenda harian dan mingguan: sesi mentoring, supervisi guru sekolah, dan penugasan proyek.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#101D3A] hover:bg-[#1B2B4B] text-[#C5DFFF] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C5DFFF]" />
          <span>Tambah Jadwal Kegiatan</span>
        </button>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {schedule.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#101D3A]">Belum Ada Agenda Jadwal</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tambahkan kegiatan atau sesi mentoring yang dijadwalkan oleh pembimbing.
            </p>
          </div>
        ) : (
          schedule.map(item => {
            const isToday = item.isToday || item.dayName.toLowerCase().includes('hari ini');
            return (
              <div
                key={item.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                  isToday
                    ? 'bg-gradient-to-r from-white via-[#EAF3FF]/40 to-white border-[#C5DFFF] shadow-md ring-2 ring-[#C5DFFF]/40'
                    : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider ${
                          isToday
                            ? 'bg-[#101D3A] text-[#C5DFFF] shadow-xs'
                            : 'bg-[#F5F7FB] text-slate-700'
                        }`}
                      >
                        {item.dayName}
                      </span>

                      {isToday && (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DDF5E5] text-emerald-800 animate-pulse">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          HARI INI
                        </span>
                      )}

                      {item.date && (
                        <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#101D3A] mt-1">
                      {item.title}
                    </h3>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2 bg-[#F5F7FB] p-2.5 rounded-xl">
                        <Clock className="w-4 h-4 text-[#101D3A] shrink-0" />
                        <span className="font-semibold text-slate-800">{item.timeRange} WIB</span>
                      </div>

                      <div className="flex items-center gap-2 bg-[#F5F7FB] p-2.5 rounded-xl">
                        <MapPin className="w-4 h-4 text-[#101D3A] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      <div className="flex items-center gap-2 bg-[#F5F7FB] p-2.5 rounded-xl">
                        <User className="w-4 h-4 text-[#101D3A] shrink-0" />
                        <span className="truncate">{item.mentor}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="mt-3 p-3 rounded-2xl bg-[#F5F7FB] border border-slate-100 text-xs text-slate-700 leading-relaxed">
                        <strong className="text-[#101D3A]">Catatan Khusus:</strong> {item.notes}
                      </div>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => deleteScheduleItem(item.id)}
                    className="p-2 self-start rounded-xl text-slate-400 hover:text-rose-600 hover:bg-[#FCE8E8] transition-colors"
                    title="Hapus Agenda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Schedule Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
                  <CalendarDays className="w-4 h-4 text-[#101D3A]" />
                </div>
                <h3 className="font-bold text-base text-[#101D3A]">Tambah Agenda Jadwal Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-3 p-3 rounded-xl bg-[#FCE8E8] text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#101D3A] mb-1">Hari</label>
                  <select
                    value={formData.dayName}
                    onChange={e => setFormData({ ...formData, dayName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A] bg-white"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis (Hari Ini)">Kamis (Hari Ini)</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                    Tanggal (Opsional)
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                  Nama Kegiatan / Agenda
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Evaluasi Proyek Mingguan atau Supervisi Guru"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                    Jam Kegiatan
                  </label>
                  <input
                    type="text"
                    value={formData.timeRange}
                    onChange={e => setFormData({ ...formData, timeRange: e.target.value })}
                    placeholder="08:30 - 10:00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101D3A] mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ruang Rapat / Google Meet"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                  Guru / Pembimbing Terkait
                </label>
                <input
                  type="text"
                  value={formData.mentor}
                  onChange={e => setFormData({ ...formData, mentor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                  Catatan Khusus (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Hal yang perlu dipersiapkan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#101D3A] text-[#C5DFFF] font-bold text-xs hover:bg-[#1B2B4B]"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
