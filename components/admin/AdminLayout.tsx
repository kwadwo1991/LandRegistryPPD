import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
        <nav className="flex space-x-4">
          <NavLink to="user-management" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-green-700 text-white' : 'text-gray-500 hover:bg-gray-200'}`}>User Management</NavLink>
          <NavLink to="create-user" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-green-700 text-white' : 'text-gray-500 hover:bg-gray-200'}`}>Create User</NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
