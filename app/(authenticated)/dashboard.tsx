import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

const Dashboard = () => {
    const { logout } = useAuth();

    const router = useRouter();
    return (
        <View className="m-auto">
            <TouchableOpacity
                onPress={() => {
                    logout();
                    router.push('/login');
                }}
                className="absolute right-4 top-3">
                <Text className="bordr">Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Dashboard;
