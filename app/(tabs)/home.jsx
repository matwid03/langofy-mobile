import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from 'expo-router';
import logo from '../../assets/icons/logo.png';

const Home = () => {
	const navigation = useNavigation();
	const [points, setPoints] = useState(0);
	const [difficulty, setDifficulty] = useState('easy');

	useFocusEffect(
		React.useCallback(() => {
			const fetchUserDetails = async () => {
				const user = FIREBASE_AUTH.currentUser;
				if (!user) {
					return;
				}

				try {
					const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
					const userDoc = await getDoc(userDocRef);
					if (userDoc.exists()) {
						const userData = userDoc.data();
						const userPoints = userData.points || 0;
						const userDifficultyLevel = userData.difficultyLevel || 'easy';

						setPoints(userPoints);

						setDifficulty(userDifficultyLevel);
					}
				} catch (error) {
					console.error('Błąd podczas pobierania danych:', error);
				}
			};

			console.log(points);
			console.log(difficulty);

			fetchUserDetails();
		}),
	);

	const handleActivitySelect = (activityType) => {
		navigation.navigate(activityType, { difficulty });
	};

	return (
		<SafeAreaView className='h-full bg-slate-200'>
			<ScrollView>
				<View className='items-center '>
					<Image className='w-80 h-80' source={logo}></Image>
				</View>
				<View className=' items-center justify-center  px-4 '>
					<Text className='text-gray-950 text-4xl'>Wybierz Konkurencję</Text>
					<CustomButton title='Zgadnij Słówko' handlePress={() => handleActivitySelect('translation')} containerStyles='mt-8 w-full' />
					<CustomButton title='Obrazek i Słówko' handlePress={() => handleActivitySelect('imageWord')} containerStyles='mt-8 w-full' />
					<CustomButton title='Tworzenie Zdań' handlePress={() => handleActivitySelect('sentences')} containerStyles='mt-8 w-full' />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;
