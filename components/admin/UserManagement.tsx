import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';
import { UserService, ManagedUser } from '../../services/userService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Edit, Trash2, Filter, CheckSquare, Square } from 'lucide-react';

const UserManagement: React.FC = () => {
  
  const navigate = useNavigate();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await UserService.getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const roleMatch = roleFilter === 'All' || user.role === roleFilter;
      const statusMatch = statusFilter === 'All' || (statusFilter === 'Active' ? user.active : !user.active);
      return roleMatch && statusMatch;
    });
  }, [users, roleFilter, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleBulkDeactivate = async () => {
    if (window.confirm(`Are you sure you want to deactivate ${selectedUserIds.length} users?`)) {
      await UserService.bulkUpdateStatus(selectedUserIds, false);
      const updatedUsers = await UserService.getUsers();
      setUsers(updatedUsers);
      setSelectedUserIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUserIds.length} users?`)) {
      await UserService.bulkDelete(selectedUserIds);
      const updatedUsers = await UserService.getUsers();
      setUsers(updatedUsers);
      setSelectedUserIds([]);
    }
  };

  const handleStatusChange = async (userId: string, active: boolean) => {
    await UserService.updateUserStatus(userId, active);
    setUsers(users.map(u => u.id === userId ? { ...u, active } : u));
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    await UserService.updateUserRole(userId, role);
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const success = await UserService.deleteUser(userId);
      if (success) {
        setUsers(users.filter(u => u.id !== userId));
      }
    }
  };

  return (
    <Card title="User Management">
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="All">All Roles</option>
                {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex space-x-2">
            {selectedUserIds.length > 0 && (
              <>
                <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={handleBulkDeactivate}>Deactivate ({selectedUserIds.length})</Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleBulkDelete}>Delete ({selectedUserIds.length})</Button>
              </>
            )}
            <Button onClick={() => navigate('/admin/create-user')}>Create User</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-green-600">
                    {selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0 ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={selectedUserIds.includes(user.id) ? 'bg-green-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => toggleSelectUser(user.id)} className="text-gray-400 hover:text-green-600">
                      {selectedUserIds.includes(user.id) ? <CheckSquare className="h-5 w-5 text-green-600" /> : <Square className="h-5 w-5" />}
                    </button>
                  </td>
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
                      <div className="ml-3 text-gray-700 font-medium">{user.active ? 'Active' : 'Inactive'}</div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                    <Button variant="icon" size="sm" onClick={() => navigate(`/admin/create-user?id=${user.id}`)}><Edit className="h-4 w-4" /></Button>
                    {user.username !== 'admin' && (
                      <Button variant="icon" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteUser(user.id)}><Trash2 className="h-4 w-4" /></Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">No users found matching the filters.</div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserManagement;
