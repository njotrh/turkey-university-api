import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useComparison } from "../hooks/useComparison";
import {
  XMarkIcon,
  ScaleIcon,
  EyeIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const ComparisonPanel = () => {
  const navigate = useNavigate();
  const {
    comparison,
    isComparing,
    removeFromComparison,
    clearComparison,
    getComparisonCount,
  } = useComparison();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!isComparing) {
    return null;
  }

  const exportComparison = () => {
    const comparisonData = {
      timestamp: new Date().toISOString(),
      universities: comparison.map((uni) => ({
        name: uni.name,
        type: uni.type,
        city: uni.city,
        website: uni.website,
        facultyCount: uni.faculties.length,
        programCount: uni.faculties.reduce(
          (total, faculty) => total + faculty.programs.length,
          0
        ),
      })),
    };

    const dataStr = JSON.stringify(comparisonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `university-comparison-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 z-50">
      {/* Comparison Button */}
      <div className="bg-blue-600 text-white rounded-lg shadow-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 hover:bg-blue-700 transition-colors rounded-lg"
        >
          <ScaleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium text-sm sm:text-base">
            <span className="hidden sm:inline">
              Karşılaştır ({getComparisonCount()})
            </span>
            <span className="sm:hidden">({getComparisonCount()})</span>
          </span>
          {isExpanded ? (
            <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 w-80 sm:w-96 max-h-80 sm:max-h-96 overflow-y-auto">
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  <span className="hidden sm:inline">
                    Üniversite Karşılaştırması
                  </span>
                  <span className="sm:hidden">Karşılaştırma</span>
                </h3>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={exportComparison}
                    className="p-1 sm:p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Karşılaştırmayı İndir"
                  >
                    <DocumentArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={clearComparison}
                    className="p-1 sm:p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Tümünü Temizle"
                  >
                    <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {comparison.map((university) => (
                <div
                  key={university.id}
                  className="border border-gray-200 rounded-lg p-2 sm:p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                        {university.name}
                      </h4>
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Tür:</span>{" "}
                          {university.type}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Şehir:</span>{" "}
                          {university.city}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Fakülteler:</span>{" "}
                          {university.faculties.length}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Programlar:</span>{" "}
                          {university.faculties.reduce(
                            (total, faculty) => total + faculty.programs.length,
                            0
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromComparison(university.id)}
                      className="ml-1 sm:ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                      title="Karşılaştırmadan Çıkar"
                    >
                      <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {comparison.length >= 2 && (
                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      // Navigate to detailed comparison page
                      navigate(
                        `/comparison?ids=${comparison
                          .map((u) => u.id)
                          .join(",")}`
                      );
                      setIsExpanded(false);
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                  >
                    <span className="hidden sm:inline">
                      Detaylı Karşılaştırma Görüntüle
                    </span>
                    <span className="sm:hidden">Detaylı Görüntüle</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonPanel;
