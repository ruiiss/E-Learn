import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getSession, clearSession } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import colors from '../constants/colors';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const session = await getSession();
      if (isMounted) {
        setUser(session);
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleLogout() {
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          navigation.getParent()?.replace
            ? navigation.getParent().replace('Login')
            : navigation.replace('Login');
        },
      },
    ]);
  }

  if (loading) {
    return <LoadingSpinner label="Memuat profil..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitial}>
          {(user?.nama || 'M').charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.nama}>{user?.nama || 'Mahasiswa'}</Text>
      <Text style={styles.nim}>NIM: {user?.nim || '-'}</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Terakhir Login</Text>
          <Text style={styles.infoValue}>
            {user?.loginAt ? new Date(user.loginAt).toLocaleString('id-ID') : '-'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Universitas</Text>
          <Text style={styles.infoValue}>Universitas Prima Indonesia</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Program Studi</Text>
          <Text style={styles.infoValue}>Sistem Informasi</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '800',
  },
  nama: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  nim: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    width: '100%',
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
  },
  logoutText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
