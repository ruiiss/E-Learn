import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { saveSession } from '../services/storage';
import colors from '../constants/colors';

export default function LoginScreen({ navigation }) {
  // Minimal 3 state berbeda: mode, form fields, errors
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ nim: '', nama: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const newErrors = {};

    if (!form.nim.trim()) {
      newErrors.nim = 'NIM tidak boleh kosong';
    } else if (!/^\d{6,12}$/.test(form.nim.trim())) {
      newErrors.nim = 'NIM harus 6-12 digit angka';
    }

    if (mode === 'register' && !form.nama.trim()) {
      newErrors.nama = 'Nama lengkap tidak boleh kosong';
    }

    if (!form.password) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = {
        nim: form.nim.trim(),
        nama: mode === 'register' ? form.nama.trim() : form.nama.trim() || 'Mahasiswa',
        loginAt: new Date().toISOString(),
      };
      await saveSession(user);
      navigation.replace('MainTabs');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.primary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.brand}>🎓 E-Learning Kampus</Text>
        <View style={styles.card}>
          <Text style={styles.heading}>
            {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
          </Text>

          {mode === 'register' && (
            <View style={styles.field}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama lengkap"
                value={form.nama}
                onChangeText={(v) => updateField('nama', v)}
              />
              {errors.nama ? <Text style={styles.error}>{errors.nama}</Text> : null}
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>NIM</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 220112345"
              keyboardType="number-pad"
              value={form.nim}
              onChangeText={(v) => updateField('nim', v)}
            />
            {errors.nim ? <Text style={styles.error}>{errors.nim}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimal 6 karakter"
              secureTextEntry
              value={form.password}
              onChangeText={(v) => updateField('password', v)}
            />
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.button, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setErrors({});
              setMode(mode === 'login' ? 'register' : 'login');
            }}
          >
            <Text style={styles.switchText}>
              {mode === 'login'
                ? 'Belum punya akun? Daftar di sini'
                : 'Sudah punya akun? Masuk di sini'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  brand: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  switchText: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: 16,
    fontSize: 13,
    fontWeight: '600',
  },
});
