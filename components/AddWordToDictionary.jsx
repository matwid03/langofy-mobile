import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import CustomButton from './CustomButton';
import FormField from './FormField';

const AddWordToDictionary = ({ addWord }) => {
	const [word, setWord] = useState('');
	const [translation, setTranslation] = useState('');

	const handleSubmit = async () => {
		if (!word || !translation) {
			alert('Wprowadź słowo i jego tłumaczenie!');
			return;
		}

		await addWord(word, translation);

		setWord('');
		setTranslation('');
	};

	return (
		<View className='w-full px-4'>
			<FormField title='Wprowadź słowo' value={word} handleChangeText={setWord} />
			<FormField title='Wprowadź tłumaczenie' value={translation} handleChangeText={setTranslation} otherStyles='mt-7' />
			<CustomButton title='Dodaj słowo' handlePress={handleSubmit} containerStyles='mt-7 w-full' />
		</View>
	);
};

export default AddWordToDictionary;
