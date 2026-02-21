
import React, { useState, createContext, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import { User } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NewRegistrationForm from './components/NewRegistrationForm';
import RegistrationList from './components/RegistrationList';
import RegistrationDetails from './components/RegistrationDetails';
import GeminiAssistant from './components/GeminiAssistant';
import SplashScreen from './components/SplashScreen';
import AdminLayout from './components/admin/AdminLayout';
import UserManagement from './components/admin/UserManagement';
import CreateUserPage from './components/admin/CreateUserPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import ProfilePage from './components/ProfilePage';
import CreateAccountPage from './components/CreateAccountPage';

export const AuthContext = createContext<{ user: User | null; login: (user: User) => void; logout: () => void; }>({ user: null, login: () => {}, logout: () => {} });

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate initial app loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const authContextValue = useMemo(() => ({
    user,
    login: (loggedInUser: User) => {
      setIsLoading(true);
      setTimeout(() => {
        setUser(loggedInUser);
        setIsLoading(false);
      }, 1000);
    },
    logout: () => {
      setUser(null);
    },
  }), [user]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!user) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="*" element={<Navigate to="/login" state={{ from: location }} replace />} />
        </Routes>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="flex h-screen bg-gray-50 text-gray-800">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-registration" element={<NewRegistrationForm />} />
              <Route path="/registrations" element={<RegistrationList />} />
              <Route path="/registrations/:id" element={<RegistrationDetails />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="user-management" replace />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="create-user" element={<CreateUserPage />} />
              </Route>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
        <GeminiAssistant />
      </div>
    </AuthContext.Provider>
  );
};

export default App;
