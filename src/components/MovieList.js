import React from "react";
import Movie from "./Movie";
import classes from "./MovieList.module.css";

const MoviesList = (props) => {
  return (
    <ul className={classes["movies-list"]}>
      {props.movies.map((movie) => (
        <Movie
          key={movie.id}
          id={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          openingText={movie.openingText}
          onDeleteMovie={props.onDeleteMovie}
      
        />
      ))}
    </ul>
  );
};

export default MoviesList;