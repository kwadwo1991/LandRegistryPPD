import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import Label from './ui/Label';
import Input from './ui/Input';
import { UserService } from '../services/userService';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [contact, setContact] = useState(user?.contact || '');
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsUpdating(true);
    
    const updatedData: Partial<User> & { password?: string } = {
      username,
      firstName,
      lastName,
      email,
      contact,
    };
    
    if (password) {
      updatedData.password = password;
    }

    // In this mock setup, we assume the user's ID is their username or we find it
    const allUsers = await UserService.getUsers();
    const managedUser = allUsers.find(u => u.username === user.username);
    
    if (managedUser) {
      const result = await UserService.updateUser(managedUser.id, updatedData);
      if (result) {
        updateUser({
          ...user,
          username,
          firstName,
          lastName,
          email,
          contact,
        });
        alert('Profile updated successfully!');
        setPassword('');
      } else {
        alert('Failed to update profile.');
      }
    }
    setIsUpdating(false);
  };

  return (
    <Card title="Edit Profile">
      <div className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled />
              <p className="text-xs text-gray-400 mt-1">Username cannot be changed.</p>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" type="text" value={user?.role || ''} disabled />
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
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <Link to="/reset-password">
              <Button variant="outline">Reset Password</Button>
            </Link>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ProfilePage;
