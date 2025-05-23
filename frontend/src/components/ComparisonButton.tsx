import { ScaleIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useComparison } from "../hooks/useComparison";
import { University } from "../types";

interface ComparisonButtonProps {
  university: University;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const ComparisonButton = ({
  university,
  size = "md",
  showText = false,
  className = "",
}: ComparisonButtonProps) => {
  const { isInComparison, addToComparison, removeFromComparison, canAddMore } =
    useComparison();

  const isUniversityInComparison = isInComparison(university.id);
  const canAdd = canAddMore();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const buttonSizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUniversityInComparison) {
      removeFromComparison(university.id);
    } else if (canAdd) {
      addToComparison(university);
    }
  };

  const getButtonColor = () => {
    if (isUniversityInComparison) {
      return "text-green-500 hover:text-green-600";
    } else if (canAdd) {
      return "text-gray-400 hover:text-blue-500";
    } else {
      return "text-gray-300 cursor-not-allowed";
    }
  };

  const getTitle = () => {
    if (isUniversityInComparison) {
      return "Karşılaştırmadan çıkar";
    } else if (canAdd) {
      return "Karşılaştırmaya ekle";
    } else {
      return "Maksimum 3 üniversite karşılaştırılabilir";
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!canAdd && !isUniversityInComparison}
      className={`
        ${buttonSizeClasses[size]}
        ${getButtonColor()}
        transition-colors duration-200
        ${className}
      `}
      title={getTitle()}
    >
      <div className="flex items-center gap-1">
        {isUniversityInComparison ? (
          <CheckIcon className={sizeClasses[size]} />
        ) : (
          <ScaleIcon className={sizeClasses[size]} />
        )}
        {showText && (
          <span className="text-sm font-medium hidden sm:inline">
            {isUniversityInComparison ? "Karşılaştırmada" : "Karşılaştır"}
          </span>
        )}
      </div>
    </button>
  );
};

export default ComparisonButton;
