import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { ControlledTextInput } from '../components/forms/ControlledTextInput';
import DoneIcon from '@/assets/icons/DoneIcon';
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import { register, RegisterRequest } from '@/api/services/auth';
import EyeShowIcon from '@/assets/icons/EyeShowIcon';
import EyeHideIcon from '@/assets/icons/EyeHideIcon';

interface FormValues {
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    emailAddress: string;
    password: string;
    confirmPassword: string;
}

export default function Register() {
    const [step, setStep] = useState<number>(1);
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const router = useRouter();

    const next = () => setStep(s => s + 1);
    const back = () => setStep(s => s - 1);

    const {
        control,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onChange',
    });

    const firstName = watch('firstName');
    const lastName = watch('lastName');
    const emailAddress = watch('emailAddress');
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    const isStepOneValid =
        !!firstName && !!lastName && !errors.firstName && !errors.lastName && !errors.middleName && !errors.suffix;

    const isPasswordMatched = password === confirmPassword;

    const isCreateAccountValid = isStepOneValid && !!emailAddress && !errors.emailAddress;

    const handleSignUp = async (data: FormValues) => {
        if (!isPasswordMatched) {
            setError('password', {
                type: 'manual',
                message: 'Password does not match.',
            });

            setError('confirmPassword', {
                type: 'manual',
                message: 'Password does not match.',
            });
            return;
        }

        try {
            const request: RegisterRequest = {
                emailAddress: data.emailAddress,
                firstName: data.firstName,
                middleName: data?.middleName,
                lastName: data.lastName,
                suffix: data?.suffix,
                password: data.password,
            };

            await register(request);

            setRegisterSuccess(true);

            return;
        } catch (error) {
            // TODO: ADD TRY AGAIN ERROR MODAL
            console.error('Error signing up: ', error);
        }
    };

    return (
        <View className="flex-1 justify-center px-5 bg-base">
            <Text className="text-2xl font-semibold text-text-base text-center">RainyDays</Text>
            <Text className="text-lg mb-8 text-center text-text-secondary">Start building your safety net today</Text>

            <View className="flex flex-col gap-2 w-full bg-white rounded-xl p-5 shadow-xl">
                {step === 1 && (
                    <>
                        <ControlledTextInput
                            name="firstName"
                            control={control}
                            placeholder="First Name"
                            rules={{
                                required: 'First name is required',
                                pattern: {
                                    value: /^(?!\s*$).+/,
                                    message: 'Whitespace is not allowed',
                                },
                                minLength: { value: 2, message: 'Minimum Length 2' },
                            }}
                            error={errors.firstName?.message}
                        />

                        <ControlledTextInput
                            name="middleName"
                            control={control}
                            placeholder="Middle Name (Optional)"
                            rules={{
                                pattern: {
                                    value: /^(?!\s*$).+/,
                                    message: 'Whitespace is not allowed',
                                },
                            }}
                            error={errors.middleName?.message}
                        />

                        <ControlledTextInput
                            name="lastName"
                            control={control}
                            placeholder="Last Name"
                            rules={{
                                required: 'Last name is required',
                                pattern: {
                                    value: /^(?!\s*$).+/,
                                    message: 'Whitespace is not allowed',
                                },
                                minLength: { value: 2, message: 'Minimum Length 2' },
                            }}
                            error={errors.lastName?.message}
                        />

                        <ControlledTextInput
                            name="suffix"
                            control={control}
                            placeholder="Suffix"
                            rules={{
                                pattern: {
                                    value: /^(?!\s*$).+/,
                                    message: 'Whitespace is not allowed',
                                },
                                minLength: { value: 3, message: 'Minimum Length 3' },
                            }}
                            error={errors.suffix?.message}
                        />

                        <TouchableOpacity
                            className={`p-4 rounded-lg items-center ${
                                !isStepOneValid ? 'bg-gray-400' : 'bg-button-base'
                            }`}
                            onPress={next}
                            disabled={!isStepOneValid}>
                            <Text className="text-white font-semibold text-lg">Next</Text>
                        </TouchableOpacity>
                    </>
                )}

                {step === 2 && (
                    <>
                        <ControlledTextInput
                            name="emailAddress"
                            control={control}
                            placeholder="Email Address"
                            keyboardType="email-address"
                            rules={{
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                            }}
                            error={errors.emailAddress?.message}
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
                                    minLength: { value: 12, message: 'Minimum length 12' },
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

                        <View>
                            <ControlledTextInput
                                name="confirmPassword"
                                control={control}
                                placeholder="Confirm Password"
                                rules={{
                                    required: 'Confirm Password is required',
                                    pattern: { value: /^(?!\s*$).+/, message: 'Whitespace is not allowed' },
                                    minLength: { value: 12, message: 'Minimum length 12' },
                                }}
                                error={errors.confirmPassword?.message}
                                autoCapitalize="none"
                                secureTextEntry={!isConfirmPasswordVisible}
                            />

                            <TouchableOpacity
                                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                className="absolute right-4 top-3">
                                {isConfirmPasswordVisible ? <EyeShowIcon /> : <EyeHideIcon />}
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between">
                            <TouchableOpacity className="p-4" onPress={back}>
                                <Text className="text-text-link font-semibold">Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`p-4 rounded-lg items-center ${
                                    !isCreateAccountValid ? 'bg-gray-400' : 'bg-button-base'
                                }`}
                                disabled={!isCreateAccountValid}
                                onPress={handleSubmit(handleSignUp)}>
                                <Text className="text-white font-semibold text-lg">Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                <Text className="text-center text-text-secondary mt-2">
                    Already have an account?{' '}
                    <Link href="/login" className="text-text-link font-semibold">
                        Login
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

            {/* MODAL */}
            <Modal
                animationType="slide"
                visible={registerSuccess}
                onRequestClose={() => {
                    setRegisterSuccess(false);
                }}>
                <View className="flex m-auto items-center justify-center ">
                    <View className="flex flex-col items-center gap-3">
                        <DoneIcon />
                        <Text className="text-xl font-bold">You&apos;ve successfully register!</Text>
                        <TouchableOpacity
                            className="p-4 flex-row items-center"
                            onPress={() => {
                                router.push('/login');
                                setRegisterSuccess(false);
                            }}>
                            <Link href="/login" className="text-text-link font-semibold">
                                Login
                            </Link>
                            <ArrowRightIcon width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
