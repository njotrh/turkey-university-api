# Türkiye Üniversiteleri API Projesi

Bu proje, Türkiye'deki üniversiteler hakkında kapsamlı bilgi sağlayan bir API ve bu API'yi kullanan bir web uygulaması içerir. Kullanıcılar, üniversiteleri listeleyebilir, filtreleyebilir ve detaylı bilgilerini görüntüleyebilir.

## Proje Hakkında

Türkiye Üniversiteleri API Projesi, iki ana bileşenden oluşur:

1. **Backend**: Express.js kullanılarak geliştirilmiş RESTful API servisi
2. **Frontend**: React, Vite ve Tailwind CSS kullanılarak geliştirilmiş modern web uygulaması

Proje, Türkiye'deki üniversiteler, fakülteler ve programlar hakkında bilgi sağlar. Kullanıcılar, üniversiteleri şehre veya türe (Devlet/Vakıf) göre filtreleyebilir, belirli bir üniversite hakkında detaylı bilgi alabilir ve fakülte veya program adına göre arama yapabilir.

## ✨ Yeni Özellikler (v2.0.0)

### 🔍 Kapsamlı Gelişmiş Arama Sistemi:

- **🎯 Çoklu Kriter Filtreleme**: Üniversite türü, şehir, program türü, puan türü ve fakülte kategorilerine göre filtreleme
- **📊 YÖK 2024 Veri Entegrasyonu**: Güncel YÖK verilerine dayalı puan aralıkları ve kontenjan bilgileri
- **🔢 Sayısal Filtreler**: Puan aralığı (min/max) ve kontenjan aralığı (min/max) filtreleme
- **📝 Akıllı Metin Arama**: Program adlarında fuzzy matching ile gelişmiş arama
- **🏷️ Fakülte Kategorileri**: Mühendislik, Tıp, Sosyal Bilimler, Fen Bilimleri, Eğitim, Hukuk, İşletme kategorileri
- **⚡ Gerçek Zamanlı Sonuçlar**: Filtreler uygulandıkça anlık sonuç güncellemeleri
- **📱 Responsive Tasarım**: Mobil uyumlu katlanabilir filtre paneli

### Backend İyileştirmeleri:

- **🚀 In-Memory Caching**: Hızlı yanıt süreleri için otomatik önbellekleme sistemi
- **⚡ Rate Limiting**: API güvenliği için istek sınırlaması
- **🗜️ Gzip Compression**: %70'e varan veri sıkıştırması ile hızlı transfer
- **✅ Input Validation**: Kapsamlı giriş doğrulama ve hata yönetimi
- **📊 Request Logging**: Detaylı performans ve kullanım logları
- **💚 Health Check**: Sistem durumu izleme endpoint'i (`/health`)
- **🛡️ Enhanced Error Handling**: Kullanıcı dostu hata mesajları
- **🔍 Gelişmiş Arama API'leri**: Yeni `/api/search/advanced` ve `/api/search/filters` endpoint'leri

### Frontend Yenilikleri:

- **🎨 Yeniden Tasarlanan Gelişmiş Arama Sayfası**: Modern React bileşen mimarisi
- **🎛️ Etkileşimli Filtre Paneli**: Katlanabilir, görsel durum göstergeleri ile
- **🏷️ Renkli Filtre Etiketleri**: Her filtre türü için farklı renk kodlaması
- **📊 Program Kartları Entegrasyonu**: YÖK 2024 verilerini gösteren gelişmiş program kartları
- **⚖️ Karşılaştırma Entegrasyonu**: Arama sonuçlarından doğrudan karşılaştırmaya ekleme
- **🔄 Yükleme Durumları**: Spinner animasyonları ve hata yönetimi

### Performans İyileştirmeleri:

- Ortalama yanıt süresi %60 azaldı
- Cache hit oranı ile tekrarlanan isteklerde %90 hızlanma
- Gzip ile veri transferi boyutu %70 azaldı
- Gelişmiş Türkçe karakter desteği (toLocaleLowerCase)
- Optimize edilmiş filtreleme algoritmaları

## Kurulum Gereksinimleri

Projeyi çalıştırmak için aşağıdaki yazılımların yüklü olması gerekmektedir:

