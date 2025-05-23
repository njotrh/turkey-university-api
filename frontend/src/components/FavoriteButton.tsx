import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useFavorites } from "../hooks/useFavorites";
import { University } from "../types";

interface FavoriteButtonProps {
  university: University;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const FavoriteButton = ({
  university,
  size = "md",
  showText = false,
  className = "",
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isUniversityFavorite = isFavorite(university.id);

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
    toggleFavorite(university);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${buttonSizeClasses[size]}
        ${
          isUniversityFavorite
            ? "text-red-500 hover:text-red-600"
            : "text-gray-400 hover:text-red-500"
        }
        transition-colors duration-200
        ${className}
      `}
      title={isUniversityFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      <div className="flex items-center gap-1">
        {isUniversityFavorite ? (
          <HeartIconSolid className={sizeClasses[size]} />
        ) : (
          <HeartIcon className={sizeClasses[size]} />
        )}
        {showText && (
          <span className="text-sm font-medium">
            {isUniversityFavorite ? "Favorilerde" : "Favorile"}
          </span>
        )}
      </div>
    </button>
  );
};

export default FavoriteButton;
