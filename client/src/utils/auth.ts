import api from './api';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        try {
            const response = await api.post('/auth/login', credentials);
            const {token, user} = response.data;

            if (!token || !user) {
                throw new Error('Invalid response from server');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return {user, token};
        } catch (error: any) {
            console.error('Login error:', error);
            // Handle different error response structures
            const errorMessage = error.response?.data?.error?.message
                || error.response?.data?.error
                || error.response?.data?.message
                || error.message
                || 'Login failed';
            throw new Error(errorMessage);
        }
    },

    async register(data: RegisterData): Promise<{ user: User; token: string }> {
        try {
            const response = await api.post('/auth/register', data);
            const {token, user} = response.data;

            if (!token || !user) {
                throw new Error('Invalid response from server');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return {user, token};
        } catch (error: any) {
            console.error('Registration error:', error);
            // Handle different error response structures
            const errorMessage = error.response?.data?.error?.message
                || error.response?.data?.error
                || error.response?.data?.message
                || error.message
                || 'Registration failed';
            throw new Error(errorMessage);
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser(): User | null {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },
};
