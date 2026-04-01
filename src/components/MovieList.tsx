import React from "react";
import { Movie } from "../types";
import MovieCard from "./MovieCard";
import type { MouseEvent } from "react";

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (id: string) => void;
  favorites: Movie[];
  onToggleFavorite: (e: MouseEvent, movie: Movie) => void;
}

export default function MovieList({ movies, onMovieClick, favorites, onToggleFavorite }: MovieListProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl">No movies found. Try searching for something else!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.imdbID} 
          movie={movie} 
          onClick={onMovieClick} 
          isFavorite={favorites.some(f => f.imdbID === movie.imdbID)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
