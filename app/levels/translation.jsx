import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { updateUserPoints } from '../../constants/difficultyLevel';
import { Audio } from 'expo-av';

const Translation = () => {
	const [words, setWords] = useState([]);
	const [fullWordsList, setFullWordsList] = useState([]);
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
					const selectedWords = getUniqueWords(wordsArray, 10);

					setFullWordsList(wordsArray);
					setWords(selectedWords);
					setCurrentWord(selectedWords[0]);
					generateOptions(selectedWords[0], wordsArray);
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

	const generateOptions = (selectedWord, wordsList) => {
		const correctTranslation = selectedWord.translation;
		let option1 = correctTranslation;
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

		setOptions(shuffleArray(optionsArray));
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
		} else {
			setTimeout(() => {
				setCurrentIndex((prevIndex) => prevIndex + 1);
				setCurrentWord(words[currentIndex + 1]);
				generateOptions(words[currentIndex + 1], fullWordsList);
				setShowResult(false);
				setIsLoading(false);
			}, 1000);
		}
	};

	const playPronunciation = async () => {
		if (currentWord && currentWord.pronun) {
			try {
				const { sound } = await Audio.Sound.createAsync({ uri: currentWord.pronun });
				await sound.playAsync();
			} catch (error) {
				console.error('Błąd podczas odtwarzania wymowy:', error);
			}
		}
	};

	return (
		<SafeAreaView className='bg-slate-200 h-full '>
			{currentWord && (
				<View className='mt-16 w-full items-center justify-center'>
					<View className='flex-row gap-10'>
						<Text className='text-gray-950 text-3xl mb-16'>{currentWord.word}</Text>
						<Icon name='volume-up' size={30} color='black' style={{ marginLeft: 10 }} onPress={playPronunciation} />
					</View>
					<FlatList data={options} renderItem={({ item }) => <CustomButton containerStyles='mb-8 w-80' title={item.text} handlePress={() => handleCheckAnswer(item.correct)} key={item.id.toString()} disabled={isLoading} />} keyExtractor={(item) => item.id.toString()} />
				</View>
			)}
			{showResult && (
				<View className='flex flex-column items-center justify-center mt-4'>
					{isCorrect ? <Icon name='check-circle' size={30} color='green' /> : <Icon name='times-circle' size={30} color='red' />}
					<Text className='text-gray-950 mb-4 mt-2 text-2xl'>{isCorrect ? 'Odpowiedź poprawna!' : 'Odpowiedź niepoprawna'}</Text>
				</View>
			)}
			<View className='absolute bottom-4 left-0 right-0 items-center'>
				<View className='bg-gray-700 w-11/12 h-4 rounded-full'>
					<View className='bg-blue-600 h-4 rounded-full' style={{ width: `${((currentIndex + 1) / 10) * 100}%` }} />
				</View>
				<Text className='text-gray-950 text-base mt-2'>{`${currentIndex + 1} / 10`}</Text>
			</View>
		</SafeAreaView>
	);
};

export default Translation;
