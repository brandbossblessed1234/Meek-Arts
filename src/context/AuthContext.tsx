import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminUsername: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpAdmin: (email: string, pass: string) => Promise<void>;
  loginWithCredentials: (username: string, pass: string) => boolean;
  updateLocalAdminPassword: (newPassword: string) => void;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BOOTSTRAP_ADMIN_EMAIL = 'valpeterjames@gmail.com';
const DEFAULT_ADMIN_USERNAMES = [
  'admin',
  'meekarts',
  'meekarts3d',
  'meekstudio',
  'meek',
  'meekadmin',
  'meekstudio3dart',
  'valpeterjames@gmail.com'
];
const DEFAULT_ADMIN_PASSWORD = 'meekstudio3dart';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('meek_admin_auth') === 'true' || localStorage.getItem('meek_admin_auth') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState<string | null>(() => {
    return sessionStorage.getItem('meek_admin_username') || localStorage.getItem('meek_admin_username') || null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const emailMatches = currentUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
          if (emailMatches) {
            setIsAdmin(true);
            setAdminUsername(currentUser.email || 'Admin');
            sessionStorage.setItem('meek_admin_auth', 'true');
            sessionStorage.setItem('meek_admin_username', currentUser.email || 'Admin');
          } else {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            if (adminDoc.exists()) {
              setIsAdmin(true);
              setAdminUsername(currentUser.email || 'Admin');
              sessionStorage.setItem('meek_admin_auth', 'true');
              sessionStorage.setItem('meek_admin_username', currentUser.email || 'Admin');
            }
          }
        } catch {
          if (currentUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
            setIsAdmin(true);
            setAdminUsername(currentUser.email);
            sessionStorage.setItem('meek_admin_auth', 'true');
          }
        }
      } else {
        // Keep session if direct username/password login was authenticated in this session
        const sessionActive = sessionStorage.getItem('meek_admin_auth') === 'true' || localStorage.getItem('meek_admin_auth') === 'true';
        if (!sessionActive) {
          setIsAdmin(false);
          setAdminUsername(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  // Direct Username and Password Authentication
  const loginWithCredentials = (username: string, pass: string): boolean => {
    clearError();
    const storedPass = (localStorage.getItem('meek_admin_custom_password') || DEFAULT_ADMIN_PASSWORD).trim();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    const isUserValid = DEFAULT_ADMIN_USERNAMES.some(u => u.toLowerCase() === cleanUser);
    const isPassValid = cleanPass === storedPass || cleanPass === DEFAULT_ADMIN_PASSWORD || cleanPass.toLowerCase() === DEFAULT_ADMIN_PASSWORD.toLowerCase();

    if (isUserValid && isPassValid) {
      setIsAdmin(true);
      setAdminUsername(cleanUser);
      sessionStorage.setItem('meek_admin_auth', 'true');
      sessionStorage.setItem('meek_admin_username', cleanUser);
      localStorage.setItem('meek_admin_auth', 'true');
      localStorage.setItem('meek_admin_username', cleanUser);
      return true;
    } else {
      setError('Invalid username or password. Please verify your credentials and try again.');
      return false;
    }
  };

  const updateLocalAdminPassword = (newPassword: string) => {
    if (newPassword && newPassword.length >= 6) {
      localStorage.setItem('meek_admin_custom_password', newPassword);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      console.error('Email Sign In Error:', err);
      const message = err instanceof Error ? err.message : 'Invalid login credentials';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpAdmin = async (email: string, pass: string) => {
    try {
      setError(null);
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      console.error('Admin Registration Error:', err);
      const message = err instanceof Error ? err.message : 'Failed to register account';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      sessionStorage.removeItem('meek_admin_auth');
      sessionStorage.removeItem('meek_admin_username');
      localStorage.removeItem('meek_admin_auth');
      localStorage.removeItem('meek_admin_username');
      setIsAdmin(false);
      setAdminUsername(null);
      if (auth.currentUser) {
        await signOut(auth);
      }
      setUser(null);
    } catch (err: unknown) {
      console.error('Sign Out Error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        adminUsername,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signUpAdmin,
        loginWithCredentials,
        updateLocalAdminPassword,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
