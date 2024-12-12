import React, { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MovieList";
import AddMovie from "./components/AddMovie";
import Loader from "./components/Loader";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryInterval, setRetryInterval] = useState(null);

  // Function to fetch movies
  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://react-http-9b891-default-rtdb.firebaseio.com//movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong....Retrying");
      }

      const data = await response.json();
      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
      setError(null);
      clearInterval(retryInterval);
    } catch (error) {
      setError(error.message);

      if (!retryInterval) {
        const intervalId = setInterval(fetchMovies, 5000);
        setRetryInterval(intervalId);
      }
    }

    setIsLoading(false);
  }, [retryInterval]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Clean up retryInterval on component unmount
  useEffect(() => {
    return () => {
      if (retryInterval) {
        clearInterval(retryInterval);
      }
    };
  }, [retryInterval]);

  // Handler to cancel retry
  function cancelRetryHandler() {
    if (retryInterval) {
      clearInterval(retryInterval);
      setRetryInterval(null);
      setIsLoading(false);
      setError("Retry cancelled by user.");
    }
  }

  // Handler to add a new movie
  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-9b891-default-rtdb.firebaseio.com//movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  }

  // Handler to delete a movie
  async function deleteMovieHandler(movieId) {
    const response = await fetch(
      `https://react-http-9b891-default-rtdb.firebaseio.com//${movieId}.json`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      setError("Failed to delete the movie.");
      return;
    }

    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
        {retryInterval && (
          <button onClick={cancelRetryHandler}>Cancel Retry</button>
        )}
      </section>
      <section>
        {!isLoading && movies.length > 0 && (
          <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />
        )}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <Loader />}
      </section>
    </React.Fragment>
  );
}

export default App;