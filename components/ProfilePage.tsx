import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import Label from './ui/Label';
import Input from './ui/Input';

const ProfilePage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');

  const handleProfileUpdate = () => {
    // In a real app, you'd have proper profile update logic here
    alert(`Profile for ${username} updated!`);
  };

  return (
    <Card title="Edit Profile">
      <div className="p-4">
        <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }}>
          <div className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Update Profile</Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ProfilePage;
