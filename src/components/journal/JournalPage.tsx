/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useMagang } from '../../context/MagangContext';
import { JournalEntry, JournalStatus } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  X,
  Printer,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JournalPage: React.FC = () => {
  const { journals, addJournal, updateJournal, deleteJournal, student } = useMagang();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [dateFilter, setDateFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [viewingJournal, setViewingJournal] = useState<JournalEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState({
    date: todayStr(),
    startTime: '08:00',
    endTime: '16:30',
    title: '',
    description: '',
    skillsLearned: '',
    obstacles: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset form
  const resetForm = () => {
    setFormData({
      date: todayStr(),
      startTime: '08:00',
      endTime: '16:30',
      title: '',
      description: '',
      skillsLearned: '',
      obstacles: '',
      notes: '',
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditModal = (journal: JournalEntry) => {
    setEditingJournal(journal);
    setFormData({
      date: journal.date,
      startTime: journal.startTime,
      endTime: journal.endTime,
      title: journal.title,
      description: journal.description,
      skillsLearned: journal.skillsLearned,
      obstacles: journal.obstacles || '',
      notes: journal.notes || '',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.date) errors.date = 'Tanggal wajib diisi.';
    if (!formData.startTime) errors.startTime = 'Jam mulai wajib diisi.';
    if (!formData.endTime) errors.endTime = 'Jam selesai wajib diisi.';
    if (formData.startTime >= formData.endTime) {
      errors.endTime = 'Jam selesai harus lebih akhir dari jam mulai.';
    }
    if (!formData.title.trim()) errors.title = 'Judul kegiatan wajib diisi.';
    if (!formData.description.trim()) {
      errors.description = 'Deskripsi pekerjaan yang dilakukan wajib diisi.';
    } else if (formData.description.trim().length < 20) {
      errors.description = 'Deskripsi minimal 20 karakter agar jelas bagi pembimbing.';
    }
    if (!formData.skillsLearned.trim()) {
      errors.skillsLearned = 'Pengetahuan/keterampilan yang diperoleh wajib diisi.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingJournal) {
      updateJournal(editingJournal.id, {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        title: formData.title.trim(),
        description: formData.description.trim(),
        skillsLearned: formData.skillsLearned.trim(),
        obstacles: formData.obstacles.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });
      setEditingJournal(null);
    } else {
      addJournal({
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        title: formData.title.trim(),
        description: formData.description.trim(),
        skillsLearned: formData.skillsLearned.trim(),
        obstacles: formData.obstacles.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });
      setIsCreateOpen(false);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch {
        // silent fallback
      }
    }
    resetForm();
  };

  // Filter and search computation
  const filteredJournals = useMemo(() => {
    return journals.filter(item => {
      const matchSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skillsLearned.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'Semua' || item.status === selectedStatus;
      const matchDate = !dateFilter || item.date === dateFilter;

      return matchSearch && matchStatus && matchDate;
    });
  }, [journals, searchQuery, selectedStatus, dateFilter]);

  // Status color styles
  const getBadgeClass = (status: JournalStatus) => {
    switch (status) {
      case 'Disetujui':
        return 'bg-[#DDF5E5] text-emerald-800 border-emerald-300';
      case 'Perlu Revisi':
        return 'bg-[#FCE8E8] text-rose-800 border-rose-300';
      case 'Menunggu':
      default:
        return 'bg-[#FEF3C7] text-amber-900 border-amber-300';
    }
  };

  const statusIcons = {
    Disetujui: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    'Perlu Revisi': <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
    Menunggu: <Clock className="w-3.5 h-3.5 text-amber-600" />,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#101D3A] px-2.5 py-0.5 rounded-full bg-[#EAF3FF]">
              Buku Catatan PKL
            </span>
            <span className="text-xs text-slate-400">• Total {journals.length} entri</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#101D3A] tracking-tight">
            Jurnal Aktivitas Harian
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Catat pekerjaan harian, ilmu baru yang diperoleh, dan kendala selama praktik di {student.companyName}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Cetak format laporan"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Cetak Jurnal</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#101D3A] hover:bg-[#1B2B4B] text-[#C5DFFF] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#101D3A]/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C5DFFF]" />
            <span>Tulis Jurnal Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3 no-print">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['Semua', 'Menunggu', 'Disetujui', 'Perlu Revisi'].map(status => {
              const isActive = selectedStatus === status;
              const count =
                status === 'Semua'
                  ? journals.length
                  : journals.filter(j => j.status === status).length;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#101D3A] text-white shadow-xs'
                      : 'bg-[#F5F7FB] text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#C5DFFF] text-[#101D3A]' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View toggle (cards vs table) */}
          <div className="hidden sm:flex items-center gap-1 bg-[#F5F7FB] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-[#101D3A]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Kartu
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-[#101D3A]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Tabel
            </button>
          </div>
        </div>

        {/* Search input & date filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul kegiatan, pekerjaan, atau keahlian..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F7FB] border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#101D3A]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F5F7FB] border border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#101D3A]"
              />
            </div>
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs"
                title="Hapus filter tanggal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Journal Content Area */}
      {filteredJournals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF3FF] text-[#101D3A] mx-auto flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-[#101D3A]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#101D3A]">
            Tidak ada jurnal ditemukan
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery || dateFilter || selectedStatus !== 'Semua'
              ? 'Tidak ada jurnal yang sesuai dengan kata kunci atau filter pencarian Anda.'
              : 'Anda belum mengisi jurnal kegiatan. Tulis aktivitas magang harian Anda sekarang.'}
          </p>
          {(searchQuery || dateFilter || selectedStatus !== 'Semua') ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('Semua');
                setDateFilter('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Reset Filter Pencarian
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl bg-[#101D3A] text-[#C5DFFF] text-xs font-bold hover:bg-[#1B2B4B]"
            >
              Tulis Jurnal Pertama
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Card Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJournals.map(journal => (
            <div
              key={journal.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Date & Status */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-[#101D3A]" />
                    <span>{journal.date}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 text-[11px] font-medium">
                      {journal.startTime} - {journal.endTime} WIB
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeClass(
                      journal.status
                    )}`}
                  >
                    {statusIcons[journal.status]}
                    <span>{journal.status}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-[#101D3A] leading-snug">
                  {journal.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {journal.description}
                </p>

                {/* Skills Learned Pill */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#F5F7FB] border border-slate-100">
                  <span className="text-[10px] font-bold text-[#101D3A] uppercase tracking-wider block mb-0.5">
                    Kompetensi / Ilmu Baru:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                    {journal.skillsLearned}
                  </p>
                </div>

                {/* Feedback note if exists */}
                {journal.feedback && (
                  <div
                    className={`mt-2.5 p-2.5 rounded-xl text-xs font-medium ${
                      journal.status === 'Perlu Revisi'
                        ? 'bg-[#FCE8E8] text-rose-900 border border-rose-200'
                        : 'bg-[#EAF3FF] text-[#101D3A] border border-[#C5DFFF]'
                    }`}
                  >
                    <span className="font-bold block text-[10px] uppercase">
                      Catatan Pembimbing ({journal.reviewedBy?.split(',')[0]}):
                    </span>
                    <span className="italic leading-snug">{journal.feedback}</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between no-print">
                <button
                  type="button"
                  onClick={() => setViewingJournal(journal)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#101D3A] hover:bg-[#EAF3FF] flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Detail</span>
                </button>

                <div className="flex items-center gap-1">
                  {/* Edit allowed if Menunggu or Perlu Revisi */}
                  {journal.status !== 'Disetujui' && (
                    <button
                      type="button"
                      onClick={() => openEditModal(journal)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-[#101D3A] hover:bg-[#EAF3FF] transition-colors"
                      title="Edit Jurnal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setDeletingId(journal.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-[#FCE8E8] transition-colors"
                    title="Hapus Jurnal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table Layout */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FB] text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Tanggal & Waktu</th>
                  <th className="py-3 px-4">Judul Kegiatan</th>
                  <th className="py-3 px-4">Uraian Pekerjaan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredJournals.map(journal => (
                  <tr key={journal.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#101D3A]">{journal.date}</div>
                      <div className="text-[11px] text-slate-400">
                        {journal.startTime} - {journal.endTime} WIB
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#101D3A] max-w-xs truncate">
                      {journal.title}
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <p className="line-clamp-2 text-slate-600">{journal.description}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeClass(
                          journal.status
                        )}`}
                      >
                        {statusIcons[journal.status]}
                        <span>{journal.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap no-print">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingJournal(journal)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#101D3A] hover:bg-[#EAF3FF]"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {journal.status !== 'Disetujui' && (
                          <button
                            type="button"
                            onClick={() => openEditModal(journal)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-[#101D3A] hover:bg-[#EAF3FF]"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeletingId(journal.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-[#FCE8E8]"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE & EDIT FORM MODAL */}
      {(isCreateOpen || editingJournal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
                  <BookOpen className="w-5 h-5 text-[#101D3A]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#101D3A]">
                    {editingJournal ? 'Edit Jurnal Aktivitas' : 'Tulis Jurnal Harian Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingJournal
                      ? 'Perbarui catatan pekerjaan atau revisi dari pembimbing'
                      : 'Isi detail pekerjaan harian Anda selama di tempat magang'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingJournal(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Date & Times */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                    Tanggal Kegiatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                  />
                  {formErrors.date && <p className="text-[11px] text-rose-600 mt-1">{formErrors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                    Jam Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                  />
                  {formErrors.startTime && <p className="text-[11px] text-rose-600 mt-1">{formErrors.startTime}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                    Jam Selesai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                  />
                  {formErrors.endTime && <p className="text-[11px] text-rose-600 mt-1">{formErrors.endTime}</p>}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                  Judul Kegiatan / Tugas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Pembuatan Modul Absensi & Slicing Desain Figma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                />
                {formErrors.title && <p className="text-[11px] text-rose-600 mt-1">{formErrors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                  Deskripsi Pekerjaan yang Dilakukan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Uraikan apa saja langkah kerja yang dikerjakan secara spesifik..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                />
                {formErrors.description && <p className="text-[11px] text-rose-600 mt-1">{formErrors.description}</p>}
              </div>

              {/* Skills Learned */}
              <div>
                <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                  Pengetahuan atau Keterampilan yang Diperoleh <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.skillsLearned}
                  onChange={e => setFormData({ ...formData, skillsLearned: e.target.value })}
                  placeholder="Contoh: Menguasai responsive design Tailwind CSS dan manajemen branch Git..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                />
                {formErrors.skillsLearned && <p className="text-[11px] text-rose-600 mt-1">{formErrors.skillsLearned}</p>}
              </div>

              {/* Obstacles & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                    Kendala yang Dihadapi (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.obstacles}
                    onChange={e => setFormData({ ...formData, obstacles: e.target.value })}
                    placeholder="Contoh: Sempat terjadi error CORS pada API"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101D3A] mb-1">
                    Catatan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Contoh: Rencana dilanjutkan besok pagi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#101D3A] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingJournal(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#101D3A] hover:bg-[#1B2B4B] text-[#C5DFFF] text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#C5DFFF]" />
                  <span>{editingJournal ? 'Simpan Perubahan' : 'Simpan Jurnal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {viewingJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${getBadgeClass(
                    viewingJournal.status
                  )}`}
                >
                  {statusIcons[viewingJournal.status]}
                  <span>{viewingJournal.status}</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">{viewingJournal.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewingJournal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div>
                <h3 className="text-lg font-bold text-[#101D3A]">{viewingJournal.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Waktu Pengerjaan: {viewingJournal.startTime} s/d {viewingJournal.endTime} WIB
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101D3A] mb-1.5">
                  Rincian Pekerjaan:
                </h4>
                <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {viewingJournal.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EAF3FF] border border-[#C5DFFF]/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101D3A] mb-1.5">
                  Pengetahuan & Keterampilan yang Diperoleh:
                </h4>
                <p className="text-xs leading-relaxed text-slate-800">
                  {viewingJournal.skillsLearned}
                </p>
              </div>

              {viewingJournal.obstacles && (
                <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-slate-100">
                  <h4 className="text-xs font-bold text-[#101D3A] mb-1">Kendala yang Dihadapi:</h4>
                  <p className="text-xs text-slate-600">{viewingJournal.obstacles}</p>
                </div>
              )}

              {viewingJournal.notes && (
                <div className="p-3.5 rounded-2xl bg-[#F5F7FB] border border-slate-100">
                  <h4 className="text-xs font-bold text-[#101D3A] mb-1">Catatan Tambahan:</h4>
                  <p className="text-xs text-slate-600">{viewingJournal.notes}</p>
                </div>
              )}

              {viewingJournal.feedback && (
                <div
                  className={`p-4 rounded-2xl border ${
                    viewingJournal.status === 'Perlu Revisi'
                      ? 'bg-[#FCE8E8] border-rose-200 text-rose-900'
                      : 'bg-[#DDF5E5] border-emerald-200 text-emerald-900'
                  }`}
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
                    Evaluasi Pembimbing ({viewingJournal.reviewedBy}):
                  </h4>
                  <p className="text-xs italic leading-relaxed">{viewingJournal.feedback}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Penulis: {student.name} ({student.nis})
              </span>
              <button
                type="button"
                onClick={() => setViewingJournal(null)}
                className="px-4 py-2 rounded-xl bg-[#101D3A] text-[#C5DFFF] text-xs font-bold hover:bg-[#1B2B4B]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FCE8E8] text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#101D3A]">Hapus Jurnal Aktivitas?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus jurnal ini? Data yang dihapus tidak dapat dipulihkan kembali.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteJournal(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              >
                Ya, Hapus Jurnal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
