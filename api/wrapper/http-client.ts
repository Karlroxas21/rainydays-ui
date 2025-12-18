import { BASE_BE_URL } from '@/config';
import { SecureStorageDataSource } from '../secure-storage-data-source';

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

    // Set Content-Type for typical JSON APIs
    if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
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

    if (!response.ok) {
        throw new Error(`GET request failed: ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export async function paskil<K, Y>(endpoint: string, data: Y): Promise<K> {
    const response = await authenticatedFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`POST request failed: ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<K>;
}

export async function ilagay<K, Y>(endpoint: string, data: Y): Promise<K> {
    const response = await authenticatedFetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`PUT request failed: ${response.statusText}`);
    }

    return response.json() as Promise<K>;
}

export async function burahin(endpoint: string): Promise<void> {
    const response = await authenticatedFetch(endpoint, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`DELETE request faield: ${response.statusText}`);
    }
}
