# Türkiye Üniversiteleri API Dokümantasyonu (v2.0.0)

Bu klasör, Türkiye Üniversiteleri API'sinin dokümantasyonunu içerir. API, YÖK 2024 verilerini entegre eden kapsamlı gelişmiş arama sistemi ile güncellenmiştir.

## 🆕 Yeni Özellikler (v2.0.0)

- **🔍 Gelişmiş Çoklu Kriter Arama**: Üniversite türü, şehir, program türü, puan türü ve fakülte kategorilerine göre filtreleme
- **📊 YÖK 2024 Veri Entegrasyonu**: Güncel puan aralıkları ve kontenjan bilgileri
- **🎯 Akıllı Filtreleme**: Sayısal aralık filtreleri ve fuzzy text matching
- **🏷️ Fakülte Kategorileri**: 7 ana fakülte kategorisi ile gelişmiş filtreleme

## Dokümantasyon Dosyaları

1. **api-doc.md**: API'nin tüm endpoint'lerini, parametrelerini, dönüş değerlerini ve örnek kullanımlarını içeren detaylı Markdown dokümantasyonu. Gelişmiş arama endpoint'leri dahil.

2. **swagger.json**: API'nin Swagger/OpenAPI formatında tanımı. Yeni gelişmiş arama endpoint'leri ile güncellenmiştir. Bu dosya, Swagger UI veya diğer OpenAPI uyumlu araçlarla görüntülenebilir.

## Swagger UI ile Dokümantasyonu Görüntüleme

Swagger UI, API dokümantasyonunuzu interaktif bir şekilde görüntülemenizi sağlar. Swagger UI'ı kullanmak için:

1. Swagger UI'ı çevrimiçi olarak kullanabilirsiniz:

   - [Swagger Editor](https://editor.swagger.io/) sayfasını açın
   - `swagger.json` dosyasının içeriğini editöre yapıştırın

2. Alternatif olarak, Swagger UI'ı yerel olarak çalıştırabilirsiniz:
   ```bash
   # Swagger UI Docker imajını çalıştırma
   docker run -p 8080:8080 -e SWAGGER_JSON=/swagger.json -v $(pwd)/swagger.json:/swagger.json swaggerapi/swagger-ui
   ```
   Ardından tarayıcınızda `http://localhost:8080` adresini açın.

## Postman Koleksiyonu

API'yi test etmek için Postman kullanabilirsiniz. Swagger JSON dosyasını Postman'e aktarmak için:

1. Postman'i açın
2. "Import" düğmesine tıklayın
3. "Raw text" sekmesini seçin
4. `swagger.json` dosyasının içeriğini yapıştırın
5. "Import" düğmesine tıklayın

Bu, API'nin tüm endpoint'lerini içeren bir Postman koleksiyonu oluşturacaktır.

## API Kullanım Örnekleri

### cURL Örnekleri

#### Sistem durumu kontrolü

```bash
curl -X GET http://localhost:3000/health
```

#### Tüm üniversiteleri listele

```bash
curl -X GET http://localhost:3000/api/universities
```

#### ID'ye göre üniversite getir

```bash
curl -X GET http://localhost:3000/api/universities/1
```

#### Şehre göre üniversiteleri filtrele

```bash
curl -X GET http://localhost:3000/api/universities/city/istanbul
```

#### Türe göre üniversiteleri filtrele

```bash
curl -X GET http://localhost:3000/api/universities/type/devlet
```

#### Fakülte ara

```bash
curl -X GET "http://localhost:3000/api/search/faculty?name=mühendislik"
```

#### Program ara

```bash
curl -X GET "http://localhost:3000/api/search/program?name=bilgisayar"
```

#### 🆕 Filtre seçeneklerini getir

```bash
curl -X GET "http://localhost:3000/api/search/filters"
```

#### 🆕 Gelişmiş çoklu kriter arama

```bash
# İstanbul ve Ankara'daki Devlet üniversitelerinde SAY puanı ile Mühendislik programları
curl -X GET "http://localhost:3000/api/search/advanced?cities=İstanbul,Ankara&universityTypes=Devlet&scoreTypes=SAY&facultyCategories=engineering&minScore=400&sortBy=name&sortOrder=asc"
```

#### 🆕 Program adına göre gelişmiş arama

```bash
curl -X GET "http://localhost:3000/api/search/advanced?programName=bilgisayar mühendisliği"
```

#### 🆕 Puan aralığı ve kontenjan filtreleme

```bash
curl -X GET "http://localhost:3000/api/search/advanced?minScore=450&maxScore=550&minQuota=20&maxQuota=100"
```

### JavaScript Örnekleri

#### Sistem durumu kontrolü

```javascript
fetch("http://localhost:3000/health")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Hata:", error));
```

#### Tüm üniversiteleri listele

```javascript
fetch("http://localhost:3000/api/universities")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Hata:", error));
```

#### ID'ye göre üniversite getir

```javascript
fetch("http://localhost:3000/api/universities/1")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Hata:", error));
```

#### Şehre göre üniversiteleri filtrele

```javascript
fetch("http://localhost:3000/api/universities/city/istanbul")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Hata:", error));
```

#### 🆕 Filtre seçeneklerini getir

```javascript
fetch("http://localhost:3000/api/search/filters")
  .then((response) => response.json())
  .then((data) => {
    console.log("Mevcut şehirler:", data.cities);
    console.log("Puan türleri:", data.scoreTypes);
    console.log("Fakülte kategorileri:", data.facultyCategories);
  })
  .catch((error) => console.error("Hata:", error));
```

#### 🆕 Gelişmiş çoklu kriter arama

```javascript
// Parametreleri hazırla
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
  .then((data) => {
    console.log(`${data.count} sonuç bulundu`);
    console.log("Uygulanan filtreler:", data.filters);
    console.log("Sonuçlar:", data.results);
  })
  .catch((error) => console.error("Hata:", error));
```

#### 🆕 Program adına göre gelişmiş arama

```javascript
fetch(
  "http://localhost:3000/api/search/advanced?programName=bilgisayar mühendisliği"
)
  .then((response) => response.json())
  .then((data) => {
    console.log("Bulunan programlar:");
    data.results.forEach((uni) => {
      console.log(`${uni.name} - ${uni.city}`);
      uni.faculties.forEach((faculty) => {
        faculty.programs.forEach((program) => {
          console.log(`  - ${program.name}`);
        });
      });
    });
  })
  .catch((error) => console.error("Hata:", error));
```

## Daha Fazla Bilgi

Daha detaylı bilgi için `api-doc.md` dosyasına bakabilirsiniz.
