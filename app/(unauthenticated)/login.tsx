import { Credentials, login } from '@/api/services/auth';
import EyeHideIcon from '@/assets/icons/EyeHideIcon';
import EyeShowIcon from '@/assets/icons/EyeShowIcon';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import { ControlledTextInput } from '../components/forms/ControlledTextInput';

interface FormValues {
    identifier: string;
    password: string;
}

export default function Login() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const router = useRouter();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onChange',
    });

    const identifier = watch('identifier');
    const password = watch('password');

    // clear global auth error when user starts typing again.
    useEffect(() => {
        if (authError) {
            setAuthError(null);
        }
    }, [identifier, password]);

    const enableLoginButton = !!identifier && !!password && !errors.identifier && !errors.password;

    const handleLogin = async (data: FormValues) => {
        try {
            const creds: Credentials = { identifier: data.identifier, password: data.password };
            await login(creds);

            router.push('/(authenticated)/dashboard');
        } catch (error: any) {
            // TODO: ADD TRY AGAIN ERROR MODAL
            if (error.message.includes('401') || error.message.includes('403')) {
                setAuthError('Invalid email or password.');
            } else if (error.message === 'Network request failed') {
                setAuthError('No internet connection.');
            } else {
                setAuthError('An unexpected error occurred. Please try again.');
            }
            console.error('Error logging in: ', error);
        }
    };
    return (
        <View className="flex-1 justify-center px-5 bg-base">
            <Text className="text-2xl font-semibold text-text-base text-center font-inter">RainyDays</Text>
            <Text className="text-lg mb-8 text-center text-text-secondary">Start building your safety net today</Text>

            <View className="w-full bg-white rounded-xl p-5 shadow-xl">
                <ControlledTextInput
                    name="identifier"
                    control={control}
                    placeholder="Email Address"
                    keyboardType="email-address"
                    rules={{
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                    }}
                    error={errors.identifier?.message}
                    autoCapitalize="none"
                />

                <View className="relative">
                    <ControlledTextInput
                        name="password"
                        control={control}
                        placeholder="Password"
                        rules={{
                            required: 'Password is required',
                            pattern: { value: /^(?!\s*$).+/, message: 'Whitespace is not allowed' },
                        }}
                        error={errors.password?.message}
                        autoCapitalize="none"
                        secureTextEntry={!isPasswordVisible}
                    />

                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-4 top-3">
                        {isPasswordVisible ? <EyeShowIcon /> : <EyeHideIcon />}
                    </TouchableOpacity>
                </View>

                {authError && (
                    <View className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                        <Text className="text-red-600 text-center font-medium">{authError}</Text>
                    </View>
                )}
                <TouchableOpacity
                    className={`p-4 rounded-lg items-center mt-4 mb-4 ${
                        !enableLoginButton ? 'bg-gray-400' : 'bg-button-base'
                    }`}
                    disabled={!enableLoginButton}
                    onPress={handleSubmit(handleLogin)}>
                    <Text className="text-white font-semibold text-lg">Login</Text>
                </TouchableOpacity>

                <Text className="text-center text-text-secondary">
                    Don&apos;t have an account?{' '}
                    <Link href="/" className="text-text-link font-semibold">
                        Sign Up
                    </Link>
                </Text>
            </View>

            <View className="mt-5 bg-white flex flex-row justify-around p-4 rounded-xl shadow-md">
                <View className="flex-1 items-center just-center">
                    <Text className="text-center text-sm font-semibold text-text-base">💰 Track</Text>
                </View>
                <View className="flex-1 items-center just-center">
                    <Text className="text-center text-sm font-semibold text-text-base">☔ Save</Text>
                </View>
                <View className="flex-1 items-center just-center">
                    <Text className="text-center text-sm font-semibold text-text-base">📈 Grow</Text>
                </View>
            </View>
        </View>
    );
}
