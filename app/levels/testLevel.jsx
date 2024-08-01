import React, { useEffect, useState } from 'react';
import emptyHeart from '../../assets/icons/empty_heart.png';
import fullHeart from '../../assets/icons/full_heart.png';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomButton from '../../components/CustomButton';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const TestLevel = () => {
	const { updateUserTestStatus, handleTestComplete } = useGlobalContext();
	const [difficultyLevel, setDifficultyLevel] = useState('hard');
	const [questionCount, setQuestionCount] = useState(1);
	const [question, setQuestion] = useState(null);
	const [options, setOptions] = useState([]);
	const [usersLife, setUsersLife] = useState([...Array(3).fill(true)]);
	const maxQuestionCount = 20;

	useEffect(() => {
		loadQuestion();
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

	const generateOptions = (word, allWords) => {
		const correctOption = word.translation;
		const incorrectOptions = allWords.filter((w) => w.word !== word.word).map((w) => w.translation);
		const randomIncorrectOption = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
		const allOptions = [correctOption, randomIncorrectOption].sort(() => Math.random() - 0.5);
		setOptions(allOptions);
	};

	const loadQuestion = async () => {
		if (FIREBASE_AUTH.currentUser) {
			try {
				const questions = await fetchQuestions(difficultyLevel);
				const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
				setQuestion(selectedQuestion);
				generateOptions(selectedQuestion, questions);
			} catch (error) {
				console.error('Błąd podczas ładowania pytania:', error);
			}
		} else {
			console.log('Użytkownik nie jest zalogowany');
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
		loadQuestion();
	};

	const handleWrongAnswer = () => {
		setUsersLife([...usersLife.splice(1), false]);
		loadQuestion();
	};

	const changeLevelOfTest = () => {
		setDifficultyLevel(difficultyLevel === 'hard' ? 'medium' : 'easy');
		if (difficultyLevel === 'easy') {
			handleTestComplete('easy');
			updateUserTestStatus(true);
		} else {
			setUsersLife([...Array(3).fill(true)]);
		}
	};

	useEffect(() => {
		if (!usersLife.some((element) => element)) {
			changeLevelOfTest();
		}
	}, [usersLife]);

	useEffect(() => {
		if (questionCount > maxQuestionCount) {
			handleTestComplete(difficultyLevel);
			updateUserTestStatus(true);
		}
	}, [questionCount]);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.levelText}>Level: {difficultyLevel}</Text>
			<View style={styles.heartWrapper}>
				<Text style={styles.lifeText}>Życia:</Text>
				{usersLife.map((element, index) => (
					<Image key={index} source={element ? fullHeart : emptyHeart} style={styles.heartIcon} />
				))}
			</View>
			<Text style={styles.questionCount}>
				{questionCount} / {maxQuestionCount}
			</Text>
			{question && (
				<>
					<Text style={styles.questionText}>{question.word}</Text>
					<View style={styles.buttonWrapper}>
						{options.map((option, index) => (
							<CustomButton containerStyles='mt-8 w-40' key={index} title={option} handlePress={() => (option === question.translation ? handleCorrectAnswer() : handleWrongAnswer())} />
						))}
					</View>
				</>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
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
