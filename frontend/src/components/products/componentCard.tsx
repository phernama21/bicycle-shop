import React, { useState } from 'react';
import OptionCard from './optionCard';
import { Component } from '@/models/component/domain/component';
import { Option } from '@/models/option/domain/option';

interface ComponentCardProps {
  component: Component;
  index: number;
  onComponentChange: (componentIndex: number, field: keyof Component, value: any) => void;
  onRemoveComponent: () => void;
  onAddOption: () => void;
  onOptionChange: (componentIndex: number, optionIndex: number, field: keyof Option, value: any) => void;
  onRemoveOption: (componentIndex: number, optionIndex: number) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  index,
  onComponentChange,
  onRemoveComponent,
  onAddOption,
  onOptionChange,
  onRemoveOption
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mr-2 text-indigo-600"
            aria-label={isCollapsed ? "Expand component" : "Collapse component"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
            value={component.name}
            onChange={(e) => onComponentChange(index, 'name', e.target.value)}
            className="text-lg font-medium p-1 border-0 border-b border-gray-300 focus:outline-none focus:border-indigo-600"
            placeholder={`Component ${index + 1}`}
          />
        </div>
        <button
          onClick={onRemoveComponent}
          className="text-red-700 hover:text-red-900"
          aria-label="Remove component"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={component.description ||''}
              onChange={(e) => onComponentChange(index, 'description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={2}
            />
            </div>
          
          
            <div className="mb-4">
                <label className="flex items-center">
                    <input
                    type="checkbox"
                    checked={component.required}
                    onChange={(e) => onComponentChange(index, 'required', e.target.checked)}
                    className="mr-2 w-5 h-5 rounded text-indigo-600 focus:ring-indigo-600 accent-indigo-600 cursor-pointer"
                    style={{ colorScheme: 'normal', accentColor: '#4f46e5' }}
                    />
                    <span className="text-sm font-medium">Required</span>
                </label>
            </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h4 className="text-md font-medium">Options</h4>
              </div>
              <button
                onClick={onAddOption}
                className="p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 flex items-center justify-center"
                aria-label="Add Option"
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
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
            
            {component.options.filter(opt => !opt._destroy).map((option, oIndex) => (
              <OptionCard
                key={option.id || `new-${oIndex}`}
                option={option}
                componentIndex={index}
                optionIndex={oIndex}
                onOptionChange={onOptionChange}
                onRemoveOption={onRemoveOption}
              />
            ))}
            
            {component.options.filter(opt => !opt._destroy).length === 0 && (
              <p className="text-gray-500 italic">No options added yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentCard;