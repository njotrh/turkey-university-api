import { University, AdvancedSearchResult } from "../types";

export const useExport = () => {
  const exportToJSON = (
    data: University[],
    filename: string = "universities"
  ) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalCount: data.length,
      universities: data.map((uni) => ({
        id: uni.id,
        name: uni.name,
        type: uni.type,
        city: uni.city,
        website: uni.website,
        address: uni.address,
        facultyCount: uni.faculties.length,
        programCount: uni.faculties.reduce(
          (total, faculty) => total + faculty.programs.length,
          0
        ),
        faculties: uni.faculties.map((faculty) => ({
          id: faculty.id,
          name: faculty.name,
          programCount: faculty.programs.length,
          programs: faculty.programs.map((program) => ({
            name: program.name,
          })),
        })),
      })),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (
    data: University[],
    filename: string = "universities"
  ) => {
    const csvHeaders = [
      "ID",
      "Üniversite Adı",
      "Tür",
      "Şehir",
      "Website",
      "Adres",
      "Fakülte Sayısı",
      "Program Sayısı",
    ];

    const csvRows = data.map((uni) => [
      uni.id,
      `"${uni.name}"`,
      `"${uni.type}"`,
      `"${uni.city}"`,
      `"${uni.website || ""}"`,
      `"${uni.address.replace(/"/g, '""')}"`,
      uni.faculties.length,
      uni.faculties.reduce(
        (total, faculty) => total + faculty.programs.length,
        0
      ),
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const dataBlob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export advanced search results with criteria
  const exportAdvancedSearchToJSON = (
    searchResult: AdvancedSearchResult,
    filename: string = "advanced-search-results"
  ) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      searchCriteria: {
        universityTypes: searchResult.filters.universityTypes,
        cities: searchResult.filters.cities,
        programTypes: searchResult.filters.programTypes,
        scoreTypes: searchResult.filters.scoreTypes,
        facultyCategories: searchResult.filters.facultyCategories,
        scoreRange: searchResult.filters.scoreRange,
        quotaRange: searchResult.filters.quotaRange,
        programName: searchResult.filters.programName,
      },
      sorting: searchResult.sorting,
      totalResults: searchResult.count,
      results: searchResult.results.map((result) => ({
        university: {
          id: result.id,
          name: result.name,
          type: result.type,
          city: result.city,
        },
        faculties: result.faculties.map((faculty) => ({
          id: faculty.id,
          name: faculty.name,
          programs: faculty.programs.map((program) => ({
            name: program.name,
            programCode: program.yokData2024?.programCode,
            programType: program.yokData2024?.programType,
            scoreType: program.yokData2024?.scoreType,
            minScore: program.yokData2024?.quota?.general?.minScore,
            maxScore: program.yokData2024?.quota?.general?.maxScore,
            quota: program.yokData2024?.quota,
          })),
        })),
      })),
    };

    const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAdvancedSearchToCSV = (
    searchResult: AdvancedSearchResult,
    filename: string = "advanced-search-results"
  ) => {
    try {
      // Validate input data
      if (
        !searchResult ||
        !searchResult.results ||
        !Array.isArray(searchResult.results)
      ) {
        console.error("Invalid search result data for CSV export");
        alert("Dışa aktarma için geçersiz veri. Lütfen tekrar deneyin.");
        return;
      }

      const csvHeaders = [
        "Üniversite ID",
        "Üniversite Adı",
        "Üniversite Türü",
        "Şehir",
        "Fakülte Adı",
        "Program Adı",
        "Program Kodu",
        "Program Türü",
        "Puan Türü",
        "Min Puan",
        "Max Puan",
        "Genel Kontenjan",
        "Yerleşen Sayısı",
      ];

      const csvRows: string[] = [];

      searchResult.results.forEach((result) => {
        if (!result.faculties || !Array.isArray(result.faculties)) {
          return; // Skip invalid faculty data
        }

        result.faculties.forEach((faculty) => {
          if (!faculty.programs || !Array.isArray(faculty.programs)) {
            return; // Skip invalid program data
          }

          faculty.programs.forEach((program) => {
            const quota = program.yokData2024?.quota?.general;
            const row = [
              result.id?.toString() || "",
              `"${result.name || ""}"`,
              `"${result.type || ""}"`,
              `"${result.city || ""}"`,
              `"${faculty.name || ""}"`,
              `"${program.name || ""}"`,
              `"${program.yokData2024?.programCode || ""}"`,
              `"${program.yokData2024?.programType || ""}"`,
              `"${program.yokData2024?.scoreType || ""}"`,
              quota?.minScore?.toString() || "",
              quota?.maxScore?.toString() || "",
              quota?.total?.toString() || "",
              quota?.placed?.toString() || "",
            ];
            csvRows.push(row.join(","));
          });
        });
      });

      // Format search criteria for better readability
      const formatSearchCriteria = () => {
        const criteria = [];

        if (searchResult.filters.programName) {
          criteria.push(`Program Adı: ${searchResult.filters.programName}`);
        }
        if (searchResult.filters.universityTypes) {
          criteria.push(
            `Üniversite Türleri: ${searchResult.filters.universityTypes}`
          );
        }
        if (searchResult.filters.cities) {
          criteria.push(`Şehirler: ${searchResult.filters.cities}`);
        }
        if (searchResult.filters.programTypes) {
          criteria.push(
            `Program Türleri: ${searchResult.filters.programTypes}`
          );
        }
        if (searchResult.filters.scoreTypes) {
          criteria.push(`Puan Türleri: ${searchResult.filters.scoreTypes}`);
        }
        if (searchResult.filters.facultyCategories) {
          criteria.push(
            `Fakülte Kategorileri: ${searchResult.filters.facultyCategories}`
          );
        }

        // Handle score range with proper formatting
        if (searchResult.filters.scoreRange) {
          const hasMinScore =
            searchResult.filters.scoreRange.min !== undefined &&
            searchResult.filters.scoreRange.min !== null;
          const hasMaxScore =
            searchResult.filters.scoreRange.max !== undefined &&
            searchResult.filters.scoreRange.max !== null;

          if (hasMinScore || hasMaxScore) {
            const minScore = hasMinScore
              ? searchResult.filters.scoreRange.min!.toString()
              : "Alt sınır yok";
            const maxScore = hasMaxScore
              ? searchResult.filters.scoreRange.max!.toString()
              : "Üst sınır yok";

            if (hasMinScore && hasMaxScore) {
              criteria.push(`Puan Aralığı: ${minScore} - ${maxScore}`);
            } else if (hasMinScore) {
              criteria.push(`Min Puan: ${minScore}`);
            } else if (hasMaxScore) {
              criteria.push(`Max Puan: ${maxScore}`);
            }
          }
        }

        // Handle quota range with proper formatting
        if (searchResult.filters.quotaRange) {
          const hasMinQuota =
            searchResult.filters.quotaRange.min !== undefined &&
            searchResult.filters.quotaRange.min !== null;
          const hasMaxQuota =
            searchResult.filters.quotaRange.max !== undefined &&
            searchResult.filters.quotaRange.max !== null;

          if (hasMinQuota || hasMaxQuota) {
            const minQuota = hasMinQuota
              ? searchResult.filters.quotaRange.min!.toString()
              : "Alt sınır yok";
            const maxQuota = hasMaxQuota
              ? searchResult.filters.quotaRange.max!.toString()
              : "Üst sınır yok";

            if (hasMinQuota && hasMaxQuota) {
              criteria.push(`Kontenjan Aralığı: ${minQuota} - ${maxQuota}`);
            } else if (hasMinQuota) {
              criteria.push(`Min Kontenjan: ${minQuota}`);
            } else if (hasMaxQuota) {
              criteria.push(`Max Kontenjan: ${maxQuota}`);
            }
          }
        }

        return criteria.length > 0 ? criteria : ["Tüm programlar"];
      };

      const searchCriteriaText = formatSearchCriteria();

      const csvContent = [
        `# Gelişmiş Arama Sonuçları - ${new Date().toLocaleString("tr-TR")}`,
        `# Toplam Sonuç: ${searchResult.count}`,
        `# Sıralama: ${searchResult.sorting.sortBy || "Varsayılan"} (${
          searchResult.sorting.sortOrder === "asc" ? "Artan" : "Azalan"
        })`,
        `#`,
        `# Arama Kriterleri:`,
        ...searchCriteriaText.map((criteria) => `# - ${criteria}`),
        `#`,
        "",
        csvHeaders.join(","),
        ...csvRows,
      ].join("\n");

      const dataBlob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting advanced search to CSV:", error);
      alert(
        "CSV dışa aktarma sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  // Enhanced comparison export with program details
  const exportComparison = (
    universities: University[],
    selectedProgram?: string,
    programComparisonData?: any[]
  ) => {
    const comparisonData = {
      exportDate: new Date().toISOString(),
      comparisonType: selectedProgram
        ? "program-comparison"
        : "university-comparison",
      selectedProgram: selectedProgram || null,
      universities: universities.map((uni) => {
        if (selectedProgram) {
          // Program comparison: only include the selected program
          const targetFaculty = uni.faculties.find((faculty) =>
            faculty.programs.some(
              (program) =>
                program.name.toLowerCase().trim() ===
                selectedProgram.toLowerCase().trim()
            )
          );

          const targetProgram = targetFaculty?.programs.find(
            (program) =>
              program.name.toLowerCase().trim() ===
              selectedProgram.toLowerCase().trim()
          );

          return {
            id: uni.id,
            name: uni.name,
            type: uni.type,
            city: uni.city,
            website: uni.website,
            selectedProgram: {
              name: targetProgram?.name || selectedProgram,
              faculty: targetFaculty?.name || "Bilinmiyor",
              programCode: targetProgram?.yokData2024?.programCode,
              programType: targetProgram?.yokData2024?.programType,
              scoreType: targetProgram?.yokData2024?.scoreType,
              minScore: targetProgram?.yokData2024?.quota?.general?.minScore,
              maxScore: targetProgram?.yokData2024?.quota?.general?.maxScore,
              quota: targetProgram?.yokData2024?.quota,
            },
          };
        } else {
          // University comparison: include all faculties and programs
          const programCount = uni.faculties.reduce(
            (total, faculty) => total + faculty.programs.length,
            0
          );

          return {
            id: uni.id,
            name: uni.name,
            type: uni.type,
            city: uni.city,
            website: uni.website,
            facultyCount: uni.faculties.length,
            programCount: programCount,
            faculties: uni.faculties.map((faculty) => ({
              name: faculty.name,
              programCount: faculty.programs.length,
              programs: faculty.programs.map((program) => ({
                name: program.name,
                programCode: program.yokData2024?.programCode,
                programType: program.yokData2024?.programType,
                scoreType: program.yokData2024?.scoreType,
                minScore: program.yokData2024?.quota?.general?.minScore,
                maxScore: program.yokData2024?.quota?.general?.maxScore,
                quota: program.yokData2024?.quota,
              })),
            })),
          };
        }
      }),
      programComparison:
        selectedProgram && programComparisonData
          ? {
              programName: selectedProgram,
              comparisonData: programComparisonData,
            }
          : null,
      summary: {
        totalUniversities: universities.length,
        byType: universities.reduce((acc, uni) => {
          const type = uni.type.toLowerCase().includes("devlet")
            ? "Devlet"
            : "Vakıf";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byCities: universities.reduce((acc, uni) => {
          acc[uni.city] = (acc[uni.city] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
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

  // Export comparison data to CSV format
  const exportComparisonToCSV = (
    universities: University[],
    selectedProgram?: string,
    programComparisonData?: any[],
    filename: string = "university-comparison"
  ) => {
    if (selectedProgram && programComparisonData) {
      // Program comparison CSV
      const csvHeaders = [
        "Üniversite Adı",
        "Üniversite Türü",
        "Şehir",
        "Fakülte Adı",
        "Program Kodu",
        "Program Türü",
        "Puan Türü",
        "Min Puan",
        "Max Puan",
        "Genel Kontenjan",
        "Yerleşen Sayısı",
        "Doluluk Oranı (%)",
      ];

      const csvRows: string[] = [];

      universities.forEach((university, index) => {
        const programData = programComparisonData[index];
        const facultyName =
          university.faculties.find((faculty) =>
            faculty.programs.some(
              (program) =>
                program.name.toLowerCase().trim() ===
                selectedProgram.toLowerCase().trim()
            )
          )?.name || "Bilinmiyor";

        const quota = programData?.yokData2024?.quota?.general;
        const placementRate =
          quota?.total && quota?.placed
            ? ((quota.placed / quota.total) * 100).toFixed(1)
            : "N/A";

        const row = [
          `"${university.name}"`,
          `"${university.type}"`,
          `"${university.city}"`,
          `"${facultyName}"`,
          `"${programData?.yokData2024?.programCode || ""}"`,
          `"${programData?.yokData2024?.programType || ""}"`,
          `"${programData?.yokData2024?.scoreType || ""}"`,
          quota?.minScore?.toString() || "",
          quota?.maxScore?.toString() || "",
          quota?.total?.toString() || "",
          quota?.placed?.toString() || "",
          placementRate,
        ];
        csvRows.push(row.join(","));
      });

      const csvContent = [
        `# Program Karşılaştırması - ${new Date().toLocaleString("tr-TR")}`,
        `# Karşılaştırılan Program: ${selectedProgram}`,
        `# Karşılaştırılan Üniversite Sayısı: ${universities.length}`,
        `#`,
        "",
        csvHeaders.join(","),
        ...csvRows,
      ].join("\n");

      const dataBlob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `program-karsilastirma-${selectedProgram.replace(
        /\s+/g,
        "-"
      )}-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // University comparison CSV
      const csvHeaders = [
        "Üniversite Adı",
        "Üniversite Türü",
        "Şehir",
        "Website",
        "Fakülte Sayısı",
        "Program Sayısı",
      ];

      const csvRows = universities.map((uni) => [
        `"${uni.name}"`,
        `"${uni.type}"`,
        `"${uni.city}"`,
        `"${uni.website || ""}"`,
        uni.faculties.length.toString(),
        uni.faculties
          .reduce((total, faculty) => total + faculty.programs.length, 0)
          .toString(),
      ]);

      const csvContent = [
        `# Üniversite Karşılaştırması - ${new Date().toLocaleString("tr-TR")}`,
        `# Karşılaştırılan Üniversite Sayısı: ${universities.length}`,
        `#`,
        "",
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      const dataBlob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return {
    exportToJSON,
    exportToCSV,
    exportComparison,
    exportAdvancedSearchToJSON,
    exportAdvancedSearchToCSV,
    exportComparisonToCSV,
  };
};
