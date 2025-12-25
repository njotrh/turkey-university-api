import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFilterOptions, advancedSearch } from "../services/api";
import { useFavorites } from "../hooks/useFavorites";
import { usePagination } from "../hooks/usePagination";
import {
  FilterOptions,
  AdvancedSearchFilters,
  AdvancedSearchResult,
} from "../types";
import ProgramCard from "../components/ProgramCard";
import ComparisonButton from "../components/ComparisonButton";
import FavoriteButton from "../components/FavoriteButton";
import ExportButton from "../components/ExportButton";
import Pagination from "../components/Pagination";
import {
  ArrowLeftIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const EnhancedSearchPage = () => {
  const { favorites } = useFavorites();
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [searchResults, setSearchResults] =
    useState<AdvancedSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // Pagination for search results
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedResults,
  } = usePagination(searchResults?.results || [], {
    initialPage: 1,
    itemsPerPage: 10,
    totalItems: searchResults?.results?.length || 0,
  });

  // Filter states
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    universityTypes: [],
    cities: [],
    programTypes: [],
    scoreTypes: [],
    facultyCategories: [],
    scoreRange: { min: undefined, max: undefined },
    quotaRange: { min: undefined, max: undefined },
    programName: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await getFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        setError("Filter seçenekleri yüklenirken hata oluştu.");
      }
    };
    loadFilterOptions();
  }, []);

  // Handle search
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const results = await advancedSearch(filters);
      setSearchResults(results);
      // Reset pagination to first page when new search is performed
      setCurrentPage(1);
    } catch (err) {
      console.error("Search error:", err);
      setError("Arama sırasında bir hata oluştu.");
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      universityTypes: [],
      cities: [],
      programTypes: [],
      scoreTypes: [],
      facultyCategories: [],
      scoreRange: { min: undefined, max: undefined },
      quotaRange: { min: undefined, max: undefined },
      programName: "",
      sortBy: "name",
      sortOrder: "asc",
    });
    setSearchResults(null);
    // Reset pagination when filters are cleared
    setCurrentPage(1);
  };

  // Update filter helper
  const updateFilter = (key: keyof AdvancedSearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle multi-select filter
  const toggleMultiSelectFilter = (
    key: keyof AdvancedSearchFilters,
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = (prev[key] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      (filters.universityTypes?.length || 0) > 0 ||
      (filters.cities?.length || 0) > 0 ||
      (filters.programTypes?.length || 0) > 0 ||
      (filters.scoreTypes?.length || 0) > 0 ||
      (filters.facultyCategories?.length || 0) > 0 ||
      filters.scoreRange?.min !== undefined ||
      filters.scoreRange?.max !== undefined ||
      filters.quotaRange?.min !== undefined ||
      filters.quotaRange?.max !== undefined ||
      filters.programName !== ""
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        Ana Sayfaya Dön
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gelişmiş Üniversite ve Program Arama
        </h1>
        <p className="text-gray-600">
          Çoklu kriter filtreleme ile detaylı arama yapın
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filter Panel */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Arama Filtreleri
              </h2>
              {hasActiveFilters() && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Aktif
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  Temizle
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-600 hover:text-gray-800"
              >
                {showFilters ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {showFilters && filterOptions && (
          <div className="p-6 space-y-6">
            {/* Program Name Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Adı
              </label>
              <input
                type="text"
                value={filters.programName || ""}
                onChange={(e) => updateFilter("programName", e.target.value)}
                placeholder="Program adı ile arama yapın..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* University Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Üniversite Türü
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.universityTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      toggleMultiSelectFilter("universityTypes", type)
                    }
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.universityTypes?.includes(type)
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şehirler ({filters.cities?.length || 0} seçili)
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                <div className="grid grid-cols-3 gap-1">
                  {filterOptions.cities.map((city) => (
                    <label key={city} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={filters.cities?.includes(city) || false}
                        onChange={() => toggleMultiSelectFilter("cities", city)}
                        className="mr-2 rounded"
                      />
                      {city}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Program Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Türü
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.programTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      toggleMultiSelectFilter("programTypes", type)
                    }
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.programTypes?.includes(type)
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {type === "lisans" ? "Lisans" : "Önlisans"}
                  </button>
                ))}
              </div>
            </div>

            {/* Score Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puan Türü
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.scoreTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleMultiSelectFilter("scoreTypes", type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.scoreTypes?.includes(type)
                        ? "bg-purple-100 text-purple-800 border border-purple-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Faculty Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fakülte Kategorileri
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.facultyCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      toggleMultiSelectFilter("facultyCategories", category.id)
                    }
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.facultyCategories?.includes(category.id)
                        ? "bg-orange-100 text-orange-800 border border-orange-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Score Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puan Aralığı
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Min puan"
                    value={filters.scoreRange?.min || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateFilter("scoreRange", {
                        ...filters.scoreRange,
                        min:
                          value && !isNaN(parseFloat(value))
                            ? parseFloat(value)
                            : undefined,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max puan"
                    value={filters.scoreRange?.max || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateFilter("scoreRange", {
                        ...filters.scoreRange,
                        max:
                          value && !isNaN(parseFloat(value))
                            ? parseFloat(value)
                            : undefined,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Quota Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kontenjan Aralığı
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Min kontenjan"
                    value={filters.quotaRange?.min || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateFilter("quotaRange", {
                        ...filters.quotaRange,
                        min:
                          value && !isNaN(parseInt(value))
                            ? parseInt(value)
                            : undefined,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max kontenjan"
                    value={filters.quotaRange?.max || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateFilter("quotaRange", {
                        ...filters.quotaRange,
                        max:
                          value && !isNaN(parseInt(value))
                            ? parseInt(value)
                            : undefined,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={filters.sortBy || "name"}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Üniversite Adı</option>
                  <option value="city">Şehir</option>
                  <option value="programCount">Program Sayısı</option>
                  <option value="facultyCount">Fakülte Sayısı</option>
                  <option value="score">Puan (YÖK 2025)</option>
                </select>
                <select
                  value={filters.sortOrder || "asc"}
                  onChange={(e) =>
                    updateFilter("sortOrder", e.target.value as "asc" | "desc")
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">Artan</option>
                  <option value="desc">Azalan</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                )}
                {loading ? "Aranıyor..." : "Ara"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Arama yapılıyor...</span>
          </div>
        </div>
      )}

      {searchResults && !loading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Arama Sonuçları
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span>
                    <strong>{searchResults.count}</strong> sonuç bulundu
                  </span>
                  {searchResults.results.length > 0 && (
                    <>
                      <span className="flex items-center gap-1">
                        <HeartIcon className="w-4 h-4 text-red-500" />
                        <strong>
                          {
                            searchResults.results.filter((uni) =>
                              favorites.some((fav) => fav.id === uni.id)
                            ).length
                          }
                        </strong>
                        favoride
                      </span>
                      {totalPages > 1 && (
                        <span>
                          Sayfa <strong>{currentPage}</strong> /{" "}
                          <strong>{totalPages}</strong>
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {searchResults.results.length > 0 && (
                <div className="w-full sm:w-auto">
                  <ExportButton
                    advancedSearchData={searchResults}
                    filename="gelismis-arama-sonuclari"
                    label="Sonuçları Dışa Aktar"
                    size="md"
                  />
                </div>
              )}
            </div>
          </div>

          {searchResults.results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Arama kriterlerinize uygun sonuç bulunamadı.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {paginatedResults.map((university) => (
                  <div
                    key={university.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    {/* University Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {university.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            <span>{university.city}</span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              university.type.toLowerCase().includes("devlet")
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {university.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FavoriteButton
                          university={{
                            ...university,
                            website: "",
                            address: "",
                            logo: "",
                          }}
                          size="md"
                          showText={false}
                        />
                        <ComparisonButton
                          university={{
                            ...university,
                            website: "",
                            address: "",
                            logo: "",
                          }}
                        />
                        <Link
                          to={`/universities/${university.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Detayları Gör
                        </Link>
                      </div>
                    </div>

                    {/* Faculties and Programs */}
                    <div className="space-y-4">
                      {university.faculties.map((faculty) => (
                        <div
                          key={faculty.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center mb-3">
                            <BuildingLibraryIcon className="w-5 h-5 mr-2 text-blue-600" />
                            <h4 className="font-medium text-gray-900">
                              {faculty.name}
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {faculty.programs.map((program, index) => (
                              <ProgramCard
                                key={index}
                                program={program}
                                showEnhancedData={true}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="justify-center"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchPage;
