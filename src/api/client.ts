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

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
    } else {
        // If not JSON (e.g. HTML error page from Vercel/Render), read as text
        const text = await response.text();
        console.warn('Received non-JSON response:', text.substring(0, 100)); // Log part of it
        data = { error: 'Invalid server response', details: text.substring(0, 100) };
    }

    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

export default apiClient;
