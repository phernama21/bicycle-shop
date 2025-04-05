import React, { useState } from 'react';
import { Option } from '@/models/option/domain/option';
interface OptionCardProps {
  option: Option;
  componentIndex: number;
  optionIndex: number;
  onOptionChange: (componentIndex: number, optionIndex: number, field: keyof Option, value: any) => void;
  onRemoveOption: (componentIndex: number, optionIndex: number) => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  componentIndex,
  optionIndex,
  onOptionChange,
  onRemoveOption
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="border border-gray-200 shadow p-4 rounded mb-3">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mr-2 text-indigo-600"
            aria-label={isCollapsed ? "Expand option" : "Collapse option"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isCollapsed ? (
                <polyline points="6 9 12 15 18 9" />
              ) : (
                <polyline points="18 15 12 9 6 15" />
              )}
            </svg>
          </button>
          <input
            type="text"
            value={option.name}
            onChange={(e) => onOptionChange(componentIndex, optionIndex, 'name', e.target.value)}
            className="font-medium p-1 border-0 border-b border-gray-300 focus:outline-none focus:border-indigo-600"
            placeholder={`Option ${optionIndex + 1}`}
          />
        </div>
        <button
          onClick={() => onRemoveOption(componentIndex, optionIndex)}
          className="text-red-700 hover:text-red-900"
          aria-label="Remove option"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
      
      {!isCollapsed && (
        <>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={option.description}
              onChange={(e) => onOptionChange(componentIndex, optionIndex, 'description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Base Price</label>
            <input
              type="number"
              value={option.basePrice}
              onChange={(e) => onOptionChange(componentIndex, optionIndex, 'basePrice', e.target.value)}
              className="w-1/3 p-2 border border-gray-300 rounded"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={option.inStock}
                onChange={(e) => onOptionChange(componentIndex, optionIndex, 'inStock', e.target.checked)}
                className="mr-2 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-600 accent-indigo-600 cursor-pointer"
                style={{ colorScheme: 'normal', accentColor: '#4f46e5' }}
              />
              <span className="text-sm font-medium">In Stock</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default OptionCard;