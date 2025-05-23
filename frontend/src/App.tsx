import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ComparisonPanel from "./components/ComparisonPanel";
import HomePage from "./pages/HomePage";
import UniversityListPage from "./pages/UniversityListPage";
import UniversityDetailPage from "./pages/UniversityDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparisonPage from "./pages/ComparisonPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/universities" element={<UniversityListPage />} />
          <Route path="/universities/:id" element={<UniversityDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
        </Routes>
      </main>
      <Footer />

      {/* Floating Comparison Panel */}
      <ComparisonPanel />
    </div>
  );
}

export default App;
