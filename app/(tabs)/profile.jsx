import { ScrollView, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomButton from '../../components/CustomButton';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const Profile = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [username, setUsername] = useState('');

	useEffect(() => {
		const fetchUsername = async () => {
			try {
				const currentUser = FIREBASE_AUTH.currentUser;
				if (currentUser) {
					console.log(currentUser.displayName);
					setUsername(currentUser.displayName);
				}
			} catch (error) {
				console.error('Błąd podczas pobierania nazwy użytkownika:', error);
			}
		};

		fetchUsername();
	}, []);

	const handleSignOut = async () => {
		setIsLoading(true);
		await FIREBASE_AUTH.signOut();
		alert('Wylogowano!');
		router.replace('/sign-in');
		setIsLoading(false);
	};

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='w-full items-center justify-center min-h-[85vh] px-4 '>
					<Text className='text-xl text-gray-100'>Nazwa użytkownika: {username}</Text>
					<Text className='text-xl text-gray-100'>Email: {FIREBASE_AUTH.currentUser?.email}</Text>
					<CustomButton title='Wyloguj się' handlePress={handleSignOut} containerStyles='mt-7 w-full' isLoading={isLoading} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Profile;
