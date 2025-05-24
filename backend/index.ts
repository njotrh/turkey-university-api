import express from "express";
import cors from "cors";
import compression from "compression";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";

// Enhanced data types for YÖK 2024 data
interface QuotaDetails {
  total: number | null;
  placed: number | null;
  minScore: number | null;
  maxScore: number | null;
}

interface YokData2024 {
  programCode: string;
  scoreType: string;
  programType: string;
  quota: {
    general: QuotaDetails;
    schoolFirst: QuotaDetails;
    earthquake: QuotaDetails;
    womenOver34: QuotaDetails;
    veteran: QuotaDetails;
  };
}

// Enhanced Program interface with optional YÖK data for backward compatibility
interface Program {
  name: string;
  yokData2024?: YokData2024;
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
  private readonly maxRequests = 300; // 300 istek
  private readonly windowMs = 1 * 60 * 1000; // 1 dakika

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

// JSON dosyasını oku - Enhanced data kullan
const universitiesData: University[] = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "../data/turkey-universities-enhanced.json"),
    "utf-8"
  )
);

// Health check endpoint
app.get("/health", (_req, res) => {
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
app.get("/", (_req, res) => {
  res.json({
    message: "Türkiye Üniversiteleri API - Enhanced Version",
    version: "2.0.0",
    endpoints: {
      "/health": "Sistem durumu kontrolü",
      "/api/universities": "Tüm üniversiteleri listeler (enhanced data ile)",
      "/api/universities/:id": "ID'ye göre üniversite getirir",
      "/api/universities/city/:city": "Şehre göre üniversiteleri filtreler",
      "/api/universities/type/:type":
        "Türe göre üniversiteleri filtreler (Devlet/Vakıf)",
      "/api/search/faculty": "Fakülte adına göre arama yapar (query: name)",
      "/api/search/program": "Program adına göre arama yapar (query: name)",
      "/api/programs/score-range":
        "Puan aralığına göre program arama (query: minScore, maxScore, scoreType)",
      "/api/search/advanced":
        "Gelişmiş çoklu kriter arama (query: multiple filters)",
      "/api/search/filters": "Arama filtreleri için mevcut seçenekleri getirir",
      "/api/statistics": "Enhanced data istatistikleri",
    },
    features: [
      "Enhanced YÖK 2024 data",
      "Score range filtering",
      "Quota type filtering",
      "Statistical analysis",
      "In-memory caching",
      "Rate limiting",
      "Request logging",
      "Input validation",
      "Error handling",
    ],
  });
});

// Tüm üniversiteleri getir (with caching)
app.get("/api/universities", cacheMiddleware(10 * 60 * 1000), (_req, res) => {
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

// Enhanced data endpoints

// Get programs by score range
app.get(
  "/api/programs/score-range",
  cacheMiddleware(5 * 60 * 1000),
  (req, res) => {
    const { minScore, maxScore, scoreType } = req.query;

    if (!minScore || !maxScore) {
      return res.status(400).json({
        error: "Eksik parametreler",
        message: "minScore ve maxScore parametreleri gereklidir",
      });
    }

    const min = parseFloat(minScore as string);
    const max = parseFloat(maxScore as string);

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
      return res.status(400).json({
        error: "Geçersiz puan aralığı",
        message: "Geçerli bir puan aralığı belirtiniz",
      });
    }

    const results = universitiesData
      .map((uni) => {
        const matchingFaculties = uni.faculties
          .map((faculty) => {
            const matchingPrograms = faculty.programs.filter((program) => {
              if (!program.yokData2024) return false;

              const data = program.yokData2024;
              if (scoreType && data.scoreType !== scoreType) return false;

              const generalQuota = data.quota.general;
              if (!generalQuota.minScore || !generalQuota.maxScore)
                return false;

              return (
                generalQuota.minScore >= min && generalQuota.maxScore <= max
              );
            });

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

    res.json({
      count: results.length,
      scoreRange: { min, max },
      scoreType: scoreType || "all",
      results,
    });
  }
);

// Advanced multi-criteria search
app.get("/api/search/advanced", cacheMiddleware(5 * 60 * 1000), (req, res) => {
  const {
    universityTypes,
    cities,
    programTypes,
    scoreTypes,
    facultyCategories,
    minScore,
    maxScore,
    programName,
    minQuota,
    maxQuota,
    sortBy,
    sortOrder,
  } = req.query;

  let results = universitiesData.map((uni) => ({ ...uni }));

  // Filter by university type
  if (universityTypes) {
    const types = (universityTypes as string)
      .split(",")
      .map((t) => t.trim().toLowerCase());
    results = results.filter((uni) =>
      types.some((type) => uni.type.toLowerCase().includes(type))
    );
  }

  // Filter by cities
  if (cities) {
    const cityList = (cities as string)
      .split(",")
      .map((c) => c.trim().toLowerCase());
    results = results.filter((uni) =>
      cityList.some((city) => uni.city.toLowerCase().includes(city))
    );
  }

  // Filter and process programs
  results = results
    .map((uni) => {
      const filteredFaculties = uni.faculties
        .map((faculty) => {
          let filteredPrograms = faculty.programs.filter((program) => {
            // Program name filter
            if (
              programName &&
              !program.name
                .toLowerCase()
                .includes((programName as string).toLowerCase())
            ) {
              return false;
            }

            if (!program.yokData2024) return true; // Include programs without enhanced data

            // Program type filter
            if (programTypes) {
              const types = (programTypes as string)
                .split(",")
                .map((t) => t.trim().toLowerCase());
              if (
                !types.includes(program.yokData2024.programType.toLowerCase())
              ) {
                return false;
              }
            }

            // Score type filter
            if (scoreTypes) {
              const types = (scoreTypes as string)
                .split(",")
                .map((t) => t.trim().toUpperCase());
              if (
                !types.includes(program.yokData2024.scoreType.toUpperCase())
              ) {
                return false;
              }
            }

            // Score range filter
            if (minScore || maxScore) {
              const generalQuota = program.yokData2024.quota.general;
              if (
                generalQuota.minScore !== null &&
                generalQuota.maxScore !== null
              ) {
                // Program's score range must be completely within the filter range
                const programMinScore = generalQuota.minScore;
                const programMaxScore = generalQuota.maxScore;
                const filterMinScore = minScore
                  ? parseFloat(minScore as string)
                  : Number.MIN_SAFE_INTEGER;
                const filterMaxScore = maxScore
                  ? parseFloat(maxScore as string)
                  : Number.MAX_SAFE_INTEGER;

                // Check if program's entire score range is within filter range
                if (
                  programMinScore < filterMinScore ||
                  programMaxScore > filterMaxScore
                ) {
                  return false;
                }
              }
            }

            // Quota range filter
            if (minQuota || maxQuota) {
              const totalQuota = program.yokData2024.quota.general.total;
              if (totalQuota !== null) {
                if (minQuota && totalQuota < parseInt(minQuota as string))
                  return false;
                if (maxQuota && totalQuota > parseInt(maxQuota as string))
                  return false;
              }
            }

            return true;
          });

          return filteredPrograms.length > 0
            ? {
                ...faculty,
                programs: filteredPrograms,
              }
            : null;
        })
        .filter((faculty): faculty is Faculty => faculty !== null);

      return filteredFaculties.length > 0
        ? {
            ...uni,
            faculties: filteredFaculties,
          }
        : null;
    })
    .filter((uni): uni is University => uni !== null);

  // Faculty category filter
  if (facultyCategories) {
    const categories = (facultyCategories as string)
      .split(",")
      .map((c) => c.trim().toLowerCase());
    results = results
      .map((uni) => {
        const filteredFaculties = uni.faculties.filter((faculty) => {
          return categories.some((category) => {
            const facultyName = faculty.name.toLowerCase();
            switch (category) {
              case "engineering":
                return (
                  facultyName.includes("mühendislik") ||
                  facultyName.includes("teknik")
                );
              case "medicine":
                return (
                  facultyName.includes("tıp") || facultyName.includes("sağlık")
                );
              case "social":
                return (
                  facultyName.includes("sosyal") ||
                  facultyName.includes("edebiyat") ||
                  facultyName.includes("iktisadi")
                );
              case "science":
                return (
                  facultyName.includes("fen") || facultyName.includes("bilim")
                );
              case "education":
                return (
                  facultyName.includes("eğitim") ||
                  facultyName.includes("öğretmen")
                );
              case "law":
                return facultyName.includes("hukuk");
              case "business":
                return (
                  facultyName.includes("işletme") ||
                  facultyName.includes("ticaret")
                );
              default:
                return false;
            }
          });
        });

        return filteredFaculties.length > 0
          ? {
              ...uni,
              faculties: filteredFaculties,
            }
          : null;
      })
      .filter((uni): uni is University => uni !== null);
  }

  // Sorting
  if (sortBy) {
    results.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "city":
          aValue = a.city;
          bValue = b.city;
          break;
        case "programCount":
          aValue = a.faculties.reduce((sum, f) => sum + f.programs.length, 0);
          bValue = b.faculties.reduce((sum, f) => sum + f.programs.length, 0);
          break;
        case "facultyCount":
          aValue = a.faculties.length;
          bValue = b.faculties.length;
          break;
        case "score":
          // Calculate average score for university based on all programs
          const aScores: number[] = [];
          const bScores: number[] = [];

          a.faculties.forEach((faculty) => {
            faculty.programs.forEach((program) => {
              if (
                program.yokData2024?.quota?.general?.minScore !== null &&
                program.yokData2024?.quota?.general?.minScore !== undefined
              ) {
                aScores.push(program.yokData2024.quota.general.minScore);
              }
            });
          });

          b.faculties.forEach((faculty) => {
            faculty.programs.forEach((program) => {
              if (
                program.yokData2024?.quota?.general?.minScore !== null &&
                program.yokData2024?.quota?.general?.minScore !== undefined
              ) {
                bScores.push(program.yokData2024.quota.general.minScore);
              }
            });
          });

          aValue =
            aScores.length > 0
              ? aScores.reduce((sum, score) => sum + score, 0) / aScores.length
              : 0;
          bValue =
            bScores.length > 0
              ? bScores.reduce((sum, score) => sum + score, 0) / bScores.length
              : 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "desc"
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
      }
      return 0;
    });
  }

  res.json({
    count: results.length,
    filters: {
      universityTypes: universityTypes || null,
      cities: cities || null,
      programTypes: programTypes || null,
      scoreTypes: scoreTypes || null,
      facultyCategories: facultyCategories || null,
      scoreRange: { min: minScore || null, max: maxScore || null },
      quotaRange: { min: minQuota || null, max: maxQuota || null },
      programName: programName || null,
    },
    sorting: {
      sortBy: sortBy || null,
      sortOrder: sortOrder || "asc",
    },
    results,
  });
});

// Get filter options for advanced search
app.get("/api/search/filters", cacheMiddleware(10 * 60 * 1000), (_req, res) => {
  const cities = new Set<string>();
  const scoreTypes = new Set<string>();
  const programTypes = new Set<string>();
  const universityTypes = new Set<string>();
  const facultyNames = new Set<string>();

  universitiesData.forEach((uni) => {
    cities.add(uni.city);
    universityTypes.add(uni.type);

    uni.faculties.forEach((faculty) => {
      facultyNames.add(faculty.name);

      faculty.programs.forEach((program) => {
        if (program.yokData2024) {
          scoreTypes.add(program.yokData2024.scoreType);
          programTypes.add(program.yokData2024.programType);
        }
      });
    });
  });

  // Faculty categories based on common patterns
  const facultyCategories = [
    { id: "engineering", name: "Mühendislik", count: 0 },
    { id: "medicine", name: "Tıp ve Sağlık", count: 0 },
    { id: "social", name: "Sosyal Bilimler", count: 0 },
    { id: "science", name: "Fen Bilimleri", count: 0 },
    { id: "education", name: "Eğitim", count: 0 },
    { id: "law", name: "Hukuk", count: 0 },
    { id: "business", name: "İşletme ve Ticaret", count: 0 },
  ];

  // Count faculties in each category
  facultyNames.forEach((facultyName) => {
    const name = facultyName.toLowerCase();
    if (name.includes("mühendislik") || name.includes("teknik")) {
      facultyCategories[0]!.count++;
    }
    if (name.includes("tıp") || name.includes("sağlık")) {
      facultyCategories[1]!.count++;
    }
    if (
      name.includes("sosyal") ||
      name.includes("edebiyat") ||
      name.includes("iktisadi")
    ) {
      facultyCategories[2]!.count++;
    }
    if (name.includes("fen") || name.includes("bilim")) {
      facultyCategories[3]!.count++;
    }
    if (name.includes("eğitim") || name.includes("öğretmen")) {
      facultyCategories[4]!.count++;
    }
    if (name.includes("hukuk")) {
      facultyCategories[5]!.count++;
    }
    if (name.includes("işletme") || name.includes("ticaret")) {
      facultyCategories[6]!.count++;
    }
  });

  res.json({
    cities: Array.from(cities).sort(),
    scoreTypes: Array.from(scoreTypes).sort(),
    programTypes: Array.from(programTypes).sort(),
    universityTypes: Array.from(universityTypes).sort(),
    facultyCategories: facultyCategories.filter((cat) => cat.count > 0),
    totalUniversities: universitiesData.length,
    totalCities: cities.size,
  });
});

// Get statistics for enhanced data
app.get("/api/statistics", cacheMiddleware(10 * 60 * 1000), (_req, res) => {
  let totalPrograms = 0;
  let programsWithData = 0;
  let scoreTypes = new Set<string>();
  let programTypes = new Set<string>();
  let totalQuota = 0;
  let totalPlaced = 0;

  universitiesData.forEach((uni) => {
    uni.faculties.forEach((faculty) => {
      faculty.programs.forEach((program) => {
        totalPrograms++;

        if (program.yokData2024) {
          programsWithData++;
          scoreTypes.add(program.yokData2024.scoreType);
          programTypes.add(program.yokData2024.programType);

          if (program.yokData2024.quota.general.total) {
            totalQuota += program.yokData2024.quota.general.total;
          }
          if (program.yokData2024.quota.general.placed) {
            totalPlaced += program.yokData2024.quota.general.placed;
          }
        }
      });
    });
  });

  res.json({
    universities: universitiesData.length,
    totalPrograms,
    programsWithEnhancedData: programsWithData,
    enhancedDataCoverage: `${((programsWithData / totalPrograms) * 100).toFixed(
      1
    )}%`,
    scoreTypes: Array.from(scoreTypes),
    programTypes: Array.from(programTypes),
    totalQuota,
    totalPlaced,
    placementRate:
      totalQuota > 0
        ? `${((totalPlaced / totalQuota) * 100).toFixed(1)}%`
        : "0%",
  });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
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
      "GET /api/programs/score-range?minScore=...&maxScore=...&scoreType=...",
      "GET /api/search/advanced?universityTypes=...&cities=...&programTypes=...",
      "GET /api/search/filters",
      "GET /api/statistics",
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
