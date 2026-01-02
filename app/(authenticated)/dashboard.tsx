import AddPlusIcon from '@/assets/icons/AddPlusIcon';
import React from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddEntryStore } from '../stores/entry';
import AddNewEntryModal from '../components/modal/AddNewEntryModal';

export default function Dashboard() {
    const setIsModalOpen = useAddEntryStore(s => s.setIsModalOpen);
    const setTranslateY = useAddEntryStore(s => s.setTranslateY);

    const SHEET_HEIGHT = Dimensions.get('window').height * 0.8;
    const translateY = React.useRef(new Animated.Value(SHEET_HEIGHT)).current;

    const openModal = () => {
        setTranslateY(translateY);
        setIsModalOpen(true);
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <SafeAreaView className="">
            {/* HEADER */}
            <View className="px-5 py-4 flex flex-row items-center justify-between shadow-md">
                <View className="">
                    <Text className="text-2xl font-bold">RainyDays</Text>
                    <Text className="text-md text-text-secondary">Build your safety net</Text>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            openModal();
                        }}>
                        <AddPlusIcon width={40} height={40} />
                    </TouchableOpacity>
                </View>
            </View>

            <View className='bg-[rgb(228,231,235)] h-full'></View>
            {/* ---------- */}
            {/* MODAL */}
            <AddNewEntryModal />
        </SafeAreaView>
    );
}
