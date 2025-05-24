import { Program } from "../types";
import { AcademicCapIcon, UserGroupIcon } from "@heroicons/react/24/outline";

interface ProgramCardProps {
  program: Program;
  showEnhancedData?: boolean;
}

const ProgramCard = ({
  program,
  showEnhancedData = true,
}: ProgramCardProps) => {
  const { yokData2024 } = program;

  const getScoreTypeColor = (scoreType: string) => {
    switch (scoreType) {
      case "SAY":
        return "bg-blue-100 text-blue-800";
      case "EA":
        return "bg-green-100 text-green-800";
      case "SÖZ":
        return "bg-purple-100 text-purple-800";
      case "DİL":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatScore = (score: number | null) => {
    return score ? score.toFixed(2) : "N/A";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 flex-1 pr-2">
          {program.name}
        </h4>
        <div className="flex gap-2">
          {yokData2024 && (
            <>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  yokData2024.programType === "lisans"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {yokData2024.programType === "lisans" ? "Lisans" : "Önlisans"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreTypeColor(
                  yokData2024.scoreType
                )}`}
              >
                {yokData2024.scoreType}
              </span>
            </>
          )}
        </div>
      </div>

      {showEnhancedData && yokData2024 && (
        <div className="space-y-3">
          {/* Program Code */}
          <div className="flex items-center text-sm text-gray-600">
            <AcademicCapIcon className="w-4 h-4 mr-2" />
            <span>Kod: {yokData2024.programCode}</span>
          </div>

          {/* General Quota Information */}
          {yokData2024.quota.general.total && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <UserGroupIcon className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium text-sm">Genel Kontenjan</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Kontenjan:</span>
                  <span className="ml-1 font-medium">
                    {yokData2024.quota.general.total}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Yerleşen:</span>
                  <span className="ml-1 font-medium">
                    {yokData2024.quota.general.placed || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Min Puan:</span>
                  <span className="ml-1 font-medium">
                    {formatScore(yokData2024.quota.general.minScore)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Max Puan:</span>
                  <span className="ml-1 font-medium">
                    {formatScore(yokData2024.quota.general.maxScore)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Special Quotas */}
          <div className="space-y-2">
            {yokData2024.quota.schoolFirst.total &&
              yokData2024.quota.schoolFirst.total > 0 && (
                <div className="flex items-center justify-between text-xs bg-blue-50 px-2 py-1 rounded">
                  <span className="text-blue-700">Okul Birincisi</span>
                  <span className="font-medium">
                    {yokData2024.quota.schoolFirst.total} kontenjan
                  </span>
                </div>
              )}

            {yokData2024.quota.womenOver34.total &&
              yokData2024.quota.womenOver34.total > 0 && (
                <div className="flex items-center justify-between text-xs bg-pink-50 px-2 py-1 rounded">
                  <span className="text-pink-700">34+ Yaş Kadın</span>
                  <span className="font-medium">
                    {yokData2024.quota.womenOver34.total} kontenjan
                  </span>
                </div>
              )}

            {yokData2024.quota.earthquake.total &&
              yokData2024.quota.earthquake.total > 0 && (
                <div className="flex items-center justify-between text-xs bg-red-50 px-2 py-1 rounded">
                  <span className="text-red-700">Deprem</span>
                  <span className="font-medium">
                    {yokData2024.quota.earthquake.total} kontenjan
                  </span>
                </div>
              )}

            {yokData2024.quota.veteran.total &&
              yokData2024.quota.veteran.total > 0 && (
                <div className="flex items-center justify-between text-xs bg-green-50 px-2 py-1 rounded">
                  <span className="text-green-700">Gazi/Şehit</span>
                  <span className="font-medium">
                    {yokData2024.quota.veteran.total} kontenjan
                  </span>
                </div>
              )}
          </div>
        </div>
      )}

      {!yokData2024 && showEnhancedData && (
        <div className="text-xs text-gray-500 italic">
          Bu program için 2024 YÖK verisi bulunmamaktadır.
        </div>
      )}
    </div>
  );
};

export default ProgramCard;
