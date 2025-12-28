import { ReactNode } from 'react';
import { create } from 'zustand';

interface BaseModalProps {
    onClose?: () => void;
    children?: ReactNode;
    title?: string;
}

type ModalEntry = {
    key: string;
    component: React.ComponentType<any>;
    props: Record<string, any>;
};

interface ModalState {
    stack: ModalEntry[];
    showModal: <T extends BaseModalProps>(opts: {
        component: React.ComponentType<T>;
        props?: Omit<T, 'onClose'> & { onClose?: (() => void) | undefined };
        stack?: boolean;
    }) => void;
    hideModal: () => void;
    hideAll: () => void;
//     showAlert: (props: Record<string, any>) => void;
//     showConfirm: (props: Record<string, any>) => void;
}

export const useModalStore = create<ModalState>((set) => ({
    stack: [],
    showModal: ({ component, props = {}, stack = true }) => {
        const entry: ModalEntry = {
            key: `${Date.now()}_${Math.random()}`,
            component,
            props,
        };
        set(s => ({ stack: stack ? [...s.stack, entry] : [entry] }));
    },
    hideModal: () => set(s => ({ stack: s.stack.slice(0, -1) })),
    hideAll: () => set({ stack: [] }),
    // showAlert: props => {
    //     const AlertModal = require('@/app/modals/AlertModal').default;
    //     get().showModal({
    //         component: AlertModal,
    //         props: { onClose: get().hideModal, ...props },
    //     });
    // },
    // showConfirm: props => {
    //     const ConfirmModal = require('@/app/modals/ConfirmModal').default;
    //     get().showModal({
    //         component: ConfirmModal,
    //         props: { onClose: get().hideModal, ...props },
    //     });
    // },
}));
