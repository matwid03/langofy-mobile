import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';

const FillGaps = () => {
	const [words, setWords] = useState([]);
	const [currentWord, setCurrentWord] = useState(null);
	const [userInput, setUserInput] = useState('');
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

		setCurrentWord(selectedWord);
		setShowResult(false);
		setIsCorrect(false);
		setUserInput('');
	};

	const handleCheckAnswer = () => {
		const userAnswer = currentWord.sentenceWithGap.replace('___', userInput.trim().toLowerCase());
		const correctAnswer = currentWord.sentenceWithGap.replace('___', currentWord.word.toLowerCase());
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

	return (
		<SafeAreaView className='bg-slate-900 h-full '>
			{currentWord && (
				<View className='mt-16 w-full items-center justify-center'>
					<Text className='text-white text-3xl mb-4'>{currentWord.sentence}</Text>
					<FormField value={userInput} handleChangeText={(text) => setUserInput(text)} otherStyles='mb-7 w-80' placeholder='Podaj odpowiedź...' />
					<CustomButton
						containerStyles='mb-8 w-80'
						title='Sprawdź'
						handlePress={() => {
							handleCheckAnswer();
						}}
					/>
					{showResult && <Text className='text-white'>{isCorrect ? 'Odpowiedź poprawna!' : 'Odpowiedź niepoprawna'}</Text>}
					<CustomButton containerStyles='mt-8 w-80' title='Następne słowo' handlePress={() => selectRandomWord(words)} />
				</View>
			)}
		</SafeAreaView>
	);
};

export default FillGaps;
