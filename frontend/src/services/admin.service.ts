import apiService from './api';

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  admin?: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    role: string;
    isActive: boolean;
    position?: string;
    lastLoginAt?: Date;
  };
}

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  position?: string;
  bio?: string;
  timezone?: string;
  createdAt: Date;
}

class AdminService {
  async loginAdmin(credentials: AdminLoginData): Promise<AdminResponse> {
    try {
      const response = await apiService.post<{ admin: any; message: string }>('/admin/loginAdmin', credentials);
      
      // Transform the response to match our interface
      const adminResponse: AdminResponse = {
        success: true,
        message: response.message,
        admin: {
          id: response.admin.id,
          name: response.admin.name,
          email: response.admin.email,
          phoneNumber: response.admin.phoneNumber,
          role: response.admin.role,
          isActive: response.admin.isActive,
          position: response.admin.position,
          lastLoginAt: response.admin.lastLoginAt
        }
      };

      // Store admin info in localStorage
      if (adminResponse.admin) {
        localStorage.setItem('adminToken', 'admin_authenticated');
        localStorage.setItem('admin', JSON.stringify(adminResponse.admin));
      }

      return adminResponse;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Admin login failed');
    }
  }

  async logoutAdmin(): Promise<void> {
    try {
      // Clear admin data from localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  }

  async getAdminProfile(id: number): Promise<AdminProfile> {
    try {
      const response = await apiService.get<AdminProfile>(`/admin/getAdminProfile/${id}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch admin profile');
    }
  }

  async getAllAdmins(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>('/admin/getAllAdmins');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch admins');
    }
  }

  async getAdminById(id: number): Promise<any> {
    try {
      const response = await apiService.get<any>(`/admin/getAdminById/${id}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch admin');
    }
  }

  async createAdmin(adminData: any): Promise<any> {
    try {
      const response = await apiService.post<any>('/admin/createAdmin', adminData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create admin');
    }
  }

  async updateAdmin(id: number, adminData: any): Promise<any> {
    try {
      const response = await apiService.put<any>(`/admin/updateAdmin/${id}`, adminData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update admin');
    }
  }

  async deleteAdmin(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.delete<{ success: boolean; message: string }>(`/admin/deleteAdminById/${id}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete admin');
    }
  }

  async toggleAdminStatus(id: number): Promise<any> {
    try {
      const response = await apiService.put<any>(`/admin/toggleAdminStatus/${id}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to toggle admin status');
    }
  }

  isAdminAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    return !!token;
  }

  getCurrentAdmin(): any | null {
    const adminStr = localStorage.getItem('admin');
    return adminStr ? JSON.parse(adminStr) : null;
  }

  getAdminToken(): string | null {
    return localStorage.getItem('adminToken');
  }
}

export const adminService = new AdminService();
export default adminService; 