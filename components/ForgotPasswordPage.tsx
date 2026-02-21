import React, { useState } from 'react';
import { sendPasswordResetLink } from '../services/authService';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendResetLink = async () => {
    setError('');
    setSuccess('');
    if (!email || !contact) {
        setError('Please enter both email and contact number.');
        return;
    }
    
    const response = await sendPasswordResetLink(email, contact);
    if (response.success) {
        setSuccess(response.message);
        setEmail('');
        setContact('');
    } else {
        setError(response.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-8">Enter your email to receive a reset link.</p>
        <form onSubmit={(e) => { e.preventDefault(); handleSendResetLink(); }}>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="email">Email Address</label>
            <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="contact">Contact Number</label>
            <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="contact" type="text" placeholder="Enter your contact number" value={contact} onChange={(e) => setContact(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-xs text-center mb-4">{success}</p>}
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300" type="submit">Send Reset Link</button>
          <div className="text-center mt-6">
            <Link to="/login" className="text-xs text-green-600 hover:underline">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
