// Global variables
let countriesData = [];
let currentPage = 1;
const pageSize = 20;

// Load liked countries from localStorage
let favorites = JSON.parse(localStorage.getItem("likedCountries")) || [];

// Fetch countries data from the API
async function fetchCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    countriesData = await response.json();
    displayCountries(); // Display initial countries
    displayFavorites(); // Display favorites
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
}
// Display autocomplete suggestions
function displayAutocomplete(filteredCountries) {
  const autocomplete = document.getElementById('autocomplete');
  autocomplete.innerHTML = ''; // Clear previous suggestions

  const limitedCountries = filteredCountries.slice(0, 5); // Limit suggestions to 5
  limitedCountries.forEach(country => {
    const suggestion = document.createElement('div');
    suggestion.className = 'suggestion';
    suggestion.innerText = country.name.common;
    suggestion.onclick = () => {
      document.getElementById('search-bar').value = country.name.common;
      displayCountries([country]); // Show selected country
      autocomplete.innerHTML = ''; // Clear suggestions
    };
    autocomplete.appendChild(suggestion);
  });
}
// Display countries with pagination
document.getElementById('search-bar').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query = event.target.value.toLowerCase();
    const country = countriesData.find(country => country.name.common.toLowerCase() === query);
    currentPage = 1; // Reset page

    if (country) {
      displayCountries([country]);
    } else {
      displayCountries([]); // No match found
    }
  }
});
document.getElementById('search-bar').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  const filteredCountries = countriesData.filter(country =>
    country.name.common.toLowerCase().includes(query)
  );

  displayCountries(filteredCountries); // Display filtered countries
  displayAutocomplete(filteredCountries); // Show autocomplete suggestions
});
function displayCountries(filteredCountries = countriesData) {
  const countryList = document.getElementById('country-list');
  countryList.innerHTML = ''; // Clear previous countries

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCountries = filteredCountries.slice(startIndex, endIndex);

  paginatedCountries.forEach(country => {
    const countryCard = createCountryCard(country);
    countryList.appendChild(countryCard);
  });
}

// Helper function to create a country card
// Helper function to create a country card
function createCountryCard(country) {
  const countryCard = document.createElement('div');
  countryCard.className = 'country-card';

  countryCard.innerHTML = `
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="80">
    <h4>${country.name.common}</h4>
    <span class="like-icon">${favorites.includes(country.name.common) ? '❤️' : '♡'}</span>
    <button class="details-button">➡️</button> <!-- Button with arrow emoji -->
  `;

  // Event for the new details button
  const detailsButton = countryCard.querySelector('.details-button');
  detailsButton.onclick = (event) => {
    event.stopPropagation(); // Prevent click from navigating
    window.location.href = `details.html?name=${encodeURIComponent(country.name.common)}`;
  };

  // Prevent propagation for the like icon
  const likeIcon = countryCard.querySelector('.like-icon');
  likeIcon.onclick = (event) => {
    event.stopPropagation(); // Prevent click from navigating
    toggleLike(country.name.common); // Toggle like status
  };

  return countryCard;
}


// Toggle favorite country
function toggleLike(countryName) {
  if (favorites.includes(countryName)) {
    favorites = favorites.filter(fav => fav !== countryName);
  } else {
    if (favorites.length < 5) { // Only add if favorites are less than 5
      favorites.push(countryName);
    } else {
      alert("You can only add up to 5 favorites!"); // Alert user
    }
  }
  localStorage.setItem('likedCountries', JSON.stringify(favorites));
  displayCountries(); // Refresh country list
  displayFavorites(); // Refresh favorites list
}

// Display favorite countries
function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = ''; // Clear previous favorites

  favorites.forEach(countryName => {
    const country = countriesData.find(c => c.name.common === countryName);
    if (country) {
      const countryCard = createCountryCard(country);
      favoritesList.appendChild(countryCard);
    }
  });
}

// Filter countries by search input and show suggestions
document.getElementById('search-bar').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  const filteredCountries = countriesData.filter(country =>
    country.name.common.toLowerCase().includes(query)
  );

  displayAutocomplete(filteredCountries); // Show autocomplete suggestions

  if (event.key === 'Enter') {
    const country = countriesData.find(country => country.name.common.toLowerCase() === query);
    currentPage = 1; // Reset page

    if (country) {
      displayCountries([country]);
    } else {
      displayCountries([]); // No match found
    }
  }
});

