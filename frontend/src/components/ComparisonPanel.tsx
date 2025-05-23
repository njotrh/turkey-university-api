import { useState } from "react";
import { useComparison } from "../hooks/useComparison";
import {
  XMarkIcon,
  ScaleIcon,
  EyeIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const ComparisonPanel = () => {
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
    <div className="fixed bottom-4 right-4 z-50">
      {/* Comparison Button */}
      <div className="bg-blue-600 text-white rounded-lg shadow-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-3 hover:bg-blue-700 transition-colors rounded-lg"
        >
          <ScaleIcon className="w-5 h-5" />
          <span className="font-medium">
            Karşılaştır ({getComparisonCount()})
          </span>
          {isExpanded ? (
            <XMarkIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Üniversite Karşılaştırması
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={exportComparison}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Karşılaştırmayı İndir"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearComparison}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Tümünü Temizle"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {comparison.map((university) => (
                <div
                  key={university.id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
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
                      className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Karşılaştırmadan Çıkar"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {comparison.length >= 2 && (
                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      // Navigate to detailed comparison page
                      window.open(
                        `/comparison?ids=${comparison
                          .map((u) => u.id)
                          .join(",")}`,
                        "_blank"
                      );
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Detaylı Karşılaştırma Görüntüle
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
