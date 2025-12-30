import { useModalStore } from '@/app/stores/modal';
import CloseIcon from '@/assets/icons/CloseIcon';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
    className?: string;
    title: string;
    onClose?: () => void;
}
export default function ModalHeader({ className, title, onClose }: Props) {
    const { hideModal } = useModalStore();

    return (
        <View className={`${className} flex flex-row items-center justify-between mb-4`}>
            <Text className={`${className} font-bold text-lg mr-auto w-3/4`}>{title}</Text>
            <TouchableOpacity
                onPress={() => {
                    if (onClose) {
                        onClose();
                    } else {
                        hideModal();
                    }
                }}>
                <CloseIcon />
            </TouchableOpacity>
        </View>
    );
}
