import apiService from './api';

export interface UpdateProfileData {
  firstName?: string; // Optional - cannot be changed by user
  lastName?: string; // Optional - cannot be changed by user
  email?: string; // Optional - cannot be changed by user
  phoneNumber?: string; // Optional - cannot be changed by user
  // Profile fields - these go directly to the backend, not nested
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  avatar?: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  // Profile fields are returned directly from backend, not nested
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  avatar?: string;
}

class UserService {
  async getProfile(): Promise<UserProfile> {
    try {
      // First try to get the current user's ID from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not found in localStorage');
      }
      
      const user = JSON.parse(userData);
      const userId = user.id;
      
      const response = await apiService.get<UserProfile>(`/users/getUserProfile/${userId}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch profile');
    }
  }

  async updateProfile(profileData: UpdateProfileData): Promise<UserProfile> {
    try {
      // First try to get the current user's ID from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not found in localStorage');
      }
      
      const user = JSON.parse(userData);
      const userId = user.id;
      
      // Use the correct backend endpoint for updating user profile
      const response = await apiService.put<UserProfile>(`/users/updateUserProfile/${userId}`, profileData);
      return response;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to change password');
    }
  }

  async uploadAvatar(file: File): Promise<{ success: boolean; avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiService.post<{ success: boolean; avatarUrl: string }>('/auth/avatar', formData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload avatar');
    }
  }

  async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>('/auth/delete-account', {
        password
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete account');
    }
  }

  async updateNotificationSettings(settings: {
    orderUpdates: boolean;
    newProducts: boolean;
    promotionalEmails: boolean;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.put<{ success: boolean; message: string }>('/users/notification-settings', settings);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update notification settings');
    }
  }

  async updatePrivacySettings(settings: {
    publicProfile: boolean;
    showEmail: boolean;
    allowReviews: boolean;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.put<{ success: boolean; message: string }>('/users/privacy-settings', settings);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update privacy settings');
    }
  }

  async getNotificationSettings(): Promise<{
    orderUpdates: boolean;
    newProducts: boolean;
    promotionalEmails: boolean;
  }> {
    try {
      const response = await apiService.get<{
        orderUpdates: boolean;
        newProducts: boolean;
        promotionalEmails: boolean;
      }>('/users/notification-settings');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch notification settings');
    }
  }

  async getPrivacySettings(): Promise<{
    publicProfile: boolean;
    showEmail: boolean;
    allowReviews: boolean;
  }> {
    try {
      const response = await apiService.get<{
        publicProfile: boolean;
        showEmail: boolean;
        allowReviews: boolean;
      }>('/users/privacy-settings');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch privacy settings');
    }
  }
}

export const userService = new UserService();
export default userService;
