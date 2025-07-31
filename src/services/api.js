// Change this when deploying to production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://yourdomain.com/api'  // Production URL
  : 'http://localhost:5001/api';  // Development URL

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('kiik69_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// API service class
class ApiService {
  // Authentication
  static async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('kiik69_token', data.token);
      localStorage.setItem('kiik69_user', JSON.stringify(data.user));
    }
    return data;
  }

  static async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      localStorage.removeItem('kiik69_token');
      localStorage.removeItem('kiik69_user');
    }
  }

  static async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Menu API
  static async getMenuItems(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/menu?${params}`);
    return handleResponse(response);
  }

  static async getMenuCategories() {
    const response = await fetch(`${API_BASE_URL}/menu/categories/list`);
    return handleResponse(response);
  }

  static async createMenuItem(formData) {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async updateMenuItem(id, formData) {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async deleteMenuItem(id) {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Events API
  static async getEvents(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/events?${params}`);
    return handleResponse(response);
  }

  static async createEvent(formData) {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async updateEvent(id, formData) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async deleteEvent(id) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Gallery API
  static async getGalleryItems(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/gallery?${params}`);
    return handleResponse(response);
  }

  static async getGalleryCategories() {
    const response = await fetch(`${API_BASE_URL}/gallery/categories/list`);
    return handleResponse(response);
  }

  static async createGalleryItem(formData) {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async updateGalleryItem(id, formData) {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async deleteGalleryItem(id) {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Party Packages API
  static async getPartyPackages(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/party-packages?${params}`);
    return handleResponse(response);
  }

  static async createPartyPackage(formData) {
    const response = await fetch(`${API_BASE_URL}/party-packages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async updatePartyPackage(id, formData) {
    const response = await fetch(`${API_BASE_URL}/party-packages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async deletePartyPackage(id) {
    const response = await fetch(`${API_BASE_URL}/party-packages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Games API
  static async getGames(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/games?${params}`);
    return handleResponse(response);
  }

  static async getGameTypes() {
    const response = await fetch(`${API_BASE_URL}/games/types/list`);
    return handleResponse(response);
  }

  static async createGame(formData) {
    const response = await fetch(`${API_BASE_URL}/games`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async updateGame(id, formData) {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  }

  static async deleteGame(id) {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Contact API
  static async submitContactForm(formData) {
    const response = await fetch(`${API_BASE_URL}/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  }

  static async getContactMessages(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/contact?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  static async updateMessageStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/contact/${id}/status`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  }

  static async deleteMessage(id) {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  static async getContactStats() {
    const response = await fetch(`${API_BASE_URL}/contact/stats/overview`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Health check
  static async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  }
}

export default ApiService; 