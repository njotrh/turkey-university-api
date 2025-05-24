# 🔙 Türkiye Üniversiteleri API Backend (v2.0.0)

[![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-4.x-black.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![API Version](https://img.shields.io/badge/API-v2.0.0-brightgreen.svg)](#)

> **Türkiye'deki üniversiteler hakkında kapsamlı bilgi sağlayan yüksek performanslı RESTful API servisi**

Bu backend servisi, Türkiye'deki üniversiteler, fakülteler ve programlar hakkında detaylı bilgi sunar. YÖK 2024 verilerini entegre eden gelişmiş arama sistemi, in-memory caching ve rate limiting ile optimize edilmiştir.

## 📋 İçindekiler

- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
- [✨ Özellikler](#-özellikler)
- [🔧 Teknik Spesifikasyonlar](#-teknik-spesifikasyonlar)
- [📊 API Endpoint'leri](#-api-endpointleri)
- [🏗️ Veri Yapısı](#️-veri-yapısı)
- [📚 API Dokümantasyonu](#-api-dokümantasyonu)
- [⚠️ Bilgilendirme](#️-bilgilendirme)

## 🚀 Hızlı Başlangıç

### ⚡ Tek Komutla Başlatma

```bash
# Bun ile çalıştırma (önerilen)
bun index.ts

# veya Node.js ile çalıştırma
node index.ts
```

### 🌐 Erişim Adresleri

| Servis        | URL                          | Açıklama                  |
| ------------- | ---------------------------- | ------------------------- |
| **🔙 API**    | http://localhost:3000        | Ana API servisi           |
| **📚 Docs**   | http://localhost:3000/docs   | Swagger UI dokümantasyonu |
| **💚 Health** | http://localhost:3000/health | Sistem durumu             |

## ✨ Özellikler

### 🆕 Yeni Özellikler (v2.0.0)

- **🔍 Gelişmiş Çoklu Kriter Arama**: Üniversite türü, şehir, program türü, puan türü ve fakülte kategorilerine göre filtreleme
- **📊 YÖK 2024 Veri Entegrasyonu**: Güncel puan aralıkları ve kontenjan bilgileri
- **🎯 Akıllı Filtreleme**: Sayısal aralık filtreleri ve fuzzy text matching
- **🏷️ Fakülte Kategorileri**: 7 ana fakülte kategorisi ile gelişmiş filtreleme
- **⚡ Performans İyileştirmeleri**: In-memory caching, rate limiting, gzip compression

### 🔧 Temel Özellikler

- ✅ Türkiye'deki tüm üniversiteleri listele
- 🏙️ Üniversiteleri şehre göre filtrele
- 🏛️ Üniversiteleri türe göre filtrele (Devlet/Vakıf)
- 📋 Belirli bir üniversite hakkında ayrıntılı bilgi al
- 🔍 Tüm üniversitelerde fakülte ara
- 🎓 Tüm üniversitelerde program ara
- 📊 Puan aralığına göre program arama
- 📈 Enhanced data istatistikleri

### 🆕 Gelişmiş Arama Özellikleri

- **🎯 Çoklu Kriter Filtreleme**: Birden fazla filtreyi aynı anda uygulama
- **🏛️ Üniversite Türü Filtresi**: Devlet/Vakıf üniversiteleri
- **🏙️ Şehir Filtresi**: 81 şehir arasından çoklu seçim
- **🎓 Program Türü Filtresi**: Lisans/Önlisans programları
- **📊 Puan Türü Filtresi**: SAY, EA, SÖZ, DİL, TYT puan türleri
- **🏷️ Fakülte Kategorileri**: Mühendislik, Tıp, Sosyal Bilimler, Fen Bilimleri, Eğitim, Hukuk, İşletme
- **🔢 Sayısal Filtreler**: Puan aralığı (min/max) ve kontenjan aralığı (min/max)
- **🔍 Akıllı Metin Arama**: Program adlarında fuzzy matching
- **📋 Sıralama Seçenekleri**: Ad, şehir, program sayısı, fakülte sayısına göre sıralama

## 🔧 Teknik Spesifikasyonlar

### 📊 Performans Metrikleri

| Metrik              | Değer     | Açıklama                      |
| ------------------- | --------- | ----------------------------- |
| **⚡ Yanıt Süresi** | ~100ms    | Ortalama API yanıt süresi     |
| **🗜️ Compression**  | %70       | Gzip ile veri boyutu azalması |
| **⚡ Cache Hit**    | %85+      | Önbellek isabet oranı         |
| **🔄 Rate Limit**   | 100/15min | İstek sınırlaması             |
| **💾 Memory**       | ~80MB     | Ortalama bellek kullanımı     |

### 🛠️ Teknoloji Stack

- **Runtime**: Node.js v18+ / Bun
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Compression**: Gzip
- **Caching**: In-Memory
- **Rate Limiting**: express-rate-limit
- **CORS**: Enabled
- **Documentation**: Swagger/OpenAPI 3.0

### 🔒 Güvenlik Özellikleri

- ✅ **Rate Limiting**: 100 istek/15 dakika
- ✅ **CORS Protection**: Yapılandırılabilir origin kontrolü
- ✅ **Input Validation**: Kapsamlı giriş doğrulama
- ✅ **Error Handling**: Güvenli hata mesajları
- ✅ **Request Logging**: Detaylı istek logları

## 📊 API Endpoint'leri

### 🔧 Temel Endpoint'ler

| Endpoint                       | Method | Açıklama                                   |
| ------------------------------ | ------ | ------------------------------------------ |
| `/`                            | GET    | API bilgisi ve kullanılabilir endpoint'ler |
| `/health`                      | GET    | Sistem durumu ve performans metrikleri     |
| `/api/universities`            | GET    | Tüm üniversiteleri listele                 |
| `/api/universities/:id`        | GET    | ID ile üniversite bilgisi getir            |
| `/api/universities/city/:city` | GET    | Üniversiteleri şehre göre filtrele         |
| `/api/universities/type/:type` | GET    | Üniversiteleri türe göre filtrele          |
| `/api/search/faculty`          | GET    | Fakülte adına göre ara                     |
| `/api/search/program`          | GET    | Program adına göre ara                     |
| `/api/programs/score-range`    | GET    | Puan aralığına göre program arama          |
| `/api/statistics`              | GET    | Enhanced data istatistikleri               |

### 🆕 Gelişmiş Arama Endpoint'leri

| Endpoint               | Method | Açıklama                          |
| ---------------------- | ------ | --------------------------------- |
| `/api/search/advanced` | GET    | Çoklu kriter ile gelişmiş arama   |
| `/api/search/filters`  | GET    | Mevcut filtre seçeneklerini getir |

#### 🔍 Gelişmiş Arama Parametreleri

- `universityTypes`: Üniversite türleri (virgülle ayrılmış)
- `cities`: Şehirler (virgülle ayrılmış)
- `programTypes`: Program türleri (virgülle ayrılmış)
- `scoreTypes`: Puan türleri (virgülle ayrılmış)
- `facultyCategories`: Fakülte kategorileri (virgülle ayrılmış)
- `minScore/maxScore`: Puan aralığı
- `minQuota/maxQuota`: Kontenjan aralığı
- `programName`: Program adı (fuzzy matching)
- `sortBy/sortOrder`: Sıralama seçenekleri

### 📝 Örnek API Kullanımı

```bash
# Sistem durumu kontrolü
curl http://localhost:3000/health

# Tüm üniversiteleri getir
curl http://localhost:3000/api/universities

# İstanbul'daki üniversiteler
curl http://localhost:3000/api/universities/city/istanbul

# Gelişmiş arama - İstanbul'daki Devlet üniversitelerinde Mühendislik programları
curl "http://localhost:3000/api/search/advanced?cities=İstanbul&universityTypes=Devlet&facultyCategories=engineering"
```

## 🏗️ Veri Yapısı

API, veri kaynağı olarak `turkey-universities-enhanced.json` dosyasını kullanır ve YÖK 2024 enhanced data ile zenginleştirilmiştir.

### 📊 Temel Veri Yapıları

```typescript
interface University {
  id: number;
  name: string;
  type: string;
  city: string;
  website: string;
  address: string;
  logo: string;
  faculties: Faculty[];
}

interface Faculty {
  id: number;
  name: string;
  programs: Program[];
}

interface Program {
  name: string;
  yokData2024?: YokData2024; // 🆕 Enhanced data
}
```

### 🆕 YÖK 2024 Enhanced Data

```typescript
interface YokData2024 {
  programCode: string;
  scoreType: string;
  programType: string;
  quota: {
    general: QuotaInfo;
    schoolFirst: QuotaInfo;
    earthquake: QuotaInfo;
    womenOver34: QuotaInfo;
    veteran: QuotaInfo;
  };
}

interface QuotaInfo {
  total: number | null;
  placed: number | null;
  minScore: number | null;
  maxScore: number | null;
}
```

### 🔍 Gelişmiş Arama Veri Yapıları

```typescript
interface AdvancedSearchFilters {
  universityTypes?: string[];
  cities?: string[];
  programTypes?: string[];
  scoreTypes?: string[];
  facultyCategories?: string[];
  scoreRange?: { min?: number; max?: number };
  quotaRange?: { min?: number; max?: number };
  programName?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface FilterOptions {
  cities: string[];
  scoreTypes: string[];
  programTypes: string[];
  universityTypes: string[];
  facultyCategories: {
    id: string;
    name: string;
    count: number;
  }[];
  totalUniversities: number;
  totalCities: number;
}
```

## 📚 API Dokümantasyonu

### 🌐 Swagger UI

API çalışırken **[http://localhost:3000/docs](http://localhost:3000/docs)** adresini ziyaret ederek interaktif API dokümantasyonuna erişebilirsiniz.

### 📁 Dokümantasyon Dosyaları

API dokümantasyonu `docs/` klasöründe bulunmaktadır:

- **📄 api-doc.md**: Detaylı Markdown dokümantasyonu
- **📋 swagger.json**: OpenAPI/Swagger formatında API tanımı
- **🌐 index.html**: Swagger UI HTML sayfası
- **📖 README.md**: Dokümantasyon rehberi

### 🔧 Harici Araçlar

`swagger.json` dosyasını şu araçlarda kullanabilirsiniz:

- **[Swagger Editor](https://editor.swagger.io/)** - Online API editörü
- **[Postman](https://www.postman.com/)** - API test aracı
- **[Insomnia](https://insomnia.rest/)** - REST client

### 📊 Monitoring

```bash
# Health check endpoint
curl http://localhost:3000/health
```

## ⚠️ Bilgilendirme

Bu API, Türkiye'deki üniversiteler hakkında **genel bilgiler** içerir:

- ✅ **Eğitim amaçlı**: Öğrenme ve geliştirme için uygundur
- ⚠️ **Güncellik**: Verilerin güncel olduğu garanti edilmez
- 🔍 **Doğrulama**: Resmi kaynaklardan doğrulama önerilir
- 🚫 **Resmi değil**: Resmi bir API servisi değildir

### 📚 Resmi Kaynaklar

- **[YÖK](https://www.yok.gov.tr/)** - Yükseköğretim Kurulu
- **[YÖK Atlas](https://yokatlas.yok.gov.tr/)** - Üniversite ve program bilgileri
- **[ÖSYM](https://www.osym.gov.tr/)** - Sınav ve yerleştirme bilgileri

---

<div align="center">

**🔙 Backend API • Türkiye Üniversiteleri Projesi**

_Eğitim amaçlı geliştirilmiştir • Made with ❤️ in Turkey_

</div>
