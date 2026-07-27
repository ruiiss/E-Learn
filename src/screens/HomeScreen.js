import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSession, getProgress } from '../services/storage';
import { fetchMatkul } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import colors from '../constants/colors';

export default function HomeScreen() {
  // 3+ state: user, matkulCount, progress, loading
  const [user, setUser] = useState(null);
  const [matkulCount, setMatkulCount] = useState(0);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    const [session, matkul, prog] = await Promise.all([
      getSession(),
      fetchMatkul(),
      getProgress(),
    ]);
    setUser(session);
    setMatkulCount(matkul.length);
    setProgress(prog);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Refresh progress whenever the tab regains focus (e.g. after updating progress)
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const progressValues = Object.values(progress);
  const avgProgress = progressValues.length
    ? Math.round(progressValues.reduce((sum, p) => sum + p.percent, 0) / progressValues.length)
    : 0;

  if (loading) {
    return <LoadingSpinner label="Memuat dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={false} onRefresh={loadDashboard} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Halo, {user?.nama || 'Mahasiswa'} 👋</Text>
        <Text style={styles.subGreeting}>NIM: {user?.nim || '-'}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{matkulCount}</Text>
          <Text style={styles.statLabel}>Mata Kuliah</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{avgProgress}%</Text>
          <Text style={styles.statLabel}>Rata-rata Progres</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{progressValues.length}</Text>
          <Text style={styles.statLabel}>Sedang Dipelajari</Text>
        </View>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Tips Hari Ini</Text>
        <Text style={styles.tipText}>
          Buka tab "Matkul" untuk melihat daftar mata kuliah dan mulai belajar. Progresmu akan
          otomatis tersimpan di perangkat.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  subGreeting: {
    fontSize: 13,
    color: '#E0E7FF',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -20,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
});
