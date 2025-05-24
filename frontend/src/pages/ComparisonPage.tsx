import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getUniversityById } from "../services/api";
import { University, Program } from "../types";
import {
  GlobeAltIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import ExportButton from "../components/ExportButton";

const ComparisonPage = () => {
  const [searchParams] = useSearchParams();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileCards, setShowMobileCards] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [commonPrograms, setCommonPrograms] = useState<string[]>([]);
  const [showProgramComparison, setShowProgramComparison] = useState(false);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setLoading(true);
        setError(null);

        const idsParam = searchParams.get("ids");
        if (!idsParam) {
          setError("Karşılaştırılacak üniversite ID'leri belirtilmemiş.");
          return;
        }

        const ids = idsParam
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));

        if (ids.length === 0) {
          setError("Geçerli üniversite ID'leri bulunamadı.");
          return;
        }

        if (ids.length < 2) {
          setError("Karşılaştırma için en az 2 üniversite gereklidir.");
          return;
        }

        if (ids.length > 3) {
          setError("Maksimum 3 üniversite karşılaştırılabilir.");
          return;
        }

        const universityPromises = ids.map((id) => getUniversityById(id));
        const loadedUniversities = await Promise.all(universityPromises);

        setUniversities(loadedUniversities);

        // Find common programs across all universities
        const allPrograms = loadedUniversities.map((uni) =>
          uni.faculties.flatMap((faculty) =>
            faculty.programs.map((program) => program.name.toLowerCase().trim())
          )
        );

        if (allPrograms.length > 0) {
          const common = allPrograms[0].filter((program) =>
            allPrograms.every((uniPrograms) => uniPrograms.includes(program))
          );

          // Remove duplicates and sort
          const uniqueCommon = [...new Set(common)].sort();
          setCommonPrograms(uniqueCommon);
        }
      } catch (err) {
        console.error("Error loading universities for comparison:", err);
        setError("Üniversite bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadUniversities();
  }, [searchParams]);

  // Check scroll position and update scroll indicators
  const checkScrollPosition = () => {
    if (tableScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);

      // Calculate current position as percentage
      const scrollPercentage =
        scrollWidth > clientWidth
          ? (scrollLeft / (scrollWidth - clientWidth)) * 100
          : 0;
      setCurrentScrollPosition(scrollPercentage);
    }
  };

  // Handle scroll events
  useEffect(() => {
    const scrollElement = tableScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollPosition);
      // Initial check
      checkScrollPosition();

      return () => {
        scrollElement.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, [universities]);

  // Scroll functions
  const scrollLeft = () => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Handle program selection for comparison
  const handleProgramSelection = (programName: string) => {
    setSelectedProgram(programName);
    setShowProgramComparison(true);
  };

  // Get program data for a specific university
  const getProgramDataForUniversity = (
    university: University,
    programName: string
  ): Program | null => {
    for (const faculty of university.faculties) {
      const program = faculty.programs.find(
        (p) => p.name.toLowerCase().trim() === programName.toLowerCase().trim()
      );
      if (program) return program;
    }
    return null;
  };

  // Get faculty name for a program in a university
  const getFacultyNameForProgram = (
    university: University,
    programName: string
  ): string => {
    for (const faculty of university.faculties) {
      const hasProgram = faculty.programs.some(
        (p) => p.name.toLowerCase().trim() === programName.toLowerCase().trim()
      );
      if (hasProgram) return faculty.name;
    }
    return "Bilinmiyor";
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">
            Karşılaştırma yükleniyor...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Hata</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/universities"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Üniversitelere Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">
            Karşılaştırılacak üniversite bulunamadı.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              to="/universities"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-3 sm:mb-4 text-sm sm:text-base"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Üniversitelere Dön
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Üniversite Karşılaştırması
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {universities.length} üniversite karşılaştırılıyor
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <ExportButton
              comparisonData={{
                universities,
                selectedProgram: showProgramComparison
                  ? selectedProgram
                  : undefined,
                programComparisonData:
                  showProgramComparison && selectedProgram
                    ? universities.map((uni) =>
                        getProgramDataForUniversity(uni, selectedProgram)
                      )
                    : undefined,
              }}
              filename="university-comparison"
              label="Karşılaştırmayı Dışa Aktar"
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Mobile View Toggle */}
      <div className="mb-4 sm:hidden">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <DevicePhoneMobileIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">Mobil Görünüm</span>
          </div>
          <button
            onClick={() => setShowMobileCards(!showMobileCards)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              showMobileCards
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-200"
            }`}
          >
            {showMobileCards ? "Tablo Görünümü" : "Kart Görünümü"}
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      {showMobileCards ? (
        <div className="sm:hidden space-y-4">
          {universities.map((university, index) => (
            <div
              key={university.id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {university.logo ? (
                    <img
                      src={university.logo}
                      alt={`${university.name} Logo`}
                      className="w-10 h-10 object-contain flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full flex-shrink-0">
                      <BuildingLibraryIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {university.name}
                    </h3>
                    <p className="text-xs text-gray-500">{university.city}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {index + 1} / {universities.length}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">
                    Üniversite Türü
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      university.type.toLowerCase().includes("devlet")
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {university.type}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">
                    Web Sitesi
                  </span>
                  {university.website ? (
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline text-sm"
                    >
                      Ziyaret Et
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">Belirtilmemiş</span>
                  )}
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">
                    Fakülte Sayısı
                  </span>
                  <span className="font-semibold text-blue-600">
                    {university.faculties.length}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">
                    Program Sayısı
                  </span>
                  <span className="font-semibold text-green-600">
                    {university.faculties.reduce(
                      (total, faculty) => total + faculty.programs.length,
                      0
                    )}
                  </span>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/universities/${university.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Table View with Scroll Indicators */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Mobile Scroll Hint */}
            <div className="sm:hidden bg-yellow-50 border-b border-yellow-200 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-yellow-800">
                    Kaydırarak diğer üniversiteleri görüntüleyin
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Progress Bar */}
                  <div className="w-12 h-1 bg-yellow-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-300 ease-out"
                      style={{ width: `${currentScrollPosition}%` }}
                    />
                  </div>
                  {/* Dots Indicator */}
                  <div className="flex items-center space-x-1">
                    {universities.map((_, index) => {
                      const isActive =
                        Math.floor(
                          (currentScrollPosition / 100) * universities.length
                        ) === index;
                      return (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            isActive ? "bg-yellow-600" : "bg-yellow-300"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Controls */}
            <div className="relative">
              {/* Left Scroll Button */}
              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors sm:hidden"
                  aria-label="Sola kaydır"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                </button>
              )}

              {/* Right Scroll Button */}
              {canScrollRight && (
                <button
                  onClick={scrollRight}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors sm:hidden"
                  aria-label="Sağa kaydır"
                >
                  <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                </button>
              )}

              <div ref={tableScrollRef} className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-900 w-32 sm:w-48">
                        Özellik
                      </th>
                      {universities.map((university) => (
                        <th
                          key={university.id}
                          className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-900 min-w-48 sm:min-w-64"
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            {university.logo ? (
                              <img
                                src={university.logo}
                                alt={`${university.name} Logo`}
                                className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 flex items-center justify-center rounded-full flex-shrink-0">
                                <BuildingLibraryIcon className="w-4 h-4 sm:w-6 sm:h-6 text-gray-500" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate text-xs sm:text-sm">
                                {university.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {university.city}
                              </p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* University Type */}
                    <tr>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 bg-gray-50">
                        Üniversite Türü
                      </td>
                      {universities.map((university) => (
                        <td
                          key={university.id}
                          className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700"
                        >
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              university.type.toLowerCase().includes("devlet")
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {university.type}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* City */}
                    <tr>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 bg-gray-50">
                        <div className="flex items-center">
                          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Şehir
                        </div>
                      </td>
                      {universities.map((university) => (
                        <td
                          key={university.id}
                          className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700"
                        >
                          {university.city}
                        </td>
                      ))}
                    </tr>

                    {/* Website */}
                    <tr>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 bg-gray-50">
                        <div className="flex items-center">
                          <GlobeAltIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Web Sitesi
                        </div>
                      </td>
                      {universities.map((university) => (
                        <td
                          key={university.id}
                          className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700"
                        >
                          {university.website ? (
                            <a
                              href={university.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 underline text-xs sm:text-sm"
                            >
                              Ziyaret Et
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs sm:text-sm">
                              Belirtilmemiş
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Faculty Count */}
                    <tr>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 bg-gray-50">
                        <div className="flex items-center">
                          <BuildingLibraryIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Fakülte Sayısı
                          </span>
                          <span className="sm:hidden">Fakülte</span>
                        </div>
                      </td>
                      {universities.map((university) => (
                        <td
                          key={university.id}
                          className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700"
                        >
                          <span className="font-semibold text-blue-600">
                            {university.faculties.length}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Program Count */}
                    <tr>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 bg-gray-50">
                        <div className="flex items-center">
                          <AcademicCapIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Toplam Program Sayısı
                          </span>
                          <span className="sm:hidden">Program</span>
                        </div>
                      </td>
                      {universities.map((university) => (
                        <td
                          key={university.id}
                          className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700"
                        >
                          <span className="font-semibold text-green-600">
                            {university.faculties.reduce(
                              (total, faculty) =>
                                total + faculty.programs.length,
                              0
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Actions */}
                    <tr>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 bg-gray-50">
                        İşlemler
                      </td>
                      {universities.map((university) => (
                        <td
                          key={university.id}
                          className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700"
                        >
                          <Link
                            to={`/universities/${university.id}`}
                            className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <span className="hidden sm:inline">
                              Detayları Gör
                            </span>
                            <span className="sm:hidden">Detay</span>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Program Comparison Section */}
      {commonPrograms.length > 0 && (
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Program Karşılaştırması
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Ortak programları karşılaştırarak YÖK 2024 verilerini inceleyin
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {/* Program Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Karşılaştırılacak Programı Seçin ({commonPrograms.length} ortak
                program)
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => handleProgramSelection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Program seçiniz...</option>
                {commonPrograms.map((program, index) => (
                  <option key={index} value={program}>
                    {program.charAt(0).toUpperCase() + program.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Program Comparison Results */}
            {showProgramComparison && selectedProgram && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {selectedProgram.charAt(0).toUpperCase() +
                      selectedProgram.slice(1)}{" "}
                    - Program Karşılaştırması
                  </h3>
                  <p className="text-sm text-blue-700">
                    Seçilen program için üniversiteler arası YÖK 2024
                    verilerinin karşılaştırması
                  </p>
                </div>

                {/* Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universities.map((university) => {
                    const programData = getProgramDataForUniversity(
                      university,
                      selectedProgram
                    );
                    const facultyName = getFacultyNameForProgram(
                      university,
                      selectedProgram
                    );

                    return (
                      <div
                        key={university.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        {/* University Header */}
                        <div className="flex items-center space-x-3 mb-4">
                          {university.logo ? (
                            <img
                              src={university.logo}
                              alt={`${university.name} Logo`}
                              className="w-8 h-8 object-contain flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full flex-shrink-0">
                              <BuildingLibraryIcon className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {university.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {facultyName}
                            </p>
                          </div>
                        </div>

                        {/* Program Data */}
                        {programData?.yokData2024 ? (
                          <div className="space-y-3">
                            {/* Program Type and Score Type */}
                            <div className="flex gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  programData.yokData2024.programType ===
                                  "lisans"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {programData.yokData2024.programType ===
                                "lisans"
                                  ? "Lisans"
                                  : "Önlisans"}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {programData.yokData2024.scoreType}
                              </span>
                            </div>

                            {/* Program Code */}
                            <div className="text-sm">
                              <span className="text-gray-600">
                                Program Kodu:
                              </span>
                              <span className="ml-2 font-medium">
                                {programData.yokData2024.programCode}
                              </span>
                            </div>

                            {/* General Quota Info */}
                            {programData.yokData2024.quota.general.total && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h5 className="font-medium text-sm mb-2">
                                  Genel Kontenjan
                                </h5>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-600">
                                      Kontenjan:
                                    </span>
                                    <span className="ml-1 font-medium">
                                      {
                                        programData.yokData2024.quota.general
                                          .total
                                      }
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Yerleşen:
                                    </span>
                                    <span className="ml-1 font-medium">
                                      {programData.yokData2024.quota.general
                                        .placed || 0}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Min Puan:
                                    </span>
                                    <span className="ml-1 font-medium">
                                      {programData.yokData2024.quota.general.minScore?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Max Puan:
                                    </span>
                                    <span className="ml-1 font-medium">
                                      {programData.yokData2024.quota.general.maxScore?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Special Quotas */}
                            <div className="space-y-1">
                              {programData.yokData2024.quota.schoolFirst
                                .total &&
                                programData.yokData2024.quota.schoolFirst
                                  .total > 0 && (
                                  <div className="flex justify-between text-xs bg-blue-50 px-2 py-1 rounded">
                                    <span className="text-blue-700">
                                      Okul Birincisi
                                    </span>
                                    <span className="font-medium">
                                      {
                                        programData.yokData2024.quota
                                          .schoolFirst.total
                                      }
                                    </span>
                                  </div>
                                )}
                              {programData.yokData2024.quota.womenOver34
                                .total &&
                                programData.yokData2024.quota.womenOver34
                                  .total > 0 && (
                                  <div className="flex justify-between text-xs bg-pink-50 px-2 py-1 rounded">
                                    <span className="text-pink-700">
                                      34+ Yaş Kadın
                                    </span>
                                    <span className="font-medium">
                                      {
                                        programData.yokData2024.quota
                                          .womenOver34.total
                                      }
                                    </span>
                                  </div>
                                )}
                              {programData.yokData2024.quota.earthquake.total &&
                                programData.yokData2024.quota.earthquake.total >
                                  0 && (
                                  <div className="flex justify-between text-xs bg-red-50 px-2 py-1 rounded">
                                    <span className="text-red-700">Deprem</span>
                                    <span className="font-medium">
                                      {
                                        programData.yokData2024.quota.earthquake
                                          .total
                                      }
                                    </span>
                                  </div>
                                )}
                              {programData.yokData2024.quota.veteran.total &&
                                programData.yokData2024.quota.veteran.total >
                                  0 && (
                                  <div className="flex justify-between text-xs bg-green-50 px-2 py-1 rounded">
                                    <span className="text-green-700">
                                      Gazi/Şehit
                                    </span>
                                    <span className="font-medium">
                                      {
                                        programData.yokData2024.quota.veteran
                                          .total
                                      }
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">
                              Bu program için YÖK 2024 verisi bulunmamaktadır.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Faculty Comparison */}
      <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Fakülte Detayları
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {universities.map((university) => (
              <div
                key={university.id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  {university.logo ? (
                    <img
                      src={university.logo}
                      alt={`${university.name} Logo`}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 flex items-center justify-center rounded-full flex-shrink-0">
                      <BuildingLibraryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                    {university.name}
                  </h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {university.faculties.slice(0, 5).map((faculty, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-200 pl-2 sm:pl-3"
                    >
                      <h4 className="font-medium text-xs sm:text-sm text-gray-800 mb-1">
                        {faculty.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {faculty.programs.length} program
                      </p>
                    </div>
                  ))}

                  {university.faculties.length > 5 && (
                    <div className="text-center pt-2">
                      <Link
                        to={`/universities/${university.id}`}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        +{university.faculties.length - 5} fakülte daha...
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
