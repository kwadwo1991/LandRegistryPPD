import { User, UserRole } from '../types';

const mockUsers: (User & { id: number; active: boolean })[] = [
  { id: 1, username: 'head_of_dept', role: UserRole.Head, active: true },
  { id: 2, username: 'deo_officer', role: UserRole.DateEntryOfficer, active: true },
  { id: 3, username: 'secretary_staff', role: UserRole.Secretary, active: false },
  { id: 4, username: 'staff_member', role: UserRole.Staff, active: true },
];

export const UserService = {
  getUsers: async (): Promise<(User & { id: number; active: boolean })[]> => {
    return [...mockUsers];
  },

  updateUserStatus: async (userId: number, active: boolean): Promise<boolean> => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.active = active;
      return true;
    }
    return false;
  },

  updateUserRole: async (userId: number, role: UserRole): Promise<boolean> => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.role = role;
      return true;
    }
    return false;
  },

  createUser: async (userData: Omit<User, 'username'> & { username: string; password?: string }, createdByAdmin: boolean = false): Promise<User & { id: number; active: boolean }> => {
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      active: createdByAdmin, // Accounts created by admin are active by default
    };
    mockUsers.push(newUser);
    return newUser;
  },
};
