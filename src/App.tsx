/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MagangProvider, useMagang } from './context/MagangContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Toast } from './components/common/Toast';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { JournalPage } from './components/journal/JournalPage';
import { AttendancePage } from './components/attendance/AttendancePage';
import { SchedulePage } from './components/schedule/SchedulePage';
import { ProgressPage } from './components/progress/ProgressPage';
import { ProfilePage } from './components/profile/ProfilePage';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activePage } = useMagang();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Toast />
        <LoginPage />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'jurnal':
        return <JournalPage />;
      case 'absensi':
        return <AttendancePage />;
      case 'jadwal':
        return <SchedulePage />;
      case 'progres':
        return <ProgressPage />;
      case 'profil':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col md:flex-row text-slate-800">
      <Toast />

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
        {/* Top Navbar */}
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic Page Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Sticky Bottom Nav */}
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <MagangProvider>
      <MainLayout />
    </MagangProvider>
  );
}
