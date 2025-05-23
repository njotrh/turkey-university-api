import { University } from "../types";

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

  const exportToTXT = (
    data: University[],
    filename: string = "universities"
  ) => {
    const txtContent = data
      .map((uni) => {
        const programCount = uni.faculties.reduce(
          (total, faculty) => total + faculty.programs.length,
          0
        );

        return [
          `Üniversite: ${uni.name}`,
          `Tür: ${uni.type}`,
          `Şehir: ${uni.city}`,
          `Website: ${uni.website || "Belirtilmemiş"}`,
          `Adres: ${uni.address}`,
          `Fakülte Sayısı: ${uni.faculties.length}`,
          `Program Sayısı: ${programCount}`,
          "",
          "Fakülteler:",
          ...uni.faculties.map(
            (faculty) =>
              `  - ${faculty.name} (${faculty.programs.length} program)`
          ),
          "",
          "---",
          "",
        ].join("\n");
      })
      .join("\n");

    const header = [
      "TÜRKİYE ÜNİVERSİTELERİ LİSTESİ",
      `Dışa Aktarma Tarihi: ${new Date().toLocaleString("tr-TR")}`,
      `Toplam Üniversite Sayısı: ${data.length}`,
      "",
      "=".repeat(50),
      "",
    ].join("\n");

    const fullContent = header + txtContent;

    const dataBlob = new Blob([fullContent], {
      type: "text/plain;charset=utf-8;",
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportComparison = (universities: University[]) => {
    const comparisonData = {
      exportDate: new Date().toISOString(),
      comparisonType: "university-comparison",
      universities: universities.map((uni) => {
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
            programs: faculty.programs.map((program) => program.name),
          })),
        };
      }),
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

  return {
    exportToJSON,
    exportToCSV,
    exportToTXT,
    exportComparison,
  };
};
