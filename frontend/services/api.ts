import axios, { AxiosError, AxiosInstance } from "axios";

// ✅ USE RELATIVE PATH - This goes through Vercel proxy to HF
const API_BASE_URL = "/api";  // Changed from full HF URL
const API_TIMEOUT = 30000;

export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  priority: string;
  tags: string[];
  due_date: string | null;
  status: string;
}

export interface HistoryEntry {
  history_id: string;
  task_id: string | null;
  task_title: string;
  action_type: "CREATED" | "UPDATED" | "COMPLETED" | "INCOMPLETED" | "DELETED";
  description: string | null;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  popup: string | null;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  popup: string | null;
  error: string | null;
}

export interface WeeklyStats {
  tasks_created_this_week: number;
  tasks_completed_this_week: number;
  total_completed: number;
  total_incomplete: number;
  week_start: string;
  week_end: string;
  total_tasks: number;
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "down";
  service: string;
  timestamp?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,  // ✅ Now uses /api (relative path)
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,  // ✅ Cookies now work (same domain)
    });

    // ✅ Request interceptor - attach token if exists
    this.client.interceptors.request.use(
      (config) => {
        // Try localStorage first (backup)
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('📤 Attaching token to:', config.url);
        } else {
          console.log('📤 No token, using cookies for:', config.url);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ Response from:', response.config.url, response.status);
        return response;
      },
      async (error: AxiosError) => {
        console.error("❌ API Error:", {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });

        // Handle 401 - redirect to login
        if (error.response?.status === 401) {
          console.error('🚫 401 Unauthorized - redirecting to login');
          
          // Clear any stored tokens
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          
          // Show alert if available
          try {
            const { sessionExpired } = await import("@/utils/authAlerts");
            await sessionExpired();
          } catch (e) {
            console.log('Could not show session expired alert');
          }

          // Redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Health Check
  async getHealth(): Promise<HealthStatus> {
    try {
      const response = await this.client.get<ApiResponse<HealthStatus>>("/health");
      return response.data.data;
    } catch (error) {
      console.error("Health check failed:", error);
      return { status: "down", service: "todo-app-backend" };
    }
  }

  // Task Endpoints
  async getTasks(): Promise<Task[]> {
    try {
      const response = await this.client.get<ApiResponse<Task[]>>("/tasks");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      throw error;
    }
  }

  async getTask(id: string): Promise<Task> {
    try {
      const response = await this.client.get<ApiResponse<Task>>(`/tasks/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch task ${id}:`, error);
      throw error;
    }
  }

  async createTask(
    title: string,
    description?: string,
    due_date?: string,
    tags?: string[]
  ): Promise<Task> {
    try {
      const response = await this.client.post<ApiResponse<Task>>("/tasks", {
        title,
        ...(description && { description }),
        ...(due_date && { due_date }),
        ...(tags && tags.length > 0 && { tags }),
      });
      return response.data.data;
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  }

  async updateTask(
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      due_date: string;
      tags: string[];
      status: string;
    }>
  ): Promise<Task> {
    try {
      const response = await this.client.put<ApiResponse<Task>>(`/tasks/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to update task ${id}:`, error);
      throw error;
    }
  }

  async completeTask(id: string): Promise<Task> {
    try {
      const response = await this.client.patch<ApiResponse<Task>>(`/tasks/${id}/complete`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to complete task ${id}:`, error);
      throw error;
    }
  }

  async incompleteTask(id: string): Promise<Task> {
    try {
      const response = await this.client.patch<ApiResponse<Task>>(`/tasks/${id}/incomplete`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to mark task incomplete ${id}:`, error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.client.delete(`/tasks/${id}`);
    } catch (error) {
      console.error(`Failed to delete task ${id}:`, error);
      throw error;
    }
  }

  // History Endpoints
  async getHistory(
    page: number = 1,
    limit: number = 10,
    taskId?: string,
    actionType?: string
  ): Promise<PaginatedResponse<HistoryEntry>> {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (taskId) params.append("task_id", taskId);
      if (actionType) params.append("action_type", actionType);

      const response = await this.client.get<ApiResponse<{ items: HistoryEntry[], pagination: any }>>(
        `/history?${params.toString()}`
      );

      const backendPagination = response.data.data.pagination;
      return {
        success: response.data.success,
        data: response.data.data.items,
        pagination: {
          page: backendPagination.current_page,
          limit: backendPagination.page_size,
          total_count: backendPagination.total_count,
          total_pages: backendPagination.total_pages,
          has_next: backendPagination.has_next,
          has_prev: backendPagination.has_prev,
        },
        popup: response.data.popup,
        error: response.data.error,
      };
    } catch (error) {
      console.error("Failed to fetch history:", error);
      throw error;
    }
  }

  async deleteHistoryEntry(historyId: string): Promise<void> {
    try {
      await this.client.delete(`/history/${historyId}`);
    } catch (error) {
      console.error(`Failed to delete history entry ${historyId}:`, error);
      throw error;
    }
  }

  // Statistics Endpoints
  async getWeeklyStats(): Promise<WeeklyStats> {
    try {
      const response = await this.client.get<ApiResponse<WeeklyStats>>("/stats/weekly");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch weekly stats:", error);
      throw error;
    }
  }

  // Notification Endpoints
  async getNotifications(unreadOnly: boolean = false): Promise<{
    notifications: any[];
    unread_count: number;
    total_count: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (unreadOnly) params.append('unread', 'true');

      const response = await this.client.get(`/notifications?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<any> {
    try {
      const response = await this.client.patch(`/notifications/${notificationId}/read`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(): Promise<{ count: number }> {
    try {
      const response = await this.client.patch('/notifications/mark-all-read');
      return response.data.data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await this.client.get<ApiResponse<{ count: number }>>('/notifications/unread/count');
      return response.data.data.count;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      throw error;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;
export { ApiClient };