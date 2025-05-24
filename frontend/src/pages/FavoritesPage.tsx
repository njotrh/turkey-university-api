import { useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import UniversityCard from "../components/UniversityCard";
import ExportButton from "../components/ExportButton";
import {
  HeartIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const FavoritesPage = () => {
  const { favorites, clearFavorites, getFavoritesCount } = useFavorites();

  const [filter, setFilter] = useState<"all" | "devlet" | "vakif">("all");
  const [cityFilter, setCityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique cities from favorites
  const uniqueCities = Array.from(
    new Set(favorites.map((uni) => uni.city))
  ).sort();

  // Filter favorites based on selected filters
  const filteredFavorites = favorites.filter((university) => {
    const matchesType =
      filter === "all" ||
      university.type.toLocaleLowerCase("tr-TR").includes(filter);

    const matchesCity =
      !cityFilter ||
      university.city
        .toLocaleLowerCase("tr-TR")
        .includes(cityFilter.toLocaleLowerCase("tr-TR"));

    const matchesSearch =
      !searchQuery ||
      university.name
        .toLocaleLowerCase("tr-TR")
        .includes(searchQuery.toLocaleLowerCase("tr-TR")) ||
      university.city
        .toLocaleLowerCase("tr-TR")
        .includes(searchQuery.toLocaleLowerCase("tr-TR"));

    return matchesType && matchesCity && matchesSearch;
  });

  if (favorites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Henüz Favori Üniversiteniz Yok
          </h1>
          <p className="text-gray-600 mb-6">
            Üniversite kartlarındaki kalp simgesine tıklayarak favori
            üniversitelerinizi ekleyebilirsiniz.
          </p>
          <a
            href="/universities"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Üniversiteleri Keşfet
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Favori Üniversitelerim
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {getFavoritesCount()} favori üniversiteniz var
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <ExportButton
                data={favorites}
                filename="favori-universiteler"
                label="Favorileri Dışa Aktar"
                size="sm"
              />
              <button
                onClick={clearFavorites}
                className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base"
              >
                <TrashIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Tümünü Temizle</span>
                <span className="sm:hidden">Temizle</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          <span className="text-sm sm:text-base font-medium text-gray-700">
            Filtreler
          </span>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Üniversite Ara
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Üniversite adı veya şehir ile ara..."
              className="w-full pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Üniversite Türü
            </label>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "devlet" | "vakif")
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tümü</option>
              <option value="devlet">Devlet</option>
              <option value="vakif">Vakıf</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Şehir
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Şehirler</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-8 px-4">
          <p className="text-sm sm:text-base text-gray-600">
            Seçilen filtrelere uygun favori üniversite bulunamadı.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 px-1">
            <p className="text-xs sm:text-sm text-gray-600">
              {filteredFavorites.length} üniversite gösteriliyor
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredFavorites.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
