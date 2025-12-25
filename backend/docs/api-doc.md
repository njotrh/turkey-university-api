# 📚 Türkiye Üniversiteleri API Dokümantasyonu

[![API Version](https://img.shields.io/badge/API-v2.0.0-brightgreen.svg)](#)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green.svg)](https://swagger.io/specification/)

> **Türkiye Üniversiteleri API'sinin kapsamlı teknik dokümantasyonu**

Bu dokümantasyon, Türkiye Üniversiteleri API'sinin tüm endpoint'lerini, parametrelerini, dönüş değerlerini ve örnek kullanımlarını içerir.

## 📋 İçindekiler

- [🌐 Genel Bakış](#-genel-bakış)
- [✨ Yeni Özellikler (v2.0.0)](#-yeni-özellikler-v200)
- [🔧 HTTP Headers](#-http-headers)
- [🌍 Temel URL](#-temel-url)
- [📊 Endpoint'ler](#-endpointler)
  - [💚 Health Check](#-health-check)
  - [ℹ️ API Bilgisi](#ℹ️-api-bilgisi)
  - [🏫 Üniversite İşlemleri](#-üniversite-işlemleri)
  - [🔍 Arama İşlemleri](#-arama-işlemleri)
  - [🆕 Gelişmiş Arama](#-gelişmiş-arama)
- [🏗️ Veri Modelleri](#️-veri-modelleri)
- [🏷️ Fakülte Kategorileri](#️-fakülte-kategorileri)
- [⚠️ Hata Kodları](#️-hata-kodları)
- [📝 Kullanım Örnekleri](#-kullanım-örnekleri)

## 🌐 Genel Bakış

Türkiye Üniversiteleri API, Türkiye'deki üniversiteler hakkında kapsamlı bilgi sağlayan **RESTful API servisi**dir. Bu API ile:

- ✅ Üniversiteleri listeleyebilir ve filtreleyebilirsiniz
- 🔍 Gelişmiş arama ve filtreleme yapabilirsiniz
- 📊 YÖK 2025 verilerine erişebilirsiniz
- ⚖️ Üniversite ve program karşılaştırması yapabilirsiniz

## ✨ Yeni Özellikler (v2.0.0)

### 🔍 Kapsamlı Gelişmiş Arama Sistemi

- **🎯 Çoklu Kriter Filtreleme**: Üniversite türü, şehir, program türü, puan türü ve fakülte kategorilerine göre filtreleme
- **📊 YÖK 2025 Veri Entegrasyonu**: Güncel YÖK verilerine dayalı puan aralıkları ve kontenjan bilgileri
- **🔢 Sayısal Filtreler**: Puan aralığı (min/max) ve kontenjan aralığı (min/max) filtreleme
- **📝 Akıllı Metin Arama**: Program adlarında fuzzy matching ile gelişmiş arama
- **🏷️ Fakülte Kategorileri**: Mühendislik, Tıp, Sosyal Bilimler, Fen Bilimleri, Eğitim, Hukuk, İşletme kategorileri
- **🔍 Gelişmiş API Endpoint'leri**: `/api/search/advanced` ve `/api/search/filters`

### Backend İyileştirmeleri:

- **🚀 In-Memory Caching**: Hızlı yanıt süreleri için otomatik önbellekleme
- **⚡ Rate Limiting**: API kötüye kullanımını önlemek için istek sınırlaması (100 istek/15 dakika)
- **🗜️ Gzip Compression**: Daha hızlı veri transferi için sıkıştırma
- **✅ Input Validation**: Gelişmiş giriş doğrulama ve hata mesajları
- **📊 Request Logging**: Detaylı istek ve performans logları
- **💚 Health Check**: Sistem durumu izleme endpoint'i
- **🛡️ Error Handling**: Kapsamlı hata yönetimi ve kullanıcı dostu mesajlar

## 🔧 HTTP Headers

API, aşağıdaki özel header'ları döndürür:

| Header                  | Açıklama                                      | Örnek Değer    |
| ----------------------- | --------------------------------------------- | -------------- |
| `X-Cache`               | Cache durumu                                  | `HIT` / `MISS` |
| `X-RateLimit-Limit`     | İzin verilen maksimum istek sayısı            | `100`          |
| `X-RateLimit-Remaining` | Kalan istek sayısı                            | `95`           |
| `X-RateLimit-Reset`     | Rate limit sıfırlanma zamanı (Unix timestamp) | `1640995200`   |

## 🌍 Temel URL

```
http://localhost:3000
```

## 📊 Endpoint'ler

### 💚 Health Check

Sistem durumunu ve performans metriklerini döndürür.

- **URL:** `/health`
- **Metot:** `GET`
- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:**
    ```json
    {
      "status": "healthy",
      "timestamp": "2025-01-15T10:30:00.000Z",
      "uptime": 3600.5,
      "cache": {
        "size": 25
      },
      "memory": {
        "used": 45,
        "total": 128
      }
    }
    ```

### ℹ️ API Bilgisi

API hakkında genel bilgi ve kullanılabilir endpoint'leri döndürür.

- **URL:** `/`
- **Metot:** `GET`
- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:**
    ```json
    {
      "message": "Türkiye Üniversiteleri API",
      "endpoints": {
        "/api/universities": "Tüm üniversiteleri listeler",
        "/api/universities/:id": "ID'ye göre üniversite getirir",
        "/api/universities/city/:city": "Şehre göre üniversiteleri filtreler",
        "/api/universities/type/:type": "Türe göre üniversiteleri filtreler (Devlet/Vakıf)",
        "/api/search/faculty": "Fakülte adına göre arama yapar (query: name)",
        "/api/search/program": "Program adına göre arama yapar (query: name)",
        "/api/programs/score-range": "Puan aralığına göre program arama (query: minScore, maxScore, scoreType)",
        "/api/search/advanced": "Gelişmiş çoklu kriter arama (query: multiple filters)",
        "/api/search/filters": "Arama filtreleri için mevcut seçenekleri getirir",
        "/api/statistics": "Enhanced data istatistikleri"
      }
    }
    ```

## 🏫 Üniversite İşlemleri

### Tüm Üniversiteleri Listele

Türkiye'deki tüm üniversitelerin listesini döndürür.

- **URL:** `/api/universities`
- **Metot:** `GET`
- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:** Üniversite nesnelerinden oluşan bir dizi
    ```json
    [
      {
        "id": 117,
        "name": "İSTANBUL TEKNİK ÜNİVERSİTESİ",
        "type": "Devlet",
        "city": "İSTANBUL",
        "website": "https://www.itu.edu.tr",
        "address": "İTÜ Ayazağa Yerleşkesi yeni Rektörlük Binası Kat:2 MASLAK-SARIYER-İSTANBUL",
        "logo": "https://yokatlas.yok.gov.tr/assets/img/logo/115069.png",
        "faculties": [
          {
            "id": 1,
            "name": "Mühendislik Fakültesi",
            "programs": [
              {
                "name": "Bilgisayar Mühendisliği"
              },
              {
                "name": "Elektrik Mühendisliği"
              }
            ]
          }
        ]
      }
      // ... diğer üniversiteler
    ]
    ```

### 3. Üniversite Detayı

Belirtilen ID'ye sahip üniversitenin detaylı bilgilerini döndürür.

- **URL:** `/api/universities/:id`
- **Metot:** `GET`
- **URL Parametreleri:**
  - `id` - Üniversite ID'si (zorunlu)
- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:** Üniversite nesnesi
    ```json
    {
      "id": 117,
      "name": "İSTANBUL TEKNİK ÜNİVERSİTESİ",
      "type": "Devlet",
      "city": "İSTANBUL",
      "website": "https://www.itu.edu.tr",
      "address": "İTÜ Ayazağa Yerleşkesi yeni Rektörlük Binası Kat:2 MASLAK-SARIYER-İSTANBUL",
      "logo": "https://yokatlas.yok.gov.tr/assets/img/logo/115069.png",
      "faculties": [
        {
          "id": 1,
          "name": "Mühendislik Fakültesi",
          "programs": [
            {
              "name": "Bilgisayar Mühendisliği"
            },
            {
              "name": "Elektrik Mühendisliği"
            }
          ]
        }
      ]
    }
    ```
- **Hata Yanıtı:**
  - **Kod:** 404
  - **İçerik:**
    ```json
    {
      "error": "Üniversite bulunamadı"
    }
    ```

### 4. Şehre Göre Üniversiteleri Filtrele

Belirtilen şehirdeki üniversitelerin listesini döndürür.

- **URL:** `/api/universities/city/:city`
- **Metot:** `GET`
- **URL Parametreleri:**
  - `city` - Şehir adı (zorunlu)
- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:** Üniversite nesnelerinden oluşan bir dizi
    ```json
    [
      {
        "id": 117,
        "name": "İSTANBUL TEKNİK ÜNİVERSİTESİ",
        "type": "Devlet",
        "city": "İSTANBUL",
        "website": "https://www.itu.edu.tr",
        "address": "İTÜ Ayazağa Yerleşkesi yeni Rektörlük Binası Kat:2 MASLAK-SARIYER-İSTANBUL",
        "logo": "https://yokatlas.yok.gov.tr/assets/img/logo/115069.png",
        "faculties": [
          // ... fakülteler
        ]
      }
      // ... diğer üniversiteler
    ]
    ```
- **Hata Yanıtı:**
  - **Kod:** 404
  - **İçerik:**
    ```json
    {
      "error": "Bu şehirde üniversite bulunamadı"
    }
    ```

### 5. Türe Göre Üniversiteleri Filtrele

Belirtilen türdeki (Devlet/Vakıf) üniversitelerin listesini döndürür.

- **URL:** `/api/universities/type/:type`
- **Metot:** `GET`
- **URL Parametreleri:**
  - `type` - Üniversite türü (zorunlu, "devlet" veya "vakıf")
- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:** Üniversite nesnelerinden oluşan bir dizi
    ```json
    [
      {
        "id": 117,
        "name": "İSTANBUL TEKNİK ÜNİVERSİTESİ",
        "type": "Devlet",
        "city": "İSTANBUL",
        "website": "https://www.itu.edu.tr",
        "address": "İTÜ Ayazağa Yerleşkesi yeni Rektörlük Binası Kat:2 MASLAK-SARIYER-İSTANBUL",
        "logo": "https://yokatlas.yok.gov.tr/assets/img/logo/115069.png",
        "faculties": [
          // ... fakülteler
        ]
      }
      // ... diğer üniversiteler
    ]
    ```
- **Hata Yanıtı:**
  - **Kod:** 404
  - **İçerik:**
    ```json
    {
      "error": "Bu türde üniversite bulunamadı"
    }
    ```

### 6. Fakülte Ara

Belirtilen ada göre fakülteleri arar.

- **URL:** `/api/search/faculty`
- **Metot:** `GET`
- **Sorgu Parametreleri:**
  - `name` - Aranacak fakülte adı (zorunlu)
- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:** Arama sonuçlarından oluşan bir dizi
    ```json
    [
      {
        "id": 1,
        "name": "İstanbul Teknik Üniversitesi",
        "city": "İSTANBUL",
        "type": "Devlet",
        "faculties": [
          {
            "id": 1,
            "name": "Mühendislik Fakültesi",
            "programs": [
              // ... programlar
            ]
          }
        ]
      }
      // ... diğer sonuçlar
    ]
    ```
- **Hata Yanıtları:**
  - **Kod:** 400
  - **İçerik:**
    ```json
    {
      "error": "Fakülte adı belirtilmedi"
    }
    ```
  - **Kod:** 404
  - **İçerik:**
    ```json
    {
      "error": "Eşleşen fakülte bulunamadı"
    }
    ```

### 7. Program Ara

Belirtilen ada göre programları arar.

- **URL:** `/api/search/program`
- **Metot:** `GET`
- **Sorgu Parametreleri:**
  - `name` - Aranacak program adı (zorunlu)
- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:** Arama sonuçlarından oluşan bir dizi
    ```json
    [
      {
        "id": 1,
        "name": "İstanbul Teknik Üniversitesi",
        "city": "İSTANBUL",
        "type": "Devlet",
        "faculties": [
          {
            "id": 1,
            "name": "Mühendislik Fakültesi",
            "programs": [
              {
                "name": "Bilgisayar Mühendisliği"
              }
            ]
          }
        ]
      }
      // ... diğer sonuçlar
    ]
    ```
- **Hata Yanıtları:**
  - **Kod:** 400
  - **İçerik:**
    ```json
    {
      "error": "Program adı belirtilmedi"
    }
    ```
  - **Kod:** 404
  - **İçerik:**
    ```json
    {
      "error": "Eşleşen program bulunamadı"
    }
    ```

## Veri Modelleri

### Üniversite

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
```

### Fakülte

```typescript
interface Faculty {
  id: number;
  name: string;
  programs: Program[];
}
```

### Program

```typescript
interface Program {
  name: string;
}
```

### Fakülte Arama Sonucu

```typescript
interface SearchFacultyResult {
  id: number;
  name: string;
  city: string;
  type: string;
  faculties: Faculty[];
}
```

### Program Arama Sonucu

```typescript
interface SearchProgramResult {
  id: number;
  name: string;
  city: string;
  type: string;
  faculties: {
    id: number;
    name: string;
    programs: Program[];
  }[];
}
```

## 🆕 Gelişmiş Arama Endpoint'leri

### 8. Filtre Seçeneklerini Getir

Gelişmiş arama için mevcut filtre seçeneklerini döndürür.

- **URL:** `/api/search/filters`
- **Metot:** `GET`
- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:**
    ```json
    {
      "cities": ["Adana", "Adıyaman", "Afyonkarahisar", "..."],
      "scoreTypes": ["SAY", "EA", "SÖZ", "DİL", "TYT"],
      "programTypes": ["lisans", "önlisans"],
      "universityTypes": ["Devlet", "Vakıf"],
      "facultyCategories": [
        {
          "id": "engineering",
          "name": "Mühendislik",
          "count": 45
        },
        {
          "id": "medicine",
          "name": "Tıp ve Sağlık",
          "count": 32
        },
        {
          "id": "social",
          "name": "Sosyal Bilimler",
          "count": 28
        }
      ],
      "totalUniversities": 205,
      "totalCities": 81
    }
    ```

### 9. Gelişmiş Çoklu Kriter Arama

Çoklu kriter kullanarak gelişmiş arama yapar.

- **URL:** `/api/search/advanced`
- **Metot:** `GET`
- **Sorgu Parametreleri:**

  - `universityTypes` - Üniversite türleri (virgülle ayrılmış, opsiyonel)
  - `cities` - Şehirler (virgülle ayrılmış, opsiyonel)
  - `programTypes` - Program türleri (virgülle ayrılmış, opsiyonel)
  - `scoreTypes` - Puan türleri (virgülle ayrılmış, opsiyonel)
  - `facultyCategories` - Fakülte kategorileri (virgülle ayrılmış, opsiyonel)
  - `minScore` - Minimum puan (sayı, opsiyonel)
  - `maxScore` - Maksimum puan (sayı, opsiyonel)
  - `minQuota` - Minimum kontenjan (sayı, opsiyonel)
  - `maxQuota` - Maksimum kontenjan (sayı, opsiyonel)
  - `programName` - Program adı (metin, opsiyonel)
  - `sortBy` - Sıralama kriteri (name, city, programCount, facultyCount, score, opsiyonel)
  - `sortOrder` - Sıralama yönü (asc, desc, opsiyonel)

- **Örnek İstek:**

  ```
  GET /api/search/advanced?cities=İstanbul,Ankara&universityTypes=Devlet&scoreTypes=SAY&facultyCategories=engineering&minScore=400&sortBy=name&sortOrder=asc
  ```

- **Başarı Yanıtı:**
  - **Kod:** 200
  - **İçerik:**
    ```json
    {
      "count": 25,
      "filters": {
        "universityTypes": "Devlet",
        "cities": "İstanbul,Ankara",
        "programTypes": null,
        "scoreTypes": "SAY",
        "facultyCategories": "engineering",
        "scoreRange": { "min": "400", "max": null },
        "quotaRange": { "min": null, "max": null },
        "programName": null
      },
      "sorting": {
        "sortBy": "name",
        "sortOrder": "asc"
      },
      "results": [
        {
          "id": 1,
          "name": "Boğaziçi Üniversitesi",
          "city": "İstanbul",
          "type": "Devlet",
          "faculties": [
            {
              "id": 1,
              "name": "Mühendislik Fakültesi",
              "programs": [
                {
                  "name": "Bilgisayar Mühendisliği",
                  "yokData2025": {
                    "programCode": "123456",
                    "scoreType": "SAY",
                    "programType": "lisans",
                    "quota": {
                      "general": {
                        "total": 50,
                        "placed": 50,
                        "minScore": 485.5,
                        "maxScore": 520.3
                      },
                      "schoolFirst": {
                        "total": 5,
                        "placed": 5,
                        "minScore": 480.2,
                        "maxScore": 515.8
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
    ```

### Gelişmiş Arama Veri Modelleri

#### Gelişmiş Arama Filtreleri

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
```

#### Gelişmiş Arama Sonucu

```typescript
interface AdvancedSearchResult {
  count: number;
  filters: {
    universityTypes: string | null;
    cities: string | null;
    programTypes: string | null;
    scoreTypes: string | null;
    facultyCategories: string | null;
    scoreRange: { min: string | null; max: string | null };
    quotaRange: { min: string | null; max: string | null };
    programName: string | null;
  };
  sorting: {
    sortBy: string | null;
    sortOrder: string;
  };
  results: SearchProgramResult[];
}
```

#### Filtre Seçenekleri

```typescript
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

#### YÖK 2025 Enhanced Data

```typescript
interface YokData2025 {
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

## 🏷️ Fakülte Kategorileri

Gelişmiş aramada kullanılan fakülte kategorileri:

| Kategori ID   | Kategori Adı       | Açıklama                             | Örnek Fakülteler               |
| ------------- | ------------------ | ------------------------------------ | ------------------------------ |
| `engineering` | Mühendislik        | Mühendislik ve teknik fakülteler     | Bilgisayar, Elektrik, Makine   |
| `medicine`    | Tıp ve Sağlık      | Tıp, diş hekimliği, sağlık bilimleri | Tıp, Diş Hekimliği, Hemşirelik |
| `social`      | Sosyal Bilimler    | Sosyal bilimler, edebiyat, iktisadi  | Edebiyat, Tarih, Sosyoloji     |
| `science`     | Fen Bilimleri      | Fen, matematik, fizik, kimya         | Matematik, Fizik, Kimya        |
| `education`   | Eğitim             | Eğitim fakülteleri ve öğretmenlik    | Eğitim Fakültesi               |
| `law`         | Hukuk              | Hukuk fakülteleri                    | Hukuk Fakültesi                |
| `business`    | İşletme ve Ticaret | İşletme, ticaret, ekonomi            | İşletme, İktisat               |

## ⚠️ Hata Kodları

API, standart HTTP durum kodlarını kullanır:

### 🟢 Başarılı Yanıtlar (2xx)

| Kod   | Açıklama | Kullanım                                   |
| ----- | -------- | ------------------------------------------ |
| `200` | OK       | Başarılı GET istekleri                     |
| `201` | Created  | Başarılı POST istekleri (gelecek sürümler) |

### 🟡 Client Hataları (4xx)

| Kod   | Açıklama          | Örnek Durum        |
| ----- | ----------------- | ------------------ |
| `400` | Bad Request       | Geçersiz parametre |
| `404` | Not Found         | Kaynak bulunamadı  |
| `429` | Too Many Requests | Rate limit aşıldı  |

### 🔴 Server Hataları (5xx)

| Kod   | Açıklama              | Örnek Durum           |
| ----- | --------------------- | --------------------- |
| `500` | Internal Server Error | Sunucu hatası         |
| `503` | Service Unavailable   | Servis kullanılamıyor |

### Hata Yanıt Formatı

```json
{
  "error": "Hata mesajı",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/universities/999"
}
```

## 📝 Kullanım Örnekleri

### 🔧 Rate Limiting Örneği

```javascript
// Rate limit kontrolü ile API çağrısı
async function apiCallWithRateLimit(url) {
  try {
    const response = await fetch(url);

    // Rate limit header'larını kontrol et
    const limit = response.headers.get("X-RateLimit-Limit");
    const remaining = response.headers.get("X-RateLimit-Remaining");
    const reset = response.headers.get("X-RateLimit-Reset");

    console.log(
      `Rate Limit: ${remaining}/${limit}, Reset: ${new Date(reset * 1000)}`
    );

    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
```

### 🔍 Gelişmiş Arama Örneği

```javascript
// Kapsamlı gelişmiş arama örneği
async function comprehensiveSearch() {
  // 1. Önce filtre seçeneklerini al
  const filters = await fetch("http://localhost:3000/api/search/filters").then(
    (res) => res.json()
  );

  console.log("Mevcut filtreler:", filters);

  // 2. Gelişmiş arama yap
  const searchParams = new URLSearchParams({
    cities: "İstanbul,Ankara,İzmir",
    universityTypes: "Devlet",
    scoreTypes: "SAY,EA",
    facultyCategories: "engineering,medicine",
    minScore: "400",
    maxScore: "600",
    minQuota: "10",
    sortBy: "name",
    sortOrder: "asc",
  });

  const results = await fetch(
    `http://localhost:3000/api/search/advanced?${searchParams}`
  ).then((res) => res.json());

  console.log(`${results.count} sonuç bulundu`);

  // 3. Sonuçları işle
  results.results.forEach((university) => {
    console.log(`\n🏫 ${university.name} (${university.city})`);

    university.faculties.forEach((faculty) => {
      console.log(`  📚 ${faculty.name}`);

      faculty.programs.forEach((program) => {
        if (program.yokData2025) {
          const quota = program.yokData2025.quota.general;
          console.log(`    🎓 ${program.name}`);
          console.log(`       📊 Puan: ${quota.minScore}-${quota.maxScore}`);
          console.log(`       👥 Kontenjan: ${quota.total}`);
        }
      });
    });
  });
}
```

### 📊 İstatistik Analizi Örneği

```javascript
// API istatistiklerini analiz et
async function analyzeStatistics() {
  const stats = await fetch("http://localhost:3000/api/statistics").then(
    (res) => res.json()
  );

  console.log("📊 API İstatistikleri:");
  console.log(`🏫 Toplam Üniversite: ${stats.totalUniversities}`);
  console.log(`🏙️ Toplam Şehir: ${stats.totalCities}`);
  console.log(`📚 Toplam Fakülte: ${stats.totalFaculties}`);
  console.log(`🎓 Toplam Program: ${stats.totalPrograms}`);

  // Şehir bazında analiz
  const cityStats = stats.universitiesByCity;
  const topCities = Object.entries(cityStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  console.log("\n🏆 En Çok Üniversiteye Sahip Şehirler:");
  topCities.forEach(([city, count], index) => {
    console.log(`${index + 1}. ${city}: ${count} üniversite`);
  });
}
```

---

<div align="center">

**📚 API Dokümantasyonu • Türkiye Üniversiteleri Projesi**

_Kapsamlı ve güncel API referansı • Made with ❤️ in Turkey_

</div>
