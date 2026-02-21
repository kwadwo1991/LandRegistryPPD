
import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Search, X, LogOut, Shield } from 'lucide-react';
import { AuthContext } from '../App';
import { UserRole } from '../types';

const GhanaCoatOfArms: React.FC = () => (
    <svg width="60" height="60" viewBox="0 0 200 200" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
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


const Sidebar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 my-1 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-green-700 text-white'
            : 'text-gray-200 hover:bg-green-600 hover:text-white'
        }`
      }
      onClick={() => { if (window.innerWidth < 1024) setIsOpen(false);}}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </NavLink>
  );
  
  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <div className={`fixed lg:relative inset-y-0 left-0 z-30 flex flex-col w-64 px-4 py-8 bg-gray-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <GhanaCoatOfArms />
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                <X/>
            </button>
        </div>
        <div className="text-center mt-2">
             <h2 className="text-lg font-semibold text-white">Techiman North District</h2>
             <span className="text-sm text-gray-400">Land Registry</span>
        </div>
        <nav className="flex-1 mt-10">
          {user && (
            <>
              <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              {(user.role === UserRole.Admin || user.role === UserRole.DateEntryOfficer) && (
                <NavItem to="/new-registration" icon={<FilePlus size={20} />} label="New Registration" />
              )}
              <NavItem to="/registrations" icon={<Search size={20} />} label="Search Records" />
              {user.role === UserRole.Admin && (
                <NavItem to="/admin" icon={<Shield size={20} />} label="Admin" />
              )}
            </>
          )}
        </nav>
        <div className="mt-auto">
            <button 
                onClick={logout} 
                className='flex items-center px-4 py-3 my-1 rounded-md text-sm font-medium transition-colors duration-200 text-gray-200 hover:bg-red-600 hover:text-white w-full'
            >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
