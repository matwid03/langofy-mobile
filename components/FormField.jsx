import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants/icons';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
	const [showPassword, setshowPassword] = useState(false);
	return (
		<View className={`space-y-2 ${otherStyles}`}>
			<Text className='text-2xl text-gray-950'>{title}</Text>
			<View className='h-16 px-4 border-2 border-blue-800 rounded-xl items-center flex-row focus:border-blue-600'>
				<TextInput className='flex-1 text-gray-950 text-xl' value={value} placeholder={placeholder} onChangeText={handleChangeText} secureTextEntry={title === 'Hasło' && !showPassword} />

				{title === 'Hasło' && (
					<TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
						<Image tintColor='#11111b' source={!showPassword ? icons.eye : icons.eyeHide} className='w-7 h-7 ' resizeMode='contain' />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default FormField;
