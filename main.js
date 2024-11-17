const countries = [];
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const errorModal = document.getElementById("error-modal");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const searchButton = document.getElementById("search-button");
const favoritesButton = document.getElementById("favorites-button");
let globe;

async function fetchCountries() {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();
    countries.push(...data);
    setupGlobe();
}

function setupGlobe() {
    const colors = ['#ff4500', '#1e90ff', '#32cd32', '#ffa500', '#8a2be2', '#ff69b4'];

    globe = Globe()(document.getElementById('globe'))
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundColor('#000')
        .pointAltitude(() => 0.02)
        .pointColor(() => colors[Math.floor(Math.random() * colors.length)])
        .pointsData(countries.map(country => ({
            lat: country.latlng[0],
            lng: country.latlng[1],
            name: country.name.common,
            capital: country.capital ? country.capital[0] : "N/A",
            region: country.region,
            population: country.population,
            area: country.area,
            flag: country.flags.svg,
            icon: '📍'
        })))
        .pointLabel(({ name }) => name)
        .pointRadius(0.5)
        .onGlobeClick(() => toggleRotation())
        .onPointClick(handlePointClick);

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 15.0;
}

for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = `${Math.random() * window.innerHeight}px`;
    star.style.left = `${Math.random() * window.innerWidth}px`;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    document.body.appendChild(star);
}

function createShootingStar() {
    const star = document.createElement('div');
    star.classList.add('shooting-star');
    star.style.top = `${Math.random() * window.innerHeight}px`;
    star.style.left = `${Math.random() * window.innerWidth}px`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 3000);
}

setInterval(createShootingStar, 2000);

const favoriteCountries = JSON.parse(localStorage.getItem('favorites')) || [];

function handlePointClick({ lat, lng, name }) {
    const country = countries.find(c => c.name.common === name);
    if (country) {
        document.getElementById("country-flag").src = country.flags.svg;
        document.getElementById("country-name").innerText = country.name.common;
        document.getElementById("country-capital").innerText = country.capital ? country.capital[0] : "N/A";
        document.getElementById("country-region").innerText = country.region;
        document.getElementById("country-population").innerText = country.population;
        document.getElementById("country-area").innerText = country.area ? country.area : "N/A";

        const heartIcon = document.getElementById("heart-icon");
        if (favoriteCountries.includes(name)) {
            heartIcon.classList.add("filled");
        } else {
            heartIcon.classList.remove("filled");
        }

        overlay.style.display = "block";
        modal.style.display = "block";
    }
}

document.getElementById("heart-icon").onclick = function () {
    const countryName = document.getElementById("country-name").innerText;

    if (favoriteCountries.includes(countryName)) {
        const index = favoriteCountries.indexOf(countryName);
        favoriteCountries.splice(index, 1);
    } else {
        favoriteCountries.push(countryName);
    }

    localStorage.setItem('favorites', JSON.stringify(favoriteCountries));

    if (favoriteCountries.length === 5) {
        showFullMessage();
    }

    if (favoriteCountries.includes(countryName)) {
        document.getElementById("heart-icon").classList.add("filled");
    } else {
        document.getElementById("heart-icon").classList.remove("filled");
    }
};

function showFullMessage() {
    alert("You have added 5 countries to your favorites!");
}

document.getElementById("close-modal").onclick = function () {
    overlay.style.display = "none";
    modal.style.display = "none";
};

document.getElementById("close-error-modal").onclick = function () {
    errorModal.style.display = "none";
};

function updateHeartIcons() {
    const heartIcons = document.querySelectorAll('.heart');
    heartIcons.forEach(icon => {
        const countryName = icon.parentElement.querySelector('.country-name').innerText;
        if (favoriteCountries.includes(countryName)) {
            icon.classList.add('filled');
        } else {
            icon.classList.remove('filled');
        }
    });
}

fetchCountries();

function toggleRotation() {
    globe.controls().autoRotate = !globe.controls().autoRotate;
}

document.getElementById("close-modal").onclick = function () {
    modal.style.display = "none";
    overlay.style.display = "none";
};

document.getElementById("close-error-modal").onclick = function () {
    errorModal.style.display = "none";
};

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCountries = countries.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm)
        );

        globe.pointsData(filteredCountries.map(country => ({
            lat: country.latlng[0],
            lng: country.latlng[1],
            name: country.name.common,
            capital: country.capital ? country.capital[0] : "N/A",
            region: country.region,
            population: country.population,
            area: country.area ? country.area : "N/A",
            flag: country.flags.svg
        })));
    }
});

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm)
    );
    globe.pointsData(filteredCountries.map(country => ({
        lat: country.latlng[0],
        lng: country.latlng[1],
        name: country.name.common,
        capital: country.capital ? country.capital[0] : "N/A",
        region: country.region,
        population: country.population,
        area: country.area ? country.area : "N/A",
        flag: country.flags.svg
    })));
});

filterSelect.addEventListener("change", () => {
    const region = filterSelect.value;
    const filteredCountries = region === "all" ? countries : countries.filter(country => country.region === region);
    globe.pointsData(filteredCountries.map(country => ({
        lat: country.latlng[0],
        lng: country.latlng[1],
        name: country.name.common,
        capital: country.capital ? country.capital[0] : "N/A",
        region: country.region,
        population: country.population,
        area: country.area ? country.area : "N/A",
        flag: country.flags.svg
    })));
});

const heartIcon = document.getElementById("heart-icon");

heartIcon.addEventListener("click", function () {
    const countryName = document.getElementById("country-name").innerText;
    const countryFlag = document.getElementById("country-flag").src;
    const countryDetails = {
        name: countryName,
        flag: countryFlag,
        capital: document.getElementById("country-capital").innerText,
        region: document.getElementById("country-region").innerText,
        population: document.getElementById("country-population").innerText,
        area: document.getElementById("country-area").innerText
    };

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const existingIndex = favorites.findIndex(c => c.name === countryName);
    if (existingIndex === -1) {
        favorites.push(countryDetails);
        heartIcon.classList.add("filled");
    } else {
        favorites.splice(existingIndex, 1);
        heartIcon.classList.remove("filled");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
});

fetchCountries();
