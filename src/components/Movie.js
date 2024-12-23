import React from 'react';
import classes from "./Movie.module.css"

const Movie = (props) => {
  const deleteMovieHandler = () => {
    props.onDeleteMovie(props.id); 
  };
  return (
    <li className={classes.movie}>
        <h2 className={classes.h2}>{props.title}</h2>
      <h3 className={classes.h3}>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={deleteMovieHandler}>Delete</button>
    </li>
  )
}

export default Movie
