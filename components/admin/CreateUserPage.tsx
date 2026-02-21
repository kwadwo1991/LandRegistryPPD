import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Label from '../ui/Label';
import Input from '../ui/Input';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(UserRole.Staff);

  const handleCreateUser = async () => {
    // In a real app, you'd have proper user creation logic here
    try {
      // await UserService.createUser({ username, password, role }, true);
      console.log('User created by admin:', { username, password, role });
      alert(`User ${username} created and activated with role ${role}`);
      navigate('/admin/user-management');
    } catch (err) {
      alert('Failed to create user.');
      console.error(err);
    }
  };

  return (
    <Card title="Create New User">
      <div className="p-4">
        <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
          <div className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-6">
            <Label htmlFor="role">Role</Label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
              {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default CreateUserPage;
