import CustomAlert from '@/components/ui/alert';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AlertType = 'success' | 'warning' | 'error';

interface AlertContextProps {
  showAlert: (type: AlertType, title: string, description?: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    type: 'success' as AlertType,
    title: '',
    description: ''
  });

  const showAlert = (type: AlertType, title: string, description?: string) => {
    setAlertData({ type, title, description: description || '' });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlert
        isOpen={isOpen}
        onClose={handleClose}
        type={alertData.type}
        title={alertData.title}
        description={alertData.description}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};