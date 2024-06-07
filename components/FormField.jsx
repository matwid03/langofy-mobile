import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants/icons';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
	const [showPassword, setshowPassword] = useState(false);
	return (
		<View className={`space-y-2 ${otherStyles}`}>
			<Text className='text-base text-gray-100'>{title}</Text>
			<View className='w-full h-16 px-4 border-2 border-black  bg-slate-600 rounded-2xl items-center flex-row focus:border-orange-700'>
				<TextInput className='flex-1 text-white text-base' value={value} placeholder={placeholder} onChangeText={handleChangeText} secureTextEntry={title === 'Hasło' && !showPassword} />

				{title === 'Hasło' && (
					<TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
						<Image source={!showPassword ? icons.eye : icons.eyeHide} className='w-6 h-6' resizeMode='contain' />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default FormField;
