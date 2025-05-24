# 🎨 Türkiye Üniversiteleri Frontend Uygulaması

[![React](https://img.shields.io/badge/react-18.x-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-5.x-646cff.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.x-38bdf8.svg)](https://tailwindcss.com/)

> **Türkiye'deki üniversiteleri keşfetmek için modern, kullanıcı dostu ve responsive web uygulaması**

Bu frontend uygulaması, Türkiye Üniversiteleri API Backend ile entegre çalışan modern bir React uygulamasıdır. Kullanıcılar üniversiteleri, fakülteleri ve programları kolayca arayabilir, filtreleyebilir ve karşılaştırabilir.

## 📋 İçindekiler

- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
- [✨ Özellikler](#-özellikler)
- [🏗️ Teknoloji Stack](#️-teknoloji-stack)
- [📱 Sayfa Yapısı](#-sayfa-yapısı)
- [🎨 Bileşen Mimarisi](#-bileşen-mimarisi)
- [🔗 API Entegrasyonu](#-api-entegrasyonu)

## 🚀 Hızlı Başlangıç

### ⚡ Tek Komutla Başlatma

```bash
# Bağımlılıkları kur ve başlat
bun install && bun run dev
# veya
npm install && npm run dev
```

### 📋 Adım Adım Kurulum

#### 1️⃣ Bağımlılıkları Kurun

```bash
# Bun ile (önerilen)
bun install

# veya npm ile
npm install
```

#### 2️⃣ Geliştirme Sunucusunu Başlatın

```bash
# Bun ile
bun run dev

# veya npm ile
npm run dev
```

#### 3️⃣ Uygulamaya Erişin

Uygulama **[http://localhost:5173](http://localhost:5173)** adresinde çalışacaktır.

## ✨ Özellikler

### 🎯 Ana Özellikler

- **🏫 Üniversite Keşfi**: 205 üniversite arasında arama ve filtreleme
- **🔍 Gelişmiş Arama**: Çoklu kriter ile kapsamlı filtreleme sistemi
- **⚖️ Karşılaştırma**: Üniversite ve program karşılaştırması
- **📊 YÖK 2024 Verileri**: Güncel puan aralıkları ve kontenjan bilgileri
- **📱 Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu
- **⚡ Hızlı Performans**: Optimized loading ve caching

### 🆕 v2.0.0 Yenilikleri

- **🔍 Gelişmiş Arama Sayfası**: Çoklu kriter filtreleme sistemi
- **🎛️ Etkileşimli Filtre Paneli**: Katlanabilir, görsel durum göstergeleri
- **🏷️ Renkli Filtre Etiketleri**: Her filtre türü için farklı renk kodlaması
- **📊 Program Kartları**: YÖK 2024 verilerini gösteren gelişmiş kartlar
- **⚖️ Karşılaştırma Entegrasyonu**: Arama sonuçlarından doğrudan ekleme
- **🔄 Yükleme Durumları**: Spinner animasyonları ve hata yönetimi

### 🔍 Filtreleme Seçenekleri

| Filtre Türü               | Seçenekler             | Açıklama                          |
| ------------------------- | ---------------------- | --------------------------------- |
| **🏛️ Üniversite Türü**    | Devlet, Vakıf          | Üniversite türüne göre filtreleme |
| **🏙️ Şehir**              | 81 şehir               | Çoklu şehir seçimi                |
| **🎓 Program Türü**       | Lisans, Önlisans       | Program seviyesi                  |
| **📊 Puan Türü**          | SAY, EA, SÖZ, DİL, TYT | YÖK puan türleri                  |
| **🏷️ Fakülte Kategorisi** | 7 ana kategori         | Mühendislik, Tıp, Sosyal vb.      |
| **🔢 Puan Aralığı**       | Min-Max                | Sayısal puan filtreleme           |
| **👥 Kontenjan**          | Min-Max                | Kontenjan sayısı filtreleme       |

## 🏗️ Teknoloji Stack

### 🔧 Ana Teknolojiler

| Teknoloji        | Versiyon | Kullanım Amacı |
| ---------------- | -------- | -------------- |
| **React**        | 18.x     | UI framework   |
| **TypeScript**   | 5.x      | Type safety    |
| **Vite**         | 5.x      | Build tool     |
| **Tailwind CSS** | 3.x      | Styling        |
| **React Router** | 6.x      | Routing        |
| **Axios**        | 1.x      | HTTP client    |

### 📦 Önemli Bağımlılıklar

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "axios": "^1.6.0"
}
```

### 🎨 UI/UX Özellikleri

- **🎨 Modern Tasarım**: Clean ve minimal arayüz
- **🌙 Responsive**: Mobil-first yaklaşım
- **⚡ Fast Loading**: Lazy loading ve code splitting
- **🔄 Smooth Animations**: CSS transitions ve transforms
- **♿ Accessibility**: ARIA labels ve keyboard navigation
- **🎯 User Experience**: Intuitive navigation ve feedback

## 📱 Sayfa Yapısı

### 🏠 Ana Sayfalar

| Sayfa                     | Route              | Açıklama                                         |
| ------------------------- | ------------------ | ------------------------------------------------ |
| **🏠 Ana Sayfa**          | `/`                | Üniversite, fakülte ve program arama seçenekleri |
| **🔍 Gelişmiş Arama**     | `/advanced-search` | Çoklu kriter filtreleme sistemi                  |
| **🏫 Üniversite Listesi** | `/universities`    | Sayfalama ve filtreleme ile görüntüleme          |
| **📋 Üniversite Detayı**  | `/university/:id`  | Fakülteler, programlar ve YÖK verileri           |
| **🔍 Arama Sonuçları**    | `/search`          | Fakülte ve program arama sonuçları               |
| **⚖️ Karşılaştırma**      | `/comparison`      | Üniversite ve program karşılaştırması            |

### 🎛️ Gelişmiş Arama Sayfası Özellikleri

- **📱 Katlanabilir Filtre Paneli**: Mobil uyumlu, görsel durum göstergeleri
- **🎨 Renkli Filtre Etiketleri**: Her filtre türü için farklı renk kodlaması
- **🔄 Gerçek Zamanlı Sonuçlar**: Anlık filtre uygulaması
- **📊 Sıralama Seçenekleri**: Ad, şehir, program/fakülte sayısı, puan (YÖK 2024)
- **📱 Responsive Tasarım**: Mobil ve masaüstü optimizasyonu

## 🎨 Bileşen Mimarisi

### 🧩 Ana Bileşenler

```
src/
├── components/           # Yeniden kullanılabilir bileşenler
├── pages/               # Sayfa bileşenleri
├── hooks/               # Custom React hooks
├── contexts/            # React context'leri
├── services/            # API servisleri
└── types/               # TypeScript tip tanımları
```

### 🎯 State Management

- **React Context**: Global state yönetimi
- **Custom Hooks**: Durum mantığı soyutlaması
- **TypeScript**: Tip güvenli state yönetimi
- **Local Storage**: Kullanıcı tercihlerini saklama

## 🔗 API Entegrasyonu

### 🌐 Backend Bağlantısı

Bu frontend uygulaması **Türkiye Üniversiteleri API Backend** ile entegre çalışır:

- **Backend URL**: `http://localhost:3000`
- **API Docs**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health`

### ⚙️ API Konfigürasyonu

API bağlantı ayarları `src/services/api.ts` dosyasında yapılandırılır:

```typescript
const API_URL = "http://localhost:3000";
```

---

<div align="center">

**🎨 Frontend • Türkiye Üniversiteleri Projesi**

_Modern React uygulaması • Made with ❤️ in Turkey_

</div>
