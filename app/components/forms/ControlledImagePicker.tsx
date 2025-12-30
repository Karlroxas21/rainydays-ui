import { Control, Controller, FieldValues, RegisterOptions, Path } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import CloseIcon from '@/assets/icons/CloseIcon';
import CameraIcon from '@/assets/icons/CameraIcon';

interface ControlledImagePickerProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    aspect?: [number, number];
    rules?: RegisterOptions<T>;
}

export default function ControlledImagePicker<T extends FieldValues>({
    control,
    name,
    label,
    aspect,
    rules,
}: ControlledImagePickerProps<T>) {
    const openGallery = async (onChange: any) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect,
            quality: 0.8,
        });

        if (!result.canceled) {
            onChange(result.assets[0]);
        }
    };

    const openCamera = async (onChange: any) => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect,
            quality: 0.8,
        });

        if (!result.canceled) {
            onChange(result.assets[0]);
        }
    };

    const handlePress = (onChange: any) => {
        Alert.alert('Add Photo', 'Choose source', [
            { text: 'Camera', onPress: () => openCamera(onChange) },
            { text: 'Gallery', onPress: () => openGallery(onChange) },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View className="relative">
                    {label && <Text className="mb-4 font-semibold">{label}</Text>}

                    <Pressable
                        onPress={() => handlePress(onChange)}
                        className={`h-40 rounded-lg border-2 border-dashed items-center justify-center overflow-hidden ${
                            error ? 'border-red-500' : 'border-gray-400'
                        }`}>
                        {value ? (
                            <Image source={{ uri: value.uri }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                            <View className='flex items-center justify-center'>
                                <CameraIcon width={24} height={24}/>

                                <Text className="text-gray-500 mt-2">Tap to add photo</Text>
                            </View>
                        )}
                    </Pressable>

                    {value && (
                        <Pressable
                            onPress={() => onChange(null)}
                            className="absolute top-12 right-2 bg-black/60 rounded-full p-2"
                            hitSlop={10}>
                            <CloseIcon fill="#fff" />
                        </Pressable>
                    )}

                    {error && <Text className="mt-1 text-xs text-red-500">{error.message}</Text>}
                </View>
            )}></Controller>
    );
}
