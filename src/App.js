import React,{useState,useEffect,useCallback,useMemo} from 'react';
import MovieList from './components/MovieList';
 

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryInterval, setRetryInterval] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const [newMovie, setNewMovie] = useState({
    title: "",
    openingText: "",
    releaseDate: "",
  });

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error(`Something went wrong...Retrying`);
      }
      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));
      setMovies(transformedMovies);

      if (retryInterval) {
        clearInterval(retryInterval);
        setRetryInterval(null);
        setIsRetrying(false);
      }
    } catch (error) {
      setError(error.message);
      if (!retryInterval) {
        const intervalId = setInterval(fetchMoviesHandler, 5000);
        setRetryInterval(intervalId);
        setIsRetrying(true);
      }
    }
    setIsLoading(false);
  }, [retryInterval]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const movieListMemo = useMemo(() => {
    return <MovieList movies={movies} />;
  }, [movies]);

  function cancelRetryHandler() {
    if (retryInterval) {
      clearInterval(retryInterval);
      setRetryInterval(null);
      setIsRetrying(false);
    }
  }

  useEffect(() => {
    return () => {
      if (retryInterval) {
        clearInterval(retryInterval);
      }
    };
  }, [retryInterval]);

  // Handle input changes for the form
  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setNewMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
  };

  // Handle form submission
  const addMovieHandler = (event) => {
    event.preventDefault();
    console.log("New Movie Object:", newMovie);

    // Optionally update movies array
    setMovies((prevMovies) => [
      ...prevMovies,
      { id: Math.random().toString(), ...newMovie },
    ]);

    // Reset form
    setNewMovie({ title: "", openingText: "", releaseDate: "" });
  };

  return (
    <React.Fragment>
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
          <button type="submit">Add Movies</button>
        </form>
      </section>
      <section>
        {!isLoading && movies.length > 0 && movieListMemo}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
        {isRetrying && (
          <button
            onClick={cancelRetryHandler}
            style={{ marginTop: "10px", color: "red" }}
          >
            Cancel Retry
          </button>
        )}
      </section>
    </React.Fragment>
  );
}

export default App;