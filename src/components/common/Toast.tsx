/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMagang } from '../../context/MagangContext';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useMagang();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#101D3A] shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-slate-800 shadow-xl shadow-emerald-900/10',
    error: 'bg-white border-rose-200 text-slate-800 shadow-xl shadow-rose-900/10',
    info: 'bg-white border-blue-200 text-slate-800 shadow-xl shadow-blue-900/10',
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm sm:max-w-md w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${bgStyles[toastMessage.type]}`}>
        {icons[toastMessage.type]}
        <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
          {toastMessage.text}
        </div>
      </div>
    </div>
  );
};
