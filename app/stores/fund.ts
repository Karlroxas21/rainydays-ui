import { create } from 'zustand';

interface Funds{
    personalFund: number;
    setPersonalFund: (value: number) => void;
}

export const useFunds = create<Funds>(set => ({
    personalFund: 0,
    setPersonalFund: (val) => set({personalFund: val}),
}));