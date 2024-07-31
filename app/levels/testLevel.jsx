import React, { useEffect, useState } from 'react';
import emptyHeart from '../../assets/icons/empty_heart.png';
import fullHeart from '../../assets/icons/full_heart.png';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomButton from '../../components/CustomButton';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';

const TestLevel = () => {
	const { updateUserTestStatus, handleTestComplete } = useGlobalContext();
	const [difficultyLevel, setDifficultyLevel] = useState('hard');
	const [questionCount, setQuestionCount] = useState(1);
	const [questionText, setQuestionText] = useState('');
	const [usersLife, setUsersLife] = useState([...Array(3).fill(true)]);
	const maxQuestionCount = 20;

	useEffect(() => {
		setQuestionText('Tu je pytanieaa');
		// tutaj funkcja do losowania pytania z bazy i ustawienia poprawnego layoutu pod zadanie
	}, []);

	const handleCorrectAnswer = () => {
		setQuestionCount(questionCount + 1);
		// tutaj funkcja do losowania pytania z bazy
	};

	const handleWrongAnswer = () => {
		setUsersLife([...usersLife.splice(1), false]);
	};

	const changeLevelOfTest = () => {
		setDifficultyLevel(difficultyLevel === 'hard' ? 'medium' : 'easy');
		if (difficultyLevel === 'easy') {
			console.log('end');
			handleTestComplete('easy');
			updateUserTestStatus(true);
			// tutaj funkcja która kończy test, setuje userowi w bazie defaultowo level easy
		} else {
			setUsersLife([...Array(3).fill(true)]);
			// tutaj funkcja do losowania pytania z bazy z odpowiedniego poziomu trudności
		}
	};

	useEffect(() => {
		if (!usersLife.some((element) => element)) {
			changeLevelOfTest();
		}
	}, [usersLife]);

	useEffect(() => {
		if (questionCount > maxQuestionCount) {
			// tutaj funkcja która kończy test, setuje userowi w bazie defaultowo level na jakim skończył
			console.log('end');
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
			<Text style={styles.questionText}>{questionText}</Text>
			<View style={styles.buttonWrapper}>
				<CustomButton title='Zepsute' handlePress={() => handleWrongAnswer()} />
				<CustomButton title='Będzie chodzić' handlePress={() => handleCorrectAnswer()} />
			</View>
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
