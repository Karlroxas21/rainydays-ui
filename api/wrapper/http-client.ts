import { BASE_BE_URL } from '@/config';
import { SecureStorageDataSource } from '../secure-storage-data-source';

export interface BackendError {
    code: number;
    message: string;
    httpStatus: string;
    details: any;
    lockoutTimeSeconds: number | null;
}

const secureStorage = new SecureStorageDataSource();

/**
 * Automatically inject JWT for authenticated API calls.
 * @param endpoint The API Path ('/profile', '/history')
 * @param options The standard RequestInit options for fetch
 */
export async function authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    // Retrieve token from secure storage
    const jwt = await secureStorage.getToken();

    // Get existing headers or initialize a new headers obj
    const headers = new Headers(options.headers || {});

    // Attach the Authorization header if a JWT exists
    if (jwt) {
        headers.set('Authorization', `Bearer ${jwt}`);
    }

    if (options.body && !(options.body instanceof FormData)) {
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
    }

    const finalOptions: RequestInit = {
        ...options,
        headers: headers,
    };

    const url = `${BASE_BE_URL}${endpoint}`;

    const response = await fetch(url, finalOptions);

    return response;
}

// -- Wrappers --

export async function kuhain<T>(endpoint: string): Promise<T> {
    const response = await authenticatedFetch(endpoint, {
        method: 'GET',
    });

    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.message || 'POST request failed');
        (error as any).status = response.status;
        (error as any).data = result;
        throw error;
    }

    return result as Promise<T>;
}

export async function paskil<K, Y>(endpoint: string, data: Y): Promise<K> {
    const body = data instanceof FormData ? (data as any) : JSON.stringify(data);

    const response = await authenticatedFetch(endpoint, {
        method: 'POST',
        body,
    });

    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.message || 'POST request failed');
        (error as any).status = response.status;
        (error as any).data = result;
        throw error;
    }

    return result as Promise<K>;
}

export async function ilagay<K, Y>(endpoint: string, data: Y): Promise<K> {
    const body = data instanceof FormData ? (data as any) : JSON.stringify(data);

    const response = await authenticatedFetch(endpoint, {
        method: 'PUT',
        body,
    });

    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.message || 'POST request failed');
        (error as any).status = response.status;
        (error as any).data = result;
        throw error;
    }

    return result as Promise<K>;
}

export async function burahin(endpoint: string): Promise<void> {
    const response = await authenticatedFetch(endpoint, {
        method: 'DELETE',
    });
    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.message || 'POST request failed');
        (error as any).status = response.status;
        (error as any).data = result;
        throw error;
    }
}
