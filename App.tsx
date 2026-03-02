import React, { useState, useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/LoginPage';
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
import EditRegistrationForm from './components/admin/EditRegistrationForm';
import AdminDashboard from './components/admin/AdminDashboard';
import { Permission, UserRole } from './types';

export const hasPermission = (user: { role: UserRole } | null, permission: Permission): boolean => {
  if (!user) return false;
  
  const rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.Admin]: [
      Permission.CreateRegistration,
      Permission.EditRegistration,
      Permission.DeleteRegistration,
      Permission.ReviewRegistration,
      Permission.ManageUsers,
      Permission.ViewReports,
    ],
    [UserRole.Head]: [
      Permission.CreateRegistration,
      Permission.EditRegistration,
      Permission.ReviewRegistration,
      Permission.ViewReports,
    ],
    [UserRole.DateEntryOfficer]: [
      Permission.CreateRegistration,
      Permission.EditRegistration,
    ],
    [UserRole.Secretary]: [
      Permission.CreateRegistration,
      Permission.ViewReports,
    ],
    [UserRole.Staff]: [
      Permission.CreateRegistration,
    ],
  };

  return rolePermissions[user.role]?.includes(permission) || false;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate initial app loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="*" element={<Navigate to="/login" state={{ from: location }} replace />} />
      </Routes>
    );
  }

  return (
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
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="create-user" element={<CreateUserPage />} />
              <Route path="edit-registration/:id" element={<EditRegistrationForm />} />
            </Route>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <GeminiAssistant />
    </div>
  );
};

export default App;
