import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProgress } from '../services/storage';
import { fetchMatkul } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import colors from '../constants/colors';

export default function ProgressScreen() {
  // 3 state: rows (merged matkul+progress), loading, refreshingKey
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    const [matkulList, progressMap] = await Promise.all([fetchMatkul(), getProgress()]);
    const merged = matkulList.map((m) => ({
      ...m,
      percent: progressMap[m.id]?.percent ?? 0,
      lastUpdated: progressMap[m.id]?.lastUpdated ?? null,
    }));
    setRows(merged);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  if (loading) {
    return <LoadingSpinner label="Memuat progres belajar..." />;
  }

  const inProgress = rows.filter((r) => r.percent > 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListHeaderComponent={
          rows.length ? (
            <Text style={styles.headerText}>
              {inProgress.length} dari {rows.length} mata kuliah sudah dimulai
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowTop}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.nama}</Text>
              <Text style={styles.rowPercent}>{item.percent}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${item.percent}%` }]} />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="📈"
            title="Belum ada progres"
            subtitle="Buka sebuah mata kuliah untuk mulai mencatat progres"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerText: {
    fontSize: 13,
    color: colors.textLight,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  rowPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  barBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: colors.secondary,
    borderRadius: 5,
  },
});
