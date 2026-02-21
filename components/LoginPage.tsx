import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as authService from '../services/authService';
import { UserRole } from '../types';
import classnames from 'classnames';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Admin');
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(UserRole.Head);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError('');
    const isStaff = activeTab === 'Staff';
    const credentials = isStaff ? role : password;
    const user = await authService.login(username, credentials, isStaff);
    if (user) {
      login(user);
    } else {
      setError('Invalid credentials');
    }
  };

  const GhanaCoatOfArms: React.FC = () => (
    <svg width="80" height="80" viewBox="0 0 200 200" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
        <g>
            <rect width="200" height="200" fill="#f0f0f0" visibility="hidden"/>
            <path d="M100 20 L160 50 L160 110 Q100 180, 40 110 L40 50 Z" fill="#ffffff" stroke="#000000" strokeWidth="3"/>
            <rect x="45" y="55" width="110" height="50" fill="#2d6a4f"/>
            <line x1="100" y1="55" x2="100" y2="105" stroke="#ffd700" strokeWidth="3"/>
            <line x1="45" y1="80" x2="160" y2="80" stroke="#ffd700" strokeWidth="3"/>
            <path d="M60 60 L70 75 L80 60 Z" fill="#d4a373"/> 
            <path d="M120 60 L140 75 L120 90 L130 75 Z" fill="#8c5a3b"/> 
            <path d="M55 85 h 30 v 15 h -30 z" fill="#e9c46a"/>
            <path d="M115 85 h 30 v 15 h -30 z" fill="#f4a261"/>
            <path d="M90 20 L110 20 L100 5 L90 20 Z" fill="#ce1126"/>
            <path d="M95 12 L105 12 L100 2 L95 12" fill="#000000"/>
            <text x="100" y="145" fontFamily="Arial" fontSize="18" textAnchor="middle" fill="#000000" fontWeight="bold">FREEDOM</text>
            <text x="100" y="165" fontFamily="Arial" fontSize="18" textAnchor="middle" fill="#000000" fontWeight="bold">AND JUSTICE</text>
        </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="text-center mb-6">
            <GhanaCoatOfArms />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">Techiman North District</h1>
            <p className="text-md text-gray-600">Land Registry Portal</p>
        </div>
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={classnames('flex-1 py-3 text-center font-semibold text-sm transition-colors duration-300', {
            'text-green-600 border-b-2 border-green-600': activeTab === 'Admin',
            'text-gray-500 hover:text-green-600': activeTab !== 'Admin'
          })}
            onClick={() => setActiveTab('Admin')}
          >
            ADMIN
          </button>
          <button
            className={classnames('flex-1 py-3 text-center font-semibold text-sm transition-colors duration-300', {
            'text-green-600 border-b-2 border-green-600': activeTab === 'Staff',
            'text-gray-500 hover:text-green-600': activeTab !== 'Staff'
          })}
            onClick={() => setActiveTab('Staff')}
          >
            STAFF
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            {activeTab === 'Admin' && (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="username">Username</label>
                        <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="password">Password</label>
                        <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </>
            )}

            {activeTab === 'Staff' && (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="role">Role</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                            {Object.values(UserRole).filter(r => r !== UserRole.Admin).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="staff-password">Password</label>
                        <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" id="staff-password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </>
            )}

            {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300" type="submit">Sign In</button>

            <div className="text-center mt-6 text-xs text-gray-500">
                <Link to="/create-account" className="hover:text-green-600">Create Account</Link>
                <span className="mx-2">|</span>
                <Link to="/forgot-password" className="hover:text-green-600">Forgot Password?</Link>
            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
