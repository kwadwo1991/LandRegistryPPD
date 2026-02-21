import { UserRole, User } from '../types';

export const login = async (username: string, passwordOrRole: string, isStaff: boolean): Promise<User | null> => {
  if (isStaff) {
    // In a real app, you'd verify staff credentials
    const role = passwordOrRole as UserRole;
    if (Object.values(UserRole).includes(role)) {
        return { role };
    }
  } else {
    if (username === 'admin' && passwordOrRole === 'Admin123') {
      return { role: UserRole.Admin };
    }
  }
  return null;
};
