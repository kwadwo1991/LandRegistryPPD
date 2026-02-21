import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types';
import { UserService } from '../../services/userService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Edit } from 'lucide-react';

const UserManagement: React.FC = () => {
  
  const navigate = useNavigate();
  const [users, setUsers] = useState<(User & { id: string; active: boolean })[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await UserService.getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, active: boolean) => {
    await UserService.updateUserStatus(userId, active);
    setUsers(users.map(u => u.id === userId ? { ...u, active } : u));
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    await UserService.updateUserRole(userId, role);
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
  };

  return (
    <Card title="User Management">
      <div className="p-4">
        <div className="flex justify-end mb-4">
          <Button onClick={() => navigate('/admin/create-user')}>Create User</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                      {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={user.active} onChange={(e) => handleStatusChange(user.id, e.target.checked)} />
                        <div className={`block w-10 h-6 rounded-full ${user.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${user.active ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <div className="ml-3 text-gray-700 font-medium">{user.active ? 'Active' : 'Pending Approval'}</div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="icon" size="sm" onClick={() => navigate(`/admin/create-user`)}><Edit className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default UserManagement;
