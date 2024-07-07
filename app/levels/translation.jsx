import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';

const Translation = () => {
	const [words, setWords] = useState([]);
	const [currentWord, setCurrentWord] = useState(null);
	const [options, setOptions] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [points, setPoints] = useState(0);
	const [showResult, setShowResult] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigation = useNavigation();
	const route = useRoute();
	const { difficulty } = route.params;

	useEffect(() => {
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
					const wordsArray = Object.values(wordList);
					const selectedWords = shuffleArray(wordsArray).slice(0, 10);

					setWords(selectedWords);
					setCurrentWord(selectedWords[0]);
					selectRandomWord(selectedWords, 0);
				}
			} catch (error) {
				console.error('Błąd podczas pobierania słów:', error);
			}
		};
		fetchWords();
	}, [difficulty]);

	const selectRandomWord = (wordsList, index) => {
		const selectedWord = wordsList[index];
		setCurrentWord(selectedWord);
		const correctTranslation = selectedWord.translation;
		const option1 = correctTranslation;
		let option2, option3;

		do {
			option2 = wordsList[Math.floor(Math.random() * wordsList.length)].translation;
		} while (option2 === option1);

		do {
			option3 = wordsList[Math.floor(Math.random() * wordsList.length)].translation;
		} while (option3 === option1 || option3 === option2);

		const optionsArray = [
			{ id: 1, text: option1, correct: true },
			{ id: 2, text: option2, correct: false },
			{ id: 3, text: option3, correct: false },
		];

		const shuffledOptions = shuffleArray(optionsArray);
		setOptions(shuffledOptions);
	};

	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	const handleCheckAnswer = async (correct) => {
		setIsCorrect(correct);
		if (isLoading) return;
		setIsLoading(true);

		if (correct) {
			setPoints((prevPoints) => prevPoints + 1);
		}

		setShowResult(true);

		if (currentIndex === 9) {
			await updateUserPoints(points + (isCorrect ? 1 : 0));
			navigation.navigate('home');
		} else
			setTimeout(() => {
				{
					setCurrentIndex((prevIndex) => prevIndex + 1);
					selectRandomWord(words, currentIndex + 1);
					setShowResult(false);
					setIsLoading(false);
				}
			}, 1500);
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
				<View className='mt-16 w-full items-center justify-center'>
					<Text className='text-white text-3xl mb-16'>{currentWord.word}</Text>
					<FlatList data={options} renderItem={({ item }) => <CustomButton containerStyles='mb-8 w-80' title={item.text} handlePress={() => handleCheckAnswer(item.correct)} key={item.id.toString()} disabled={isLoading} />} keyExtractor={(item) => item.id.toString()} />
				</View>
			)}
			{showResult && (
				<View className='flex flex-column items-center justify-center mt-4'>
					{isCorrect ? <Icon name='check-circle' size={30} color='green' /> : <Icon name='times-circle' size={30} color='red' />}
					<Text className='text-white mb-4 mt-2 text-xl'>{isCorrect ? 'Odpowiedź poprawna!' : 'Odpowiedź niepoprawna'}</Text>
				</View>
			)}
			<View className='absolute bottom-4 left-0 right-0 items-center'>
				<View className='bg-gray-700 w-11/12 h-4 rounded-full'>
					<View className='bg-green-500 h-4 rounded-full' style={{ width: `${((currentIndex + 1) / 10) * 100}%` }} />
				</View>
				<Text className='text-white mt-2'>{`${currentIndex + 1} / 10`}</Text>
			</View>
		</SafeAreaView>
	);
};

export default Translation;
