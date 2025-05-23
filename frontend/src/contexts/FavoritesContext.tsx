import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { University } from "../types";

const FAVORITES_STORAGE_KEY = "university-favorites";

interface FavoritesContextType {
  favorites: University[];
  addToFavorites: (university: University) => void;
  removeFromFavorites: (universityId: number) => void;
  toggleFavorite: (university: University) => void;
  isFavorite: (universityId: number) => boolean;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
  getFavoritesByCity: (city: string) => University[];
  getFavoritesByType: (type: string) => University[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<University[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed || []);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save favorites to localStorage whenever they change (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const addToFavorites = (university: University) => {
    setFavorites((prev) => {
      // Check if university is already in favorites
      if (prev.some((fav) => fav.id === university.id)) {
        return prev;
      }
      return [...prev, university];
    });
  };

  const removeFromFavorites = (universityId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== universityId));
  };

  const toggleFavorite = (university: University) => {
    if (isFavorite(university.id)) {
      removeFromFavorites(university.id);
    } else {
      addToFavorites(university);
    }
  };

  const isFavorite = (universityId: number) => {
    return favorites.some((fav) => fav.id === universityId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  const getFavoritesByCity = (city: string) => {
    return favorites.filter((fav) =>
      fav.city
        .toLocaleLowerCase("tr-TR")
        .includes(city.toLocaleLowerCase("tr-TR"))
    );
  };

  const getFavoritesByType = (type: string) => {
    return favorites.filter((fav) =>
      fav.type
        .toLocaleLowerCase("tr-TR")
        .includes(type.toLocaleLowerCase("tr-TR"))
    );
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    getFavoritesCount,
    getFavoritesByCity,
    getFavoritesByType,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavoritesContext must be used within a FavoritesProvider");
  }
  return context;
};
