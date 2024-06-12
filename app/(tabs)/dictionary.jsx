import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dictionary = () => {
	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='flex-1 items-center justify-center min-h-[85vh]'>
					<Text className='text-white'>Słownik</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Dictionary;