// Autocomplete search functionality
function displayAutocomplete(filteredCountries) {
  const autocomplete = document.getElementById('autocomplete');
  autocomplete.innerHTML = ''; // Clear previous suggestions

  const limitedCountries = filteredCountries.slice(0, 5); // Limit suggestions to 5
  limitedCountries.forEach(country => {
    const suggestion = document.createElement('div');
    suggestion.className = 'suggestion';
    suggestion.innerText = country.name.common;
    suggestion.onclick = () => {
      document.getElementById('search-bar').value = country.name.common;
      displayCountries([country]); // Show selected country
      autocomplete.innerHTML = ''; // Clear suggestions
    };
    autocomplete.appendChild(suggestion);
  });
}

// Filter countries by region and language
document.getElementById('region-filter').addEventListener('change', filterCountries);
document.getElementById('language-filter').addEventListener('input', filterCountries);

function filterCountries() {
  const region = document.getElementById('region-filter').value;
  const language = document.getElementById('language-filter').value.toLowerCase();
  currentPage = 1; // Reset page

  const filteredCountries = countriesData.filter(country => {
    const matchesRegion = !region || country.region === region;
    const matchesLanguage = !language || (country.languages && Object.values(country.languages).some(lang => lang.toLowerCase().includes(language)));
    return matchesRegion && matchesLanguage;
  });

  displayCountries(filteredCountries);
}

// "Show More" button functionality
document.getElementById('show-more').addEventListener('click', () => {
  currentPage++;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCountries = countriesData.slice(startIndex, endIndex);

  const countryList = document.getElementById('country-list');
  paginatedCountries.forEach(country => {
    const countryCard = createCountryCard(country);
    countryList.appendChild(countryCard);
  });

  // Check if all countries are loaded, hide "Show More" if no more pages
  if (endIndex >= countriesData.length) {
    document.getElementById('show-more').style.display = 'none';
  }
});

// Hide "Show More" button when searching or filtering
document.getElementById('search-bar').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  const filteredCountries = countriesData.filter(country =>
    country.name.common.toLowerCase().includes(query)
  );

  // Display filtered countries
  displayCountries(filteredCountries);
  displayAutocomplete(filteredCountries);

  // Hide "Show More" button when searching
  document.getElementById('show-more').style.display = 'none';

  // Optionally show "Show More" button if there are more than pageSize countries
  if (filteredCountries.length > pageSize) {
    document.getElementById('show-more').style.display = 'block'; // Show if more countries exist
  }
});

// Filter countries by region and language
document.getElementById('region-filter').addEventListener('change', filterCountries);
document.getElementById('language-filter').addEventListener('input', filterCountries);

function filterCountries() {
  const region = document.getElementById('region-filter').value;
  const language = document.getElementById('language-filter').value.toLowerCase();
  currentPage = 1; // Reset page

  const filteredCountries = countriesData.filter(country => {
    const matchesRegion = !region || country.region === region;
    const matchesLanguage = !language || (country.languages && Object.values(country.languages).some(lang => lang.toLowerCase().includes(language)));
    return matchesRegion && matchesLanguage;
  });

  // Display filtered countries
  displayCountries(filteredCountries);

  // Hide "Show More" button when filtering
  document.getElementById('show-more').style.display = 'none';

  // Show "Show More" button if there are more countries than pageSize
  if (filteredCountries.length > pageSize) {
    document.getElementById('show-more').style.display = 'block';
  }
}

// Function to display countries (handles paginated results and more)
function displayCountries(filteredCountries = countriesData) {
  const countryList = document.getElementById('country-list');
  countryList.innerHTML = ''; // Clear previous countries

  // Paginate filtered results
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCountries = filteredCountries.slice(startIndex, endIndex);

  // Display paginated countries
  paginatedCountries.forEach(country => {
    const countryCard = createCountryCard(country);
    countryList.appendChild(countryCard);
  });

  // Hide "Show More" button if no more countries to load
  if (endIndex >= filteredCountries.length) {
    document.getElementById('show-more').style.display = 'none';
  } else {
    document.getElementById('show-more').style.display = 'block'; // Show button if more countries exist
  }
}




// Initial setup to fetch and display country data
fetchCountries();
