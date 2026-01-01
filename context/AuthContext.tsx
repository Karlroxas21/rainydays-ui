import { SecureStorageDataSource } from '@/api/secure-storage-data-source';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';
import { login as apiLogin, whoAmI } from '@/api/services/auth';
import { useRouter } from 'expo-router';

interface AuthData {
    id: string;
    jwt: string;
}

export interface User {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    profileUrl?: string;
}

interface Context {
    isAuthenticated: boolean;
    loading: boolean;
    isInitialLoading: boolean;
    login: (identity: string, password: string) => void;
    logout: () => void;
    whoAmI: () => Promise<User>;
    authData: AuthData | null;
    user: User | null;
}

interface Provider {
    children: ReactNode;
}

const secureStorage = new SecureStorageDataSource();

const AuthContext = createContext<Context>({
    isAuthenticated: false,
    loading: true,
    isInitialLoading: true,
    login: () => Promise.resolve(),
    logout: () => {},
    whoAmI: () => Promise.resolve({} as User),
    authData: null,
    user: null,
});

const AuthProvider = ({ children }: Provider) => {
    const [loading, setLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

    // check if token exists
    useEffect(() => {
        // to prevent memory leaks
        let mounted = true;

        // (async() =>{}) is an Immediately Invoked Function Expression (IIFE)
        (async () => {
            try {
                const token = await secureStorage.getToken();
                console.log('TOKEN: ', token);

                if (!mounted) return;

                if (token) {
                    let rawToken: string = token;
                    try {
                        const parsed = JSON.parse(token);
                        rawToken = typeof parsed === 'string' ? parsed : token;
                    } catch {
                        // token was already a raw string
                        rawToken = token;
                    }

                    sinoAko();
                    setAuthData({ id: 'session', jwt: rawToken });
                    setIsAuthenticated(true);
                } else {
                    setAuthData(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (mounted) setLoading(false);
                setIsInitialLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const login = async (identity: string, password: string) => {
        setLoading(true);
        try {
            const jwt = await apiLogin({ identifier: identity, password: password });
            if (jwt.tokenSession) {
                await secureStorage.saveToken(jwt.tokenSession);
                setIsAuthenticated(true);
                await sinoAko();
            } else {
                throw new Error('Login failed: no token returned.');
            }
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await secureStorage.deleteToken();
            setAuthData(null);
            setIsAuthenticated(false);
            setUser(null);

            router.push('/(unauthenticated)/login');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sinoAko = async () => {
        setLoading(true);
        try {
            const data = await whoAmI();
            setUser(data);
        } catch (error) {
            console.error(error);
            // Auto-logout on unauthorized (invalid/expired token)
            await logout();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,
                isInitialLoading,
                login,
                logout,
                whoAmI,
                authData,
                user,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { useAuth, AuthContext, AuthProvider };
