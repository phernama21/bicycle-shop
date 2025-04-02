'use client'

import { useNavigation } from '@/contexts/NavigationContext';
import { useUser } from '@/contexts/UserContext';

export const AdminToggle = () => {
  const { user } = useUser();
  const { viewMode, toggleViewMode } = useNavigation();
  
  if (!user?.isAdmin) return null;
  
  return (
    <>
      <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center'>
        <input
          type='checkbox'
          checked={viewMode === 'admin'}
          onChange={toggleViewMode}
          className='sr-only'
        />
        <span className='label flex items-center text-sm font-medium text-black'>
            Normal View
        </span>
        <span
          className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
            viewMode === 'admin' ? 'bg-[#212b36]' : 'bg-[#CCCCCE]'
          }`}
        >
          <span
            className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                viewMode === 'admin' ? 'translate-x-[28px]' : ''
            }`}
          ></span>
        </span>
        <span className='label flex items-center text-sm font-medium text-black'>
            Admin View
        </span>
      </label>
    </>
    );
};