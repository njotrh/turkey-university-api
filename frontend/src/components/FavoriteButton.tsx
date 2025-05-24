import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useFavorites } from "../hooks/useFavorites";
import { University } from "../types";
import { getUniversityById } from "../services/api";

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
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
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

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add a small animation effect
    const button = e.currentTarget as HTMLButtonElement;
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);

    if (isUniversityFavorite) {
      removeFromFavorites(university.id);
    } else {
      // Check if university data is complete (not empty strings)
      const isDataComplete =
        university.website &&
        university.address &&
        university.logo &&
        university.website.trim() !== "" &&
        university.address.trim() !== "" &&
        university.logo.trim() !== "";

      if (isDataComplete) {
        addToFavorites(university);
      } else {
        // Fetch complete university data from API
        try {
          const completeUniversity = await getUniversityById(university.id);
          addToFavorites(completeUniversity);
        } catch (error) {
          console.error("Error fetching complete university data:", error);
          // Fallback: add with existing data
          addToFavorites(university);
        }
      }
    }
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
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
        rounded-lg
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
