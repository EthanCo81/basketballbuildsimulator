import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const lightTheme = {
  background: '#fff',
  backgroundSecondary: '#f5f5f5',
  card: '#fff',
  cardBorder: '#e0e0e0',
  text: '#000',
  textSecondary: '#666',
  textTertiary: '#999',
  border: '#ddd',
  borderSecondary: '#eee',
  disabled: '#ccc',
  disabledText: '#999',
  input: '#fff',
  inputBorder: '#ddd',
  barBackground: '#ddd',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  background: '#000',
  backgroundSecondary: '#0f0f0f',
  card: '#1a1a1a',
  cardBorder: '#2a2a2a',
  text: '#fff',
  textSecondary: '#999',
  textTertiary: '#666',
  border: '#2a2a2a',
  borderSecondary: '#333',
  disabled: '#444',
  disabledText: '#666',
  input: '#1a1a1a',
  inputBorder: '#444',
  barBackground: '#2a2a2a',
  shadow: 'rgba(0, 0, 0, 0.5)',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value = {
    theme,
    isDark,
    toggleTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
