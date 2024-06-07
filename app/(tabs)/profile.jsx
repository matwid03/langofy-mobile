import { ScrollView, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='w-full items-center justify-center min-h-[85vh] px-4 '>
					<Text className='text-xl text-gray-100'>Email: {FIREBASE_AUTH.currentUser?.email}</Text>
					<CustomButton
						title='Wyloguj się'
						handlePress={() => {
							setIsLoading(true);
							FIREBASE_AUTH.signOut();
							setIsLoading(false);
						}}
						containerStyles='mt-7 w-full'
						isLoading={isLoading}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Profile;
