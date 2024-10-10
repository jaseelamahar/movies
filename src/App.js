import React,{useState} from 'react';
import MovieList from './components/MovieList';


function App() {
  const[movies,setMovies]=useState([])
  function fetchMoviesHandler(){
    fetch("https://swapi.dev/api/films/").then(response=>{
      return response.json()
    }).then(data=>{
      const transformedMovies=data.results.map(movieData=>{
        return {
        id:  movieData.episode_id,
        title:movieData.title,
        openingText:movieData.opening_crawl,
        releaseDate:movieData.release_date
        }
      })
     setMovies(transformedMovies)
    })
  }
  return (
    <React.Fragment>
      <section  style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={fetchMoviesHandler} style={{border:"1px solid black",color:"brown",fontSize:"20px"}}>Fetch movies</button>
      </section>
    <section>
      <MovieList movies={movies}/>
    </section>
        
    </React.Fragment>
  );
}

export default App;
