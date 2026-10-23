/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMagang } from '../../context/MagangContext';
import {
  User,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  CheckCircle2,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { student, updateProfile, resetToDemoData, stats } = useMagang();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name,
    nis: student.nis,
    grade: student.grade,
    major: student.major,
    school: student.school,
    email: student.email,
    phone: student.phone,
    companyName: student.companyName,
    companyAddress: student.companyAddress,
    mentorSchool: student.mentorSchool,
    mentorSchoolPhone: student.mentorSchoolPhone,
    mentorCompany: student.mentorCompany,
    mentorCompanyPosition: student.mentorCompanyPosition,
    periodStart: student.periodStart,
    periodEnd: student.periodEnd,
    totalRequiredDays: student.totalRequiredDays,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Nama lengkap wajib diisi.';
    if (!formData.nis.trim()) errs.nis = 'NIS wajib diisi.';
    if (!formData.school.trim()) errs.school = 'Nama sekolah wajib diisi.';
    if (!formData.companyName.trim()) errs.companyName = 'Tempat magang wajib diisi.';
    if (!formData.mentorSchool.trim()) errs.mentorSchool = 'Guru pembimbing wajib diisi.';
    if (!formData.mentorCompany.trim()) errs.mentorCompany = 'Pembimbing lapangan wajib diisi.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: student.name,
      nis: student.nis,
      grade: student.grade,
      major: student.major,
      school: student.school,
      email: student.email,
      phone: student.phone,
      companyName: student.companyName,
      companyAddress: student.companyAddress,
      mentorSchool: student.mentorSchool,
      mentorSchoolPhone: student.mentorSchoolPhone,
      mentorCompany: student.mentorCompany,
      mentorCompanyPosition: student.mentorCompanyPosition,
      periodStart: student.periodStart,
      periodEnd: student.periodEnd,
      totalRequiredDays: student.totalRequiredDays,
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#101D3A] px-2.5 py-0.5 rounded-full bg-[#EAF3FF]">
              Biodata & Informasi Peserta
            </span>
            <span className="text-xs text-slate-400">• Terdaftar Resmi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#101D3A] tracking-tight">
            Profil Siswa Magang
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Informasi identitas siswa, sekolah asal, tempat magang industri, dan kontak guru pembimbing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Cetak Kartu Siswa</span>
          </button>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 rounded-xl bg-[#101D3A] hover:bg-[#1B2B4B] text-[#C5DFFF] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4 text-[#C5DFFF]" />
              <span>Edit Profil</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Identity Card & Avatar */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs text-center">
            <div className="relative inline-block mx-auto mb-4">
              <div className="w-24 h-24 rounded-3xl bg-[#101D3A] text-[#C5DFFF] text-4xl font-extrabold flex items-center justify-center ring-4 ring-[#C5DFFF]/60 shadow-lg mx-auto">
                {student.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-[#101D3A]">{student.name}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">NIS: {student.nis}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3FF] text-[#101D3A]">
              {student.grade}
            </span>

            <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-left">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Jurusan:</span>
                <span className="font-semibold text-slate-800">{student.major}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Sekolah:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                  {student.school}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Total Selesai:</span>
                <span className="font-semibold text-emerald-700">
                  {stats.completedDays} / {student.totalRequiredDays} Hari
                </span>
              </div>
            </div>
          </div>

          {/* Reset Demo Data & Info Card */}
          <div className="bg-[#F5F7FB] rounded-3xl p-5 border border-slate-200/80 no-print space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#101D3A]" />
              <h4 className="text-xs font-bold text-[#101D3A]">Demo Mode & Sinkronisasi</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seluruh data jurnal, presensi, target, dan profil tersimpan otomatis di penyimpanan lokal (localStorage) browser Anda.
            </p>
            <button
              type="button"
              onClick={resetToDemoData}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Pulihkan Data Demo Awal</span>
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Editable Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-6">
            {/* Section 1: Data Pribadi Siswa */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <User className="w-4 h-4 text-[#101D3A]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#101D3A] uppercase tracking-wider">
                  1. Data Diri Siswa & Sekolah
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Nomor Induk Siswa (NIS)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.nis}
                    onChange={e => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                  {errors.nis && <p className="text-[11px] text-rose-600 mt-1">{errors.nis}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kelas</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Jurusan / Kompetensi Keahlian</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.major}
                    onChange={e => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Sekolah</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.school}
                    onChange={e => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                  {errors.school && <p className="text-[11px] text-rose-600 mt-1">{errors.school}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Siswa</label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">No. WhatsApp / Telepon</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Data Perusahaan Tempat Magang */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-[#101D3A]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#101D3A] uppercase tracking-wider">
                  2. Tempat Magang / DU/DI
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Nama Perusahaan / Instansi Magang
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700 font-semibold"
                  />
                  {errors.companyName && <p className="text-[11px] text-rose-600 mt-1">{errors.companyName}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Alamat Lengkap Perusahaan
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={formData.companyAddress}
                    onChange={e => setFormData({ ...formData, companyAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Periode Mulai</label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={formData.periodStart}
                    onChange={e => setFormData({ ...formData, periodStart: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Periode Selesai</label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={formData.periodEnd}
                    onChange={e => setFormData({ ...formData, periodEnd: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Data Pembimbing */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <Briefcase className="w-4 h-4 text-[#101D3A]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#101D3A] uppercase tracking-wider">
                  3. Guru & Pembimbing Lapangan
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Guru Pembimbing Sekolah
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.mentorSchool}
                    onChange={e => setFormData({ ...formData, mentorSchool: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                  {errors.mentorSchool && <p className="text-[11px] text-rose-600 mt-1">{errors.mentorSchool}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    No. Kontak Guru Pembimbing
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.mentorSchoolPhone}
                    onChange={e => setFormData({ ...formData, mentorSchoolPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Pembimbing Lapangan (Industri)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.mentorCompany}
                    onChange={e => setFormData({ ...formData, mentorCompany: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                  {errors.mentorCompany && <p className="text-[11px] text-rose-600 mt-1">{errors.mentorCompany}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Jabatan Pembimbing Lapangan
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.mentorCompanyPosition}
                    onChange={e => setFormData({ ...formData, mentorCompanyPosition: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#101D3A] disabled:bg-[#F5F7FB] disabled:text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Bottom action when editing */}
            {isEditing && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#101D3A] hover:bg-[#1B2B4B] text-[#C5DFFF] text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4 text-[#C5DFFF]" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
