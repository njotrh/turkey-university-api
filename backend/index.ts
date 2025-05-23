import express from "express";
import cors from "cors";
import compression from "compression";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";

// Veri tiplerini tanımlayalım
interface Program {
  name: string;
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

// Cache interface
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

// Rate limiting interface
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory cache implementation
class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 dakika

  set(key: string, data: any, ttl?: number): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    this.cache.set(key, entry);
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  generateKey(req: express.Request): string {
    const url = req.originalUrl || req.url;
    const query = JSON.stringify(req.query);
    return createHash("md5")
      .update(url + query)
      .digest("hex");
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Rate limiter implementation
class RateLimiter {
  private clients = new Map<string, RateLimitEntry>();
  private readonly maxRequests = 100; // 100 istek
  private readonly windowMs = 15 * 60 * 1000; // 15 dakika

  isAllowed(clientId: string): boolean {
    const now = Date.now();
    const client = this.clients.get(clientId);

    if (!client || now > client.resetTime) {
      this.clients.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (client.count >= this.maxRequests) {
      return false;
    }

    client.count++;
    return true;
  }

  getRemainingRequests(clientId: string): number {
    const client = this.clients.get(clientId);
    if (!client || Date.now() > client.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - client.count);
  }

  getResetTime(clientId: string): number {
    const client = this.clients.get(clientId);
    if (!client || Date.now() > client.resetTime) {
      return Date.now() + this.windowMs;
    }
    return client.resetTime;
  }
}

// Express uygulamasını oluştur
const app = express();
const PORT = process.env.PORT || 3000;

// Cache ve rate limiter örneklerini oluştur
const cache = new MemoryCache();
const rateLimiter = new RateLimiter();

// Helper function to get client IP
const getClientIp = (req: express.Request): string => {
  return (
    req.ip ||
    (req.headers["x-forwarded-for"] as string) ||
    (req.headers["x-real-ip"] as string) ||
    req.socket.remoteAddress ||
    "unknown"
  );
};

// Request logging middleware
const requestLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const start = Date.now();
  const clientIp = getClientIp(req);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${
        res.statusCode
      } - ${duration}ms - ${clientIp}`
    );
  });

  next();
};

// Rate limiting middleware
const rateLimitMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const clientIp = getClientIp(req);

  if (!rateLimiter.isAllowed(clientIp)) {
    const resetTime = rateLimiter.getResetTime(clientIp);
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

    res.set({
      "X-RateLimit-Limit": "100",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": resetTime.toString(),
      "Retry-After": retryAfter.toString(),
    });

    return res.status(429).json({
      error: "Çok fazla istek gönderildi",
      message: "Lütfen daha sonra tekrar deneyin",
      retryAfter: retryAfter,
    });
  }

  const remaining = rateLimiter.getRemainingRequests(clientIp);
  const resetTime = rateLimiter.getResetTime(clientIp);

  res.set({
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": resetTime.toString(),
  });

  next();
};

// Cache middleware
const cacheMiddleware = (ttl?: number) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const cacheKey = cache.generateKey(req);
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      res.set("X-Cache", "HIT");
      return res.json(cachedData);
    }

    res.set("X-Cache", "MISS");

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function (data: any) {
      cache.set(cacheKey, data, ttl);
      return originalJson.call(this, data);
    };

    next();
  };
};

// Input validation middleware
const validateSearchQuery = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "Geçersiz arama parametresi",
      message: "Arama terimi belirtilmeli ve metin olmalıdır",
      parameter: "name",
    });
  }

  if (name.length < 2) {
    return res.status(400).json({
      error: "Arama terimi çok kısa",
      message: "Arama terimi en az 2 karakter olmalıdır",
      parameter: "name",
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      error: "Arama terimi çok uzun",
      message: "Arama terimi en fazla 100 karakter olabilir",
      parameter: "name",
    });
  }

  next();
};

const validateIdParameter = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: "ID parametresi eksik",
      message: "ID parametresi belirtilmelidir",
      parameter: "id",
    });
  }

  const numericId = parseInt(id);

  if (isNaN(numericId) || numericId <= 0) {
    return res.status(400).json({
      error: "Geçersiz ID parametresi",
      message: "ID pozitif bir sayı olmalıdır",
      parameter: "id",
    });
  }

  next();
};

// Middleware
app.use(compression()); // Gzip compression
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimitMiddleware);
app.use("/docs", express.static(path.join(__dirname, "docs")));

// JSON dosyasını oku
const universitiesData: University[] = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "turkey-universities.json"), "utf-8")
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache: {
      size: cache.size(),
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
  });
});

// Ana sayfa
app.get("/", (req, res) => {
  res.json({
    message: "Türkiye Üniversiteleri API",
    version: "1.1.0",
    endpoints: {
      "/health": "Sistem durumu kontrolü",
      "/api/universities": "Tüm üniversiteleri listeler",
      "/api/universities/:id": "ID'ye göre üniversite getirir",
      "/api/universities/city/:city": "Şehre göre üniversiteleri filtreler",
      "/api/universities/type/:type":
        "Türe göre üniversiteleri filtreler (Devlet/Vakıf)",
      "/api/search/faculty": "Fakülte adına göre arama yapar (query: name)",
      "/api/search/program": "Program adına göre arama yapar (query: name)",
    },
    features: [
      "In-memory caching",
      "Rate limiting",
      "Request logging",
      "Input validation",
      "Error handling",
    ],
  });
});

// Tüm üniversiteleri getir (with caching)
app.get("/api/universities", cacheMiddleware(10 * 60 * 1000), (req, res) => {
  res.json(universitiesData);
});

// Şehre göre üniversiteleri filtrele (with caching)
app.get(
  "/api/universities/city/:city",
  cacheMiddleware(5 * 60 * 1000),
  (req, res) => {
    const city = req.params.city?.toUpperCase();

    if (!city) {
      return res.status(400).json({
        error: "Şehir parametresi eksik",
        message: "Şehir adı belirtilmelidir",
      });
    }

    const universities = universitiesData.filter((uni) =>
      uni.city.toUpperCase().includes(city)
    );

    if (universities.length === 0) {
      return res.status(404).json({
        error: "Bu şehirde üniversite bulunamadı",
        searchedCity: req.params.city,
      });
    }

    res.json({
      count: universities.length,
      city: req.params.city,
      universities,
    });
  }
);

// Türe göre üniversiteleri filtrele (Devlet/Vakıf) (with caching)
app.get(
  "/api/universities/type/:type",
  cacheMiddleware(5 * 60 * 1000),
  (req, res) => {
    const type = req.params.type?.toUpperCase();

    if (!type) {
      return res.status(400).json({
        error: "Tür parametresi eksik",
        message: "Üniversite türü belirtilmelidir",
      });
    }

    const validTypes = ["DEVLET", "VAKIF"];
    if (!validTypes.some((validType) => type.includes(validType))) {
      return res.status(400).json({
        error: "Geçersiz üniversite türü",
        message: "Geçerli türler: Devlet, Vakıf",
        providedType: req.params.type,
      });
    }

    const universities = universitiesData.filter((uni) =>
      uni.type.toUpperCase().includes(type)
    );

    if (universities.length === 0) {
      return res.status(404).json({
        error: "Bu türde üniversite bulunamadı",
        searchedType: req.params.type,
      });
    }

    res.json({
      count: universities.length,
      type: req.params.type,
      universities,
    });
  }
);

// ID'ye göre üniversite getir (with validation and caching)
app.get(
  "/api/universities/:id",
  validateIdParameter,
  cacheMiddleware(15 * 60 * 1000),
  (req, res) => {
    const id = parseInt(req.params.id!);
    const university = universitiesData.find((uni) => uni.id === id);

    if (!university) {
      return res.status(404).json({
        error: "Üniversite bulunamadı",
        searchedId: id,
      });
    }

    res.json(university);
  }
);

// Fakülte adına göre arama (with validation and caching)
app.get(
  "/api/search/faculty",
  validateSearchQuery,
  cacheMiddleware(3 * 60 * 1000),
  (req, res) => {
    const name = req.query.name as string;

    const results = universitiesData
      .map((uni) => {
        const matchingFaculties = uni.faculties.filter((faculty) =>
          faculty.name
            .toLocaleLowerCase("tr-TR")
            .includes(name.toLocaleLowerCase("tr-TR"))
        );

        if (matchingFaculties.length > 0) {
          return {
            id: uni.id,
            name: uni.name,
            city: uni.city,
            type: uni.type,
            website: uni.website,
            faculties: matchingFaculties,
          };
        }

        return null;
      })
      .filter(Boolean);

    if (results.length === 0) {
      return res.status(404).json({
        error: "Eşleşen fakülte bulunamadı",
        searchTerm: name,
      });
    }

    res.json({
      count: results.length,
      searchTerm: name,
      results,
    });
  }
);

// Program adına göre arama (with validation and caching)
app.get(
  "/api/search/program",
  validateSearchQuery,
  cacheMiddleware(3 * 60 * 1000),
  (req, res) => {
    const name = req.query.name as string;

    const results = universitiesData
      .map((uni) => {
        const matchingFaculties = uni.faculties
          .map((faculty) => {
            const matchingPrograms = faculty.programs.filter((program) =>
              program.name
                .toLocaleLowerCase("tr-TR")
                .includes(name.toLocaleLowerCase("tr-TR"))
            );

            if (matchingPrograms.length > 0) {
              return {
                id: faculty.id,
                name: faculty.name,
                programs: matchingPrograms,
              };
            }

            return null;
          })
          .filter(Boolean);

        if (matchingFaculties.length > 0) {
          return {
            id: uni.id,
            name: uni.name,
            city: uni.city,
            type: uni.type,
            website: uni.website,
            faculties: matchingFaculties,
          };
        }

        return null;
      })
      .filter(Boolean);

    if (results.length === 0) {
      return res.status(404).json({
        error: "Eşleşen program bulunamadı",
        searchTerm: name,
      });
    }

    res.json({
      count: results.length,
      searchTerm: name,
      results,
    });
  }
);

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(`[${new Date().toISOString()}] Error:`, err);

    res.status(500).json({
      error: "Sunucu hatası",
      message: "Beklenmeyen bir hata oluştu",
      timestamp: new Date().toISOString(),
    });
  }
);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: "Endpoint bulunamadı",
    message: `${req.method} ${req.originalUrl} endpoint'i mevcut değil`,
    availableEndpoints: [
      "GET /",
      "GET /health",
      "GET /api/universities",
      "GET /api/universities/:id",
      "GET /api/universities/city/:city",
      "GET /api/universities/type/:type",
      "GET /api/search/faculty?name=...",
      "GET /api/search/program?name=...",
    ],
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🚀 Türkiye Üniversiteleri API başlatıldı!`);
  console.log(`📍 Sunucu adresi: http://localhost:${PORT}`);
  console.log(`📚 API dokümantasyonu: http://localhost:${PORT}/docs`);
  console.log(`💚 Sistem durumu: http://localhost:${PORT}/health`);
  console.log(`📊 Toplam üniversite sayısı: ${universitiesData.length}`);
  console.log(`⚡ Özellikler: Caching, Rate Limiting, Validation, Logging`);
});
