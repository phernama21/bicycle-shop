import React, { useState, useEffect } from 'react';

interface CustomAlertProps {
  type: 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  type,
  title,
  description,
  isOpen,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    
    let timer: NodeJS.Timeout;
    if (isOpen && autoClose) {
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const alertConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      iconColor: 'text-green-500',
      iconBgColor: 'bg-green-100',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      iconColor: 'text-yellow-500',
      iconBgColor: 'bg-yellow-100',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      iconColor: 'text-red-500',
      iconBgColor: 'bg-red-100',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  };

  const config = alertConfig[type];

  return (
    <div 
      className={`fixed top-4 right-4 w-96 max-w-full z-50 transition-all duration-300 ease-in-out transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`rounded-md p-4 border-l-4 ${config.bgColor} ${config.borderColor} shadow-md`}>
        <div className="flex">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <div className={`p-1 rounded-full ${config.iconBgColor}`}>
              {config.icon}
            </div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${config.titleColor}`}>{title}</h3>
            {description && (
              <div className={`mt-2 text-sm ${config.textColor}`}>
                <p>{description}</p>
              </div>
            )}
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className={`inline-flex rounded-md p-1.5 ${config.textColor} ${config.bgColor} hover:${config.iconBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${config.borderColor}`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;