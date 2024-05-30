

//----------------FUNCTIONS--------------------------
// Populate dropdown menu with all the available genres
const populateGenreDropdown = (genres) => {
  const select = document.getElementById('genres');
  for (const genre of genres) {
      let option = document.createElement("option");
      option.value = genre.id;
      option.text = genre.name;
      select.appendChild(option);
  }
};

// Returns the current genre selection from the dropdown menu
const getSelectedGenre = () => {
  const selectedGenre = document.getElementById('genres').value;
  return selectedGenre;
};

// Displays the like and dislike buttons on the page
const showBtns = () => {
  const btnDiv = document.getElementById('likeOrDislikeBtns');
  btnDiv.removeAttribute('hidden');
};

// Clear the current movie from the screen
const clearCurrentMovie = () => {
  const moviePosterDiv = document.getElementById('moviePoster');
  const movieTextDiv = document.getElementById('movieText');
  moviePosterDiv.innerHTML = '';
  movieTextDiv.innerHTML = '';
}

// After liking a movie, clears the current movie from the screen and gets another random movie
const likeMovie = () => {
  clearCurrentMovie();
  showRandomMovie();
};

// After disliking a movie, clears the current movie from the screen and gets another random movie
const dislikeMovie = () => {
  clearCurrentMovie();
  showRandomMovie();
};

// Create HTML for movie poster
const createMoviePoster = (posterPath) => {
  const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;

  const posterImg = document.createElement('img');
  posterImg.setAttribute('src', moviePosterUrl);
  posterImg.setAttribute('id', 'moviePoster');

  return posterImg;
};

// Create HTML for movie title
const createMovieTitle = (title) => {
  const titleHeader = document.createElement('h1');
  titleHeader.setAttribute('id', 'movieTitle');
  titleHeader.innerHTML = title;

  return titleHeader;
};

// Create HTML for movie overview
const createMovieOverview = (overview) => {
  const overviewParagraph = document.createElement('p');
  overviewParagraph.setAttribute('id', 'movieOverview');
  overviewParagraph.innerHTML = overview;

  return overviewParagraph;
};

// Returns a random movie from the first page of movies
const getRandomMovie = (movies) => {
  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];
  return randomMovie;
};

// Uses the DOM to create HTML to display the movie
const displayMovie = (movieInfo) => {
  const moviePosterDiv = document.getElementById('moviePoster');
  const movieTextDiv = document.getElementById('movieText');
  const likeBtn = document.getElementById('likeBtn');
  const dislikeBtn = document.getElementById('dislikeBtn');

  // Create HTML content containing movie info
  const moviePoster = createMoviePoster(movieInfo.poster_path);
  const titleHeader = createMovieTitle(movieInfo.title);
  const overviewText = createMovieOverview(movieInfo.overview);

  // Append title, poster, and overview to page
  moviePosterDiv.appendChild(moviePoster);
  movieTextDiv.appendChild(titleHeader);
  movieTextDiv.appendChild(overviewText);

  showBtns();
  likeBtn.onclick = likeMovie;
  dislikeBtn.onclick = dislikeMovie;
};


//---------SERVER REQUESTS--------------------

const playBtn = document.getElementById('playBtn');

const getGenres = async () => {
  try {
    const response = await fetch(`${process.env.URL_BACKEND}/genres`);
    let json = await response.json();
    console.log(json.message);
    populateGenreDropdown(json.message)
    return json.message;
  } catch (error) {
    console.log(error);
  }
};
getGenres();

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  let url = `${process.env.URL_BACKEND}/movies`;
  let init = {
    method: 'POST',
    body: JSON.stringify({selectedGenre}),
    cache: 'default',
    headers: {'Content-Type':'application/json'},
  };
  try {
    let response = await fetch(url, init);
    let json = await response.json();
    console.log(json.movies);
    return json.movies;
  } catch (error) {
    console.log(error);
  }
 
};
//getMovies();
const getMovieInfo = async (movie) => {
  console.log(movie);
  let movieId = movie.id;

  let url = `${process.env.URL_BACKEND}/movie/info`;
  let init = {
    method: "POST",
    body: JSON.stringify({movieId}),
    cache: "default",
    headers:{'Content-Type':'application/json'},
  };

  try {
    let response = await fetch(url, init);
    let json = await response.json();
    console.log(json)
    return json.info;
  } catch (error) {
    console.log(error);
  }
  
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();

  };
  const movies = await getMovies();
  console.log(movies)
  const randomMovie = await getRandomMovie(movies);
  console.log(randomMovie);
  const info = await getMovieInfo(randomMovie);
  displayMovie(info);

};

//playBtn.onclick = showRandomMovie;