import { Modal, Pressable, View } from 'react-native';
import { useModalStore } from '../stores/modal';

export default function ModalProvider({ children }: { children: React.ReactNode }) {
    const stack = useModalStore(s => s.stack);
    const hideModal = useModalStore(s => s.hideModal);

    const visible = stack.length > 0;

    return (
        <>
            <Modal visible={visible} transparent animationType="fade" onRequestClose={hideModal}>
                <Pressable className="absolute inset-0 bg-black/50" onPress={hideModal} />
                <View className="absolute inset-0 flex items-center justify-center p-4">
                    {stack.map(entry => {
                        const Component = entry.component;
                        const modalOnClose =
                            typeof entry.props?.onClose === 'function' ? entry.props.onClose : hideModal;

                        return (
                            <Pressable
                                key={entry.key}
                                onPress={() => {}}
                                className="w-full max-w-md bg-white rounded-lg p-4 shadow-lg">
                                <Component
                                    {...entry.props}
                                    onClose={() => {
                                        try {
                                            modalOnClose?.();
                                        } catch (error) {
                                            console.error('Modal onClose threw', error);
                                        }
                                    }}
                                />
                            </Pressable>
                        );
                    })}
                </View>
            </Modal>
            {children}
        </>
    );
}
