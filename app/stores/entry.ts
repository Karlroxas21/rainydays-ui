import { Animated } from 'react-native';
import { create } from 'zustand';

interface AddNewEntry {
    isModalOpen: boolean;
    translateY?: Animated.Value;
    setIsModalOpen: (isOpen: boolean) => void;
    setTranslateY: (v?: Animated.Value) => void;
}

export const useAddEntryStore = create<AddNewEntry>(set => ({
    isModalOpen: false,
    translateY: undefined,
    setIsModalOpen: isOpen => set({ isModalOpen: isOpen }),
    setTranslateY: v => set({ translateY: v }),
}));
