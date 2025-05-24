// Enhanced data types for YÖK 2024 data
export interface QuotaDetails {
  total: number | null;
  placed: number | null;
  minScore: number | null;
  maxScore: number | null;
}

export interface YokData2024 {
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

export interface Program {
  name: string;
  yokData2024?: YokData2024;
}

export interface Faculty {
  id: number;
  name: string;
  programs: Program[];
}

export interface University {
  id: number;
  name: string;
  type: string;
  city: string;
  website: string;
  address: string;
  logo: string;
  faculties: Faculty[];
}

export interface SearchFacultyResult {
  id: number;
  name: string;
  city: string;
  type: string;
  faculties: Faculty[];
}

export interface SearchProgramResult {
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

// Enhanced API response interfaces
export interface ScoreRangeSearchResult {
  count: number;
  scoreRange: { min: number; max: number };
  scoreType: string;
  results: SearchProgramResult[];
}

export interface QuotaTypeSearchResult {
  count: number;
  quotaType: string;
  results: SearchProgramResult[];
}

export interface StatisticsResult {
  universities: number;
  totalPrograms: number;
  programsWithEnhancedData: number;
  enhancedDataCoverage: string;
  scoreTypes: string[];
  programTypes: string[];
  totalQuota: number;
  totalPlaced: number;
  placementRate: string;
}

// Advanced search interfaces
export interface AdvancedSearchFilters {
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

export interface AdvancedSearchResult {
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

export interface FilterOptions {
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
