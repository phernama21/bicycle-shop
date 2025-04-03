"use client";

import React from 'react';

interface SwitchProps {
  isChecked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ isChecked, onChange, disabled = false }) => {
  return (
    <label className={`themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={onChange}
        disabled={disabled}
        className='sr-only'
      />
      <span
        className={`slider mx-4 flex h-6 w-[48px] items-center rounded-full p-1 duration-200 ${
          isChecked ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`dot h-4 w-4 rounded-full bg-white duration-200 ${
            isChecked ? 'translate-x-[24px]' : ''
          }`}
        ></span>
      </span>
    </label>
  );
};

export default Switch;
