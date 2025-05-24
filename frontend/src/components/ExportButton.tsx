import { useState } from "react";
import {
  DocumentArrowDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { University, AdvancedSearchResult } from "../types";
import { useExport } from "../hooks/useExport";

interface ExportButtonProps {
  data?: University[];
  advancedSearchData?: AdvancedSearchResult;
  comparisonData?: {
    universities: University[];
    selectedProgram?: string;
    programComparisonData?: any[];
  };
  filename?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

const ExportButton = ({
  data,
  advancedSearchData,
  comparisonData,
  filename = "export",
  label = "Dışa Aktar",
  size = "md",
  variant = "outline",
  className = "",
}: ExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    exportToJSON,
    exportToCSV,
    exportComparison,
    exportAdvancedSearchToJSON,
    exportAdvancedSearchToCSV,
    exportComparisonToCSV,
  } = useExport();

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 border-blue-600",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 border-gray-600",
    outline: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const handleExport = (format: "json" | "csv") => {
    setIsOpen(false);

    try {
      // Handle different data types
      if (advancedSearchData) {
        switch (format) {
          case "json":
            exportAdvancedSearchToJSON(advancedSearchData, filename);
            break;
          case "csv":
            exportAdvancedSearchToCSV(advancedSearchData, filename);
            break;
        }
      } else if (comparisonData) {
        switch (format) {
          case "json":
            exportComparison(
              comparisonData.universities,
              comparisonData.selectedProgram,
              comparisonData.programComparisonData
            );
            break;
          case "csv":
            exportComparisonToCSV(
              comparisonData.universities,
              comparisonData.selectedProgram,
              comparisonData.programComparisonData,
              filename
            );
            break;
        }
      } else if (data) {
        switch (format) {
          case "json":
            exportToJSON(data, filename);
            break;
          case "csv":
            exportToCSV(data, filename);
            break;
        }
      } else {
        alert("Dışa aktarılacak veri bulunamadı.");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Dışa aktarma sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Determine data count for display
  const getDataCount = () => {
    if (advancedSearchData) return advancedSearchData.count;
    if (comparisonData) return comparisonData.universities.length;
    if (data) return data.length;
    return 0;
  };

  const dataCount = getDataCount();

  if (dataCount === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          border rounded-lg font-medium transition-colors
          flex items-center gap-2
          ${className}
        `}
      >
        <DocumentArrowDownIcon className={iconSizes[size]} />
        {label} ({dataCount})
        <ChevronDownIcon
          className={`${iconSizes[size]} transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={() => handleExport("json")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <span className="text-blue-600 font-mono text-xs">JSON</span>
                JSON Formatında İndir
              </button>

              <button
                onClick={() => handleExport("csv")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <span className="text-green-600 font-mono text-xs">CSV</span>
                Excel/CSV Formatında İndir
              </button>
            </div>

            <div className="border-t border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500">
                {dataCount}{" "}
                {advancedSearchData
                  ? "program"
                  : comparisonData
                  ? "üniversite karşılaştırması"
                  : "üniversite"}{" "}
                dışa aktarılacak
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
