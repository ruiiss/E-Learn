import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { getSession } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MatkulListScreen from '../screens/MatkulListScreen';
import DetailMatkulScreen from '../screens/DetailMatkulScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../constants/colors';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MatkulStack = createNativeStackNavigator();

// Stack nested inside the "Matkul" tab: list -> detail, passes route params
function MatkulStackNavigator() {
  return (
    <MatkulStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: colors.white }}>
      <MatkulStack.Screen
        name="MatkulList"
        component={MatkulListScreen}
        options={{ title: 'Mata Kuliah' }}
      />
      <MatkulStack.Screen
        name="DetailMatkul"
        component={DetailMatkulScreen}
        options={({ route }) => ({ title: route.params?.nama || 'Detail Matkul' })}
      />
    </MatkulStack.Navigator>
  );
}

const TAB_ICONS = {
  Beranda: '🏠',
  Matkul: '📚',
  Progres: '📈',
  Profil: '👤',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen
        name="Matkul"
        component={MatkulStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Progres" component={ProgressScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    (async () => {
      const session = await getSession();
      setInitialRoute(session ? 'MainTabs' : 'Login');
      setCheckingSession(false);
    })();
  }, []);

  if (checkingSession) {
    return <LoadingSpinner label="Menyiapkan aplikasi..." />;
  }

  return (
    <RootStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="MainTabs" component={MainTabs} />
    </RootStack.Navigator>
  );
}
