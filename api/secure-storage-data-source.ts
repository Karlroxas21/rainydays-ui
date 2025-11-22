import * as Keychain from 'react-native-keychain';

const SERVICE_ID = 'auth_session';

export class SecureStorageDataSource {
    async getToken(): Promise<String | null> {
        try {
            // the token saved as a generic password.
            const jwt = await Keychain.getGenericPassword({ service: SERVICE_ID });

            if (jwt && jwt.password !== null) {
                return jwt.password;
            }

            return null;
        }
        catch (error) {
            console.error("Error retrieving token from Keychain", error);
            return null;
        }
    }

    async saveToken(jwt: string): Promise<void> {
        try {
            await Keychain.setGenericPassword('jwt_session', jwt, { service: SERVICE_ID });
        } catch (error) {
            console.error("Error saving token to Keychain", error);
            throw error;
        }
    }

    async deleteToken(): Promise<void> {
        try {
            await Keychain.resetGenericPassword({ service: SERVICE_ID });
        } catch (error) {
            console.error("Error deleting token from Keychain", error);
            throw error;
        }
    }
}