import axios from "axios";
import {
  University,
  SearchFacultyResult,
  SearchProgramResult,
  ScoreRangeSearchResult,
  QuotaTypeSearchResult,
  StatisticsResult,
  AdvancedSearchFilters,
  AdvancedSearchResult,
  FilterOptions,
} from "../types";

const API_URL = "http://localhost:3000";

export const getUniversities = async (): Promise<University[]> => {
  const response = await axios.get<University[]>(`${API_URL}/api/universities`);
  return response.data;
};

export const getUniversityById = async (id: number): Promise<University> => {
  const response = await axios.get<University>(
    `${API_URL}/api/universities/${id}`
  );
  return response.data;
};

export const getUniversitiesByCity = async (
  city: string
): Promise<University[]> => {
  const response = await axios.get<{
    count: number;
    city: string;
    universities: University[];
  }>(`${API_URL}/api/universities/city/${city}`);
  return response.data.universities;
};

export const getUniversitiesByType = async (
  type: string
): Promise<University[]> => {
  const response = await axios.get<{
    count: number;
    type: string;
    universities: University[];
  }>(`${API_URL}/api/universities/type/${type}`);
  return response.data.universities;
};

export const searchFaculties = async (
  name: string
): Promise<SearchFacultyResult[]> => {
  const response = await axios.get<{
    count: number;
    searchTerm: string;
    results: SearchFacultyResult[];
  }>(`${API_URL}/api/search/faculty`, {
    params: { name },
  });
  return response.data.results;
};

export const searchPrograms = async (
  name: string
): Promise<SearchProgramResult[]> => {
  const response = await axios.get<{
    count: number;
    searchTerm: string;
    results: SearchProgramResult[];
  }>(`${API_URL}/api/search/program`, {
    params: { name },
  });
  return response.data.results;
};

// Enhanced API functions
export const searchProgramsByScoreRange = async (
  minScore: number,
  maxScore: number,
  scoreType?: string
): Promise<ScoreRangeSearchResult> => {
  const response = await axios.get<ScoreRangeSearchResult>(
    `${API_URL}/api/programs/score-range`,
    {
      params: { minScore, maxScore, scoreType },
    }
  );
  return response.data;
};

export const searchProgramsByQuotaType = async (
  quotaType: string
): Promise<QuotaTypeSearchResult> => {
  const response = await axios.get<QuotaTypeSearchResult>(
    `${API_URL}/api/programs/quota-type`,
    {
      params: { quotaType },
    }
  );
  return response.data;
};

export const getStatistics = async (): Promise<StatisticsResult> => {
  const response = await axios.get<StatisticsResult>(
    `${API_URL}/api/statistics`
  );
  return response.data;
};

// Advanced search functions
export const getFilterOptions = async (): Promise<FilterOptions> => {
  const response = await axios.get<FilterOptions>(
    `${API_URL}/api/search/filters`
  );
  return response.data;
};

export const advancedSearch = async (
  filters: AdvancedSearchFilters
): Promise<AdvancedSearchResult> => {
  const params = new URLSearchParams();

  if (filters.universityTypes?.length) {
    params.append("universityTypes", filters.universityTypes.join(","));
  }
  if (filters.cities?.length) {
    params.append("cities", filters.cities.join(","));
  }
  if (filters.programTypes?.length) {
    params.append("programTypes", filters.programTypes.join(","));
  }
  if (filters.scoreTypes?.length) {
    params.append("scoreTypes", filters.scoreTypes.join(","));
  }
  if (filters.facultyCategories?.length) {
    params.append("facultyCategories", filters.facultyCategories.join(","));
  }
  if (
    filters.scoreRange?.min !== undefined &&
    filters.scoreRange.min !== null
  ) {
    params.append("minScore", filters.scoreRange.min.toString());
  }
  if (
    filters.scoreRange?.max !== undefined &&
    filters.scoreRange.max !== null
  ) {
    params.append("maxScore", filters.scoreRange.max.toString());
  }
  if (
    filters.quotaRange?.min !== undefined &&
    filters.quotaRange.min !== null
  ) {
    params.append("minQuota", filters.quotaRange.min.toString());
  }
  if (
    filters.quotaRange?.max !== undefined &&
    filters.quotaRange.max !== null
  ) {
    params.append("maxQuota", filters.quotaRange.max.toString());
  }
  if (filters.programName) {
    params.append("programName", filters.programName);
  }
  if (filters.sortBy) {
    params.append("sortBy", filters.sortBy);
  }
  if (filters.sortOrder) {
    params.append("sortOrder", filters.sortOrder);
  }

  const response = await axios.get<AdvancedSearchResult>(
    `${API_URL}/api/search/advanced?${params.toString()}`
  );
  return response.data;
};
