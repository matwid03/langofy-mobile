import { View, Text, Image, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { addWordsToDatabase } from '../../constants/addWordsToDatabase';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ImageWord = () => {
	const [words, setWords] = useState([]);
	const [currentWord, setCurrentWord] = useState(null);
	const [userInput, setUserInput] = useState('');
	const [showResult, setShowResult] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [points, setPoints] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const navigation = useNavigation();
	const route = useRoute();
	const { difficulty } = route.params;

	useEffect(() => {
		// addWordsToDatabase();

		const user = FIREBASE_AUTH.currentUser;
		if (!user) {
			return;
		}

		const fetchWords = async () => {
			try {
				const docRef = doc(FIRESTORE_DB, 'words', difficulty);
				const wordRef = await getDoc(docRef);
				const wordList = wordRef.data();
				if (wordList) {
					const wordsArray = Object.values(wordList).filter((word) => word.imgUrl);
					const selectedWords = shuffleArray(wordsArray).slice(0, 10);
					setWords(selectedWords);
					setCurrentWord(selectedWords[0]);
				}
			} catch (error) {
				console.error('Błąd podczas pobierania słów:', error);
			}
		};
		fetchWords();
	}, [difficulty]);

	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	const handleCheckAnswer = async () => {
		if (isLoading) return;
		setIsLoading(true);

		if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
			setIsCorrect(true);
			console.log('Odpowiedź poprawna');
			setPoints((prevPoints) => prevPoints + 1);
		} else {
			setIsCorrect(false);
			console.log('Odpowiedź niepoprawna');
		}

		setShowResult(true);

		if (currentIndex === 9) {
			await updateUserPoints(points + (isCorrect ? 1 : 0));
			navigation.navigate('home');
		} else {
			setTimeout(() => {
				setCurrentIndex((prevIndex) => prevIndex + 1);
				setCurrentWord(words[currentIndex + 1]);
				setUserInput('');
				setShowResult(false);
				setIsLoading(false);
			}, 1500);
		}
	};

	const updateUserPoints = async (finalPoints) => {
		const user = FIREBASE_AUTH.currentUser;
		if (user) {
			const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
			const userDoc = await getDoc(userDocRef);
			if (userDoc.exists()) {
				const userData = userDoc.data();
				const newPoints = (userData.points || 0) + finalPoints;
				await updateDoc(userDocRef, { points: newPoints });
			}
		}
	};

	return (
		<SafeAreaView className='bg-slate-900 h-full '>
			{currentWord && (
				<TouchableWithoutFeedback className='bg-slate-900 h-full ' onPress={Keyboard.dismiss} accessible={false}>
					<View className='mt-20 w-full items-center justify-center'>
						<Image
							className='w-80 h-80'
							source={{
								uri: currentWord.imgUrl,
							}}
							resizeMode='contain'
						/>
						<FormField value={userInput} handleChangeText={(text) => setUserInput(text)} otherStyles='mb-7 w-80' placeholder='Podaj odpowiedź...' />
						<CustomButton
							containerStyles='mb-8 w-80'
							title='Sprawdź'
							handlePress={() => {
								handleCheckAnswer();
							}}
							disabled={isLoading}
						/>
						{showResult && (
							<View className='flex flex-column items-center justify-center mt-4'>
								{isCorrect ? <Icon name='check-circle' size={30} color='green' /> : <Icon name='times-circle' size={30} color='red' />}
								<Text className='text-white mb-4 mt-2 text-xl'>{isCorrect ? 'Odpowiedź poprawna!' : 'Odpowiedź niepoprawna'}</Text>
							</View>
						)}
					</View>
					<View className='absolute bottom-4 left-0 right-0 items-center'>
						<View className='bg-gray-700 w-11/12 h-4 rounded-full'>
							<View className='bg-green-500 h-4 rounded-full' style={{ width: `${((currentIndex + 1) / 10) * 100}%` }} />
						</View>
						<Text className='text-white mt-2'>{`${currentIndex + 1} / 10`}</Text>
					</View>
				</TouchableWithoutFeedback>
			)}
		</SafeAreaView>
	);
};

export default ImageWord;
