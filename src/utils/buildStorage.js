import AsyncStorage from '@react-native-async-storage/async-storage';

const BUILDS_KEY = '@basketball_builds';

/**
 * Get all saved builds
 * Returns array of build objects with metadata
 */
export async function getAllBuilds() {
  try {
    const buildsJson = await AsyncStorage.getItem(BUILDS_KEY);
    if (!buildsJson) return [];
    return JSON.parse(buildsJson);
  } catch (error) {
    console.error('Error loading builds:', error);
    return [];
  }
}

/**
 * Save a new build
 * @param {string} name - Build name
 * @param {object} buildData - { heightInches, wingspan, weight, values }
 * @returns {string} buildId
 */
export async function saveBuild(name, buildData) {
  try {
    const builds = await getAllBuilds();
    
    const buildId = Date.now().toString();
    const newBuild = {
      id: buildId,
      name,
      createdAt: new Date().toISOString(),
      ...buildData,
    };
    
    builds.push(newBuild);
    await AsyncStorage.setItem(BUILDS_KEY, JSON.stringify(builds));
    
    return buildId;
  } catch (error) {
    console.error('Error saving build:', error);
    throw error;
  }
}

/**
 * Update an existing build
 * @param {string} buildId - Build ID to update
 * @param {string} name - Build name
 * @param {object} buildData - { heightInches, wingspan, weight, values }
 */
export async function updateBuild(buildId, name, buildData) {
  try {
    const builds = await getAllBuilds();
    const index = builds.findIndex(b => b.id === buildId);
    
    if (index === -1) {
      throw new Error('Build not found');
    }
    
    builds[index] = {
      ...builds[index],
      name,
      ...buildData,
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(BUILDS_KEY, JSON.stringify(builds));
  } catch (error) {
    console.error('Error updating build:', error);
    throw error;
  }
}

/**
 * Delete a build
 * @param {string} buildId - Build ID to delete
 */
export async function deleteBuild(buildId) {
  try {
    const builds = await getAllBuilds();
    const filtered = builds.filter(b => b.id !== buildId);
    await AsyncStorage.setItem(BUILDS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting build:', error);
    throw error;
  }
}

/**
 * Get a specific build by ID
 * @param {string} buildId
 * @returns {object|null}
 */
export async function getBuild(buildId) {
  try {
    const builds = await getAllBuilds();
    return builds.find(b => b.id === buildId) || null;
  } catch (error) {
    console.error('Error getting build:', error);
    return null;
  }
}
