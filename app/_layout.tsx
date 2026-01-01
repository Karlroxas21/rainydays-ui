import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Slot } from 'expo-router';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import './globals.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ModalProvider from './provider/ModalProvider';
import Toast from 'react-native-toast-message';

function RootNavigator() {
    const { isInitialLoading } = useAuth();

    if (isInitialLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <StatusBar barStyle={'dark-content'} />
                <ModalProvider>
                    <RootNavigator />
                </ModalProvider>
                <Toast />
            </SafeAreaProvider>
        </AuthProvider>
    );
}
