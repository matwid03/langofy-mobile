import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import CustomButton from '../../components/CustomButton';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateUserPoints } from '../../constants/difficultyLevel';

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
		return array.map((item, index) => ({ id: `${item}-${index}`, word: item }));
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

		const userAnswer = selectedWords
			.map((wordObj) => wordObj.word)
			.join(' ')
			.toLowerCase();
		const correctAnswer = currentWord.sentenceAng.toLowerCase();
		const isAnswerCorrect = userAnswer === correctAnswer;
		setIsCorrect(isAnswerCorrect);

		if (isAnswerCorrect) {
			setPoints((prevPoints) => prevPoints + 1);
		}

		setShowResult(true);

		if (currentIndex === 9) {
			await updateUserPoints(points + (isAnswerCorrect ? 1 : 0));
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

	const renderChoices = () => {
		return (
			<View className='flex-row flex-wrap justify-center'>
				{shuffledChoices.map((item, index) => (
					<CustomButton key={index} title={item.word} handlePress={() => handleWordClick(item)} containerStyles='mr-8 mb-4 min-w-[40] px-4 ' disabled={selectedWords.some((selected) => selected.id === item.id)} />
				))}
			</View>
		);
	};

	return (
		<SafeAreaView className='bg-slate-200 h-full '>
			<View>
				<Text className='ml-2 mt-2 text-lg text-blue-600'>Poprawne odpowiedzi: {points}</Text>
			</View>
			{currentWord && (
				<ScrollView>
					<TouchableWithoutFeedback className='bg-slate-200 min-h-[90vh] ' onPress={Keyboard.dismiss} accessible={false}>
						<View className='mt-2 w-full items-center justify-center'>
							<Text className='text-gray-950 text-2xl mb-4 mx-2'>{currentWord.sentence}</Text>
							<View className='min-h-[70px] border-2 border-blue-600 rounded-md bg-white w-80 p-4 mb-4 flex-wrap flex flex-row '>
								{selectedWords.map((word, index) => (
									<TouchableOpacity key={index} onPress={() => handleRemoveWord(index)}>
										<Text className='text-black text-3xl'>{word.word} </Text>
									</TouchableOpacity>
								))}
							</View>
							<ScrollView className='flex mb-8 ml-6'>{renderChoices()}</ScrollView>
							<CustomButton containerStyles='mb-4 w-80 bg-white border-2 border-blue-600' textStyles='text-gray-950' title='Sprawdź' handlePress={handleCheckAnswer} disabled={isLoading} />
							{showResult && (
								<View className='flex flex-column items-center justify-center mt-4'>
									{isCorrect ? <Icon name='check-circle' size={30} color='green' /> : <Icon name='times-circle' size={30} color='red' />}
									<Text className='text-gray-950 mb-4 mt-2 text-2xl'>{isCorrect ? 'Odpowiedź poprawna!' : 'Odpowiedź niepoprawna'}</Text>
								</View>
							)}
						</View>
						{!showResult && (
							<View className='mt-6 items-center'>
								<View className='bg-gray-700 w-11/12 h-4 rounded-full'>
									<View className='bg-blue-600 h-4 rounded-full' style={{ width: `${((currentIndex + 1) / 10) * 100}%` }} />
								</View>
								<Text className='text-gray-950 text-base mt-2'>{`${currentIndex + 1} / 10`}</Text>
							</View>
						)}
					</TouchableWithoutFeedback>
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

export default Sentences;
