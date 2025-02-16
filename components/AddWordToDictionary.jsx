import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import CustomButton from './CustomButton';
import FormField from './FormField';

const AddWordToDictionary = ({ addWord }) => {
	const [word, setWord] = useState('');
	const [translation, setTranslation] = useState('');

	const handleSubmit = async () => {
		if (!word || !translation) {
			Alert.alert('', 'Wprowadź słowo i jego tłumaczenie!');
			return;
		}

		await addWord(word, translation);

		setWord('');
		setTranslation('');
	};

	return (
		<View className='w-full px-4'>
			<FormField title='Wprowadź słowo' value={word} handleChangeText={setWord} isDictionary={true} />
			<FormField title='Wprowadź tłumaczenie' value={translation} handleChangeText={setTranslation} isDictionary={true} otherStyles='mt-7' />
			<CustomButton title='Dodaj słowo' handlePress={handleSubmit} containerStyles='mt-10 mb-4 w-full' />
		</View>
	);
};

export default AddWordToDictionary;
