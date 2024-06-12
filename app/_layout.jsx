import { Stack } from 'expo-router';
import GlobalProvider from '../context/GlobalProvider';
import { StatusBar } from 'react-native';

const RootLayout = () => {
	return (
		<GlobalProvider>
			<StatusBar barStyle='light-content' backgroundColor='#11111b' />
			<Stack>
				<Stack.Screen name='index' options={{ headerShown: false }} />
				<Stack.Screen name='(auth)' options={{ headerShown: false }} />
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
			</Stack>
		</GlobalProvider>
	);
};

export default RootLayout;
