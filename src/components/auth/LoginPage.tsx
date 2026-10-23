/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMagang } from '../../context/MagangContext';
import {
  GraduationCap,
  Eye,
  EyeOff,
  LogIn,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  BookCheck,
  ShieldCheck,
  X,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, student } = useMagang();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(credential, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const fillDemoAccount = () => {
    setCredential(student.nis); // '202410882'
    setPassword('siswa123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Background soft decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-[#EAF3FF] rounded-full blur-3xl opacity-70 -translate-y-24" />
        <div className="w-[400px] h-[400px] bg-[#C5DFFF]/30 rounded-full blur-3xl opacity-50 translate-x-48 translate-y-36" />
      </div>

      <div className="relative w-full max-w-md sm:max-w-lg z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#101D3A] text-[#C5DFFF] shadow-xl shadow-[#101D3A]/20 ring-4 ring-[#C5DFFF]/40 mb-4 transition-transform hover:scale-105 duration-300">
            <GraduationCap className="w-9 h-9" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#101D3A] tracking-tight">MagangKu</span>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#EAF3FF] text-[#1B2B4B] border border-[#C5DFFF]/60">
              PKL SISWA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#101D3A] mt-2">Selamat Datang di MagangKu</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Kelola kegiatan magangmu dengan lebih mudah.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#FCE8E8] border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#101D3A] uppercase tracking-wider mb-1.5">
                NIS atau Email Siswa
              </label>
              <input
                type="text"
                value={credential}
                onChange={e => setCredential(e.target.value)}
                placeholder="Contoh: 202410882 atau email siswa"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#101D3A] focus:border-transparent transition-all bg-[#F5F7FB]/50 text-slate-800 placeholder-slate-400"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#101D3A] uppercase tracking-wider">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-xs font-medium text-[#1B2B4B] hover:text-[#101D3A] hover:underline"
                >
                  Lupa sandi?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akunmu"
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#101D3A] focus:border-transparent transition-all bg-[#F5F7FB]/50 text-slate-800 placeholder-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#101D3A] hover:bg-[#1B2B4B] active:scale-[0.99] text-[#C5DFFF] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#101D3A]/25 transition-all mt-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#C5DFFF] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#C5DFFF]" />
                  <span>Masuk ke MagangKu</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Button */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full py-2.5 px-3 rounded-xl bg-[#EAF3FF] hover:bg-[#C5DFFF]/60 text-[#101D3A] text-xs font-semibold flex items-center justify-center gap-2 border border-[#C5DFFF] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#101D3A]" />
              <span>Gunakan Akun Demo Siswa (Andi Pratama - NIS: 202410882)</span>
            </button>
          </div>

          {/* Help link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#101D3A] transition-colors font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Butuh bantuan masuk atau belum punya akun?</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Footer */}
        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/50 shadow-xs">
            <BookCheck className="w-4 h-4 mx-auto text-[#101D3A] mb-1" />
            <p className="text-[11px] font-bold text-[#101D3A]">Jurnal Harian</p>
            <p className="text-[10px] text-slate-500">Catat rapi setiap hari</p>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/50 shadow-xs">
            <Building2 className="w-4 h-4 mx-auto text-[#101D3A] mb-1" />
            <p className="text-[11px] font-bold text-[#101D3A]">Absensi Digital</p>
            <p className="text-[10px] text-slate-500">Check-in & Pulang</p>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/50 shadow-xs">
            <ShieldCheck className="w-4 h-4 mx-auto text-[#101D3A] mb-1" />
            <p className="text-[11px] font-bold text-[#101D3A]">Progres PKL</p>
            <p className="text-[10px] text-slate-500">Pantau target & nilai</p>
          </div>
        </div>

        {/* Disclaimer about demo & future Firebase integration */}
        <p className="text-center text-[11px] text-slate-400 mt-6 leading-relaxed">
          Demo aplikasi PKL siswa SMA/SMK. Data tersimpan di memori browser lokal (localStorage).
        </p>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] flex items-center justify-center text-[#101D3A]">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#101D3A]">Bantuan Masuk MagangKu</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-[#F5F7FB]">
                <p className="font-bold text-[#101D3A] mb-1">1. Bagaimana cara mendapatkan akun?</p>
                <p className="leading-relaxed">
                  Akun MagangKu dibuatkan langsung oleh Guru Koordinator Hubungan Industri (Hubin) atau Pembimbing Sekolah. Gunakan NIS resmi sekolah Anda.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F7FB]">
                <p className="font-bold text-[#101D3A] mb-1">2. Lupa kata sandi?</p>
                <p className="leading-relaxed">
                  Untuk keamanan, reset kata sandi dilakukan melalui Guru Pembimbing PKL di sekolah Anda atau hubungi bagian tata usaha SMKN 1 Jakarta.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#EAF3FF] border border-[#C5DFFF]">
                <p className="font-bold text-[#101D3A] mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Akun Demo Untuk Uji Coba:</span>
                </p>
                <p className="text-[11px] text-slate-700">
                  NIS: <span className="font-mono font-bold text-[#101D3A]">202410882</span><br />
                  Password: <span className="font-mono font-bold text-[#101D3A]">siswa123</span> (atau klik tombol isi demo di halaman depan)
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowHelpModal(false);
                  fillDemoAccount();
                }}
                className="w-full py-2.5 rounded-xl bg-[#101D3A] text-[#C5DFFF] font-semibold text-xs hover:bg-[#1B2B4B] transition-colors"
              >
                Gunakan Akun Uji Coba Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
