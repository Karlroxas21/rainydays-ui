import { View, Text } from 'react-native';
import ModalHeader from './ModalHeader';

export default function AddNewEntryModal() {
    return (
        <View>
            <ModalHeader title={'Add New Entry'} />
            <Text> MODAL!</Text>
        </View>
    );
}
