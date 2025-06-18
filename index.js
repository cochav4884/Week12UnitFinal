// API URL and Key
const API_URL = 'http://localhost:5000/movies'; // Local json-server URL, replace with your actual API URL
const API_KEY = 'HkMwCY58i61SxGSegiorf3ejDRDuM1JeaoUgUQpr'; // Replace with your actual API key

// Form elements
const movieForm = document.getElementById('movieForm');
const titleInput = document.getElementById('title');
const directorInput = document.getElementById('director');
const yearInput = document.getElementById('year');
const genreInput = document.getElementById('genre');
const searchInput = document.getElementById('searchInput');
const genreSelect = document.getElementById('genreSelect');

// Movie list display area
const movieList = document.getElementById('movieList');

// Store fetched movies in a global variable for filtering
let allMovies = [];

// Function to fetch and display movies from the API (using async/await)
async function fetchMovies() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY // Add the API key here
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        allMovies = data; // Store fetched movies
        displayMovies(data); // Display all movies initially
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Function to display movies in the list
function displayMovies(movies) {
    movieList.innerHTML = ''; // Clear the movie list
    movies.forEach(movie => {
        const movieItem = document.createElement('li');
        movieItem.classList.add('list-group-item');
        movieItem.textContent = `${movie.title} (Directed by ${movie.director}, ${movie.year}, Genre: ${movie.genre})`;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteBtn.onclick = () => deleteMovie(movie.id);

        movieItem.appendChild(deleteBtn);
        movieList.appendChild(movieItem);
    });
}

// Event listener for the form submission to add a new movie (using async/await)
movieForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const newMovie = {
        title: titleInput.value.trim(),
        director: directorInput.value.trim(),
        year: yearInput.value.trim(),
        genre: genreInput.value.trim()
    };

    // Validate input
    if (!newMovie.title || !newMovie.director || !newMovie.year || !newMovie.genre) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify(newMovie)
        });

        if (!response.ok) {
            throw new Error('Failed to add movie');
        }

        const data = await response.json();
        console.log('Movie added:', data);
        fetchMovies(); // Refresh the movie list
        movieForm.reset(); // Clear form inputs
    } catch (error) {
        console.error('Error adding movie:', error);
    }
});

// Function to delete a movie (using async/await)
async function deleteMovie(movieId) {
    try {
        const response = await fetch(`${API_URL}/${movieId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete movie');
        }

        console.log(`Movie with ID ${movieId} deleted`);
        fetchMovies(); // Refresh list after deletion
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
}

// Event listener for search input and genre dropdown to filter movies
function filterMovies() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedGenre = genreSelect.value;

    // Filter the movies based on title, director, or genre
    const filteredMovies = allMovies.filter(movie => {
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesDirector = movie.director.toLowerCase().includes(query);
        const matchesGenre = selectedGenre ? movie.genre === selectedGenre : true;

        return (matchesTitle || matchesDirector) && matchesGenre;
    });

    // Display filtered movies
    displayMovies(filteredMovies);
}

// Event listeners for search input and genre dropdown
searchInput.addEventListener('input', filterMovies);
genreSelect.addEventListener('change', filterMovies);

// Initial fetch when the page loads
fetchMovies();






