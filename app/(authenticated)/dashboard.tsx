import AddPlusIcon from '@/assets/icons/AddPlusIcon';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
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
import { ControlledRegularRadioButton } from '../components/forms/ControlledRegularRadioButton';
import ControlledTextInput from '../components/forms/ControlledTextInput';
import ControlledImagePicker from '../components/forms/ControlledImagePicker';
import { snakeToTitleCase } from '../utils/strings';
import { useAuth } from '@/context/AuthContext';
import { ImagePickerAsset } from 'expo-image-picker';

interface FormValues {
    fundType: string;
    transactionType: string;
    amount: number;
    note?: string;
    photo: ImagePickerAsset;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.8;

export default function Dashboard() {
    const [visible, setVisible] = useState(false);

    const { user } = useAuth();

    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            fundType: 'personal_fund',
            transactionType: 'deposit',
        },
    });

    const fundType = watch('fundType');
    const transactionType = watch('transactionType');
    const amount = watch('amount');
    const photo = watch('photo');

    const enableSubmitButton =
        !!fundType &&
        !!transactionType &&
        !!amount &&
        !!photo &&
        !errors.fundType &&
        !errors.transactionType &&
        !errors.amount &&
        !errors.note &&
        !errors.photo;

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
            // icon: <GemIcon width={25} height={25} />,
        },
        {
            value: 'family_savers',
            label: 'Family Savers',
            subLabel: '5 members',
            // icon: <GemIcon width={25} height={25} />,
        },
    ];

    const transactionTypeOptions = [
        {
            value: 'deposit',
            label: 'Deposit',
        },
        {
            value: 'withdraw',
            label: 'Withdraw',
        },
    ];

    const getPhotoName = (transactionType: string) => {
        const timestamp = Date.now();
        const lastName = `${user?.lastName}`;

        return `${transactionType}_${timestamp}_${lastName}`;
    };

    const handleAddToFund = (data: FormValues) => {
        const formData = new FormData();
        try {
            formData.ap
            getPhotoName(data.transactionType);
        } catch (error) {}
        console.log('DATA: ', data);
    };

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

            {/* ---------- */}
            {/* MODAL */}
            <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={closeModal}>
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View className="flex-1 bg-[rgba(0,0,0,0.35)]" />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.sheet, { height: SHEET_HEIGHT, transform: [{ translateY }] }]}>
                    <View className="p-5 flex-1">
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
                            <View className="mt-4">
                                <Text className="font-semibold">Transaction Type:</Text>
                                <View accessibilityRole="radiogroup" className="flex-row flex-wrap justify-between">
                                    {transactionTypeOptions.map(option => (
                                        <View key={option.value} className="w-1/2">
                                            <ControlledRegularRadioButton
                                                key={option.label}
                                                control={control}
                                                name="transactionType"
                                                label={option.label}
                                                value={option.value}
                                                rules={{
                                                    required: 'Select your transaction type.',
                                                }}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Amount */}
                            <ControlledTextInput
                                name="amount"
                                type="number"
                                control={control}
                                allowDecimal
                                label="Amount"
                                rules={{
                                    required: 'Amount is required',
                                    pattern: { value: /^\d+(\.\d+)?$/, message: 'Invalid amount' },
                                }}
                                error={errors.amount?.message}
                                autoCapitalize="none"
                                textInputStyle="!rounded-lg !border-border-form-input "
                            />

                            {/* Note (Optional) */}
                            <ControlledTextInput
                                name="note"
                                control={control}
                                allowDecimal
                                label="Note (Optional)"
                                error={errors.note?.message}
                                rules={{
                                    required: false,
                                    maxLength: { value: 40, message: 'Max characters length 40' },
                                }}
                                autoCapitalize="none"
                                textInputStyle="!rounded-lg !border-border-form-input "
                            />

                            {/* Photo */}
                            <ControlledImagePicker
                                control={control}
                                name="photo"
                                label="Photo"
                                rules={{ required: 'Photo is required' }}
                            />

                            {/* Contributing to: */}
                            <View className="border border-border-form-input mt-4 rounded-lg p-4 bg-form-input">
                                <Text className="text-sm">Contributing to:</Text>
                                <Text className="font-semibold">{snakeToTitleCase(fundType)}</Text>
                            </View>

                            {/* Submit */}
                            <TouchableOpacity
                                className={`p-2 rounded-lg items-center mt-4 mb-4 ${
                                    !enableSubmitButton ? 'bg-gray-400' : 'bg-button-base'
                                }`}
                                disabled={!enableSubmitButton}
                                onPress={handleSubmit(handleAddToFund)}>
                                {isSubmitting ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-semibold text-lg">{`Add to ${snakeToTitleCase(
                                        fundType
                                    )}`}</Text>
                                )}
                            </TouchableOpacity>
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
