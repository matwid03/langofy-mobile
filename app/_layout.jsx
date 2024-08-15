import { Stack } from 'expo-router';
import GlobalProvider from '../context/GlobalProvider';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootLayout = () => {
	return (
		<>
			<GestureHandlerRootView>
				<StatusBar barStyle='light-content' backgroundColor='#11111b' />
				<GlobalProvider>
					<Stack>
						<Stack.Screen name='index' options={{ headerShown: false }} />
						<Stack.Screen name='(auth)' options={{ headerShown: false }} />
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
						<Stack.Screen name='levels' options={{ headerShown: false }} />
					</Stack>
				</GlobalProvider>
			</GestureHandlerRootView>
		</>
	);
};

export default RootLayout;
