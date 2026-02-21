import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as authService from '../services/authService';
import classnames from 'classnames';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Admin');
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError('');
    const isStaff = activeTab === 'Staff';
    const user = await authService.login(username, password, isStaff);
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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans">
        {/* Stunning Background Image with Overlay */}
        <div 
            className="absolute inset-0 z-0"
            style={{
                backgroundImage: 'url("https://picsum.photos/seed/techiman-north-assembly/1920/1080")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-green-900/40 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
            <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <div className="inline-block p-5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    <GhanaCoatOfArms />
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl mb-2 uppercase">
                    Techiman North
                </h1>
                <div className="flex items-center justify-center space-x-3">
                    <div className="h-px w-8 bg-green-500"></div>
                    <p className="text-sm text-green-400 font-bold tracking-[0.3em] uppercase">
                        Land Registry Portal
                    </p>
                    <div className="h-px w-8 bg-green-500"></div>
                </div>
            </div>

            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <div className="flex p-1.5 bg-black/20 rounded-2xl mb-10 border border-white/5">
                    <button
                        className={classnames('flex-1 py-3 text-center font-black text-xs tracking-widest transition-all duration-500 rounded-xl uppercase', {
                            'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]': activeTab === 'Admin',
                            'text-white/40 hover:text-white/70 hover:bg-white/5': activeTab !== 'Admin'
                        })}
                        onClick={() => setActiveTab('Admin')}
                    >
                        Administrator
                    </button>
                    <button
                        className={classnames('flex-1 py-3 text-center font-black text-xs tracking-widest transition-all duration-500 rounded-xl uppercase', {
                            'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]': activeTab === 'Staff',
                            'text-white/40 hover:text-white/70 hover:bg-white/5': activeTab !== 'Staff'
                        })}
                        onClick={() => setActiveTab('Staff')}
                    >
                        Staff Member
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-8">
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-white/50 text-[10px] font-black mb-2 uppercase tracking-[0.2em] transition-colors group-focus-within:text-green-400" htmlFor="username">
                                Username
                            </label>
                            <input 
                                className="w-full px-5 py-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-black/40 focus:border-green-500/50 transition-all duration-300" 
                                id="username" 
                                type="text" 
                                placeholder="e.g. admin_tenda" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <div className="group relative">
                            <label className="block text-white/50 text-[10px] font-black mb-2 uppercase tracking-[0.2em] transition-colors group-focus-within:text-green-400" htmlFor="password">
                                Password
                            </label>
                            <input 
                                className="w-full px-5 py-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-black/40 focus:border-green-500/50 transition-all duration-300" 
                                id="password" 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-8 pr-5 flex items-center text-white/30 hover:text-white transition-colors">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-shake">
                            <p className="text-red-400 text-xs text-center font-bold uppercase tracking-wider">{error}</p>
                        </div>
                    )}

                    <button 
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-5 px-4 rounded-2xl shadow-[0_10px_30px_rgba(22,163,74,0.3)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 uppercase tracking-[0.2em] text-sm" 
                        type="submit"
                    >
                        Access Portal
                    </button>

                    <div className="flex items-center justify-center space-x-6 text-[11px] font-bold uppercase tracking-widest text-white/30">
                        <Link to="/create-account" className="hover:text-white transition-colors">Register</Link>
                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                        <Link to="/forgot-password" className="hover:text-white transition-colors">Recovery</Link>
                    </div>
                </form>
            </div>
            
            <div className="mt-12 text-center">
                <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase font-black">
                    &copy; 2026 Techiman North District Assembly
                </p>
                <p className="text-white/10 text-[8px] mt-2 uppercase tracking-widest">
                    Powered by Land Registry Systems
                </p>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;
