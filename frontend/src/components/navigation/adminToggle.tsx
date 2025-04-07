'use client'

import { useNavigation } from '@/contexts/NavigationContext';
import { useUser } from '@/contexts/UserContext';
import { Bike, UserRoundCog } from 'lucide-react';

export const AdminToggle = () => {
  const { user } = useUser();
  const { viewMode, toggleViewMode } = useNavigation();
  
  if (!user?.isAdmin) return null;
  
  return (
    <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-white p-1 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <input type="checkbox" className="sr-only" checked={viewMode === "admin"} onChange={toggleViewMode} />
      <span
        className={`flex items-center space-x-[6px] rounded-md py-2 px-[18px] text-sm font-medium ${
          !(viewMode === "admin") ? "text-primary bg-[#f4f7ff]" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Bike />
        <span className="hidden md:inline">User View</span>
      </span>
      <span
        className={`flex items-center space-x-[6px] rounded-md py-2 px-[18px] text-sm font-medium ${
          viewMode === "admin" ? "text-white bg-indigo-600" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <UserRoundCog />
        <span className="hidden md:inline">Admin View</span>
      </span>
    </label>
  );
};