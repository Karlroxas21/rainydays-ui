import React from 'react';
import { View, Text, TextInput, TextInputProps, Platform } from 'react-native';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

/**
 * How to use:
 * <ControlledTextInput
        name="firstName"
        control={control}
        placeholder="First Name"
        rules={{
            required: 'First name is required',
            pattern: {
                value: /^(?!\s*$).+/,
                message: 'Whitespace is not allowed'
            },
            minLength: { value: 2, message: 'Minimum Length 2' }
        }}
        error={errors.firstName?.message}
    />
 */

type InputType = 'number' | 'text';
interface ControlledInputProps<T extends FieldValues> extends TextInputProps {
    control: Control<T>;
    name: Path<T>;
    type?: InputType;
    allowDecimal?: boolean;
    label?: string;
    rules?: RegisterOptions<T>;
    error?: string;
    viewStyle?: string;
    textInputStyle?: string;
}

export const ControlledTextInput = <T extends FieldValues>({
    control,
    name,
    rules,
    error,
    label,
    type = 'text',
    allowDecimal = false,
    viewStyle,
    textInputStyle,
    ...textInputProps // Placeholder, keyboardType, etc.
}: ControlledInputProps<T>) => {
    return (
        <View className={`${viewStyle}`}>
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { onChange, onBlur, value } }) => {
                    const handleChange = (text: string) => {
                        if (type === 'number') {
                            const regex = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;

                            if (!regex.test(text)) return;
                        }

                        onChange(text);
                    };

                    return (
                        <View>
                            {label && <Text className="mb-4 font-semibold">{label}</Text>}
                            <TextInput
                                className={`bg-form-input mb-2 p-3 rounded-xl border border-border-form-input text-black ${textInputStyle}`}
                                onBlur={onBlur}
                                onChangeText={handleChange}
                                value={value}
                                placeholderTextColor="#888"
                                keyboardType={
                                    type === 'number' ? (Platform.OS === 'ios' ? 'decimal-pad' : 'numeric') : 'default'
                                }
                                {...textInputProps}
                            />

                            {error && <Text className="text-red-500 text-xs ml-2 mb-1">{error}</Text>}
                        </View>
                    );
                }}
            />
        </View>
    );
};

export default ControlledTextInput;
