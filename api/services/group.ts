import { kuhain } from '../wrapper/http-client';

export interface UserGroups {
    id: string;
    groupName: string;
    amount: number;
    totalMembers: number;
}

export async function getUserGroups(): Promise<UserGroups[]> {
    const data = await kuhain<UserGroups[]>('/group/user');

    return data;
}
