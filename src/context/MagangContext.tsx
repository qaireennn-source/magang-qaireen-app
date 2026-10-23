/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  JournalEntry,
  AttendanceRecord,
  ScheduleItem,
  TargetProgress,
  Announcement,
  AppNotification,
  ActivePage,
  AttendanceStatus,
  TargetStatus,
} from '../types';
import {
  INITIAL_STUDENT,
  INITIAL_JOURNALS,
  INITIAL_ATTENDANCE,
  INITIAL_SCHEDULE,
  INITIAL_TARGETS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const STORAGE_KEY = 'magangku_storage_v1';
const AUTH_KEY = 'magangku_auth_v1';

interface MagangStats {
  totalRequiredDays: number;
  completedDays: number;
  progressPercentage: number;
  totalJournals: number;
  approvedJournals: number;
  pendingJournals: number;
  revisionJournals: number;
  attendanceRate: number;
  countHadir: number;
  countIzin: number;
  countSakit: number;
  countTerlambat: number;
  completedTargets: number;
  totalTargets: number;
  todayAttendance?: AttendanceRecord;
}

interface MagangContextType {
  student: StudentProfile;
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  schedule: ScheduleItem[];
  targets: TargetProgress[];
  announcements: Announcement[];
  notifications: AppNotification[];
  isAuthenticated: boolean;
  activePage: ActivePage;
  stats: MagangStats;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  setActivePage: (page: ActivePage) => void;
  login: (credential: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  addJournal: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'status'>) => void;
  updateJournal: (id: string, updated: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  checkInToday: (notes?: string, status?: AttendanceStatus) => { success: boolean; message: string };
  checkOutToday: () => { success: boolean; message: string };
  recordAttendanceManual: (data: Omit<AttendanceRecord, 'id'>) => { success: boolean; message: string };
  updateProfile: (profile: Partial<StudentProfile>) => void;
  updateTargetStatus: (id: string, status: TargetStatus) => void;
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  deleteScheduleItem: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDemoData: () => void;
}

const MagangContext = createContext<MagangContextType | undefined>(undefined);

export const MagangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : true; // default logged in for easy test demo
    } catch {
      return true;
    }
  });

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Core application state
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_JOURNALS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [targets, setTargets] = useState<TargetProgress[]>(INITIAL_TARGETS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.student) setStudent(parsed.student);
        if (parsed.journals) setJournals(parsed.journals);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.schedule) setSchedule(parsed.schedule);
        if (parsed.targets) setTargets(parsed.targets);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch (e) {
      console.error('Failed to load local storage data', e);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          student,
          journals,
          attendance,
          schedule,
          targets,
          announcements,
          notifications,
        })
      );
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [student, journals, attendance, schedule, targets, announcements, notifications]);

  // Save auth state
  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(isAuthenticated));
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  }, [isAuthenticated]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const login = (credential: string, pass: string) => {
    const trimmedCred = credential.trim();
    if (!trimmedCred) {
      return { success: false, message: 'Harap masukkan NIS atau email siswa.' };
    }
    if (!pass) {
      return { success: false, message: 'Harap masukkan kata sandi.' };
    }

    // Demo allows: 202410882, andi.pratama@siswa.smkn1jkt.sch.id, or any test credentials
    if (
      trimmedCred === '202410882' ||
      trimmedCred.toLowerCase() === student.email.toLowerCase() ||
      trimmedCred.toLowerCase().includes('andi') ||
      trimmedCred === 'siswa'
    ) {
      setIsAuthenticated(true);
      setActivePage('dashboard');
      showToast(`Selamat datang kembali, ${student.name}!`, 'success');
      return { success: true, message: 'Login berhasil' };
    }

    // Allow user-entered credentials for custom testing as well
    setIsAuthenticated(true);
    setActivePage('dashboard');
    showToast(`Masuk sebagai ${trimmedCred}`, 'success');
    return { success: true, message: 'Login berhasil' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Anda telah keluar dari akun MagangKu.', 'info');
  };

  // Journal handlers
  const addJournal = (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'status'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `jrn-${Date.now()}`,
      status: 'Menunggu',
      createdAt: new Date().toISOString(),
    };
    setJournals(prev => [newEntry, ...prev]);
    showToast('Jurnal harian berhasil disimpan dan menunggu verifikasi pembimbing!', 'success');
  };

  const updateJournal = (id: string, updated: Partial<JournalEntry>) => {
    setJournals(prev =>
      prev.map(j => {
        if (j.id === id) {
          // If editing a revision, reset status to Menunggu
          const newStatus = j.status === 'Perlu Revisi' ? 'Menunggu' : j.status;
          return { ...j, ...updated, status: newStatus };
        }
        return j;
      })
    );
    showToast('Jurnal harian berhasil diperbarui!', 'success');
  };

  const deleteJournal = (id: string) => {
    setJournals(prev => prev.filter(j => j.id !== id));
    showToast('Jurnal harian berhasil dihapus.', 'info');
  };

  // Attendance handlers
  const getTodayDateStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTodayDayName = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date().getDay()];
  };

  const checkInToday = (notes?: string, status: AttendanceStatus = 'Hadir') => {
    const todayStr = getTodayDateStr();
    const existing = attendance.find(a => a.date === todayStr);

    if (existing && existing.checkInTime) {
      return {
        success: false,
        message: `Anda sudah melakukan Absen Masuk hari ini pada pukul ${existing.checkInTime} WIB. Absensi ganda tidak diperbolehkan.`,
      };
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 15);

    if (existing) {
      setAttendance(prev =>
        prev.map(a =>
          a.date === todayStr
            ? {
                ...a,
                checkInTime: timeStr,
                status,
                isLate,
                notes: notes || a.notes || 'Hadir mandiri di tempat magang.',
              }
            : a
        )
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: todayStr,
        dayName: getTodayDayName(),
        checkInTime: timeStr,
        checkOutTime: null,
        status,
        isLate,
        notes: notes || (isLate ? 'Hadir (Terlambat melewati toleransi 08:15 WIB)' : 'Hadir tepat waktu.'),
      };
      setAttendance(prev => [newRecord, ...prev]);
    }

    showToast(`Absen Masuk berhasil dicatat pukul ${timeStr} WIB. Semangat beraktivitas!`, 'success');
    return { success: true, message: 'Check-in berhasil' };
  };

  const checkOutToday = () => {
    const todayStr = getTodayDateStr();
    const existing = attendance.find(a => a.date === todayStr);

    if (!existing || !existing.checkInTime) {
      return {
        success: false,
        message: 'Anda belum melakukan Absen Masuk hari ini. Harap check-in terlebih dahulu.',
      };
    }

    if (existing.checkOutTime) {
      return {
        success: false,
        message: `Anda sudah melakukan Absen Pulang hari ini pada pukul ${existing.checkOutTime} WIB.`,
      };
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setAttendance(prev =>
      prev.map(a => (a.date === todayStr ? { ...a, checkOutTime: timeStr } : a))
    );

    showToast(`Absen Pulang berhasil dicatat pukul ${timeStr} WIB. Selamat beristirahat!`, 'success');
    return { success: true, message: 'Check-out berhasil' };
  };

  const recordAttendanceManual = (data: Omit<AttendanceRecord, 'id'>) => {
    const existing = attendance.find(a => a.date === data.date);
    if (existing) {
      setAttendance(prev => prev.map(a => (a.date === data.date ? { ...a, ...data } : a)));
      showToast(`Data absensi tanggal ${data.date} berhasil diperbarui.`, 'success');
    } else {
      const newRecord: AttendanceRecord = {
        ...data,
        id: `att-${Date.now()}`,
      };
      setAttendance(prev => [newRecord, ...prev]);
      showToast(`Pengajuan absensi ${data.status} berhasil disimpan.`, 'success');
    }
    return { success: true, message: 'Berhasil' };
  };

  const updateProfile = (updatedProfile: Partial<StudentProfile>) => {
    setStudent(prev => ({ ...prev, ...updatedProfile }));
    showToast('Informasi profil siswa berhasil disimpan!', 'success');
  };

  const updateTargetStatus = (id: string, status: TargetStatus) => {
    setTargets(prev =>
      prev.map(t => {
        if (t.id === id) {
          const completedDate = status === 'Selesai' ? getTodayDateStr() : undefined;
          return { ...t, status, completedDate };
        }
        return t;
      })
    );
    showToast(`Status target kompetensi diperbarui menjadi "${status}".`, 'success');
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `sch-${Date.now()}`,
    };
    setSchedule(prev => [...prev, newItem]);
    showToast('Jadwal baru berhasil ditambahkan.', 'success');
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
    showToast('Jadwal berhasil dihapus.', 'info');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Semua notifikasi ditandai telah dibaca.', 'info');
  };

  const resetToDemoData = () => {
    setStudent(INITIAL_STUDENT);
    setJournals(INITIAL_JOURNALS);
    setAttendance(INITIAL_ATTENDANCE);
    setSchedule(INITIAL_SCHEDULE);
    setTargets(INITIAL_TARGETS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Data berhasil dikembalikan ke data awal demo.', 'info');
  };

  // Calculate statistics
  const todayStr = getTodayDateStr();
  const todayAttendance = attendance.find(a => a.date === todayStr);

  const totalRequiredDays = student.totalRequiredDays || 60;
  // Completed days: count of Hadir records + base offset for realistic 3-month demo (e.g. 42 days)
  const countHadir = attendance.filter(a => a.status === 'Hadir').length;
  const countIzin = attendance.filter(a => a.status === 'Izin').length;
  const countSakit = attendance.filter(a => a.status === 'Sakit').length;
  const countTerlambat = attendance.filter(a => a.isLate).length;

  // Let's make completed days realistic: base 34 historical days + count of present records in dataset
  const completedDays = Math.min(totalRequiredDays, 34 + countHadir);
  const progressPercentage = Math.round((completedDays / totalRequiredDays) * 100);

  const totalJournals = journals.length;
  const approvedJournals = journals.filter(j => j.status === 'Disetujui').length;
  const pendingJournals = journals.filter(j => j.status === 'Menunggu').length;
  const revisionJournals = journals.filter(j => j.status === 'Perlu Revisi').length;

  const totalRecordedDays = countHadir + countIzin + countSakit;
  const attendanceRate = totalRecordedDays > 0 ? Math.round((countHadir / totalRecordedDays) * 100) : 100;

  const completedTargets = targets.filter(t => t.status === 'Selesai').length;
  const totalTargets = targets.length;

  const stats: MagangStats = {
    totalRequiredDays,
    completedDays,
    progressPercentage,
    totalJournals,
    approvedJournals,
    pendingJournals,
    revisionJournals,
    attendanceRate,
    countHadir,
    countIzin,
    countSakit,
    countTerlambat,
    completedTargets,
    totalTargets,
    todayAttendance,
  };

  return (
    <MagangContext.Provider
      value={{
        student,
        journals,
        attendance,
        schedule,
        targets,
        announcements,
        notifications,
        isAuthenticated,
        activePage,
        stats,
        toastMessage,
        setActivePage,
        login,
        logout,
        showToast,
        addJournal,
        updateJournal,
        deleteJournal,
        checkInToday,
        checkOutToday,
        recordAttendanceManual,
        updateProfile,
        updateTargetStatus,
        addScheduleItem,
        deleteScheduleItem,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDemoData,
      }}
    >
      {children}
    </MagangContext.Provider>
  );
};

export const useMagang = (): MagangContextType => {
  const context = useContext(MagangContext);
  if (!context) {
    throw new Error('useMagang must be used within a MagangProvider');
  }
  return context;
};
