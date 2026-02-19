export type ArticleStatus = 'draft' | 'pending_editor' | 'pending_admin' | 'published' | 'rejected';

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    image: string;
    isFeatured?: boolean;
    views?: number;
    status: ArticleStatus;
    content?: string; // Adding content field for full article
}

export const articles: Article[] = [
    {
        id: '1',
        title: 'Akar Rumput Solid Dukung Pepep Sebagai Ketua DPW PPP Jabar',
        excerpt: 'Dukungan terus mengalir dari akar rumput untuk Pepep Saeful Hidayat memimpin DPW PPP Jawa Barat.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '01 Feb, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/02/thumbnail-50-1.png',
        isFeatured: true,
        views: 12543,
        status: 'published',
        content: `MAJALENGKA - Arus dukungan akar rumput Partai Persatuan Pembangunan (PPP) di Jawa Barat semakin solid mengarah kepada Pepep Saeful Hidayat untuk memimpin DPW PPP Jawa Barat periode mendatang. Berbagai elemen partai, mulai dari pengurus tingkat cabang hingga ranting, menyuarakan aspirasi agar kepemimpinan Pepep dilanjutkan secara definitif.
        
        Dalam deklarasi yang digelar di Majalengka pada Minggu (01/02/2026), perwakilan kader menegaskan bahwa Pepep Saeful Hidayat dinilai berhasil menjaga stabilitas partai di tengah dinamika politik nasional dan lokal. "Kami solid mendukung Kang Pepep. Beliau figur yang mengayomi dan terbukti mampu menaikkan kursi PPP di DPRD Jawa Barat pada pemilu lalu," ujar salah satu perwakilan DPC PPP.
        
        Dukungan ini juga muncul sebagai respons atas beredarnya isu penunjukan pelaksana tugas (Plt) lain yang dinilai tidak sesuai dengan aspirasi kader di bawah. Para kader menekankan pentingnya menjaga marwah organisasi dengan menghormati mekanisme partai yang berlaku dan aspirasi dari bawah.
        
        "Soliditas ini modal penting menghadapi agenda politik ke depan. Kami berharap DPP mendengar suara arus bawah ini," tambahnya. Pepep sendiri saat ini masih menjabat sebagai Plt Ketua DPW PPP Jabar dan aktif melakukan konsolidasi ke berbagai daerah untuk memastikan kesiapan mesin partai.
        `
    },
    {
        id: '2',
        title: 'PPP Jawa Barat Siap Gelar Muswil, Status Plt Ketua Masih Pepep Saeful Hidayat',
        excerpt: 'Persiapan Musyawarah Wilayah PPP Jawa Barat terus dimatangkan di tengah dinamika partai.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '28 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-48.png',
        status: 'published',
        content: `BANDUNG - Dewan Pimpinan Wilayah (DPW) Partai Persatuan Pembangunan (PPP) Jawa Barat memastikan kesiapannya untuk menggelar Musyawarah Wilayah (Muswil) dalam waktu dekat. Hal ini ditegaskan dalam rapat koordinasi DPW PPP Jabar yang digelar di Bandung, Senin (26/01/2026).
        
        Rapat tersebut dipimpin langsung oleh Pelaksana Tugas (Plt) Ketua DPW PPP Jabar, H. Pepep Saeful Hidayat, dan dihadiri oleh jajaran pengurus harian serta pimpinan DPC PPP se-Jawa Barat. Agenda utama rapat membahas persiapan teknis, pembentukan panitia, serta penetapan waktu dan tempat pelaksanaan Muswil.
        
        Wakil Ketua DPW PPP Jabar, Apip Ifan Permadi, menjelaskan bahwa konsolidasi organisasi terus berjalan meskipun terdapat dinamika terkait isu Surat Keputusan (SK) DPP PPP tentang penunjukan pejabat baru. "Kami fokus pada agenda Muswil sesuai instruksi partai untuk pembenahan struktur. Hingga saat ini, status Ketua DPW masih dipegang oleh Kang Pepep," tegas Apip.
        
        Sebelumnya, DPW PPP Jabar sempat mengajukan permohonan penundaan Muswil pada Desember 2025 lalu dikarenakan kondisi bencana alam yang melanda sejumlah daerah. Namun kini, mesin partai telah dipanaskan kembali untuk menyukseskan agenda tertinggi di tingkat wilayah tersebut.
        
        Masifnya dukungan DPC-DPC kepada Pepep Saeful Hidayat juga menjadi sorotan. Keberhasilannya menaikkan kursi legislatif di Jawa Barat dianggap sebagai prestasi yang patut diapresiasi dengan memberikan kesempatan memimpin secara definitif.
        `
    },
    {
        id: '3',
        title: '300 Rumah Warga di Majalengka Terdampak Banjir',
        excerpt: 'Hujan deras yang mengguyur wilayah Majalengka menyebabkan ratusan rumah terendam banjir.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '25 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-47.png',
        status: 'published',
        content: `MAJALENGKA - Sebanyak kurang lebih 300 rumah warga di Kabupaten Majalengka dilaporkan terdampak banjir akibat cuaca ekstrem yang melanda wilayah tersebut. Banjir dipicu oleh hujan dengan intensitas tinggi yang mengguyur terus-menerus sejak Jumat hingga Sabtu (24/01/2026).
        
        Kepala Pelaksana BPBD Kabupaten Majalengka, Agus Tamim, mengungkapkan bahwa Desa Wanasalam di Kecamatan Ligung menjadi salah satu titik terparah. "Air mulai naik sejak Sabtu dini hari, merendam pemukiman warga dan memutus beberapa akses jalan desa," ujar Agus.
        
        Selain merendam ratusan rumah, banjir juga menggenangi puluhan hektar sawah, mengancam warga gagal panen. Tim Reaksi Cepat (TRC) BPBD Majalengka bersama TNI/Polri dan relawan telah diterjunkan ke lokasi untuk melakukan evakuasi dan pendataan.
        
        "Kami mencatat ada 39 titik bencana yang tersebar di 13 kecamatan, meliputi banjir, longsor, dan pohon tumbang. Kami mengimbau warga untuk tetap waspada karena curah hujan diprediksi masih tinggi hingga akhir Januari," tambah Agus Tamim.
        
        Pemerintah daerah melalui Dinas Sosial juga telah mulai mendistribusikan bantuan logistik berupa makanan siap saji dan kebutuhan dasar bagi warga yang terdampak, sementara sebagian warga memilih mengungsi ke tempat yang lebih aman.
        `
    },
    {
        id: '4',
        title: 'Banjir dan Longsor Landa Sejumlah Wilayah di Majalengka',
        excerpt: 'BPBD mencatat beberapa titik longsor dan banjir yang perlu diwaspadai warga.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '24 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-46.png',
        status: 'published',
        content: `MAJALENGKA - Bencana hidrometeorologi berupa banjir dan tanah longsor menerjang sejumlah wilayah di Kabupaten Majalengka, Jawa Barat. Data Pusat Pengendalian Operasi (Pusdalops) BPBD Majalengka mencatat setidaknya 26 kejadian bencana terjadi dalam kurun waktu 24 jam terakhir hingga Sabtu (24/01/2026).
        
        Bupati Majalengka, H. Eman Suherman, langsung menginstruksikan jajaran BPBD dan Dinas Pekerjaan Umum dan Tata Ruang (PUTR) untuk bergerak cepat (gercep) menangani dampak bencana. "Alat berat harus segera diturunkan untuk membuka akses jalan yang tertutup longsor, dan pastikan kebutuhan warga terdampak terpenuhi," instruksi Bupati Eman saat meninjau lokasi.
        
        Selain kerusakan infrastruktur jalan, longsor juga mengancam beberapa rumah warga di daerah perbukitan. BPBD mengonfirmasi tidak ada korban jiwa dalam rentetan kejadian ini, namun kerugian materiil diperkirakan mencapai ratusan juta rupiah.
        
        Kepala Dinas Ketahanan Pangan, Pertanian dan Perikanan (DKP3) juga diminta untuk segera mendata lahan pertanian yang rusak (puso) akibat terendam banjir untuk mengupayakan bantuan bibit atau asuransi tani bagi petani yang merugi.
        `
    },
    {
        id: '5',
        title: 'BPBD Imbau Masyarakat Majalengka Waspada Cuaca Ekstrem',
        excerpt: 'Masyarakat diminta tetap waspada terhadap potensi hujan lebat dan angin kencang.',
        category: 'Pemerintahan',
        author: 'Redaksi',
        date: '21 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-62.png',
        status: 'published',
        content: `MAJALENGKA - Badan Penanggulangan Bencana Daerah (BPBD) Kabupaten Majalengka mengeluarkan peringatan dini terkait potensi cuaca ekstrem yang masih akan melanda wilayah Majalengka dan sekitarnya.
        
        Kepala Pelaksana BPBD Majalengka, Agus Tamim, menyatakan bahwa berdasarkan prakiraan BMKG, potensi hujan dengan intensitas sedang hingga lebat yang dapat disertai kilat/petir dan angin kencang masih berpotensi terjadi. "Kondisi tanah yang sudah jenuh air akibat hujan beberapa hari terakhir meningkatkan risiko longsor, terutama di wilayah selatan Majalengka," jelas Agus.
        
        Masyarakat yang tinggal di bantaran sungai dan lereng bukit diminta untuk meningkatkan kewaspadaan, terutama saat hujan turun lebih dari satu jam tanpa henti. BPBD juga telah menyiagakan personel dan peralatan penanggulangan bencana 24 jam.
        
        "Kami menghimbau warga untuk segera melaporkan jika melihat tanda-tanda retakan tanah atau kenaikan debit air sungai yang tidak wajar kepada aparat desa atau langsung ke call center BPBD," pungkas Agus.
        `
    },
    // Mock Data for Workflow Testing (Keep generically descriptive)
    {
        id: '101',
        title: 'Draf Berita Ekonomi Mikro (Wartawan)',
        excerpt: 'Analisis mendalam mengenai perkembangan UMKM di daerah pedesaan.',
        category: 'Bisnis',
        author: 'Joko (Wartawan)',
        date: '08 Feb, 2026',
        image: 'https://placehold.co/800x450/333333/white?text=Draft+Wartawan',
        status: 'draft',
        content: 'Ini adalah draf konten berita mengenai ekonomi mikro. Wartawan sedang mengumpulkan data lapangan terkait pertumbuhan UMKM pasca pandemi di desa-desa wisata.'
    },
    {
        id: '102',
        title: 'Berita Menunggu Review Editor',
        excerpt: 'Laporan lapangan mengenai kondisi jalan rusak di wilayah selatan.',
        category: 'Nasional',
        author: 'Joko (Wartawan)',
        date: '07 Feb, 2026',
        image: 'https://placehold.co/800x450/444444/white?text=Pending+Editor',
        status: 'pending_editor',
        content: 'Laporan ini menyoroti kondisi infrastruktur jalan di wilayah selatan yang mengalami kerusakan parah akibat tonase kendaraan dan curah hujan tinggi. Warga mengeluhkan mobilitas yang terganggu.'
    },
    {
        id: '103',
        title: 'Berita Siap Publish (Pending Admin)',
        excerpt: 'Wawancara eksklusif dengan tokoh masyarakat setempat.',
        category: 'Nasional',
        author: 'Siti (Editor)',
        date: '06 Feb, 2026',
        image: 'https://placehold.co/800x450/555555/white?text=Pending+Admin',
        status: 'pending_admin',
        content: 'Hasil wawancara eksklusif dengan tokoh masyarakat mengenai pentingnya menjaga kerukunan antar warga menjelang tahun politik. Tokoh tersebut menekankan nilai-nilai gotong royong.'
    },
    {
        id: '6',
        title: 'Pemulihan Layanan Pendidikan di Wilayah Terdampak Banjir Sumatera',
        excerpt: 'Kementerian Pendidikan mempercepat pemulihan fasilitas sekolah pasca banjir.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '20 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-43.png',
        status: 'published',
        content: `SUMATERA - Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen) terus mempercepat proses pemulihan layanan pendidikan di wilayah-wilayah terdampak banjir di Sumatera, khususnya Sumatera Barat dan Sumatera Utara.
        
        Menteri Pendidikan Dasar dan Menengah, Abdul Mu'ti, menyampaikan bahwa proses pembersihan fasilitas sekolah di kedua provinsi tersebut rata-rata sudah hampir selesai dilakukan. Namun, kendala masih ditemui terkait sarana prasarana pendukung pembelajaran.
        
        "Pembersihan lumpur sisa banjir sudah mencapai 90%, tapi banyak mebeler seperti meja, kursi, dan lemari buku yang rusak parah dan tidak bisa digunakan lagi," ujar Abdul Mu'ti dalam keterangannya (20/01/2026).
        
        Akibat kerusakan ini, kegiatan belajar mengajar (KBM) di beberapa sekolah belum bisa berjalan normal. Sebagian siswa terpaksa belajar dengan fasilitas seadanya, bahkan ada yang harus belajar secara bergantian atau menumpang di lokasi yang lebih aman.
        
        Pemerintah pusat berkomitmen untuk memberikan bantuan afirmasi berupa pengadaan mebeler baru dan buku-buku pelajaran untuk menggantikan yang rusak. Khusus untuk wilayah Aceh yang mengalami dampak kerusakan infrastruktur lebih parah, Kemendikdasmen akan berkoordinasi dengan Kementerian PUPR untuk perbaikan fisik bangunan sekolah.
        `
    }
];

export const categories = [
    'Nasional', 'Internasional', 'Bisnis', 'Olahraga', 'Teknologi', 'Gaya Hidup', 'Otomotif', 'Kesehatan', 'Pemerintahan', 'Hukum', 'Hiburan'
];
