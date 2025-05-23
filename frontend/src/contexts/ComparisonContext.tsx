import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { University } from "../types";

const COMPARISON_STORAGE_KEY = "university-comparison";
const MAX_COMPARISON_ITEMS = 3;

interface ComparisonState {
  universities: University[];
  isComparing: boolean;
}

interface ComparisonContextType {
  comparison: University[];
  isComparing: boolean;
  addToComparison: (university: University) => void;
  removeFromComparison: (universityId: number) => void;
  clearComparison: () => void;
  isInComparison: (universityId: number) => boolean;
  canAddMore: () => boolean;
  getComparisonCount: () => number;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

interface ComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const [comparison, setComparison] = useState<ComparisonState>({
    universities: [],
    isComparing: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load comparison data from localStorage on mount
  useEffect(() => {
    const savedComparison = localStorage.getItem(COMPARISON_STORAGE_KEY);
    if (savedComparison) {
      try {
        const parsed = JSON.parse(savedComparison);
        setComparison({
          universities: parsed.universities || [],
          isComparing: parsed.isComparing || false,
        });
      } catch (error) {
        console.error("Error loading comparison data:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save comparison data to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparison));
    }
  }, [comparison, isInitialized]);

  const addToComparison = (university: University) => {
    setComparison((prev) => {
      // Check if university is already in comparison
      if (prev.universities.some((uni) => uni.id === university.id)) {
        return prev;
      }

      // Check if we've reached the maximum
      if (prev.universities.length >= MAX_COMPARISON_ITEMS) {
        return prev;
      }

      return {
        ...prev,
        universities: [...prev.universities, university],
        isComparing: true,
      };
    });
  };

  const removeFromComparison = (universityId: number) => {
    setComparison((prev) => {
      const newUniversities = prev.universities.filter(
        (uni) => uni.id !== universityId
      );
      return {
        universities: newUniversities,
        isComparing: newUniversities.length > 0,
      };
    });
  };

  const clearComparison = () => {
    setComparison({
      universities: [],
      isComparing: false,
    });
  };

  const isInComparison = (universityId: number) => {
    return comparison.universities.some((uni) => uni.id === universityId);
  };

  const canAddMore = () => {
    return comparison.universities.length < MAX_COMPARISON_ITEMS;
  };

  const getComparisonCount = () => {
    return comparison.universities.length;
  };

  const value: ComparisonContextType = {
    comparison: comparison.universities,
    isComparing: comparison.isComparing,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore,
    getComparisonCount,
    maxItems: MAX_COMPARISON_ITEMS,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparisonContext = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparisonContext must be used within a ComparisonProvider");
  }
  return context;
};
