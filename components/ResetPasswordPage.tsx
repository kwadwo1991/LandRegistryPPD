import React from 'react';
import { Link } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Reset Password</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="new-password">New Password</label>
            <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="new-password" type="password" placeholder="Enter new password" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="confirm-password">Confirm Password</label>
            <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="confirm-password" type="password" placeholder="Confirm new password" />
          </div>
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
