import React,{useState} from 'react';
import MovieList from './components/MovieList';


function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading,setIsLoading]=useState(false)

  async function fetchMoviesHandler() {
    setIsLoading(true)
      const response = await fetch("https://swapi.dev/api/films/");
      const data = await response.json();
      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setIsLoading(false)
    } 
  

  return (
    <React.Fragment>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={fetchMoviesHandler} style={{ border: "1px solid black", color: "brown", fontSize: "20px" }}>
          Fetch movies
        </button>
      </section>
      <section>
       {  !isLoading && movies.length>0 &&< MovieList movies={movies} />}
       {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;