import { createContext, ReactNode, useState, useContext } from "react";

interface AuthData {
    id: string;
    jwt: string;

}

interface User {
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    profileUrl?: string;
}

interface Context {
    isAuthenticated: boolean;
    login: (identity: string, password: string) => void;
    logout: () => void;
    authData: AuthData | null;
    user: User | null;

}

interface Provider {
    children: ReactNode;
}

const AuthContext = createContext<Context>({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    authData: null,
    user: null
});

const AuthProvider = ({ children }: Provider) => {
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState(false);
    const [user, setUser] = useState<User>();

    const isAuthenticated = false;

    const login = async () => { };

    const logout = async () => { };

    const authData = null;

    const userData = null;

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            authData,
            user: userData
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext);
}

export { useAuth, AuthContext, AuthProvider };
