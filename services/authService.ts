import { UserRole, User } from '../types';
import { mockUsers } from './userService';

export const login = async (username: string, passwordOrRole: string, isStaff: boolean): Promise<User | null> => {
  const user = mockUsers.find(u => u.username === username);

  if (isStaff) {
    // In a real app, you'd verify staff credentials against a database
    const role = passwordOrRole as UserRole;
    if (user && Object.values(UserRole).includes(role)) {
        return user;
    }
  } else {
    if (user && user.password === passwordOrRole) {
      return user;
    }
  }
  return null;
};

export const resetPasswordForLoggedInUser = async (username: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const user = mockUsers.find(u => u.username === username);
    if (!user || user.password !== currentPassword) {
        return { success: false, message: 'Invalid current password.' };
    }
    // In a real app, you would hash the new password and save it
    user.password = newPassword;
    return { success: true, message: 'Password has been reset successfully!' };
};

export const sendPasswordResetLink = async (email: string, contact: string): Promise<{ success: boolean; message: string }> => {
    const user = mockUsers.find(u => u.email === email && u.contact === contact);
    if (!user) {
        return { success: false, message: 'No account found with the provided details.' };
    }
    // In a real app, you would generate a token, save it with an expiry, and email the link
    const resetToken = `fake-reset-token-for-${user.username}`;
    console.log(`Password reset link for ${email}: /reset-password?token=${resetToken}`);
    return { success: true, message: `A password reset link has been sent to ${email}. The link will be valid for 24 hours.` };
};
