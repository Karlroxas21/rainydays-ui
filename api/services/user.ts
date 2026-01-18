import { authenticatedFetch, kuhain } from '../wrapper/http-client';

interface AddEntryRequest {
    userId: string;
    entryType: string;
    amount: number;
    note?: string;
    photo: Blob;
    groupId: string;
}

interface TotalPersonalFundResponse {
    totalPersonalFund: number;
}

// Will return ID of successfully created entry. Id is UUID.
export async function addEntry(request: AddEntryRequest): Promise<void> {
    const form = new FormData();
    form.append('userId', request.userId);
    form.append('entryType', request.entryType);
    form.append('amount', String(request.amount));
    if (request.note) form.append('note', request.note);
    if (request.groupId) form.append('groupId', request.groupId);

    form.append('photo', request.photo);

    const response = await authenticatedFetch('/user/add-entry', {
        method: 'POST',
        body: form,
    });

    if (!response.ok) {
        throw new Error('Failed to add entry');
    }
}

export async function getTotalPersonalFundCoontributedByuser(userId: string): Promise<TotalPersonalFundResponse> {
    const data = await kuhain<TotalPersonalFundResponse>(`/user/${userId}/total-personal-fund`);

    return data;
}
