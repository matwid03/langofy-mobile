import { Stack } from 'expo-router';

const LevelsLayout = () => {
	return (
		<Stack>
			<Stack.Screen name='testLevel' options={{ headerShown: false }} />
			<Stack.Screen name='imageWord' options={{ headerShown: false }} />
			<Stack.Screen name='sentences' options={{ headerShown: false }} />
			<Stack.Screen name='translation' options={{ headerShown: false }} />
		</Stack>
	);
};

export default LevelsLayout;
