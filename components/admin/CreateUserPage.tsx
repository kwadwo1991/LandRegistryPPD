import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Label from '../ui/Label';
import Input from '../ui/Input';
import { UserService, ManagedUser } from '../../services/userService';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('id');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(UserRole.Staff);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        const users = await UserService.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
          setUsername(user.username || '');
          setRole(user.role);
          setFirstName(user.firstName || '');
          setLastName(user.lastName || '');
          setEmail(user.email || '');
          setContact(user.contact || '');
          // Password is not fetched for security, but can be updated
        }
      };
      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async () => {
    try {
      const userData: Partial<ManagedUser> = { username, role, firstName, lastName, email, contact };
      if (password) {
        userData.password = password;
      }

      if (userId) {
        await UserService.updateUser(userId, userData);
        alert(`User ${username} updated successfully.`);
      } else {
        await UserService.createUser(userData, true);
        alert(`User ${username} created and activated.`);
      }
      navigate('/admin/user-management');
    } catch (err) {
      alert(`Failed to ${userId ? 'update' : 'create'} user.`);
      console.error(err);
    }
  };

  return (
    <Card title={userId ? "Edit User Profile" : "Create New User"}>
      <div className="p-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={!!userId && username === 'admin'} />
            </div>
            <div>
              <Label htmlFor="password">{userId ? "New Password (leave blank to keep current)" : "Password"}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!userId} />
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Input id="contact" type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
          </div>
          <div className="mb-6">
            <Label htmlFor="role">Role</Label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" disabled={!!userId && username === 'admin'}>
              {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex justify-end">
            <Button type="submit">{userId ? "Update User" : "Create User"}</Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default CreateUserPage;
