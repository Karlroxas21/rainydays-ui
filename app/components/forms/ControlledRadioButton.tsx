import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { TouchableOpacity, View, Text } from 'react-native';

interface ControlledRadioProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    value: string | number;
    label: string;
    subLabel: string;
    Icon?: React.ReactNode;
    rules?: RegisterOptions<T>;
    disabled?: boolean;
    className?: string;
}

const RadioIndicator = ({ selected }: { selected: boolean }) => {
    return (
        <View
            accessible
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className="flex items-center justify-center"
            style={{
                width: 20,
                height: 20,
                borderWidth: selected ? 6 : 2,
                borderRadius: 10,
                borderColor: '#0f172a',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            {selected ? (
                <View
                    style={{
                        backgroundColor: 'bg-white',
                    }}
                />
            ) : null}
        </View>
    );
};

export const ControlledRadioButton = <T extends FieldValues>({
    control,
    name,
    value,
    label,
    subLabel,
    Icon,
    rules,
    disabled = false,
    className,
}: ControlledRadioProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value: currentValue } }) => {
                const selected = currentValue === value;

                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            if (!disabled) onChange(value);
                        }}
                        accessibilityRole="button"
                        accessibilityState={{ disabled, selected }}
                        className={`w-full flex-row items-center justify-between p-5  rounded-lg border border-border-form-input ${selected ? 'bg-base' : 'bg-white'} ${className}`}>
                        <View className="flex-row items-center flex-1">
                            <RadioIndicator selected={selected} />

                            <View className="px-5">
                                <Text className="font-semibold text-base text-text-base">{label}</Text>
                                {subLabel ? <Text className="text-sm text-text-secondary">{subLabel}</Text> : null}
                            </View>
                        </View>
                        {Icon}
                    </TouchableOpacity>
                );
            }}></Controller>
    );
};
