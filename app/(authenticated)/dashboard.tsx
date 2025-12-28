import AddPlusIcon from '@/assets/icons/AddPlusIcon';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModalHeader from '../components/modal/ModalHeader';
import { useForm } from 'react-hook-form';
import { ControlledRadioButton } from '../components/forms/ControlledRadioButton';
import GemIcon from '@/assets/icons/GemIcon';

interface FormValues {
    fundType: string;
    // fundAction: string;
    // amout: number;
    // note?: string;
    // photo: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.8;

export default function Dashboard() {
    const [visible, setVisible] = useState(false);

    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onChange',
    });

    const openModal = () => {
        setVisible(true);
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(translateY, {
            toValue: SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    // GET OPTIONS FROM API.
    // THIS IS TEMPORARY.
    const fundTypeOptions = [
        {
            value: 'personal_fund',
            label: 'Personal Fund',
            subLabel: 'Your personal emergency fund',
            icon: <GemIcon width={25} height={25} />,
        },
        {
            value: 'family_savers',
            label: 'Family Savers',
            subLabel: '5 members',
            icon: <GemIcon width={25} height={25} />,
        },
    ];

    return (
        <SafeAreaView className="bg-[rgb(228,231,235)]">
            {/* HEADER */}
            <View className="px-5 py-4 flex flex-row items-center justify-between shadow-md">
                <View className="">
                    <Text className="text-2xl font-bold">RainyDays</Text>
                    <Text className="text-md text-text-secondary">Build your safety net</Text>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            // showModal({
                            //     component: AddNewEntryModal,
                            //     props: {
                            //         onClose: () => {},
                            //     },
                            // });
                            openModal();
                        }}>
                        <AddPlusIcon width={40} height={40} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* MODAL */}
            <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={closeModal}>
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View className="flex-1 bg-[rgba(0,0,0,0.35)]" />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.sheet, { height: SHEET_HEIGHT, transform: [{ translateY }] }]}>
                    <View className="p-5">
                        <View>
                            <ModalHeader title="Add New Entry" onClose={closeModal} />
                        </View>

                        {/* FORM */}
                        <ScrollView className="">
                            {/* Add to Fund */}
                            <Text className="font-semibold mb-4">Add to Fund</Text>
                            <View accessibilityRole="radiogroup">
                                {fundTypeOptions.map((option, i) => (
                                    <View
                                        key={option.value}
                                        style={{ marginBottom: i === fundTypeOptions.length - 1 ? 0 : 8 }}>
                                        <ControlledRadioButton
                                            key={option.label}
                                            control={control}
                                            name="fundType"
                                            value={option.value}
                                            label={option.label}
                                            subLabel={option.subLabel}
                                            rules={{
                                                required: 'Add to Fund is required',
                                            }}
                                        />
                                    </View>
                                ))}
                            </View>
                            {/* Transaction Type */}
                            <View className='mt-4'>
                                <Text className="font-semibold mb-4">Transaction Type:</Text>
                            </View>
                        </ScrollView>
                    </View>
                </Animated.View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 10,
    },
});
