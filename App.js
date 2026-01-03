import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BuildScreen from './src/screens/BuildScreen';
import SavedBuildsScreen from './src/screens/SavedBuildsScreen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
          tabBarActiveTintColor: '#0a84ff',
          tabBarInactiveTintColor: theme.textSecondary,
          headerStyle: { backgroundColor: theme.card, borderBottomColor: theme.border },
          headerTintColor: theme.text,
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 16 }}
            >
              <MaterialCommunityIcons 
                name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'} 
                size={24} 
                color={theme.text}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Tab.Screen
          name="Home"
          component={BuildScreen}
          options={{ 
            title: 'Build Editor',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-edit" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SavedBuilds"
          component={SavedBuildsScreen}
          options={{ 
            title: 'My Builds',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="folder-multiple" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
