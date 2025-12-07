import { BASE_BE_URL } from '@/config';
import { paskil } from '../wrapper/http-client';

// -- Register --
interface RegisterRequest {
    email_address: string
    username: string
    first_name: string
    middle_name?: string
    last_name: string
    suffix?: string
    profile_url?: string
    password: string
}

interface RegisterResponse {
    email: string
    username: string
    first_name: string
    middle_name?: string
    last_name: string
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
    const res = await paskil<RegisterResponse, RegisterRequest>(`${BASE_BE_URL}/user/register`, request);
    return res;
}

// -- Login --
interface Credentials {
    identifier: string
    password: string
}
export async function login(credentials: Credentials): Promise<string> {
    const jwtSession = await paskil<string, Credentials>(`${BASE_BE_URL}/user/login`, credentials);

    return jwtSession;
}

// -- Reset password --
interface PasswordResetRequest {
    identity: string
    password: string
}

export async function resetPassword(request: PasswordResetRequest): Promise<void> {
    await paskil(`${BASE_BE_URL}/user/reset-password`, request);
}
