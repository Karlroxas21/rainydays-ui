import { getUserGroups, UserGroups } from '@/api/services/group';
import { addEntry } from '@/api/services/user';
import { useAddEntryStore } from '@/app/stores/entry';
import { useAuth } from '@/context/AuthContext';
import { ImagePickerAsset } from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import ControlledImagePicker from '../forms/ControlledImagePicker';
import { ControlledRadioButton } from '../forms/ControlledRadioButton';
import { ControlledRegularRadioButton } from '../forms/ControlledRegularRadioButton';
import ControlledTextInput from '../forms/ControlledTextInput';
import ModalHeader from './ModalHeader';

interface FormValues {
    fundType: string;
    transactionType: string;
    amount: number;
    note?: string;
    photo: ImagePickerAsset;
}

type FundOption = {
    groupName: string;
    id?: string;
};

interface ReactNativeFile {
    uri: string;
    name: string;
    type: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.8;

export default function AddNewEntryModal() {
    const [userGroups, setUserGroups] = useState<UserGroups[]>([]);
    const newEntryModalState = useAddEntryStore(s => s); // get both isModalOpen and translateY

    const visible = newEntryModalState.isModalOpen;
    const translateY = newEntryModalState.translateY || new Animated.Value(SHEET_HEIGHT);
    const setIsModalOpen = useAddEntryStore(s => s.setIsModalOpen);

    const PERSONAL_FUND: FundOption = {
        groupName: 'Personal Fund',
    };
    const { user } = useAuth();

    const closeModal = () => {
        Animated.timing(translateY, {
            toValue: SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setIsModalOpen(false));
    };

    const fundOptions = [PERSONAL_FUND, ...userGroups.map(g => ({ groupName: g.groupName, id: g.id }))];

    const transactionTypeOptions = [
        {
            value: 'DEPOSIT',
            label: 'Deposit',
        },
        {
            value: 'WITHDRAW',
            label: 'Withdraw',
        },
    ];

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            fundType: 'Personal Fund',
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

    const getPhotoName = (transactionType: string) => {
        const timestamp = Date.now();
        const lastName = `${user?.lastName}`;

        return `${transactionType}_${timestamp}_${lastName}`;
    };

    const handleAddToFund = async (data: FormValues) => {
        try {
            if (!user?.id) return;

            const group = userGroups.find(g => g.groupName === data.fundType);
            const groupIdValue = data.fundType === PERSONAL_FUND.groupName ? null : group?.id ?? '';

            const photoToUpload: ReactNativeFile = {
                uri: data.photo.uri,
                name: getPhotoName(data.transactionType), // but in Backend, we enforce photo name.
                type: 'image/jpeg',
            };

            await addEntry({
                userId: user.id,
                entryType: data.transactionType,
                amount: data.amount,
                note: data.note ?? '',
                groupId: groupIdValue ?? '',
                photo: photoToUpload as unknown as Blob,
            });

            
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const fetchUserGroups = async () => {
        const userGroups = await getUserGroups();
        setUserGroups(userGroups);
    };

    useEffect(() => {
        fetchUserGroups();
    }, []);

    return (
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
                            {fundOptions.map((option, i) => (
                                <View key={option.groupName} style={{ marginBottom: i === userGroups.length ? 0 : 8 }}>
                                    <ControlledRadioButton
                                        key={option.groupName}
                                        control={control}
                                        name="fundType"
                                        value={option.groupName}
                                        label={option.groupName}
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
                            <Text className="font-semibold">{fundType}</Text>
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
                                <Text className="text-white font-semibold text-lg">{`Add to ${fundType}`}</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Animated.View>
        </Modal>
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
