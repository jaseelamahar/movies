import React, { useState } from 'react';

function AddMovie(props) {
  const [newMovie, setNewMovie] = useState({
    title: "",
    openingText: "",
    releaseDate: "",
  });

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setNewMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
  };

  const addMovieHandler = (event) => {
    event.preventDefault();
    props.onAddMovie(newMovie);
    setNewMovie({ title: "", openingText: "", releaseDate: "" });
  };

  return (
    <section>
      <form onSubmit={addMovieHandler}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newMovie.title}
          onChange={inputChangeHandler}
          required
        />
        <textarea
          name="openingText"
          placeholder="Opening Text"
          value={newMovie.openingText}
          onChange={inputChangeHandler}
          required
        ></textarea>
        <input
          type="date"
          name="releaseDate"
          value={newMovie.releaseDate}
          onChange={inputChangeHandler}
          required
        />
         <button type="submit">Add Movie</button>
      </form>
    </section>
  );
}

export default AddMovie;
