import { SecureStorageDataSource } from '@/api/secure-storage-data-source'
import { createContext, ReactNode, useState, useContext, useEffect } from 'react'
import { login as apiLogin } from '@/api/services/auth'
import { router } from 'expo-router'

interface AuthData {
    id: string
    jwt: string
}

interface User {
    firstName: string
    middleName?: string
    lastName: string
    suffix?: string
    profileUrl?: string
}

interface Context {
    isAuthenticated: boolean
    loading: boolean
    login: (identity: string, password: string) => void
    logout: () => void
    authData: AuthData | null
    user: User | null
}

interface Provider {
    children: ReactNode
}

const secureStorage = new SecureStorageDataSource()

const AuthContext = createContext<Context>({
    isAuthenticated: false,
    loading: true,
    login: () => {},
    logout: () => {},
    authData: null,
    user: null,
})

const AuthProvider = ({ children }: Provider) => {
    const [loading, setLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authData, setAuthData] = useState<AuthData | null>(null)
    const [user, setUser] = useState<User | null>(null)

    // check if token exists
    useEffect(() => {
        // to prevent memory leaks
        let mounted = true

        // (async() =>{}) is an Immediately Invoked Function Expression (IIFE)
        ;(async () => {
            setLoading(true)

            try {
                const token = await secureStorage.getToken()
                if (!mounted) return

                if (token) {
                    setAuthData({ id: 'session', jwt: token as string })
                    setIsAuthenticated(true)

                    // TODO: fetch user profile
                    // const apiCallwhoAmI
                    // store setUser(apiCallWhoAmI)
                }
                setAuthData(null)
                setIsAuthenticated(false)
            } catch (error) {
                console.error(error)
            } finally {
                if (mounted) setLoading(false)
            }
        })()

        return () => {
            mounted = false
        }
    }, [])

    const login = async (identity: string, password: string) => {
        setLoading(true)
        try {
            const jwt = await apiLogin({ identifier: identity, password: password })
            if (jwt) {
                await secureStorage.saveToken(jwt as string)
                setIsAuthenticated(true)
            } else {
                throw new Error('Login failed: no token returned.')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)
        try {
            await secureStorage.deleteToken()
            setAuthData(null)
            setIsAuthenticated(false)
            setUser(null)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,
                login,
                logout,
                authData,
                user,
            }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext)
}

export { useAuth, AuthContext, AuthProvider }
