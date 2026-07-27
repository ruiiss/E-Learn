import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys used across the app
export const KEYS = {
  SESSION: '@elearning_session',       // logged-in user session
  PROGRESS: '@elearning_progress',     // progress per matkul
  TUGAS: '@elearning_tugas_uploads',   // uploaded tugas photos
};

// Generic helpers -----------------------------------------------------
export async function saveData(key, value) {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
    return true;
  } catch (e) {
    console.warn('storage.saveData error', e);
    return false;
  }
}

export async function loadData(key, fallback = null) {
  try {
    const json = await AsyncStorage.getItem(key);
    return json != null ? JSON.parse(json) : fallback;
  } catch (e) {
    console.warn('storage.loadData error', e);
    return fallback;
  }
}

export async function removeData(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn('storage.removeData error', e);
    return false;
  }
}

// Session specific helpers ---------------------------------------------
export async function saveSession(user) {
  return saveData(KEYS.SESSION, user);
}

export async function getSession() {
  return loadData(KEYS.SESSION, null);
}

export async function clearSession() {
  return removeData(KEYS.SESSION);
}

// Progress specific helpers ----------------------------------------------
// progress shape: { [matkulId]: { percent: number, lastUpdated: string } }
export async function saveProgress(progressMap) {
  return saveData(KEYS.PROGRESS, progressMap);
}

export async function getProgress() {
  return loadData(KEYS.PROGRESS, {});
}

export async function updateProgress(matkulId, percent) {
  const current = await getProgress();
  const updated = {
    ...current,
    [matkulId]: { percent, lastUpdated: new Date().toISOString() },
  };
  await saveProgress(updated);
  return updated;
}

// Tugas upload helpers -----------------------------------------------------
// uploads shape: { [matkulId]: { uri: string, uploadedAt: string } }
export async function saveTugasUpload(matkulId, uri) {
  const current = await loadData(KEYS.TUGAS, {});
  const updated = {
    ...current,
    [matkulId]: { uri, uploadedAt: new Date().toISOString() },
  };
  await saveData(KEYS.TUGAS, updated);
  return updated;
}

export async function getTugasUploads() {
  return loadData(KEYS.TUGAS, {});
}
