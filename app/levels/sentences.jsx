import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import CustomButton from '../../components/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';

const Sentences = () => {
	const [words, setWords] = useState([]);
	const [currentWord, setCurrentWord] = useState(null);
	const [selectedWords, setSelectedWords] = useState([]);
	const [showResult, setShowResult] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);

	useEffect(() => {
		const user = FIREBASE_AUTH.currentUser;
		if (!user) {
			return;
		}

		const fetchWords = async () => {
			try {
				const docRef = doc(FIRESTORE_DB, 'words', 'easy');
				const wordRef = await getDoc(docRef);
				const wordList = wordRef.data();
				if (wordList) {
					const wordsArray = Object.values(wordList);
					setWords(wordsArray);
					selectRandomWord(wordsArray);
				}
			} catch (error) {
				console.error('Błąd podczas pobierania słów:', error);
			}
		};
		fetchWords();
	}, []);

	const selectRandomWord = (wordsList) => {
		const randomIndex = Math.floor(Math.random() * wordsList.length);
		if (currentWord === wordsList[randomIndex]) {
			selectRandomWord(wordsList);
		}
		const selectedWord = wordsList[randomIndex];

		const shuffledChoices = shuffleArray(selectedWord.choices);
		selectedWord.choices = shuffledChoices;

		setCurrentWord(selectedWord);
		setSelectedWords([]);
		setShowResult(false);
		setIsCorrect(false);
	};

	const handleWordClick = (word) => {
		setSelectedWords([...selectedWords, word]);
	};

	const handleRemoveWord = (index) => {
		const newSelectedWords = [...selectedWords];
		newSelectedWords.splice(index, 1);
		setSelectedWords(newSelectedWords);
	};

	const handleCheckAnswer = () => {
		const userAnswer = selectedWords.join(' ').toLowerCase();
		const correctAnswer = currentWord.sentenceAng.toLowerCase();
		console.log(userAnswer);
		console.log(correctAnswer);
		if (userAnswer === correctAnswer) {
			setIsCorrect(true);
			console.log('Odpowiedź poprawna');
			//PUNKTY
		} else {
			setIsCorrect(false);
			console.log('Odpowiedź niepoprawna');
		}

		setShowResult(true);
	};

	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	const renderChoices = () => {
		return (
			<View className='flex-row flex-wrap justify-center'>
				{currentWord.choices.map((item, index) => (
					<CustomButton key={index} title={item} handlePress={() => handleWordClick(item)} containerStyles='mr-8 mb-4 min-w-[40] px-4' disabled={selectedWords.includes(item)} />
				))}
			</View>
		);
	};

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			{currentWord && (
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
					<CustomButton containerStyles='mb-8 w-80' title='Sprawdź' handlePress={handleCheckAnswer} />
					{showResult && <Text className='text-white'>{isCorrect ? 'Odpowiedź poprawna!' : 'Odpowiedź niepoprawna'}</Text>}
					<CustomButton containerStyles='mt-8 w-80' title='Następne słowo' handlePress={() => selectRandomWord(words)} />
				</View>
			)}
		</SafeAreaView>
	);
};

export default Sentences;
