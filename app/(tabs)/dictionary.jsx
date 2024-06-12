import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddWordToDictionary from '../../components/AddWordToDictionary';

const Dictionary = () => {
	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='flex-1 items-center justify-center min-h-[30vh]'>
					<Text className='text-white text-2xl mb-4'>Słownik</Text>
					<AddWordToDictionary />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Dictionary;
