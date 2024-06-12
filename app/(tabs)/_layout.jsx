import { View, Image } from 'react-native';
import { Tabs } from 'expo-router';
import { icons } from '../../constants/icons';
import { createStackNavigator } from '@react-navigation/stack';
import Translation from '../levels/translation';
import ImageWord from '../levels/imageWord';
import FillGaps from '../levels/fillGaps';

const TabIcon = ({ icon, color }) => {
	return (
		<View>
			<Image source={icon} resizeMode='contain' tintColor={color} className='w-6 h-6' />
		</View>
	);
};

const Stack = createStackNavigator();

const TabsLayout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					backgroundColor: '#11111b',
				},
			}}>
			<Tabs.Screen
				name='home'
				options={{
					title: 'Strona główna',
					headerShown: false,
					tabBarIcon: ({ color }) => <TabIcon icon={icons.home} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='dictionary'
				options={{
					title: 'Słownik',
					headerShown: false,
					tabBarIcon: ({ color }) => <TabIcon icon={icons.dictionary} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profil',
					headerShown: false,
					tabBarIcon: ({ color }) => <TabIcon icon={icons.profile} color={color} />,
				}}
			/>
		</Tabs>
	);
};

const AppNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name='tabs' component={TabsLayout} />
			<Stack.Screen name='translation' component={Translation} />
			<Stack.Screen name='imageWord' component={ImageWord} />
			<Stack.Screen name='fillGaps' component={FillGaps} />
		</Stack.Navigator>
	);
};

export default AppNavigator;
