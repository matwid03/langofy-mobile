import React, { useEffect, useState } from 'react';
import emptyHeart from '../../assets/icons/empty_heart.png';
import fullHeart from '../../assets/icons/full_heart.png';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomButton from '../../components/CustomButton';
import { SafeAreaView, View, Text, Image, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../../assets/icons/logo.png';

const TestLevel = () => {
	const { updateUserTestStatus, handleTestComplete } = useGlobalContext();
	const [difficultyLevel, setDifficultyLevel] = useState('hard');
	const [questionCount, setQuestionCount] = useState(1);
	const [question, setQuestion] = useState(null);
	const [options, setOptions] = useState([]);
	const [usersLife, setUsersLife] = useState([...Array(3).fill(true)]);
	const [questionsList, setQuestionsList] = useState([]);
	const [usedQuestionIndices, setUsedQuestionIndices] = useState([]);
	const maxQuestionCount = 20;

	useEffect(() => {
		Alert.alert('Przejdź test!', 'Przed przystąpieniem do nauki sprawdźmy twój poziom znajomości angielskiego 😀');
	}, []);

	useEffect(() => {
		initializeQuestions();
	}, [difficultyLevel]);

	const fetchQuestions = async (level) => {
		try {
			const docRef = doc(FIRESTORE_DB, 'words', level);
			const wordRef = await getDoc(docRef);
			const wordList = wordRef.data();
			if (wordList) {
				const wordsArray = Object.values(wordList);
				return getUniqueWords(wordsArray, 21);
			}
		} catch (error) {
			console.error('Błąd podczas pobierania pytań:', error);
			throw error;
		}
	};

	const initializeQuestions = async () => {
		if (FIREBASE_AUTH.currentUser) {
			try {
				const questions = await fetchQuestions(difficultyLevel);
				setQuestionsList(questions);
				setUsedQuestionIndices([]);
				loadQuestion(questions, []);
			} catch (error) {
				console.error('Błąd podczas inicjalizacji pytań:', error);
			}
		} else {
			console.log('Użytkownik nie jest zalogowany');
		}
	};

	const generateOptions = (word, allWords) => {
		const correctOption = word.translation;
		const incorrectOptions = allWords.filter((w) => w.word !== word.word).map((w) => w.translation);
		const randomIncorrectOption = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
		const allOptions = [correctOption, randomIncorrectOption].sort(() => Math.random() - 0.5);
		setOptions(allOptions);
	};

	const loadQuestion = (questions, usedIndices) => {
		const availableIndices = questions.map((_, index) => index).filter((index) => !usedIndices.includes(index));
		if (availableIndices.length > 0) {
			const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
			const selectedQuestion = questions[randomIndex];
			setQuestion(selectedQuestion);
			setUsedQuestionIndices([...usedIndices, randomIndex]);
			generateOptions(selectedQuestion, questions);
		} else {
			console.error('Brak dostępnych pytań.');
		}
	};

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

	const handleCorrectAnswer = () => {
		setQuestionCount(questionCount + 1);
		loadQuestion(questionsList, usedQuestionIndices);
	};

	const handleWrongAnswer = () => {
		const updatedLives = [...usersLife];
		updatedLives.pop();
		setUsersLife(updatedLives);

		if (updatedLives.every((life) => !life)) {
			if (difficultyLevel === 'easy') {
				handleTestComplete(difficultyLevel);
				updateUserTestStatus(true);
			} else {
				changeLevelOfTest();
			}
		} else {
			loadQuestion(questionsList, usedQuestionIndices);
		}
	};

	const changeLevelOfTest = () => {
		setDifficultyLevel((prevLevel) => {
			if (prevLevel === 'hard') return 'medium';
			if (prevLevel === 'medium') return 'easy';
			return 'easy';
		});
		setUsersLife([...Array(3).fill(true)]);
	};

	useEffect(() => {
		if (questionCount > maxQuestionCount) {
			handleTestComplete(difficultyLevel);
			updateUserTestStatus(true);
		}
	}, [questionCount]);

	return (
		<SafeAreaView className='bg-slate-200 mt-16 px-4 h-full'>
			<Text className='text-xl text-gray-950 capitalize'>Poziom: {difficultyLevel}</Text>
			<View className='flex-row items-center my-2'>
				<Text className='text-xl text-gray-950'>Życia:</Text>
				{usersLife.map((element, index) => (
					<Image key={index} source={element ? fullHeart : emptyHeart} className='w-6 h-6 mx-2' />
				))}
			</View>
			<Text
				className='text-xl text-gray-950 text-center mb-10 mt-10
			'>
				{questionCount < 20 ? questionCount : 20} / {maxQuestionCount}
			</Text>
			{question &&
				(questionCount < 21 ? (
					<>
						<Text
							className='text-2xl text-gray-950 text-center mb-10
					'>
							{question.word}
						</Text>
						<View className='flex-row justify-between'>
							{options.map((option, index) => (
								<CustomButton containerStyles='mt-8 w-40' textStyles='text-xl' key={index} title={option} handlePress={() => (option === question.translation ? handleCorrectAnswer() : handleWrongAnswer())} />
							))}
						</View>
					</>
				) : (
					<Text className='text-8xl text-center mt-4'>'👏🏻'</Text>
				))}
			<View className='items-center mt-20'>
				<Image className='w-80 h-80' source={logo}></Image>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 8,
		flex: 1,
		padding: 20,
		backgroundColor: '#11111b',
	},
	levelText: {
		color: '#ffffff',
		fontSize: 18,
		marginBottom: 10,
	},
	heartWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
	},
	lifeText: {
		color: '#ffffff',
		fontSize: 18,
	},
	heartIcon: {
		width: 20,
		height: 20,
		marginHorizontal: 5,
	},
	questionCount: {
		color: '#ffffff',
		fontSize: 18,
		marginVertical: 10,
	},
	questionText: {
		color: '#ffffff',
		fontSize: 18,
		marginVertical: 20,
		textAlign: 'center',
	},
	buttonWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	button: {
		flex: 1,
		marginHorizontal: 5,
		padding: 10,
		alignItems: 'center',
	},
});

export default TestLevel;
