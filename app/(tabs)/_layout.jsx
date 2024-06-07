import { View, Text, Image } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { icons } from '../../constants/icons';

const TabIcon = ({ icon, color }) => {
	return (
		<View>
			<Image source={icon} resizeMode='contain' tintColor={color} className='w-6 h-6' />
		</View>
	);
};

const TabsLayout = () => {
	return (
		<>
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
		</>
	);
};

export default TabsLayout;
