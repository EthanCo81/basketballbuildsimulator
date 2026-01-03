import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllBuilds, deleteBuild } from '../utils/buildStorage';
import { useTheme } from '../contexts/ThemeContext';

export default function SavedBuildsScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [savedBuilds, setSavedBuilds] = useState([]);

  const loadBuilds = useCallback(async () => {
    const builds = await getAllBuilds();
    setSavedBuilds(builds);
  }, []);

  useEffect(() => {
    loadBuilds();
    
    // Reload when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadBuilds);
    return unsubscribe;
  }, [navigation, loadBuilds]);

  const handleLoad = useCallback((build) => {
    navigation.navigate('Home', { loadBuild: build });
  }, [navigation]);

  const handleDelete = useCallback(async (buildId, buildName) => {
    Alert.alert(
      'Delete Build',
      `Are you sure you want to delete "${buildName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBuild(buildId);
            await loadBuilds();
          },
        },
      ]
    );
  }, [loadBuilds]);

  const handleNewBuild = useCallback(() => {
    navigation.navigate('Home', { newBuild: true });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={handleNewBuild}
        >
          <Text style={styles.newButtonText}>+ New Build</Text>
        </TouchableOpacity>

        {savedBuilds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved builds yet</Text>
            <Text style={styles.emptySubtext}>Create a build and save it to get started</Text>
          </View>
        ) : (
          <View style={styles.buildsList}>
            {savedBuilds.map((build) => (
              <View key={build.id} style={styles.buildCard}>
                <TouchableOpacity
                  style={styles.buildCardMain}
                  onPress={() => handleLoad(build)}
                >
                  <Text style={styles.buildName}>{build.name}</Text>
                  <View style={styles.buildDetails}>
                    <Text style={styles.buildDetailText}>
                      Height: {Math.floor(build.heightInches / 12)}'{build.heightInches % 12}
                    </Text>
                    <Text style={styles.buildDetailText}>
                      Weight: {build.weight} lbs
                    </Text>
                  </View>
                  <Text style={styles.buildDate}>
                    {new Date(build.createdAt).toLocaleDateString()} {new Date(build.createdAt).toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(build.id, build.name)}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    padding: 16,
  },
  newButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  buildsList: {
    gap: 12,
  },
  buildCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  buildCardMain: {
    flex: 1,
  },
  buildName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  buildDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  buildDetailText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  buildDate: {
    fontSize: 12,
    color: theme.textTertiary,
    marginTop: 4,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff453a',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28,
  },
});
