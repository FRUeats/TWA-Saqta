/**
 * API Client Configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiOptions {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
}

async function apiClient(endpoint: string, options: ApiOptions = {}) {
    const { method = 'GET', body, headers = {} } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

export default apiClient;
