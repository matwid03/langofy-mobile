import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import CustomButton from '../../components/CustomButton';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Sentences = () => {
	const [words, setWords] = useState([]);
	const [currentWord, setCurrentWord] = useState(null);
	const [selectedWords, setSelectedWords] = useState([]);
	const [showResult, setShowResult] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [points, setPoints] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [shuffledChoices, setShuffledChoices] = useState([]);

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
					const wordsArray = Object.values(wordList).filter((word) => word.sentence && word.sentenceAng);
					const selectedWords = getUniqueWords(wordsArray, 10);

					setWords(selectedWords);
					if (selectedWords.length > 0) {
						setCurrentWord(selectedWords[0]);
						setShuffledChoices(shuffleArray(selectedWords[0].choices));
					}
				}
			} catch (error) {
				console.error('Błąd podczas pobierania słów:', error);
			}
		};
		fetchWords();
	}, [difficulty]);

	const getUniqueWords = (array, count) => {
		const uniqueSet = new Set();
		const result = [];
		while (uniqueSet.size < count && array.length > 0) {
			const randomIndex = Math.floor(Math.random() * array.length);
			const word = array[randomIndex];
			if (!uniqueSet.has(word.word)) {
				uniqueSet.add(word.word);
				result.push(word);
			}
		}
		return result;
	};

	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	const handleWordClick = (word) => {
		setSelectedWords([...selectedWords, word]);
	};

	const handleRemoveWord = (index) => {
		const newSelectedWords = [...selectedWords];
		newSelectedWords.splice(index, 1);
		setSelectedWords(newSelectedWords);
	};

	const handleCheckAnswer = async () => {
		if (isLoading) return;
		setIsLoading(true);

		const userAnswer = selectedWords.join(' ').toLowerCase();
		const correctAnswer = currentWord.sentenceAng.toLowerCase();
		if (userAnswer === correctAnswer) {
			setIsCorrect(true);
			setPoints((prevPoints) => prevPoints + 1);
		} else {
			setIsCorrect(false);
		}

		setShowResult(true);

		if (currentIndex === 9) {
			await updateUserPoints(points + (isCorrect ? 1 : 0));
			navigation.navigate('home');
		} else {
			setTimeout(() => {
				setCurrentIndex((prevIndex) => prevIndex + 1);
				if (words.length > currentIndex + 1) {
					setCurrentWord(words[currentIndex + 1]);
					setShuffledChoices(shuffleArray(words[currentIndex + 1].choices));
				}
				setSelectedWords([]);
				setShowResult(false);
				setIsLoading(false);
			}, 1000);
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

	const renderChoices = () => {
		return (
			<View className='flex-row flex-wrap justify-center'>
				{shuffledChoices.map((item, index) => (
					<CustomButton key={index} title={item} handlePress={() => handleWordClick(item)} containerStyles='mr-8 mb-4 min-w-[40] px-4' disabled={selectedWords.includes(item)} />
				))}
			</View>
		);
	};

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			{currentWord && (
				<TouchableWithoutFeedback className='bg-slate-900 h-full ' onPress={Keyboard.dismiss} accessible={false}>
					<View className='mt-10 w-full items-center justify-center'>
						<Text className='text-white text-3xl mb-4'>{currentWord.sentence}</Text>
						<View className='min-h-[70px] bg-white w-80 p-4 mb-4 flex-wrap flex flex-row '>
							{selectedWords.map((word, index) => (
								<TouchableOpacity key={index} onPress={() => handleRemoveWord(index)}>
									<Text className='text-black text-3xl'>{word} </Text>
								</TouchableOpacity>
							))}
						</View>
						<ScrollView className='flex mb-10 ml-6'>{renderChoices()}</ScrollView>
						<CustomButton containerStyles='mb-4 w-80' title='Sprawdź' handlePress={handleCheckAnswer} disabled={isLoading} />
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

export default Sentences;
