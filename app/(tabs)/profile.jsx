import { ScrollView, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import CustomButton from '../../components/CustomButton';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc } from 'firebase/firestore';

const Profile = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [username, setUsername] = useState('');
	const [avatar, setAvatar] = useState('');
	const [topPlayers, setTopPlayers] = useState([]);

	useFocusEffect(
		useCallback(() => {
			const fetchProfileData = async () => {
				try {
					const currentUser = FIREBASE_AUTH.currentUser;
					if (currentUser) {
						setUsername(currentUser.displayName);

						const userDocRef = doc(FIRESTORE_DB, 'users', currentUser.uid);
						const userDoc = await getDoc(userDocRef);
						if (userDoc.exists()) {
							const userData = userDoc.data();
							setAvatar(userData.avatarUrl || '');
						}
					}
				} catch (error) {
					console.error('Błąd podczas pobierania danych użytkownika:', error);
				}
			};

			const fetchTopPlayers = async () => {
				try {
					const playersRef = collection(FIRESTORE_DB, 'users');
					const q = query(playersRef, orderBy('points', 'desc'), limit(10));
					const querySnapshot = await getDocs(q);

					const players = querySnapshot.docs.map((doc) => doc.data());
					setTopPlayers(players);
				} catch (error) {
					console.error('Błąd podczas pobierania rankingu:', error);
				}
			};

			const controller = new AbortController();

			if (FIREBASE_AUTH.currentUser) {
				fetchProfileData(controller);
				fetchTopPlayers(controller);
			}

			return () => {
				controller.abort();
			};
		}, []),
	);

	const handleSignOut = async () => {
		setIsLoading(true);
		await FIREBASE_AUTH.signOut();
		Alert.alert('Sukces', 'Wylogowano!');
		router.replace('/sign-in');
		setIsLoading(false);
	};

	const pickImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (!result.canceled) {
				setIsLoading(true);
				const { uri } = result;
				const user = FIREBASE_AUTH.currentUser;
				const response = await fetch(uri);
				const blob = await response.blob();
				const storageRef = ref(FIREBASE_STORAGE, `avatars/${user.uid}`);
				await uploadBytes(storageRef, blob);
				const downloadURL = await getDownloadURL(storageRef);

				const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
				await updateDoc(userDocRef, { avatarUrl: downloadURL });
				console.log('Selected image URI:', uri);

				setAvatar(downloadURL);
				setIsLoading(false);
			}
		} catch (error) {
			console.error('Błąd podczas przesyłania awatara:', error.message);
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView className='bg-slate-200 h-full'>
			<ScrollView>
				<View className=' items-center justify-center min-h-[85vh] px-4 '>
					<TouchableOpacity onPress={pickImage} className='mb-4'>
						{avatar ? (
							<Image source={{ uri: avatar }} className='w-24 h-24 rounded-full' />
						) : (
							<View className='w-24 h-24 rounded-full bg-gray-400 items-center justify-center'>
								<Text className='text-xl text-blue-500'>Dodaj avatar</Text>
							</View>
						)}
					</TouchableOpacity>
					<Text className='text-xl text-gray-950'>Nazwa użytkownika: {username}</Text>
					<Text className='text-xl text-gray-950 '>Email: {FIREBASE_AUTH.currentUser?.email}</Text>

					<View className='mt-10 border-y-2 border-gray-800 pt-6'>
						<Text className='text-2xl text-gray-950 mb-4'>Ranking graczy:</Text>
						{topPlayers.map((player, index) => (
							<View key={index} className='flex-row justify-between w-full mb-2 px-4'>
								<Text className='text-xl text-gray-950'>
									{index + 1}. {player.username}
								</Text>
								<Text className='text-xl text-gray-950'>{player.points} pkt</Text>
							</View>
						))}
					</View>
					<CustomButton title='Wyloguj się' handlePress={handleSignOut} containerStyles='mt-7 w-full' isLoading={isLoading} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Profile;
