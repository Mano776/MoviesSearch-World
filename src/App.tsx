import React, { useState, useEffect, useCallback, type MouseEvent } from "react";
import { Film, Heart, Search, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import MovieDetailsModal from "./components/MovieDetails";
import Loader from "./components/Loader";
import { Movie, MovieDetails, SearchResponse } from "./types";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "a368fd30"; // Valid user key as fallback
const BASE_URL = "https://www.omdbapi.com";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("Tamil");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("cineSearchFavorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchMovies = useCallback(async (searchQuery: string, pageNum: number) => {
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/?s=${searchQuery}&page=${pageNum}&apikey=${API_KEY}`);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: SearchResponse = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search || []);
        setTotalResults(parseInt(data.totalResults || "0"));
      } else {
        setMovies([]);
        setError(data.Error || "No results found");
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to fetch movies. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMovieDetails = async (id: string) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/?i=${id}&plot=full&apikey=${API_KEY}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data: MovieDetails = await response.json();
      setSelectedMovie(data);
    } catch (err) {
      console.error("Failed to fetch movie details", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(query, page);
  }, [query, page, fetchMovies]);

  useEffect(() => {
    localStorage.setItem("cineSearchFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setShowFavorites(false);
  };

  const handleMovieClick = (id: string) => {
    setSelectedMovieId(id);
    fetchMovieDetails(id);
  };

  const toggleFavorite = (e: MouseEvent, movie: Movie) => {
    e.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.some(f => f.imdbID === movie.imdbID);
      if (isFav) {
        return prev.filter(f => f.imdbID !== movie.imdbID);
      } else {
        return [...prev, movie];
      }
    });
  };

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setQuery("Tamil");
              setPage(1);
              setShowFavorites(false);
            }}
          >
            <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <Film className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              CineSearch
            </h1>
          </div>

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${showFavorites
              ? "bg-red-500/20 text-red-400 border border-red-500/50"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
          >
            <Heart className={`h-5 w-5 ${showFavorites ? "fill-current" : ""}`} />
            <span className="hidden sm:inline font-medium">Favorites ({favorites.length})</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!showFavorites && (
          <div className="text-center mb-12 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
            >
              Discover Your Next Favorite Movie
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Search through thousands of movies, explore details, and keep track of your favorites.
            </motion.p>
          </div>
        )}

        {/* Search Bar */}
        {!showFavorites && (
          <div className="space-y-6">
            <SearchBar onSearch={handleSearch} />

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mr-2">Quick Search:</span>
              {[
                { label: "Hollywood", query: "Hollywood" },
                { label: "Bollywood", query: "Bollywood" },
                { label: "Kollywood", query: "Tamil" },
                { label: "Action", query: "Action" },
                { label: "Comedy", query: "Comedy" },
                { label: "Horror", query: "Horror" }
              ].map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => handleSearch(filter.query)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${query === filter.query && !showFavorites
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {showFavorites ? (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                  Your Favorites
                </h3>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  <ChevronLeft className="h-5 w-5" /> Back to Search
                </button>
              </div>

              {favorites.length > 0 ? (
                <MovieList
                  movies={favorites}
                  onMovieClick={handleMovieClick}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              ) : (
                <div className="text-center py-32 bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
                  <Heart className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 text-xl">You haven't added any favorites yet.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loading ? (
                <Loader />
              ) : error ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6 max-w-md mx-auto bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-red-500/20 shadow-2xl shadow-red-900/10"
                >
                  <div className="p-5 bg-red-500/10 rounded-2xl border border-red-500/20 animate-pulse">
                    <AlertCircle className="h-14 w-14 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-red-400 text-2xl font-bold tracking-tight">Something went wrong</h3>
                    <p className="text-gray-300 text-lg font-medium">{error}</p>
                  </div>
                  
                  {error.includes("401") ? (
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-sm text-gray-400 text-left">
                      <p className="font-bold text-gray-200 mb-1">💡 Troubleshooting Tip:</p>
                      <p>This "401" error usually means your <strong>OMDB API key</strong> is invalid or inactive. Please ensure you have a valid <code>VITE_OMDB_API_KEY</code> in your <code>.env</code> file.</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Try searching for a different title or check your internet connection.</p>
                  )}
                  
                  <button 
                    onClick={() => handleSearch(query)}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors border border-gray-700"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-400">
                      Showing results for <span className="text-white font-bold">"{query}"</span>
                      <span className="ml-2 text-gray-600">({totalResults} found)</span>
                    </p>
                  </div>

                  <MovieList
                    movies={movies}
                    onMovieClick={handleMovieClick}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-4">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <span className="text-lg font-medium text-gray-400">
                        Page <span className="text-white">{page}</span> of {totalPages}
                      </span>
                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-900 py-10 text-center text-gray-600">
        <p>© {new Date().getFullYear()} CineSearch.</p>
      </footer>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        loading={detailsLoading}
        onClose={() => {
          setSelectedMovieId(null);
          setSelectedMovie(null);
        }}
      />
    </div>
  );
}
