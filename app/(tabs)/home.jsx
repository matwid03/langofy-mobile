import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from 'expo-router';

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

						// if (userData.difficultyLevel !== newDifficulty) {
						// 	await updateDoc(userDocRef, { difficultyLevel: newDifficulty });
						// }
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
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='w-full items-center justify-center min-h-[85vh] px-4 '>
					<Text className='text-white text-4xl'>Wybierz Poziom</Text>
					<CustomButton title='Słówka' handlePress={() => handleActivitySelect('translation')} containerStyles='mt-7 w-full' />
					<CustomButton title='Obrazki' handlePress={() => handleActivitySelect('imageWord')} containerStyles='mt-7 w-full' />
					<CustomButton title='Zdania' handlePress={() => handleActivitySelect('sentences')} containerStyles='mt-7 w-full' />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;
