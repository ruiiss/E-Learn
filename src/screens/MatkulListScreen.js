import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { fetchMatkul } from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import colors from '../constants/colors';

export default function MatkulListScreen({ navigation }) {
  // 3 state: matkulList, loading, error
  const [matkulList, setMatkulList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMatkul();
        if (isMounted) setMatkulList(data);
      } catch (e) {
        if (isMounted) setError('Gagal memuat data mata kuliah');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner label="Memuat daftar mata kuliah..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matkulList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <ItemCard
            title={item.nama}
            subtitle={`${item.dosen} • ${item.sks} SKS`}
            meta={item.jadwal}
            badge={`${item.sks} SKS`}
            onPress={() => navigation.navigate('DetailMatkul', { matkulId: item.id, nama: item.nama })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="📚"
            title={error || 'Belum ada mata kuliah'}
            subtitle="Tarik ke bawah untuk memuat ulang"
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
});
