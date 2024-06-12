import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const ImageWord = () => {
	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='w-full items-center justify-center min-h-[85vh]'>
					<Text className='text-white'>ImageWord</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ImageWord;
