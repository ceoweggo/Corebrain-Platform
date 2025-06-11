import axios from 'axios';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5000';

export const apiRequest = async <T = any>(method: string, endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('apiToken')}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
}; 