import ActivityIcon from '@/assets/icons/ActivityIcon';
import GroupIcon from '@/assets/icons/GroupIcon';
import HomeIcon from '@/assets/icons/HomeIcon';
import ProfileIcon from '@/assets/icons/ProfileIcon';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BottomNavBar({ state, navigation }: BottomTabBarProps) {
    const navigationItems = [
        {
            value: 'dashboard',
            name: 'Dashboard',
            Icon: HomeIcon,
        },
        {
            value: 'group',
            name: 'Group',
            Icon: GroupIcon,
        },
        {
            value: 'activity',
            name: 'Activity',
            Icon: ActivityIcon,
        },
        {
            value: 'profile',
            name: 'Profile',
            Icon: ProfileIcon,
        },
    ];

    return (
        <SafeAreaView edges={['bottom']}>
            <View className='flex-row h-16 '>
                {state.routes.map((route, idx) => {
                    const item = navigationItems.find(n => n.value === route.name) ?? navigationItems[idx];
                    const isFocused = state.index === idx;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                    };

                    const Icon = item.Icon;
                    if (!Icon) return null;
                    const color = isFocused ? '#111827' : 'none';
                    const selected = isFocused ? 'bold' : 'normal';
                    const size = route.name === 'add' ? 28 : 20;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            className="flex-1 items-center justify-center">
                            <Icon fill={color} width={size} height={size} />
                            {item.name ? (
                                <Text style={{ color, fontSize: 12, fontWeight: selected }}>{item.name}</Text>
                            ) : null}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}
