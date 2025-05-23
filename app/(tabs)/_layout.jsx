import { View, Image } from 'react-native';
import { icons } from '../../constants/icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Translation from '../levels/translation';
import ImageWord from '../levels/imageWord';
import Home from './home';
import Dictionary from './dictionary';
import Profile from './profile';
import Sentences from '../levels/sentences';
import TestLevel from '../levels/testLevel';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ icon, color }) => {
	return (
		<View>
			<Image source={icon} resizeMode='contain' tintColor={color} className='w-6 h-6' />
		</View>
	);
};

const HomeStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name='home' component={Home} />
			<Stack.Screen name='translation' component={Translation} />
			<Stack.Screen name='imageWord' component={ImageWord} />
			<Stack.Screen name='sentences' component={Sentences} />
			<Stack.Screen name='testLevel' component={TestLevel} />
		</Stack.Navigator>
	);
};

const TabsLayout = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarLabelStyle: {
					fontSize: 14,
				},
				tabBarStyle: {
					backgroundColor: '#1f2937',
				},
				tabBarActiveTintColor: '#2563eb',
				tabBarInactiveTintColor: '#fff',
				tabBarIcon: ({ color }) => {
					let icon;
					if (route.name === 'homeStack') {
						icon = icons.home;
					} else if (route.name === 'dictionary') {
						icon = icons.dictionary;
					} else if (route.name === 'profile') {
						icon = icons.profile;
					}
					return <TabIcon icon={icon} color={color} />;
				},
			})}>
			<Tab.Screen name='homeStack' component={HomeStack} options={{ title: 'Strona główna' }} />
			<Tab.Screen name='dictionary' component={Dictionary} options={{ title: 'Słownik' }} />
			<Tab.Screen name='profile' component={Profile} options={{ title: 'Profil' }} />
		</Tab.Navigator>
	);
};

export default TabsLayout;
