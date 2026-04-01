import React from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { Movie } from "../types";
import type { MouseEvent } from "react";

interface MovieCardProps {
  movie: Movie;
  onClick: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: MouseEvent, movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, isFavorite, onToggleFavorite }) => {
  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(movie.imdbID)}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer group transition-all hover:shadow-2xl border border-gray-700 relative"
    >
      <button
        onClick={(e) => onToggleFavorite(e, movie)}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isFavorite 
            ? "bg-red-500 text-white shadow-lg scale-110" 
            : "bg-black/40 text-white/70 hover:text-white hover:bg-black/60"
        }`}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
      </button>

      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-white font-medium text-sm">View Details</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-lg line-clamp-1 group-hover:text-blue-400 transition-colors">
          {movie.Title}
        </h3>
        <p className="text-gray-400 text-sm mt-1">{movie.Year}</p>
      </div>
    </motion.div>
  );
};

export default MovieCard;
