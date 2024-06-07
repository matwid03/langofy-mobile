import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomButton = ({ title, handlePress, containerStyles, isLoading, disabled }) => {
	return (
		<TouchableOpacity disabled={disabled} onPress={handlePress} activeOpacity={0.7} className={`bg-orange-700 rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''} ${disabled ? 'opacity-20' : ''}`}>
			<Text>{title}</Text>
		</TouchableOpacity>
	);
};

export default CustomButton;
