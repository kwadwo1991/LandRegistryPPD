import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Label from './ui/Label';
import Input from './ui/Input';
// We will create this service function in the next step
// import { UserService } from '../services/userService';

const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(UserRole.Staff);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateAccount = async () => {
    setError('');
    setSuccess('');
    try {
      // This is a placeholder. We will implement the actual service call later.
      // await UserService.createUser({ username, password, role }); 
      console.log('User created:', { username, password, role });
      setSuccess('Account created successfully! An administrator will review and activate your account shortly.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Card title="Create a New Account">
        <div className="p-4">
          {success ? (
            <p className="text-green-600 text-center">{success}</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }}>
              <div className="mb-4">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="mb-6">
                <Label htmlFor="role">Select Your Role</Label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                  {Object.values(UserRole).filter(r => r !== UserRole.Admin).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
              <div className="flex items-center justify-between">
                <Button type="submit">Create Account</Button>
                <Link to="/login" className="text-xs text-green-600 hover:underline">Back to Login</Link>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CreateAccountPage;
