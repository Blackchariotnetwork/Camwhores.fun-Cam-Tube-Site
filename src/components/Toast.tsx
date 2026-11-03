import React from 'react';
import { useTube } from '../context/TubeContext';
import { Check } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useTube();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 pointer-events-none animate-fadeIn">
      <div className="bg-white text-black border border-white px-4 py-2.5 shadow-2xl flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
        <Check className="w-3.5 h-3.5 stroke-[3]" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
