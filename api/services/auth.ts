import { BASE_BE_URL } from '@/config';
import { kuhain, paskil } from '../wrapper/http-client';
import { User } from '@/context/AuthContext';

// -- Register --
export interface RegisterRequest {
    emailAddress: string;
    username?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    profileUrl?: string;
    password: string;
}

interface RegisterResponse {
    email: string;
    username: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
    const res = await paskil<RegisterResponse, RegisterRequest>('/user/register', request);
    return res;
}

// -- Login --
export interface Credentials {
    identifier: string;
    password: string;
}
export async function login(credentials: Credentials): Promise<{tokenSession: string}> {
    const jwtSession = await paskil<{tokenSession: string}, Credentials>('/user/login', credentials);

    return jwtSession;
}

// -- Who Am I --
export async function whoAmI(): Promise<User> {
    const data = await kuhain<User>('/user/whoami');

    return data;
}

// -- Reset password --
interface PasswordResetRequest {
    identity: string;
    password: string;
}

export async function resetPassword(request: PasswordResetRequest): Promise<void> {
    await paskil(`${BASE_BE_URL}/user/reset-password`, request);
}
