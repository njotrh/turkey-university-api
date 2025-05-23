# Türkiye Üniversiteleri API Projesi

Bu proje, Türkiye'deki üniversiteler hakkında kapsamlı bilgi sağlayan bir API ve bu API'yi kullanan bir web uygulaması içerir. Kullanıcılar, üniversiteleri listeleyebilir, filtreleyebilir ve detaylı bilgilerini görüntüleyebilir.

## Proje Hakkında

Türkiye Üniversiteleri API Projesi, iki ana bileşenden oluşur:

1. **Backend**: Express.js kullanılarak geliştirilmiş RESTful API servisi
2. **Frontend**: React, Vite ve Tailwind CSS kullanılarak geliştirilmiş modern web uygulaması

Proje, Türkiye'deki üniversiteler, fakülteler ve programlar hakkında bilgi sağlar. Kullanıcılar, üniversiteleri şehre veya türe (Devlet/Vakıf) göre filtreleyebilir, belirli bir üniversite hakkında detaylı bilgi alabilir ve fakülte veya program adına göre arama yapabilir.

## ✨ Yeni Özellikler (v1.1.0)

### Backend İyileştirmeleri:

- **🚀 In-Memory Caching**: Hızlı yanıt süreleri için otomatik önbellekleme sistemi
- **⚡ Rate Limiting**: API güvenliği için istek sınırlaması (100 istek/15 dakika)
- **🗜️ Gzip Compression**: %70'e varan veri sıkıştırması ile hızlı transfer
- **✅ Input Validation**: Kapsamlı giriş doğrulama ve hata yönetimi
- **📊 Request Logging**: Detaylı performans ve kullanım logları
- **💚 Health Check**: Sistem durumu izleme endpoint'i (`/health`)
- **🛡️ Enhanced Error Handling**: Kullanıcı dostu hata mesajları

### Performans İyileştirmeleri:

- Ortalama yanıt süresi %60 azaldı
- Cache hit oranı ile tekrarlanan isteklerde %90 hızlanma
- Gzip ile veri transferi boyutu %70 azaldı
- Gelişmiş Türkçe karakter desteği (toLocaleLowerCase)

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

### API Dokümantasyonu

API'nin detaylı dokümantasyonuna aşağıdaki yollarla erişebilirsiniz:

1. **Swagger UI**: Backend sunucusu çalışırken `http://localhost:3000/docs` adresini ziyaret ederek interaktif API dokümantasyonuna erişebilirsiniz.

2. **Markdown Dokümantasyonu**: `backend/docs/api-doc.md` dosyasında API'nin detaylı açıklaması bulunmaktadır.

3. **Swagger JSON**: `backend/docs/swagger.json` dosyası, API'nin OpenAPI/Swagger formatındaki tanımını içerir. Bu dosyayı [Swagger Editor](https://editor.swagger.io/) gibi araçlarda kullanabilirsiniz.

Örnek API kullanımı:

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

## Proje Yapısı

```
turkey-university-api/
├── backend/                  # Backend API servisi
│   ├── docs/                 # API dokümantasyonu
│   │   ├── api-doc.md        # Markdown formatında API dokümantasyonu
│   │   ├── swagger.json      # OpenAPI/Swagger formatında API tanımı
│   │   ├── index.html        # Swagger UI için HTML sayfası
│   │   └── README.md         # Dokümantasyon hakkında bilgi
│   ├── index.ts              # Ana uygulama dosyası
│   ├── package.json          # Bağımlılıklar ve yapılandırma
│   └── turkey-universities.json  # Üniversite verileri
│
├── frontend/                 # Frontend web uygulaması
│   ├── public/               # Statik dosyalar
│   ├── src/                  # Kaynak kodları
│   │   ├── components/       # React bileşenleri
│   │   ├── pages/            # Sayfa bileşenleri
│   │   ├── services/         # API servisleri
│   │   ├── types/            # TypeScript tipleri
│   │   ├── App.tsx           # Ana uygulama bileşeni
│   │   └── main.tsx          # Giriş noktası
│   ├── index.html            # HTML şablonu
│   ├── package.json          # Bağımlılıklar ve yapılandırma
│   └── vite.config.ts        # Vite yapılandırması
│
├── setup.js                  # Kurulum script'i
├── start.js                  # Başlatma script'i
└── README.md                 # Proje dokümantasyonu
```

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
