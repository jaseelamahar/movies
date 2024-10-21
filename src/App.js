import React,{useState,useEffect} from 'react';
import MovieList from './components/MovieList';
 

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState(false);
  const [retryInterval, setRetryInterval] = useState(null);
  const[isRetrying,setIsRetrying]=useState(false);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    try{
      const response = await fetch("https://swapi.dev/api/filmc/");
      
      if(!response.ok){
   throw new Error(`something went wrong...Retrying`)
      }
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
      
   // Clear retry interval when the fetch is successful
   if (retryInterval) {
    clearInterval(retryInterval);
    setRetryInterval(null);  // Reset the retryInterval state
    setIsRetrying(false);    // Stop retrying when successful
  }
} catch (error) {
  setError(error.message);

  // If there's no active retry interval, start one
  if (!retryInterval) {
    const intervalId = setInterval(fetchMoviesHandler, 5000);  // Retry every 5 seconds
    setRetryInterval(intervalId);  // Store the interval ID
    setIsRetrying(true);           // Mark as retrying
  }
}

setIsLoading(false);
}

// Cancel retry mechanism when the user clicks "Cancel"
function cancelRetryHandler() {
if (retryInterval) {
  clearInterval(retryInterval);   // Stop the retry interval
  setRetryInterval(null);         // Clear the state
  setIsRetrying(false);           // Mark as not retrying
}
}

// Cleanup interval on component unmount to avoid memory leaks
useEffect(() => {
return () => {
  if (retryInterval) {
    clearInterval(retryInterval);  // Clean up the retry interval if it's still running
  }
};
}, [retryInterval]);
     

  return (
    <React.Fragment>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={fetchMoviesHandler} style={{ border: "1px solid black", color: "brown", fontSize: "20px" }}>
          Fetch movies
        </button>
      </section>
      <section>
       {  !isLoading && movies.length>0 &&< MovieList movies={movies} />}
       {!isLoading  && error && <p>{error}</p>}
       {isLoading && <p>Loading...</p>}
       {isRetrying && (
          <button onClick={cancelRetryHandler} style={{ marginTop: '10px', color: 'red' }}>
            Cancel Retry
          </button>
        )}
      </section>
    </React.Fragment>
  );
}

export default App;