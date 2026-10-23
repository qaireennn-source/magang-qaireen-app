/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type JournalStatus = 'Menunggu' | 'Disetujui' | 'Perlu Revisi';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  title: string;
  description: string;
  skillsLearned: string;
  obstacles?: string;
  notes?: string;
  status: JournalStatus;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Tidak Hadir';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // 'Senin', 'Selasa', etc.
  checkInTime: string | null; // HH:MM
  checkOutTime: string | null; // HH:MM
  status: AttendanceStatus;
  notes?: string;
  isLate?: boolean;
}

export interface ScheduleItem {
  id: string;
  dayName: string; // 'Senin', 'Selasa', etc.
  date?: string; // Optional specific date YYYY-MM-DD
  timeRange: string; // e.g. "08:00 - 12:00"
  title: string;
  location: string;
  mentor: string;
  notes?: string;
  isToday?: boolean;
}

export type TargetStatus = 'Belum Dimulai' | 'Sedang Berjalan' | 'Selesai';

export interface TargetProgress {
  id: string;
  title: string;
  category: string;
  description: string;
  dueDate: string;
  status: TargetStatus;
  completedDate?: string;
}

export interface StudentProfile {
  id: string;
  nis: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  major: string;
  companyName: string;
  companyAddress: string;
  mentorSchool: string;
  mentorSchoolPhone: string;
  mentorCompany: string;
  mentorCompanyPosition: string;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD
  totalRequiredDays: number;
  avatarUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  sender: string;
  role: 'Guru Pembimbing' | 'Pembimbing Lapangan' | 'Admin Sekolah';
  date: string;
  content: string;
  isImportant?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

export type ActivePage = 
  | 'dashboard'
  | 'jurnal'
  | 'absensi'
  | 'jadwal'
  | 'progres'
  | 'profil';
