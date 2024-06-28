import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
	const navigation = useNavigation();

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='w-full items-center justify-center min-h-[85vh] px-4 '>
					<Text className='text-white text-4xl'>Wybierz Poziom</Text>
					<CustomButton title='Słówka' handlePress={() => navigation.navigate('translation')} containerStyles='mt-7 w-full' />
					<CustomButton title='Obrazki' handlePress={() => navigation.navigate('imageWord')} containerStyles='mt-7 w-full' />
					<CustomButton title='Zdania' handlePress={() => navigation.navigate('sentences')} containerStyles='mt-7 w-full' />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;
