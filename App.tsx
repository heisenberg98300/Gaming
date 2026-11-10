import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DiceScreen from './screens/DiceScreen';
import FingerPickerScreen from './screens/FingerPickerScreen';
import ExtractionName from './screens/ExtractionName';

// Definiamo i tipi per le rotte dei Tab
type RootTabParamList = {
  Dado: undefined;
  'Finger Picker': undefined;
  'Estrai Nome': undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ellipse';
            if (route.name === 'Dado') {
              iconName = focused ? 'dice' : 'dice-outline';
            } else if (route.name === 'Finger Picker') {
              iconName = focused ? 'hand-left' : 'hand-left-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      >
        <Tab.Screen name="Dado" component={DiceScreen} options={{ title: 'Lancia il Dado' }} />
        <Tab.Screen name="Finger Picker" component={FingerPickerScreen} options={{ title: 'Scegli Dita' }} />
        <Tab.Screen name="Estrai Nome" component={ExtractionName} options={{ title: 'Estrai Nome' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}