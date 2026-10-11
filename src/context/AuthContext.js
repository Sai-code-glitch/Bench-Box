// Customer profile.
// There is no login server yet, so this keeps the customer's details on the
// device and pre-fills checkout. A real sign-in can replace it later without
// changing the screens that use `useContext(AuthContext)`.
import React, { createContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const STORAGE_KEY = 'USER_INFO';
const EMPTY = { name: '', email: '', address: '' };

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(EMPTY);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => saved && setProfile({ ...EMPTY, ...JSON.parse(saved) }))
      .catch((error) => console.error('Error loading profile:', error));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      saveProfile: async (next) => {
        const clean = { ...EMPTY, ...next };
        setProfile(clean);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      },
    }),
    [profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
