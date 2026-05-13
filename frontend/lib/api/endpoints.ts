import api from './client';

export const authAPI = {
  register: (data: { email: string; name: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () => api.post('/auth/logout'),
  
  verifyEmail: (email: string) =>
    api.post('/auth/verify-email', { email }),
  
  requestAccess: (email: string) =>
    api.post('/auth/request-access', { email }),
  
  checkEmailStatus: (email: string) =>
    api.get('/auth/check-email', { params: { email } }),
};

export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  
  getAllUsers: (page: number = 1, limit: number = 10) =>
    api.get('/users', { params: { page, limit } }),
  
  getUserById: (userId: string) =>
    api.get(`/users/${userId}`),
  
  updateUserRole: (userId: string, role: string) =>
    api.patch(`/users/${userId}/role`, { role }),
  
  toggleUserStatus: (userId: string, isActive: boolean) =>
    api.patch(`/users/${userId}/status`, { isActive }),
  
  deleteUser: (userId: string) =>
    api.delete(`/users/${userId}`),
  
  getDashboardStats: () =>
    api.get('/users/dashboard/stats'),
};

export const adminAPI = {
  getPendingRequests: (page: number = 1, limit: number = 10) =>
    api.get('/admin/requests/pending', { params: { page, limit } }),
  
  getAllRequests: (page: number = 1, limit: number = 10) =>
    api.get('/admin/requests', { params: { page, limit } }),
  
  approveRequest: (requestId: string, role: string) =>
    api.patch(`/admin/requests/${requestId}/approve`, { role }),
  
  rejectRequest: (requestId: string, reason?: string) =>
    api.patch(`/admin/requests/${requestId}/reject`, { reason }),

  getMonitoringLogs: (page: number = 1, limit: number = 50) =>
    api.get('/admin/monitoring/logs', { params: { page, limit } }),

  getSystemStats: () =>
    api.get('/admin/monitoring/stats'),

  getIntelligenceStats: (params: { type: string }) =>
    api.get('/admin/intelligence-stats', { params }),

  inviteUser: (email: string, role: string) =>
    api.post('/admin/invite', { email, role }),

  revokeAccess: (email: string) =>
    api.post('/admin/revoke', { email }),
};

export const dataAPI = {
  uploadData: (formData: FormData) =>
    api.post('/data/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  createRecord: (type: string, data: any) =>
    api.post('/data', { type, data }),

  getData: (params: { 
    type?: 'LEAD' | 'BRAND' | 'INFLUENCER', 
    status?: string, 
    assignedTo?: string, 
    search?: string, 
    tags?: string,
    outreach_status?: string
  }) => api.get('/data', { params }),

  getStats: (type?: string) =>
    api.get('/data/stats', { params: { type } }),

  updateData: (id: string, data: any) =>
    api.patch(`/data/${id}`, data),

  deleteData: (id: string) =>
    api.delete(`/data/${id}`),

  bulkDelete: (ids: string[]) =>
    api.post('/data/bulk-delete', { ids }),
};
