import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';

const Translation = () => {
	const [words, setWords] = useState([]);
	const [currentWord, setCurrentWord] = useState(null);
	const [options, setOptions] = useState([]);

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
					setWords(Object.values(wordList));
					selectRandomWord(Object.values(wordList));
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

	return (
		<SafeAreaView className='bg-slate-900 h-full '>
			{currentWord && (
				<View className='mt-16 w-full items-center justify-center'>
					<Text className='text-white text-3xl mb-16'>{currentWord.word}</Text>
					<FlatList
						data={options}
						renderItem={({ item }) => (
							<CustomButton
								containerStyles='mb-8 w-80'
								title={item.text}
								handlePress={() => {
									if (item.correct) {
										console.log('Odpowiedź poprawna!');
										//DODAWANIE PUNKTÓW
									} else {
										console.log('Odpowiedź niepoprawna');
									}
									selectRandomWord(Object.values(words));
								}}
								key={item.id.toString()}
							/>
						)}
						keyExtractor={(item) => item.id.toString()}
					/>
				</View>
			)}
		</SafeAreaView>
	);
};

export default Translation;
