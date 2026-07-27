# E-Learning Kampus — Domain: E-Learning Kampus

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-Local_Persistence-00b894)

> Platform belajar online kampus yang memungkinkan mahasiswa login, melihat daftar mata kuliah, membaca materi, mencatat progres belajar, dan mengunggah foto tugas — semua tersimpan secara lokal di perangkat.

---

## 📸 Screenshots

| Login Screen | Home Screen | Feature Screen |
|:---:|:---:|:---:|
| ![Login](https://i.imgur.com/Cs2VYT5.jpeg) | ![Home](https://i.imgur.com/I4SLxGn.jpeg) | ![Feature](https://i.imgur.com/tpWquT2.jpeg) |

*(Ganti dengan screenshot asli dari HP kamu sebelum submit.)*

---

## ✨ Fitur Utama

- [x] Login/Register dengan validasi form (NIM, nama, password)
- [x] Daftar Mata Kuliah dengan FlatList
- [x] Detail Mata Kuliah dengan navigasi Stack dan parameter
- [x] Progres belajar per mata kuliah (0-100%) tersimpan lokal
- [x] Upload foto tugas via expo-image-picker (kamera) dengan handling izin
- [x] Data persisten dengan AsyncStorage (sesi, progres, foto tugas)
- [x] Bottom Tab Navigation (Beranda, Matkul, Progres, Profil)

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React Native + Expo |
| Navigation | React Navigation v6 (Stack + Bottom Tab) |
| Storage | @react-native-async-storage/async-storage |
| Device | expo-image-picker |
| Build | EAS Build (Expo Application Services) |

---

## 🚀 Cara Menjalankan

```bash
git clone https://github.com/ruiiss/E-Learn.git
cd e-learning-kampus
npm install
npx expo start
```

Scan QR Code dengan Expo Go di HP.

---

## 📦 Download APK

[Download APK terbaru](LINK_APK_GITHUB_RELEASE_ATAU_DRIVE)

---

## 🌐 Expo Snack

[Buka di Expo Snack](https://snack.expo.dev/@ariq_lll/e-learn)

---

## 👤 Developer

**Nama Lengkap** | NIM | Kelas
Universitas Prima Indonesia — Prodi Sistem Informasi
Mata Kuliah: Pemrograman Mobile (TI-MOBILE-01)

---

## 📁 Struktur Data AsyncStorage

| Key | Isi |
|-----|-----|
| `@elearning_session` | Data sesi user (nim, nama, waktu login) |
| `@elearning_progress` | Progres belajar per mata kuliah (`{ [matkulId]: { percent, lastUpdated } }`) |
| `@elearning_tugas_uploads` | URI foto tugas per mata kuliah (`{ [matkulId]: { uri, uploadedAt } }`) |

## 🧭 Catatan Navigasi

```
RootStack
├── Login
└── MainTabs (Bottom Tab)
    ├── Beranda   (HomeScreen)
    ├── Matkul    (Stack: MatkulList -> DetailMatkul)
    ├── Progres   (ProgressScreen)
    └── Profil    (ProfileScreen)
```
