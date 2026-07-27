// Dummy "API" for mata kuliah data.
// In a real app this would be a fetch() call to a REST endpoint.
// A small artificial delay is added so the loading state (ActivityIndicator)
// is easy to demonstrate and test.

const DUMMY_MATKUL = [
  {
    id: 'MK001',
    nama: 'Pemrograman Mobile',
    dosen: 'Dr. Andi Wijaya, M.Kom',
    sks: 3,
    jadwal: 'Senin, 08:00 - 10:30',
    deskripsi:
      'Mata kuliah ini membahas pengembangan aplikasi mobile lintas platform menggunakan React Native dan Expo, mencakup navigasi, state management, dan integrasi fitur perangkat.',
    materi: ['Pengenalan React Native', 'Navigasi & Routing', 'State & Props', 'AsyncStorage', 'Device Features'],
  },
  {
    id: 'MK002',
    nama: 'Basis Data Lanjut',
    dosen: 'Siti Rahma, M.T.',
    sks: 3,
    jadwal: 'Selasa, 10:30 - 13:00',
    deskripsi:
      'Membahas perancangan basis data tingkat lanjut, normalisasi, indexing, serta optimasi query untuk aplikasi skala besar.',
    materi: ['Normalisasi Lanjutan', 'Indexing', 'Query Optimization', 'Transaksi & Concurrency'],
  },
  {
    id: 'MK003',
    nama: 'Kecerdasan Buatan',
    dosen: 'Prof. Budi Santoso, Ph.D.',
    sks: 3,
    jadwal: 'Rabu, 13:00 - 15:30',
    deskripsi:
      'Pengantar konsep kecerdasan buatan, algoritma pencarian, machine learning dasar, dan penerapannya pada masalah nyata.',
    materi: ['Algoritma Pencarian', 'Machine Learning Dasar', 'Neural Network', 'Studi Kasus AI'],
  },
  {
    id: 'MK004',
    nama: 'Interaksi Manusia & Komputer',
    dosen: 'Dewi Lestari, M.Kom',
    sks: 2,
    jadwal: 'Kamis, 08:00 - 09:40',
    deskripsi:
      'Membahas prinsip desain antarmuka, usability testing, dan pengalaman pengguna (UX) dalam pengembangan perangkat lunak.',
    materi: ['Prinsip Desain UI', 'Usability Testing', 'Wireframing', 'User Research'],
  },
  {
    id: 'MK005',
    nama: 'Etika Profesi TI',
    dosen: 'Rina Marlina, S.Kom., M.M.',
    sks: 2,
    jadwal: "Jum'at, 10:00 - 11:40",
    deskripsi:
      'Membahas etika, hukum, dan tanggung jawab profesi di bidang teknologi informasi, termasuk perlindungan data pribadi.',
    materi: ['Kode Etik Profesi', 'UU ITE', 'Perlindungan Data Pribadi', 'Studi Kasus Pelanggaran Etika'],
  },
];

export function fetchMatkul() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_MATKUL), 900);
  });
}

export function fetchMatkulById(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_MATKUL.find((m) => m.id === id) || null), 300);
  });
}
