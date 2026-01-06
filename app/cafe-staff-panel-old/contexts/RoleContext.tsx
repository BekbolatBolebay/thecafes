import React, { createContext, ReactNode, useContext, useState } from 'react';

type Role = 'Админ' | 'Қабылдаушы' | 'Курьер' | null;

interface RoleContextType {
  role: Role;
  userName: string;
  setRole: (role: Role) => void;
  setUserName: (name: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [userName, setUserName] = useState<string>('');

  return (
    <RoleContext.Provider value={{ role, userName, setRole, setUserName }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};