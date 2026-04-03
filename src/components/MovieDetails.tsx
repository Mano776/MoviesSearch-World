import React from "react";
import { X, Star, Calendar, Clock, Film, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MovieDetails as MovieDetailsType } from "../types";
import { ImgWithFallback } from "./ImgWithFallback";

interface MovieDetailsProps {
  movie: MovieDetailsType | null;
  onClose: () => void;
  loading: boolean;
}

export default function MovieDetails({ movie, onClose, loading }: MovieDetailsProps) {
  return (
    <AnimatePresence>
      {(movie || loading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {loading ? (
              <div className="flex items-center justify-center py-40">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                />
              </div>
            ) : movie ? (
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 aspect-[2/3] md:aspect-auto">
                  <ImgWithFallback 
                    src={movie.Poster} 
                    alt={movie.Title} 
                  />
                </div>
                
                <div className="w-full md:w-2/3 p-6 md:p-10 space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.Title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {movie.Year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {movie.Runtime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Film className="h-4 w-4" /> {movie.Genre}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-xl w-fit">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-white">{movie.imdbRating}</span>
                    <span className="text-gray-500 text-sm">/ 10</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-blue-400 uppercase tracking-wider text-sm">Plot</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">{movie.Plot}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                    <div>
                      <h4 className="text-gray-500 text-sm uppercase font-bold mb-1">Director</h4>
                      <p className="text-white">{movie.Director}</p>
                    </div>
                    <div>
                      <h4 className="text-gray-500 text-sm uppercase font-bold mb-1">Cast</h4>
                      <p className="text-white">{movie.Actors}</p>
                    </div>
                    <div>
                      <h4 className="text-gray-500 text-sm uppercase font-bold mb-1">Awards</h4>
                      <div className="flex items-start gap-2">
                        <Award className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                        <p className="text-white">{movie.Awards}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-gray-500 text-sm uppercase font-bold mb-1">Released</h4>
                      <p className="text-white">{movie.Released}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
