# 📚 Türkiye Üniversiteleri API Dokümantasyonu (v2.0.0)

[![API Version](https://img.shields.io/badge/API-v2.0.0-brightgreen.svg)](#)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green.svg)](https://swagger.io/specification/)
[![Documentation](https://img.shields.io/badge/docs-Swagger%20UI-orange.svg)](http://localhost:3000/docs)

> **Türkiye Üniversiteleri API'sinin kapsamlı dokümantasyon merkezi**

Bu klasör, Türkiye Üniversiteleri API'sinin tüm dokümantasyonunu içerir. API, YÖK 2025 verilerini entegre eden gelişmiş arama sistemi ile güncellenmiştir.

## 📋 İçindekiler

- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
- [✨ Yeni Özellikler](#-yeni-özellikler)
- [📁 Dokümantasyon Dosyaları](#-dokümantasyon-dosyaları)
- [🌐 Swagger UI](#-swagger-ui)
- [🔧 API Test Araçları](#-api-test-araçları)
- [📝 Kullanım Örnekleri](#-kullanım-örnekleri)
- [🔗 Harici Araçlar](#-harici-araçlar)

## 🚀 Hızlı Başlangıç

### 📖 Dokümantasyona Erişim

| Yöntem            | URL                                                      | Açıklama                        |
| ----------------- | -------------------------------------------------------- | ------------------------------- |
| **🌐 Swagger UI** | [http://localhost:3000/docs](http://localhost:3000/docs) | İnteraktif API dokümantasyonu   |
| **📄 Markdown**   | [api-doc.md](./api-doc.md)                               | Detaylı Markdown dokümantasyonu |
| **📋 OpenAPI**    | [swagger.json](./swagger.json)                           | OpenAPI 3.0 spesifikasyonu      |

### ⚡ API'yi Test Etme

```bash
# API durumu kontrolü
curl http://localhost:3000/health

# Temel endpoint testi
curl http://localhost:3000/api/universities

# Gelişmiş arama testi
curl "http://localhost:3000/api/search/advanced?cities=İstanbul&universityTypes=Devlet"
```

## ✨ Yeni Özellikler (v2.0.0)

### 🔍 Gelişmiş Arama Sistemi

- **🎯 Çoklu Kriter Filtreleme**: Üniversite türü, şehir, program türü, puan türü ve fakülte kategorilerine göre filtreleme
- **📊 YÖK 2025 Veri Entegrasyonu**: Güncel puan aralıkları ve kontenjan bilgileri
- **🔢 Sayısal Filtreler**: Puan aralığı (min/max) ve kontenjan aralığı (min/max) filtreleme
- **📝 Akıllı Metin Arama**: Program adlarında fuzzy matching ile gelişmiş arama
- **🏷️ Fakülte Kategorileri**: 7 ana fakülte kategorisi ile gelişmiş filtreleme

### 🚀 Performans İyileştirmeleri

- **⚡ In-Memory Caching**: %90 hızlanma tekrarlanan isteklerde
- **🗜️ Gzip Compression**: %70 veri boyutu azalması
- **🛡️ Rate Limiting**: API güvenliği için istek sınırlaması
- **📊 Request Logging**: Detaylı performans ve kullanım logları

## 📁 Dokümantasyon Dosyaları

### 📄 Ana Dokümantasyon

| Dosya                              | Format   | Açıklama                   | Boyut |
| ---------------------------------- | -------- | -------------------------- | ----- |
| **[api-doc.md](./api-doc.md)**     | Markdown | Detaylı API dokümantasyonu | ~50KB |
| **[swagger.json](./swagger.json)** | JSON     | OpenAPI 3.0 spesifikasyonu | ~25KB |
| **[index.html](./index.html)**     | HTML     | Swagger UI sayfası         | ~5KB  |
| **README.md**                      | Markdown | Bu dokümantasyon rehberi   | ~10KB |

### 📊 İçerik Özeti

```
📚 Toplam Dokümantasyon:
├── 15+ API Endpoint'i
├── 50+ Parametre Açıklaması
├── 30+ Örnek İstek/Yanıt
├── 10+ Veri Modeli
└── 20+ Kullanım Örneği
```

## 🌐 Swagger UI

### 🚀 Yerel Swagger UI

API çalışırken **[http://localhost:3000/docs](http://localhost:3000/docs)** adresini ziyaret ederek interaktif API dokümantasyonuna erişebilirsiniz.

### 🌟 Swagger UI Özellikleri

- **🔍 İnteraktif Test**: Endpoint'leri doğrudan test etme
- **📋 Parametre Editörü**: Kolay parametre girişi
- **📊 Yanıt Görüntüleme**: Gerçek zamanlı API yanıtları
- **📝 Kod Örnekleri**: Çoklu dil desteği (curl, JavaScript, Python)
- **🔒 Yetkilendirme**: API key ve token desteği

### 🔧 Alternatif Swagger Görüntüleme

#### Online Swagger Editor

1. **[Swagger Editor](https://editor.swagger.io/)** sayfasını açın
2. `swagger.json` dosyasının içeriğini editöre yapıştırın
3. İnteraktif dokümantasyonu görüntüleyin

#### Docker ile Yerel Swagger UI

```bash
# Swagger UI Docker container'ı çalıştırma
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/swagger.json \
  -v $(pwd)/swagger.json:/swagger.json \
  swaggerapi/swagger-ui

# Tarayıcıda açın: http://localhost:8080
```

## 🔧 API Test Araçları

### 📮 Postman Entegrasyonu

#### Otomatik Import

1. **Postman**'i açın
2. **"Import"** düğmesine tıklayın
3. **"Raw text"** sekmesini seçin
4. `swagger.json` dosyasının içeriğini yapıştırın
5. **"Import"** düğmesine tıklayın

#### Manuel Collection Oluşturma

```bash
# Postman Collection export
curl -X GET http://localhost:3000/docs/postman-collection.json
```

### 🔧 Insomnia Entegrasyonu

1. **Insomnia**'yı açın
2. **"Import/Export"** > **"Import Data"** > **"From File"**
3. `swagger.json` dosyasını seçin
4. API koleksiyonu otomatik oluşturulur

### ⚡ Thunder Client (VS Code)

1. VS Code'da **Thunder Client** eklentisini kurun
2. **"Import"** > **"OpenAPI"** seçin
3. `swagger.json` dosyasını import edin

## 📝 Kullanım Örnekleri

### 🔧 cURL Örnekleri

#### 💚 Sistem Durumu Kontrolü

```bash
# Health check
curl -X GET http://localhost:3000/health \
  -H "Accept: application/json"
```

#### 🏫 Temel Üniversite İşlemleri

```bash
# Tüm üniversiteleri listele
curl -X GET http://localhost:3000/api/universities

# ID'ye göre üniversite getir
curl -X GET http://localhost:3000/api/universities/1

# Şehre göre filtrele
curl -X GET http://localhost:3000/api/universities/city/istanbul

# Türe göre filtrele
curl -X GET http://localhost:3000/api/universities/type/devlet
```

#### 🔍 Arama İşlemleri

```bash
# Fakülte ara
curl -X GET "http://localhost:3000/api/search/faculty?name=mühendislik"

# Program ara
curl -X GET "http://localhost:3000/api/search/program?name=bilgisayar"

# Puan aralığı ile program ara
curl -X GET "http://localhost:3000/api/programs/score-range?minScore=400&maxScore=500&scoreType=SAY"
```

#### 🆕 Gelişmiş Arama Örnekleri

```bash
# Filtre seçeneklerini getir
curl -X GET "http://localhost:3000/api/search/filters"

# İstanbul'daki Devlet üniversitelerinde Mühendislik programları
curl -X GET "http://localhost:3000/api/search/advanced?cities=İstanbul&universityTypes=Devlet&facultyCategories=engineering&minScore=400&sortBy=name&sortOrder=asc"

# Program adına göre gelişmiş arama
curl -X GET "http://localhost:3000/api/search/advanced?programName=bilgisayar mühendisliği"

# Puan ve kontenjan filtreleme
curl -X GET "http://localhost:3000/api/search/advanced?minScore=450&maxScore=550&minQuota=20&maxQuota=100"
```

### 📊 İstatistik ve Monitoring

```bash
# Enhanced data istatistikleri
curl -X GET http://localhost:3000/api/statistics

# API bilgisi
curl -X GET http://localhost:3000/
```

### 🌐 JavaScript/TypeScript Örnekleri

#### 💚 Sistem Durumu ve Temel İşlemler

```javascript
// Modern async/await syntax
async function checkApiHealth() {
  try {
    const response = await fetch("http://localhost:3000/health");
    const data = await response.json();
    console.log("API Status:", data.status);
    console.log("Uptime:", data.uptime);
  } catch (error) {
    console.error("API Error:", error);
  }
}

// Tüm üniversiteleri getir
async function getAllUniversities() {
  const response = await fetch("http://localhost:3000/api/universities");
  const universities = await response.json();
  console.log(`${universities.length} üniversite bulundu`);
  return universities;
}
```

#### 🔍 Gelişmiş Arama İşlemleri

```javascript
// Filtre seçeneklerini getir
async function getFilterOptions() {
  const response = await fetch("http://localhost:3000/api/search/filters");
  const filters = await response.json();

  console.log("Mevcut şehirler:", filters.cities);
  console.log("Puan türleri:", filters.scoreTypes);
  console.log("Fakülte kategorileri:", filters.facultyCategories);

  return filters;
}

// Gelişmiş çoklu kriter arama
async function advancedSearch(filters) {
  const params = new URLSearchParams({
    cities: filters.cities?.join(",") || "",
    universityTypes: filters.universityTypes?.join(",") || "",
    scoreTypes: filters.scoreTypes?.join(",") || "",
    facultyCategories: filters.facultyCategories?.join(",") || "",
    minScore: filters.minScore || "",
    maxScore: filters.maxScore || "",
    sortBy: filters.sortBy || "name",
    sortOrder: filters.sortOrder || "asc",
  });

  const response = await fetch(
    `http://localhost:3000/api/search/advanced?${params}`
  );
  const results = await response.json();

  console.log(`${results.count} sonuç bulundu`);
  console.log("Uygulanan filtreler:", results.filters);

  return results;
}

// Kullanım örneği
const searchFilters = {
  cities: ["İstanbul", "Ankara"],
  universityTypes: ["Devlet"],
  scoreTypes: ["SAY"],
  facultyCategories: ["engineering"],
  minScore: 400,
  sortBy: "name",
};

advancedSearch(searchFilters);
```

#### 📊 TypeScript ile Tip Güvenli Kullanım

```typescript
interface University {
  id: number;
  name: string;
  type: string;
  city: string;
  website: string;
  faculties: Faculty[];
}

interface SearchResult {
  count: number;
  filters: any;
  sorting: any;
  results: University[];
}

async function typedAdvancedSearch(filters: any): Promise<SearchResult> {
  const response = await fetch(
    `http://localhost:3000/api/search/advanced?${params}`
  );
  return response.json() as Promise<SearchResult>;
}
```

## 🔗 Harici Araçlar

### 📋 OpenAPI/Swagger Uyumlu Araçlar

| Araç               | Platform    | Açıklama                  | Link                                                                                            |
| ------------------ | ----------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| **Swagger Editor** | Web         | Online API editörü        | [editor.swagger.io](https://editor.swagger.io/)                                                 |
| **Postman**        | Desktop/Web | API test ve dokümantasyon | [postman.com](https://www.postman.com/)                                                         |
| **Insomnia**       | Desktop     | REST client               | [insomnia.rest](https://insomnia.rest/)                                                         |
| **Thunder Client** | VS Code     | VS Code eklentisi         | [marketplace](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) |
| **Swagger UI**     | Docker      | Self-hosted UI            | [hub.docker.com](https://hub.docker.com/r/swaggerapi/swagger-ui/)                               |

## 📚 Ek Kaynaklar

### 📖 Dokümantasyon Linkleri

- **[Ana README](../../../README.md)** - Proje genel bilgileri
- **[Backend README](../README.md)** - Backend spesifik dokümantasyon
- **[Frontend README](../../frontend/README.md)** - Frontend dokümantasyonu
- **[API Detay Dokümantasyonu](./api-doc.md)** - Kapsamlı API rehberi

### 🌐 Resmi Kaynaklar

- **[YÖK](https://www.yok.gov.tr/)** - Yükseköğretim Kurulu
- **[YÖK Atlas](https://yokatlas.yok.gov.tr/)** - Üniversite ve program bilgileri
- **[ÖSYM](https://www.osym.gov.tr/)** - Sınav ve yerleştirme bilgileri

### 🔧 Geliştirici Araçları

- **[OpenAPI Specification](https://swagger.io/specification/)** - OpenAPI 3.0 spesifikasyonu
- **[JSON Schema](https://json-schema.org/)** - JSON şema validasyonu
- **[Swagger Tools](https://swagger.io/tools/)** - Swagger araç seti

---

<div align="center">

**📚 API Dokümantasyonu • Türkiye Üniversiteleri Projesi**

_Kapsamlı ve güncel API dokümantasyonu • Made with ❤️ in Turkey_

</div>
