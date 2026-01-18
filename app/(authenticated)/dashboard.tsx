import AddPlusIcon from '@/assets/icons/AddPlusIcon';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddEntryStore } from '../stores/entry';
import AddNewEntryModal from '../components/modal/AddNewEntryModal';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, PhilippinePeso, Plus } from 'lucide-react-native';
import { useFunds } from '../stores/fund';
import { getTotalPersonalFundCoontributedByuser } from '@/api/services/user';

export default function Dashboard() {
    const setIsModalOpen = useAddEntryStore(s => s.setIsModalOpen);
    const setTranslateY = useAddEntryStore(s => s.setTranslateY);

    const personalFund = useFunds(s => s.personalFund);
    const setPersonalFund = useFunds(s => s.setPersonalFund);

    const isPersonalFundEmpty = personalFund === 0 ? true : false;

    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFund();
        setRefreshing(false);
    };

    const fetchFund = useCallback(async () => {
        if (!user?.id) return;

        const fetchPersonalFund = await getTotalPersonalFundCoontributedByuser(user?.id);

        setPersonalFund(fetchPersonalFund.totalPersonalFund);
    }, [user?.id, setPersonalFund]);

    useEffect(() => {
        fetchFund();
    }, [fetchFund]);

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

    const YourEmergencyFund = () => {
        return (
            <View className="bg-white rounded-lg h-auto px-5 py-4 text-slate-200 shadow">
                <Text className="text-lg font-bold mb-2">Your Emergency Fund</Text>
                {user?.goal === 0 && isPersonalFundEmpty ? (
                    <View className="flex flex-row">
                        <Text>Set your personal fund! </Text>
                    </View>
                ) : !isPersonalFundEmpty ? (
                    <View>
                        <View className="flex flex-row items-center">
                            <Text className="text-xl">Current total funds: </Text>
                            <Text className="font-semibold text-xl">
                                <PhilippinePeso size={14} /> {personalFund}
                            </Text>
                        </View>
                        {/* Add Navigate here to add goal view */}
                        <View className="flex flex-row items-center mt-2">
                            {/* <Link href="/(unauthenticated)/register" className="text-text-link font-semibold">
                                                    Set your goals!
                                                </Link> */}
                            <Text className="mr-2">Set your goals!</Text>
                            <ArrowRight size={16} />
                        </View>
                    </View>
                ) : (
                    <View>
                        <Text> {user?.goal}</Text>
                    </View>
                )}
                <Pressable
                    className="flex flex-row bg-button-base mt-4 py-2 px-4 rounded-xl justify-center items-center "
                    onPress={() => {
                        openModal();
                    }}>
                    <Plus color="white" width={'18px'} height={'18px'} />
                    <Text className="text-white">Add Funds</Text>
                </Pressable>
            </View>
        );
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

            {/* BODY */}
            <ScrollView
                className="bg-[rgb(228,231,235)] h-full"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View className="p-8">
                    <View>
                        <YourEmergencyFund />
                    </View>
                </View>
            </ScrollView>
            {/* ---------- */}
            {/* MODAL */}
            <AddNewEntryModal />
        </SafeAreaView>
    );
}
