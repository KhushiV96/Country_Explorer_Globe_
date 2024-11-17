// details.html JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const countryName = urlParams.get('name');

  if (countryName) {
    fetchCountryDetails(countryName);
  }
});

async function fetchCountryDetails(countryName) {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();
    const country = countries.find(c => c.name.common === countryName);

    if (country) {
      displayCountryDetails(country);
    } else {
      console.error('Country not found');
    }
  } catch (error) {
    console.error('Error fetching country details:', error);
  }
}

function displayCountryDetails(country) {
  const detailsContainer = document.getElementById('details-container');
  detailsContainer.innerHTML = `
    
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
    <h1>${country.name.common}</h1>
    <p>Region: ${country.region}</p>
    <p>Subregion: ${country.subregion}</p>
    <p>Population: ${country.population.toLocaleString()}</p>
    <p>Capital: ${country.capital}</p>
    <p>Languages: ${Object.values(country.languages).join(', ')}</p>
    <!-- Add more country details as needed -->
  `;
}
