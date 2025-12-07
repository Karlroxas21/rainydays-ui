import * as SecureStore from 'expo-secure-store';

const SERVICE_ID = 'auth_session';

// fallback for environments where Keychain native module isn't available
// eg. Android
let inMemoryFallbackToken: string | null = null;

export class SecureStorageDataSource {
    async getToken(): Promise<string | null> {
        try {
            const jwt = await SecureStore.getItemAsync(SERVICE_ID);
            if (jwt) return jwt;

            // last resort: in-memoery (dev only)
            return inMemoryFallbackToken;
        } catch (error) {
            console.error('Error retrieving token from Keychain', error);
            return null;
        }
    }

    async saveToken(jwt: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(SERVICE_ID, jwt, { keychainAccessible: SecureStore.WHEN_UNLOCKED });

            // fallback
            inMemoryFallbackToken = jwt;
        } catch (error) {
            console.error('Error saving token to storage', error);
            throw error;
        }
    }

    async deleteToken(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(SERVICE_ID);
        } catch (error) {
            console.error('Error deleting token from storage', error);
            throw error;
        }
    }
}
