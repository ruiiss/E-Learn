import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { fetchMatkulById } from '../services/api';
import { getProgress, updateProgress, saveTugasUpload, getTugasUploads } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import colors from '../constants/colors';

const PROGRESS_STEPS = [0, 25, 50, 75, 100];

export default function DetailMatkulScreen({ route }) {
  const { matkulId, nama } = route.params;

  // 3+ state: matkul detail, loading, percent progress, uploaded photo, permission status
  const [matkul, setMatkul] = useState(null);
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const [tugasUri, setTugasUri] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      const [detail, progressMap, uploads] = await Promise.all([
        fetchMatkulById(matkulId),
        getProgress(),
        getTugasUploads(),
      ]);
      if (!isMounted) return;
      setMatkul(detail);
      setPercent(progressMap[matkulId]?.percent ?? 0);
      setTugasUri(uploads[matkulId]?.uri ?? null);
      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [matkulId]);

  async function handleSetProgress(value) {
    setPercent(value);
    await updateProgress(matkulId, value);
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert(
        'Izin Kamera Ditolak',
        'Untuk mengunggah foto tugas, izinkan akses kamera di pengaturan HP kamu.'
      );
      return;
    }

    setPermissionDenied(false);

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      setTugasUri(uri);
      await saveTugasUpload(matkulId, uri);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Memuat detail mata kuliah..." />;
  }

  if (!matkul) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Mata kuliah tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.headerCard}>
        <Text style={styles.matkulNama}>{matkul.nama}</Text>
        <Text style={styles.matkulDosen}>{matkul.dosen}</Text>
        <Text style={styles.matkulJadwal}>🗓 {matkul.jadwal} • {matkul.sks} SKS</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.bodyText}>{matkul.deskripsi}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materi</Text>
        {matkul.materi.map((item, index) => (
          <View key={index} style={styles.materiRow}>
            <Text style={styles.materiBullet}>{index + 1}.</Text>
            <Text style={styles.materiText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progres Belajar: {percent}%</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>
        <View style={styles.stepsRow}>
          {PROGRESS_STEPS.map((step) => (
            <TouchableOpacity
              key={step}
              style={[styles.stepButton, percent === step && styles.stepButtonActive]}
              onPress={() => handleSetProgress(step)}
            >
              <Text style={[styles.stepText, percent === step && styles.stepTextActive]}>
                {step}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Foto Tugas</Text>
        {tugasUri ? (
          <Image source={{ uri: tugasUri }} style={styles.preview} />
        ) : (
          <Text style={styles.bodyText}>Belum ada foto tugas diunggah.</Text>
        )}
        {permissionDenied && (
          <Text style={styles.errorText}>
            Izin kamera ditolak. Aktifkan lewat Pengaturan HP untuk mengunggah foto.
          </Text>
        )}
        <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
          <Text style={styles.uploadButtonText}>
            {tugasUri ? '📷 Ambil Ulang Foto' : '📷 Ambil Foto Tugas'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    color: colors.textLight,
    fontSize: 15,
  },
  headerCard: {
    backgroundColor: colors.primary,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  matkulNama: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  matkulDosen: {
    fontSize: 13,
    color: '#E0E7FF',
    marginTop: 4,
  },
  matkulJadwal: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 6,
  },
  section: {
    backgroundColor: colors.card,
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
  materiRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  materiBullet: {
    width: 20,
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  materiText: {
    fontSize: 13,
    color: colors.text,
    flexShrink: 1,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    backgroundColor: colors.secondary,
    borderRadius: 6,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  stepButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  stepTextActive: {
    color: colors.white,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: 8,
  },
});
