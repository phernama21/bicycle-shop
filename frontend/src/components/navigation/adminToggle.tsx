'use client'

import { useNavigation } from '@/contexts/NavigationContext';
import { useUser } from '@/contexts/UserContext';

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
        <svg width="16" height="16" viewBox="0 0 16 16" className="mr-[6px] fill-current">
          <path d="M8,1.5c-1.1,0-2,0.9-2,2c0,0.9,0.6,1.7,1.5,1.9v0.6H6.7c-0.3,0-0.5,0.2-0.6,0.4L5.3,8H4.5C4.2,8,4,8.2,4,8.5v1 C4,9.8,4.2,10,4.5,10h1C5.8,10,6,9.8,6,9.5v-1C6,8.2,5.8,8,5.5,8H5.7l0.6-1.5h0.7v0.8c0,0.2,0.1,0.3,0.3,0.4l2,0.8 c0.1,0,0.2,0.1,0.3,0c0.1,0,0.2-0.1,0.3-0.2l1-1.5c0.1-0.1,0.1-0.3,0.1-0.4c0-0.1-0.1-0.3-0.2-0.3L9.5,5.5V5.4 c0.9-0.2,1.5-1,1.5-1.9C11,2.4,10.1,1.5,8,1.5z M8,2.5c0.6,0,1,0.4,1,1S8.6,4.5,8,4.5S7,4.1,7,3.5S7.4,2.5,8,2.5z" />
          <path d="M12.5,8C11.1,8,10,9.1,10,10.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.9,8,12.5,8z M12.5,9c0.8,0,1.5,0.7,1.5,1.5 s-0.7,1.5-1.5,1.5S11,11.3,11,10.5S11.7,9,12.5,9z" />
          <path d="M3.5,8C2.1,8,1,9.1,1,10.5S2.1,13,3.5,13S6,11.9,6,10.5S4.9,8,3.5,8z M3.5,9C4.3,9,5,9.7,5,10.5S4.3,12,3.5,12 S2,11.3,2,10.5S2.7,9,3.5,9z" />
          <path d="M8,10c-0.8,0-1.5,0.7-1.5,1.5S7.2,13,8,13s1.5-0.7,1.5-1.5S8.8,10,8,10z M8,11c0.3,0,0.5,0.2,0.5,0.5S8.3,12,8,12 s-0.5-0.2-0.5-0.5S7.7,11,8,11z" />
          <path d="M8,2c-0.3,0-0.5,0.2-0.5,0.5v1C7.5,3.8,7.7,4,8,4s0.5-0.2,0.5-0.5v-1C8.5,2.2,8.3,2,8,2z" />
        </svg>
        User View
      </span>
      <span
        className={`flex items-center space-x-[6px] rounded-md py-2 px-[18px] text-sm font-medium ${
          viewMode === "admin" ? "text-white bg-indigo-600" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" className="mr-[6px] fill-current">
          <path
            d="M6.5,2.5C4.6,2.5,3,4.1,3,6c0,1.1,0.5,2.1,1.3,2.8C3.1,9.6,2.2,10.7,1.7,12l-0.3,0.9c-0.1,0.3,0,0.6,0.1,0.8
            c0.2,0.2,0.4,0.4,0.7,0.4h10.6c0.3,0,0.5-0.1,0.7-0.4c0.2-0.2,0.2-0.5,0.1-0.8L13.3,12c-0.6-1.6-1.8-2.8-3.7-2.9
            C10.3,8.3,10.9,7.2,10.9,6C10.9,4.1,9.3,2.5,6.5,2.5z M6.5,4c1.5,0,2.8,2.2,2.8,4.2C9.3,10.3,7.9,11,6.5,11S3.7,10.3,3.7,8.2
            C3.7,6.2,5,4,6.5,4z"
          />
          <path
            d="M12.9,5.9c0.5-0.3,0.9-0.9,0.9-1.5c0-1-0.8-1.7-1.7-1.7c-0.3,0-0.6,0.1-0.9,0.3c-0.2,0.6-0.4,1.2-0.7,1.8
            C11.4,4.9,12.3,5.3,12.9,5.9z"
          />
          <path
            d="M15.5,6.3c0-0.2-0.2-0.4-0.4-0.4h-0.7c-0.1-0.2-0.1-0.4-0.2-0.6l0.5-0.5c0.1-0.1,0.1-0.2,0.1-0.3s0-0.2-0.1-0.3l-0.9-0.9
            c-0.1-0.1-0.2-0.1-0.3-0.1c-0.1,0-0.2,0-0.3,0.1L13,3.8c-0.2-0.1-0.4-0.2-0.6-0.2V3c0-0.2-0.2-0.4-0.4-0.4h-1.3
            c-0.1,0-0.2,0,0.2,0.1c0.1,0.4,0.2,0.8,0.2,1.3c0,0.3,0,0.6-0.1,0.9c0.2-0.1,0.5-0.1,0.8-0.1c1.2,0,2.3,1,2.3,2.3
            c0,0.8-0.4,1.5-1,1.9c0.5,0.5,0.8,1.1,1,1.7c0,0,0.1,0,0.1,0c0.1,0,0.2,0,0.3-0.1l0.9-0.9c0.1-0.1,0.1-0.2,0.1-0.3
            s0-0.2-0.1-0.3L14,8.6c0.1-0.2,0.2-0.4,0.2-0.6h0.7c0.1,0,0.2,0,0.3-0.1c0.1-0.1,0.1-0.2,0.1-0.3L15.5,6.3z"
          />
        </svg>
        Admin View
      </span>
    </label>
    
    );
};