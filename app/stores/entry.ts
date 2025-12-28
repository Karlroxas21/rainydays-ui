import { create } from 'zustand';

interface AddNewEntry {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

export const useAddEntryStore = create<AddNewEntry>(set => ({
    isModalOpen: false,
    setIsModalOpen: (isOpen) => set({isModalOpen: isOpen}),
}));
