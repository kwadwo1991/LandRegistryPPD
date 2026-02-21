
import React, { useContext, useState } from 'react';
import { UserCircle } from 'lucide-react';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="flex items-center">
        <div className="relative text-lg font-bold text-gray-700 ml-4 lg:ml-0">
          Land Registration Portal
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-3 text-sm font-medium text-gray-600">{user?.role}</div>
        <div className="relative ml-3">
          <div>
            <button type="button" className="flex text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="sr-only">Open user menu</span>
              <UserCircle className="h-8 w-8 text-gray-600" />
            </button>
          </div>
          {isMenuOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</Link>
              <button onClick={() => {}} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