- [Node.js](https://nodejs.org/) (v18 veya üzeri)
- [Bun](https://bun.sh/) (önerilen, ancak zorunlu değil)

## Kurulum Adımları

1. Projeyi bilgisayarınıza klonlayın:

   ```bash
   git clone https://github.com/Yimikami/turkey-university-api
   cd turkey-university-api
   ```

2. Otomatik kurulum script'ini çalıştırın:

   ```bash
   node setup.js
   ```

   Bu komut, hem backend hem de frontend için gerekli bağımlılıkları otomatik olarak kuracaktır. Eğer Bun yüklüyse, kurulum Bun ile yapılacaktır. Değilse, npm kullanılacaktır.

3. Manuel kurulum (opsiyonel):

   Otomatik kurulum script'i çalışmazsa, aşağıdaki komutları sırasıyla çalıştırabilirsiniz:

   ```bash
   # Backend bağımlılıklarını kur
   cd backend
   bun install  # veya npm install

   # Frontend bağımlılıklarını kur
   cd ../frontend
   bun install  # veya npm install
   ```

## Projeyi Başlatma

Projeyi başlatmak için aşağıdaki komutu kullanabilirsiniz:

```bash
node start.js
```

Bu komut:

- Backend ve frontend sunucularını aynı anda başlatır
- Frontend uygulamasını varsayılan tarayıcınızda otomatik olarak açar
- Sunucu adresleri:
  - Backend: http://localhost:3000
  - Frontend: http://localhost:5173

Alternatif olarak, her bir bileşeni ayrı ayrı başlatabilirsiniz:

```bash
# Backend'i başlat
cd backend
bun index.ts  # veya node index.js

# Frontend'i başlat
cd frontend
npm run dev
```

## API Kullanımı

Backend API'si aşağıdaki endpoint'leri sunar:

### Temel Endpoint'ler

| Endpoint                       | Metot | Açıklama                                           |
| ------------------------------ | ----- | -------------------------------------------------- |
| `/`                            | GET   | API bilgisi ve kullanılabilir endpoint'ler         |
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

| Endpoint               | Metot | Açıklama                                                 |
| ---------------------- | ----- | -------------------------------------------------------- |
| `/api/search/advanced` | GET   | Çoklu kriter ile gelişmiş arama (aşağıdaki parametreler) |
| `/api/search/filters`  | GET   | Mevcut filtre seçeneklerini getir                        |

#### Gelişmiş Arama Parametreleri (`/api/search/advanced`)

| Parametre           | Tür    | Açıklama                                                          | Örnek                         |
| ------------------- | ------ | ----------------------------------------------------------------- | ----------------------------- |
| `universityTypes`   | string | Üniversite türleri (virgülle ayrılmış)                            | `Devlet,Vakıf`                |
| `cities`            | string | Şehirler (virgülle ayrılmış)                                      | `İstanbul,Ankara,İzmir`       |
| `programTypes`      | string | Program türleri (virgülle ayrılmış)                               | `lisans,önlisans`             |
| `scoreTypes`        | string | Puan türleri (virgülle ayrılmış)                                  | `SAY,EA,SÖZ`                  |
| `facultyCategories` | string | Fakülte kategorileri (virgülle ayrılmış)                          | `engineering,medicine,social` |
| `minScore`          | number | Minimum puan                                                      | `400`                         |
| `maxScore`          | number | Maksimum puan                                                     | `500`                         |
| `minQuota`          | number | Minimum kontenjan                                                 | `10`                          |
| `maxQuota`          | number | Maksimum kontenjan                                                | `100`                         |
| `programName`       | string | Program adı (fuzzy matching)                                      | `bilgisayar mühendisliği`     |
| `sortBy`            | string | Sıralama kriteri (`name`, `city`, `programCount`, `facultyCount`) | `name`                        |
| `sortOrder`         | string | Sıralama yönü (`asc`, `desc`)                                     | `asc`                         |

### API Dokümantasyonu

API'nin detaylı dokümantasyonuna aşağıdaki yollarla erişebilirsiniz:

1. **Swagger UI**: Backend sunucusu çalışırken `http://localhost:3000/docs` adresini ziyaret ederek interaktif API dokümantasyonuna erişebilirsiniz.

2. **Markdown Dokümantasyonu**: `backend/docs/api-doc.md` dosyasında API'nin detaylı açıklaması bulunmaktadır.

3. **Swagger JSON**: `backend/docs/swagger.json` dosyası, API'nin OpenAPI/Swagger formatındaki tanımını içerir. Bu dosyayı [Swagger Editor](https://editor.swagger.io/) gibi araçlarda kullanabilirsiniz.

### Örnek API Kullanımları:

#### Temel Kullanım:

```javascript
// Tüm üniversiteleri getir
fetch("http://localhost:3000/api/universities")
  .then((response) => response.json())
  .then((data) => console.log(data));

// İstanbul'daki üniversiteleri getir
fetch("http://localhost:3000/api/universities/city/istanbul")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

#### 🆕 Gelişmiş Arama Örnekleri:

```javascript
// Filtre seçeneklerini getir
fetch("http://localhost:3000/api/search/filters")
  .then((response) => response.json())
  .then((data) => console.log(data));

// İstanbul ve Ankara'daki Devlet üniversitelerinde SAY puanı ile Mühendislik programları
const params = new URLSearchParams({
  cities: "İstanbul,Ankara",
  universityTypes: "Devlet",
  scoreTypes: "SAY",
  facultyCategories: "engineering",
  minScore: "400",
  sortBy: "name",
  sortOrder: "asc",
});

fetch(`http://localhost:3000/api/search/advanced?${params}`)
  .then((response) => response.json())
  .then((data) => console.log(data));

// Program adına göre arama
fetch(
  "http://localhost:3000/api/search/advanced?programName=bilgisayar mühendisliği"
)
  .then((response) => response.json())
  .then((data) => console.log(data));

// Puan aralığı ve kontenjan filtreleme
fetch(
  "http://localhost:3000/api/search/advanced?minScore=450&maxScore=550&minQuota=20&maxQuota=100"
)
  .then((response) => response.json())
  .then((data) => console.log(data));
```

#### Gelişmiş Arama Yanıt Formatı:

```json
{
  "count": 25,
  "filters": {
    "universityTypes": "Devlet",
    "cities": "İstanbul,Ankara",
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
              "yokData2024": {
                "programCode": "123456",
                "scoreType": "SAY",
                "programType": "lisans",
                "quota": {
                  "general": {
                    "total": 50,
                    "placed": 50,
                    "minScore": 485.5,
                    "maxScore": 520.3
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

## 🎯 Frontend Özellikleri

### Ana Sayfalar:

- **Ana Sayfa**: Üniversite, fakülte ve program arama seçenekleri
- **🆕 Gelişmiş Arama Sayfası**: Çoklu kriter filtreleme ile kapsamlı arama
- **Üniversite Listesi**: Sayfalama ve filtreleme ile üniversite görüntüleme
- **Üniversite Detayları**: Fakülteler, programlar ve YÖK 2024 verileri
- **Arama Sonuçları**: Fakülte ve program arama sonuçları
- **Karşılaştırma Sayfası**: Üniversite ve program karşılaştırması

### 🆕 Gelişmiş Arama Sayfası Özellikleri:

- **Katlanabilir Filtre Paneli**: Görsel durum göstergeleri ile
- **Çoklu Filtre Türleri**:
  - Üniversite türü (Devlet/Vakıf)
  - Şehir seçimi (81 şehir, çoklu seçim)
  - Program türü (Lisans/Önlisans)
  - Puan türü (SAY, EA, SÖZ, DİL, TYT)
  - Fakülte kategorileri (7 ana kategori)
- **Sayısal Filtreler**: Puan ve kontenjan aralığı
- **Akıllı Arama**: Program adı fuzzy matching
- **Gerçek Zamanlı Sonuçlar**: Anlık filtre uygulaması
- **Sıralama Seçenekleri**: Ad, şehir, program/fakülte sayısı
- **Responsive Tasarım**: Mobil uyumlu arayüz

### Bileşen Mimarisi:

- **ProgramCard**: YÖK 2024 verilerini gösteren gelişmiş program kartları
- **ComparisonButton**: Arama sonuçlarından doğrudan karşılaştırmaya ekleme
- **StatisticsCard**: Enhanced data istatistikleri (quota rate kaldırıldı)
- **Modern State Management**: TypeScript ile tip güvenli durum yönetimi

## Katkıda Bulunma

Projeye katkıda bulunmak isterseniz:

1. Bu repo'yu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request açın

## Lisans

Bu proje eğitim amaçlıdır ve açık kaynak olarak sunulmaktadır. Ticari kullanım için lütfen iletişime geçin.

## Bilgilendirme

Bu API, Türkiye'deki üniversiteler hakkında genel bilgiler içerir. Ancak, bu bilgilerin güncel olup olmadığını garanti etmiyoruz. Verilerinizi doğrulamak ve güncel tutmak için lütfen ilgili üniversiteye veya resmi web sitesine başvurun. Ayrıca kesinlikle resmi bir API servisi değildir; sadece bilgilendirme ve eğitim amaçlıdır.
