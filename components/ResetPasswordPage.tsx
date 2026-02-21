import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { resetPasswordForLoggedInUser } from '@/services/authService';
import { Link } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async () => {
    if (!user || !user.username) {
        setError('You must be logged in to reset your password.');
        return;
    }
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    const response = await resetPasswordForLoggedInUser(user.username, currentPassword, newPassword);
    if (response.success) {
        setSuccess(response.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } else {
        setError(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Reset Password</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="current-password">Current Password</label>
            <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="current-password" type="password" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="new-password">New Password</label>
            <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="new-password" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="confirm-password">Confirm Password</label>
            <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="confirm-password" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-xs text-center mb-4">{success}</p>}
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300" type="submit">Reset Password</button>
          <div className="text-center mt-6">
            <Link to="/login" className="text-xs text-green-600 hover:underline">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
