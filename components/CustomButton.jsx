import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomButton = ({ title, handlePress, containerStyles, isLoading, disabled, textStyles }) => {
	return (
		<TouchableOpacity disabled={disabled} onPress={handlePress} activeOpacity={0.7} className={` bg-blue-600 rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''} ${disabled ? 'opacity-20' : ''}`}>
			<Text className={`text-white text-2xl ${textStyles}`}>{title}</Text>
		</TouchableOpacity>
	);
};

export default CustomButton;
