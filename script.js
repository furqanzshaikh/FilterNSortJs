const fetchData = async () => {
    try {
        const data = await fetch(' https://movie-json-server-bhus.onrender.com/movies');
        const movies = await data.json();
        return movies;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const renderMovies = (movies) => {
    const movieListContainer = document.getElementById('movie-list');
    movieListContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('card');

        const poster = document.createElement('img');
        poster.src = movie.posterURL;
        poster.alt = `${movie.name} Poster`;
        poster.classList.add('poster');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.name;
        movieTitle.classList.add('title');

        const releaseDate = document.createElement('p');
        releaseDate.textContent = `Release Date: ${movie.releaseDate}`;
        releaseDate.classList.add('release-date');

        const imdbRating = document.createElement('p');
        imdbRating.textContent = `IMDb Rating: ${movie.imdbRating}`;
        imdbRating.classList.add('imdb-rating');

        movieCard.appendChild(poster);
        movieCard.appendChild(movieTitle);
        movieCard.appendChild(releaseDate);
        movieCard.appendChild(imdbRating);

        movieListContainer.appendChild(movieCard);
    });
};

const sortMovies = async () => {
    const dropdown = document.getElementById('dropdown');
    const orderBy = dropdown.value;

    const allMovies = await fetchData();

    allMovies.sort((a, b) => {
        if (orderBy === 'asc') {
            return a.imdbRating - b.imdbRating;
        } else {
            return b.imdbRating - a.imdbRating;
        }
    });

    renderMovies(allMovies);
};

document.getElementById('dropdown').addEventListener('change', sortMovies);

fetchData().then(renderMovies);


const searchByYear = async (year) => {
    try {
        const data = await fetch(`https://movie-json-server-bhus.onrender.com/movies?year=${year}`);
        const movies = await data.json();
        renderMovies(movies);
    } catch (error) {
        console.error('Error fetching data:', error);
        renderMovies([]);
    }
};

const filterMoviesByYear = async (year) => {
    const allMovies = await fetchData();
    return allMovies.filter(movie => {
        const movieYear = new Date(movie.releaseDate).getFullYear();
        return movieYear === parseInt(year);
    });
};

document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchInput = document.getElementById('search-input');
    const year = searchInput.value;
    
    if (!year || isNaN(year)) {
        alert('Please enter a valid year.');
        return;
    }

    const filteredMovies = await filterMoviesByYear(year);
    renderMovies(filteredMovies);
});
