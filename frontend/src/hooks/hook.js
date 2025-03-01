import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post('/auth/refresh', { refreshToken });
                
                // Store new tokens
                const { token } = response.data;
                localStorage.setItem('jwt_token', token);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Wrapper functions for common HTTP methods
const apiWrapper = {
    get: async (url, config = {}) => {
        try {
            const response = await api.get(url, config);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    post: async (url, data = {}, config = {}) => {
        try {
            const response = await api.post(url, data, config);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    put: async (url, data = {}, config = {}) => {
        try {
            const response = await api.put(url, data, config);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    delete: async (url, config = {}) => {
        try {
            const response = await api.delete(url, config);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    // Upload files with progress tracking
    upload: async (url, file, onProgress) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress?.(percentCompleted);
                },
            });
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },
};

// Error handling function
const handleError = (error) => {
    if (error.response) {
        // Server responded with error
        console.error('API Error:', error.response.data);
        
        // Handle specific error codes
        switch (error.response.status) {
            case 400:
                // Handle bad request
                break;
            case 401:
                // Handle unauthorized (handled by interceptor)
                break;
            case 403:
                // Handle forbidden
                break;
            case 404:
                // Handle not found
                break;
            case 500:
                // Handle server error
                break;
            default:
                // Handle other errors
                break;
        }
    } else if (error.request) {
        // Request made but no response
        console.error('Network Error:', error.request);
    } else {
        // Error in request configuration
        console.error('Request Error:', error.message);
    }
};

export default apiWrapper;
