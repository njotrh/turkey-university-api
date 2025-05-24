# Türkiye Üniversiteleri API Backend (v2.0.0)

Türkiye’deki üniversiteler hakkında fakülteleri ve programları da dahil olmak üzere kapsamlı bilgi sağlayan RESTful API servisi. YÖK 2024 verilerini entegre eden gelişmiş arama sistemi ile güncellenmiştir.

## 🆕 Yeni Özellikler (v2.0.0)

- **🔍 Gelişmiş Çoklu Kriter Arama**: Üniversite türü, şehir, program türü, puan türü ve fakülte kategorilerine göre filtreleme
- **📊 YÖK 2024 Veri Entegrasyonu**: Güncel puan aralıkları ve kontenjan bilgileri
- **🎯 Akıllı Filtreleme**: Sayısal aralık filtreleri ve fuzzy text matching
- **🏷️ Fakülte Kategorileri**: 7 ana fakülte kategorisi ile gelişmiş filtreleme
- **⚡ Performans İyileştirmeleri**: In-memory caching, rate limiting, gzip compression

## Başlangıç

API'yi çalıştırmak için:

```bash
# Bun ile çalıştırma (önerilen)
bun index.ts

# veya Node.js ile çalıştırma
node index.ts
```

API varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## Özellikler

### Temel Özellikler:

- Türkiye’deki tüm üniversiteleri listele
- Üniversiteleri şehre göre filtrele
- Üniversiteleri türe göre filtrele (Devlet/Vakıf)
- Belirli bir üniversite hakkında ayrıntılı bilgi al
- Tüm üniversitelerde fakülte ara
- Tüm üniversitelerde program ara
- Puan aralığına göre program arama
- Enhanced data istatistikleri

### 🆕 Gelişmiş Arama Özellikleri:

- **Çoklu Kriter Filtreleme**: Birden fazla filtreyi aynı anda uygulama
- **Üniversite Türü Filtresi**: Devlet/Vakıf üniversiteleri
- **Şehir Filtresi**: 81 şehir arasından çoklu seçim
- **Program Türü Filtresi**: Lisans/Önlisans programları
- **Puan Türü Filtresi**: SAY, EA, SÖZ, DİL, TYT puan türleri
- **Fakülte Kategorileri**: Mühendislik, Tıp, Sosyal Bilimler, Fen Bilimleri, Eğitim, Hukuk, İşletme
- **Sayısal Filtreler**: Puan aralığı (min/max) ve kontenjan aralığı (min/max)
- **Akıllı Metin Arama**: Program adlarında fuzzy matching
- **Sıralama Seçenekleri**: Ad, şehir, program sayısı, fakülte sayısına göre sıralama

## API Uç Noktaları

### Temel Endpoint'ler

| Uç Nokta                       | Metot | Açıklama                                           |
| ------------------------------ | ----- | -------------------------------------------------- |
| `/`                            | GET   | API bilgisi ve kullanılabilir uç noktalar          |
| `/health`                      | GET   | Sistem durumu ve performans metrikleri             |
| `/api/universities`            | GET   | Tüm üniversiteleri listele                         |
| `/api/universities/:id`        | GET   | ID ile üniversite bilgisi getir                    |
| `/api/universities/city/:city` | GET   | Üniversiteleri şehre göre filtrele                 |
| `/api/universities/type/:type` | GET   | Üniversiteleri türe göre filtrele (Devlet/Vakıf)   |
| `/api/search/faculty`          | GET   | Fakülteyi ada göre ara (sorgu parametresi: `name`) |
| `/api/search/program`          | GET   | Programı ada göre ara (sorgu parametresi: `name`)  |
| `/api/programs/score-range`    | GET   | Puan aralığına göre program arama                  |
| `/api/statistics`              | GET   | Enhanced data istatistikleri                       |

### 🆕 Gelişmiş Arama Endpoint'leri

| Uç Nokta               | Metot | Açıklama                          |
| ---------------------- | ----- | --------------------------------- |
| `/api/search/advanced` | GET   | Çoklu kriter ile gelişmiş arama   |
| `/api/search/filters`  | GET   | Mevcut filtre seçeneklerini getir |

#### Gelişmiş Arama Parametreleri (`/api/search/advanced`)

- `universityTypes`: Üniversite türleri (virgülle ayrılmış)
- `cities`: Şehirler (virgülle ayrılmış)
- `programTypes`: Program türleri (virgülle ayrılmış)
- `scoreTypes`: Puan türleri (virgülle ayrılmış)
- `facultyCategories`: Fakülte kategorileri (virgülle ayrılmış)
- `minScore/maxScore`: Puan aralığı
- `minQuota/maxQuota`: Kontenjan aralığı
- `programName`: Program adı (fuzzy matching)
- `sortBy/sortOrder`: Sıralama seçenekleri

## Veri Yapısı

API, veri kaynağı olarak `turkey-universities-enhanced.json` adlı bir JSON dosyası kullanır ve YÖK 2024 enhanced data ile zenginleştirilmiştir:

### Temel Veri Yapıları

```typescript
interface Program {
  name: string;
  yokData2024?: YokData2024; // 🆕 Enhanced data
}

interface Faculty {
  id: number;
  name: string;
  programs: Program[];
}

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

### Gelişmiş Arama Veri Yapıları

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

## API Dokümantasyonu

API'nin detaylı dokümantasyonuna aşağıdaki yollarla erişebilirsiniz:

### Swagger UI

API çalışırken `http://localhost:3000/docs` adresini ziyaret ederek interaktif API dokümantasyonuna erişebilirsiniz. Swagger UI, API'nin tüm endpoint'lerini, parametrelerini ve dönüş değerlerini görsel bir arayüzle sunar ve API'yi doğrudan test etmenize olanak tanır.

### Dokümantasyon Dosyaları

API dokümantasyonu, `docs` klasöründe aşağıdaki formatlarda bulunmaktadır:

- **api-doc.md**: API'nin Markdown formatında detaylı dokümantasyonu
- **swagger.json**: API'nin OpenAPI/Swagger formatında tanımı
- **index.html**: Swagger UI için HTML sayfası
- **README.md**: Dokümantasyon hakkında bilgi

### Swagger JSON Kullanımı

`swagger.json` dosyasını aşağıdaki araçlarda kullanabilirsiniz:

- [Swagger Editor](https://editor.swagger.io/)
- [Postman](https://www.postman.com/) (Import > Raw Text)
- [Insomnia](https://insomnia.rest/) (Import/Export > Import Data > From File)

## Bilgilendirme

Bu API, Türkiye’deki üniversiteler hakkında genel bilgiler içerir. Ancak, bu bilgilerin güncel olup olmadığını garanti etmiyoruz. Verilerinizi doğrulamak ve güncel tutmak için lütfen ilgili üniversiteye veya resmi web sitesine başvurun. Ayrıca kesinlikle resmi bir API servisi değildir; sadece bilgilendirme ve eğitim amaçlıdır.
