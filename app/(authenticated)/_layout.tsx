import { Tabs } from 'expo-router';
import BottomNavBar from '../components/BottomNavBar';

export default function AuthenticatedLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }} tabBar={props => <BottomNavBar {...props}/>}>
            <Tabs.Screen name="dashboard" options={{}}></Tabs.Screen>
            <Tabs.Screen name="group" options={{}}></Tabs.Screen>
            <Tabs.Screen name="activity" options={{}}></Tabs.Screen>
            <Tabs.Screen name="profile" options={{}}></Tabs.Screen>
        </Tabs>
    );
}
