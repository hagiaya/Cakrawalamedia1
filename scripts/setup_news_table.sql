-- 1. Create 'news' table if it completely doesn't exist
CREATE TABLE IF NOT EXISTS public.news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  excerpt text,
  content text,
  category text,
  image text,
  author text,
  status text CHECK (status IN ('draft', 'pending_editor', 'pending_admin', 'published', 'rejected')) DEFAULT 'draft',
  views integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Add columns if they don't exist (in case table existed but was incomplete)
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.users(id);
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS published_at date DEFAULT CURRENT_DATE;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());


-- 2. Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- 3. Policies
DROP POLICY IF EXISTS "Public can view published news" ON public.news;
CREATE POLICY "Public can view published news" ON public.news
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Staff can view all news" ON public.news;
CREATE POLICY "Staff can view all news" ON public.news
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff can insert news" ON public.news;
CREATE POLICY "Staff can insert news" ON public.news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff can update news" ON public.news;
CREATE POLICY "Staff can update news" ON public.news
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff can delete news" ON public.news;
CREATE POLICY "Staff can delete news" ON public.news
  FOR DELETE USING (auth.role() = 'authenticated');


-- 4. Seed Mock Data
DO $$
DECLARE
  admin_id uuid := 'cd9b6245-8ee5-449f-b6a2-40b7d4c62074';
BEGIN

  -- Article 1
  IF NOT EXISTS (SELECT 1 FROM public.news WHERE title = 'Akar Rumput Solid Dukung Pepep Sebagai Ketua DPW PPP Jabar') THEN
    INSERT INTO public.news (title, excerpt, content, category, author, author_id, published_at, image, status, views, is_featured)
    VALUES (
      'Akar Rumput Solid Dukung Pepep Sebagai Ketua DPW PPP Jabar',
      'Dukungan terus mengalir dari akar rumput untuk Pepep Saeful Hidayat memimpin DPW PPP Jawa Barat.',
      'MAJALENGKA - Arus dukungan akar rumput Partai Persatuan Pembangunan (PPP) di Jawa Barat semakin solid mengarah kepada Pepep Saeful Hidayat untuk memimpin DPW PPP Jawa Barat periode mendatang...',
      'Nasional',
      'Redaksi',
      admin_id,
      '2026-02-01',
      'https://cakrawalamedia.com/wp-content/uploads/2026/02/thumbnail-50-1.png',
      'published',
      12543,
      true
    );
  END IF;

  -- Article 2
  IF NOT EXISTS (SELECT 1 FROM public.news WHERE title = 'PPP Jawa Barat Siap Gelar Muswil, Status Plt Ketua Masih Pepep Saeful Hidayat') THEN
    INSERT INTO public.news (title, excerpt, content, category, author, author_id, published_at, image, status)
    VALUES (
      'PPP Jawa Barat Siap Gelar Muswil, Status Plt Ketua Masih Pepep Saeful Hidayat',
      'Persiapan Musyawarah Wilayah PPP Jawa Barat terus dimatangkan di tengah dinamika partai.',
      'BANDUNG - Dewan Pimpinan Wilayah (DPW) Partai Persatuan Pembangunan (PPP) Jawa Barat memastikan kesiapannya...',
      'Nasional',
      'Redaksi',
      admin_id,
      '2026-01-28',
      'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-48.png',
      'published'
    );
  END IF;

  -- Article 3
  IF NOT EXISTS (SELECT 1 FROM public.news WHERE title = '300 Rumah Warga di Majalengka Terdampak Banjir') THEN
    INSERT INTO public.news (title, excerpt, content, category, author, author_id, published_at, image, status)
    VALUES (
      '300 Rumah Warga di Majalengka Terdampak Banjir',
      'Hujan deras yang mengguyur wilayah Majalengka menyebabkan ratusan rumah terendam banjir.',
      'MAJALENGKA - Sebanyak kurang lebih 300 rumah warga di Kabupaten Majalengka dilaporkan terdampak banjir...',
      'Nasional',
      'Redaksi',
      admin_id,
      '2026-01-25',
      'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-47.png',
      'published'
    );
  END IF;

  -- Article 4
  IF NOT EXISTS (SELECT 1 FROM public.news WHERE title = 'Banjir dan Longsor Landa Sejumlah Wilayah di Majalengka') THEN
    INSERT INTO public.news (title, excerpt, content, category, author, author_id, published_at, image, status)
    VALUES (
      'Banjir dan Longsor Landa Sejumlah Wilayah di Majalengka',
      'BPBD mencatat beberapa titik longsor dan banjir yang perlu diwaspadai warga.',
      'MAJALENGKA - Bencana hidrometeorologi berupa banjir dan tanah longsor menerjang sejumlah wilayah...',
      'Nasional',
      'Redaksi',
      admin_id,
      '2026-01-24',
      'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-46.png',
      'published'
    );
  END IF;

   -- Article 5
   IF NOT EXISTS (SELECT 1 FROM public.news WHERE title = 'BPBD Imbau Masyarakat Majalengka Waspada Cuaca Ekstrem') THEN
    INSERT INTO public.news (title, excerpt, content, category, author, author_id, published_at, image, status)
    VALUES (
      'BPBD Imbau Masyarakat Majalengka Waspada Cuaca Ekstrem',
      'Masyarakat diminta tetap waspada terhadap potensi hujan lebat dan angin kencang.',
      'MAJALENGKA - Badan Penanggulangan Bencana Daerah (BPBD) Kabupaten Majalengka mengeluarkan peringatan dini...',
      'Pemerintahan',
      'Redaksi',
      admin_id,
      '2026-01-21',
      'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-62.png',
      'published'
    );
  END IF;

   -- Article 6
   IF NOT EXISTS (SELECT 1 FROM public.news WHERE title = 'Pemulihan Layanan Pendidikan di Wilayah Terdampak Banjir Sumatera') THEN
    INSERT INTO public.news (title, excerpt, content, category, author, author_id, published_at, image, status)
    VALUES (
      'Pemulihan Layanan Pendidikan di Wilayah Terdampak Banjir Sumatera',
      'Kementerian Pendidikan mempercepat pemulihan fasilitas sekolah pasca banjir.',
      'SUMATERA - Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen) terus mempercepat proses pemulihan layanan pendidikan di wilayah-wilayah terdampak banjir di Sumatera, khususnya Sumatera Barat dan Sumatera Utara...',
      'Nasional',
      'Redaksi',
      admin_id,
      '2026-01-20',
      'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-43.png',
      'published'
    );
  END IF;

END $$;

