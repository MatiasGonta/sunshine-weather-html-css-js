const searchBox = document.querySelector('.search-box');
const searchForm = document.querySelector('.search-box form');
const searchInput = document.querySelector('.search-box input');
const errorBox = document.querySelector('.error');
const errorMessage = document.querySelector('.error span');

const loadModal = document.querySelector('.loading-box');

const savedSearches = localStorage.getItem('searchesHistory');
let response, historyArray = savedSearches ? JSON.parse(savedSearches) : ['London', 'Paris', 'Tokyo', 'New York'];//Default Search History

const historyOne = document.getElementById('sh-one');
const historyTwo = document.getElementById('sh-two');
const historyThree = document.getElementById('sh-three');
const historyFour = document.getElementById('sh-four');

// Axios config and Weather fetch
const API_KEY = 'c23b1d28140788f772fa4de635fc98af';

const api = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
    params: {
        appid: API_KEY,
    },
});

const errorMatches = {
    400: 'Bad Request: The request was invalid',
    401: 'Unauthorized: API key is missing or invalid',
    404: 'Your location was not founded',
    500: 'Internal Server Error'
};
Object.freeze(errorMatches);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Show Page Loading
        loadModal.style.display = 'none';

        // Handle Error Alert
        errorMessage.innerHTML = errorMatches[error.response.status] || 'An error occurred. Please try again later';
        errorBox.classList.add('show');
        setTimeout(()=>{
            errorBox.classList.remove('show');
        },3000);
        return Promise.reject(error);
    }
);

const fetchWeatherByCoordinates = async (latitude, longitude) => {
    // Show Page Loading
    loadModal.style.display = 'flex';
    
    response = await api.get('/weather', {
        params: {
            lat: latitude,
            lon: longitude,
            units: 'metric'
        },
    });

    handleWeatherData(response.data);
};
    
const fetchWeatherByCity = async (city) => {
    // Show Page Loading
    loadModal.style.display = 'flex';

    response = await api.get('/weather', {
        params: {
        q: city,
        units: 'metric'
        },
    });
      
    handleWeatherData(response.data);
};

const handleWeatherData = (weatherData) => {
    // Set Search History
    if (historyArray[0] !== weatherData.name) {
        historyArray.pop();
        historyArray.unshift(weatherData.name);
        localStorage.setItem('searchesHistory', JSON.stringify(historyArray));
    }

    historyOne.innerHTML = historyArray[0];
    historyTwo.innerHTML = historyArray[1];
    historyThree.innerHTML = historyArray[2];
    historyFour.innerHTML = historyArray[3];

    // Time
    const weekDayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const dateUnix = weatherData.dt;
    const timezone = weatherData.timezone;
                        
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
            
    const getDate = `${weekDayName} ${date.getUTCDate()}, ${monthName} ${hours}:${minutes}`;

    // Select and set Weather features
    const icon = document.getElementById('icon');
    const background = document.querySelector('main');
    const cloudy = document.getElementById('cloudy');
    const cityName = document.getElementById('city');
    const time = document.getElementById('time');
    const temperature = document.getElementById('temp');
    const description = document.getElementById('description');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');

    const weatherResponses = {
        Clear: 'Clear',
        Clouds: 'Clouds',
        Rain: 'Rain',
        Drizzle: 'Rain',
        Thunderstorm: 'Thunderstorm',
        Snow: 'Snow',
        Mist: 'Mist',
        Fog: 'Mist',
        Haze: 'Mist',
        Smoke: 'Dust',
        Dust: 'Dust',
        Sand: 'Dust',
        Ash: 'Ash',
        Squall: 'Mist',
        Tornado: 'Tornado'
    };
    Object.freeze(weatherResponses);

    const weatherName = weatherData.weather[0].main;
    icon.src = `assets/weather-icons/${weatherResponses[weatherName]}.png`;
    icon.alt = weatherData.weather[0].description;

    if (weatherName !== 'Thunderstorm' && weatherName !== 'Tornado' && weatherName !== 'Ash') {
        if (hours > 7 && hours < 20) {
            background.style.backgroundImage = `url("assets/weather-backgrounds/${weatherResponses[weatherName]}-day.jpg")`;
        } else {
            background.style.backgroundImage = `url("assets/weather-backgrounds/${weatherResponses[weatherName]}-night.jpg")`;
        }
    } else {
        background.style.backgroundImage = `url("assets/weather-backgrounds/${weatherResponses[weatherName]}.jpg")`;
    }

    temperature.innerHTML = `${parseInt(weatherData.main.temp)}<span>°C</span>`;
    description.innerHTML = `${weatherData.weather[0].description}`;
    cityName.innerHTML = `${weatherData.name}`;
    time.innerHTML = `${getDate}`;
    cloudy.innerHTML = `${weatherData.clouds.all}%`;
    humidity.innerHTML = `${weatherData.main.humidity}%`;
    wind.innerHTML = `${parseInt(weatherData.wind.speed)}Km/h`;

    // Hidden Page Loading
    loadModal.style.display = 'none';
}

// User location weather search
window.addEventListener('load', () => {
    async function success(pos) {
        let latitude = pos.coords.latitude;
        let longitude = pos.coords.longitude;

        fetchWeatherByCoordinates(latitude, longitude);
    }

    async function error() {
        fetchWeatherByCity('New York');
    }
    navigator.geolocation.getCurrentPosition(success,error);
});

// Search History items weather search
historyOne.addEventListener('click', () => fetchWeatherByCity(historyOne.innerHTML));
historyTwo.addEventListener('click', () => fetchWeatherByCity(historyTwo.innerHTML));
historyThree.addEventListener('click', () => fetchWeatherByCity(historyThree.innerHTML));
historyFour.addEventListener('click', () => fetchWeatherByCity(historyFour.innerHTML));

// Input value weather search
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchWeatherByCity(searchInput.value);
});