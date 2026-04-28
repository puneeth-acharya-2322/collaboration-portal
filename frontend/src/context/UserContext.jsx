import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('preview_role') || 'public');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('faculty_token') || null);

  // Sync role to localStorage for persistence during development
  useEffect(() => {
    localStorage.setItem('preview_role', role);
  }, [role]);

  // Mock profile data for Anitha Rao when role is user/faculty
  useEffect(() => {
    if (['user', 'faculty', 'admin'].includes(role)) {
      setUser({
        name: 'Dr. Anitha Rao',
        id: 'FYRC-2401-92',
        initials: 'AR',
        role: 'Assistant Professor',
        department: 'Department of AI in Healthcare'
      });
    } else {
      setUser(null);
    }
  }, [role]);

  return (
    <UserContext.Provider value={{ role, setRole, user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
