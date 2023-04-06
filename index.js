const search = document.querySelector('.search button');
const searchBox = document.querySelector('.search');
const error = document.querySelector('.error');
let city, historyArray = [];

const historyOne = document.getElementById('one');
const historyTwo = document.getElementById('two');
const historyThree = document.getElementById('three');
const historyFour = document.getElementById('four');

window.addEventListener('load', () => {
    city = "New York";
    searchWeather();
});

historyOne.addEventListener('click', () => {
    city = historyOne.innerHTML;
    searchWeather();
});
historyTwo.addEventListener('click', () => {
    city = historyTwo.innerHTML;
    searchWeather();
});
historyThree.addEventListener('click', () => {
    city = historyThree.innerHTML;
    searchWeather();
});
historyFour.addEventListener('click', () => {
    city = historyFour.innerHTML;
    searchWeather();
});

search.addEventListener('click', () => {
    city = document.querySelector('.search input').value;
    console.log(city.className)
    searchWeather();
});

function searchWeather() {
    const weatherAPIKey = 'c23b1d28140788f772fa4de635fc98af';

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAPIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                error.style.display = 'flex';
                error.classList.add('show');
                setTimeout(()=>{
                    error.classList.remove('show');
                    error.style.display = 'none';
                },3000);
                return;
            }

            if(historyArray.length < 4) {
                historyArray.unshift(city);
            } else {
                historyArray.pop();
                historyArray.unshift(city);
            }

            switch (historyArray.length) {
                case 1:
                    historyOne.innerHTML = historyArray[0];
                    break;
                case 2:
                    historyOne.innerHTML = historyArray[0];
                    historyTwo.innerHTML = historyArray[1];
                    break;
                case 3:
                    historyOne.innerHTML = historyArray[0];
                    historyTwo.innerHTML = historyArray[1];
                    historyThree.innerHTML = historyArray[2];
                    break;
                case 4:
                    historyOne.innerHTML = historyArray[0];
                    historyTwo.innerHTML = historyArray[1];
                    historyThree.innerHTML = historyArray[2];
                    historyFour.innerHTML = historyArray[3];
                    break;
                default:
                    break;
            }

            const dateUnix = json.dt;
            const timezone = json.timezone;
            
            const weekDayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            
            const date = new Date((dateUnix + timezone) * 1000);
            const weekDayName = weekDayNames[date.getUTCDay()];
            const monthName = monthNames[date.getUTCMonth()];
            const hours = addZeros(date.getUTCHours());
            const minutes = addZeros(date.getUTCMinutes());

            function addZeros(num){
                if (num.toString().length < 2) {
                    return "0".concat(num);
                } else {
                    return num;
                }
            }
            
            const getDate = `${weekDayName} ${date.getUTCDate()}, ${monthName} ${hours}:${minutes}`;

            const image = document.querySelector('.weather-info img');
            const background = document.querySelector('.container');
            const cloudy = document.querySelector('.cloudy span');
            const cityName = document.querySelector('.city');
            const time = document.querySelector('.time');
            const temperature = document.querySelector('.temp');
            const description = document.querySelector('.description');
            const humidity = document.querySelector('.humidity span');
            const wind = document.querySelector('.wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    if (parseInt(hours) > 7 && parseInt(hours) < 20) {
                        background.style.backgroundImage = 'url("images/backgrounds/clear-day.jpg")';
                    } else {
                        background.style.backgroundImage = 'url("images/backgrounds/clear-night.jpg")';
                    }
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    if (parseInt(hours) > 7 && parseInt(hours) < 20) {
                        background.style.backgroundImage = 'url("images/backgrounds/rain-day.jpg")';
                    } else {
                        background.style.backgroundImage = 'url("images/backgrounds/rain-night.jpg")';
                    }
                    break;
                case 'Thunderstorm':
                    image.src = 'images/thunderstorm.png';
                    if (parseInt(hours) > 7 && parseInt(hours) < 20) {
                        background.style.backgroundImage = 'url("images/backgrounds/rain-day.jpg")';
                    } else {
                        background.style.backgroundImage = 'url("images/backgrounds/rain-night.jpg")';
                    }
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    if (parseInt(hours) > 7 && parseInt(hours) < 20) {
                        background.style.backgroundImage = 'url("images/backgrounds/snow-day.jpg")';
                    } else {
                        background.style.backgroundImage = 'url("images/backgrounds/snow-night.jpg")';
                    }
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    if (parseInt(hours) > 7 && parseInt(hours) < 20) {
                        background.style.backgroundImage = 'url("images/backgrounds/cloud-day.jpg")';
                    } else {
                        background.style.backgroundImage = 'url("images/backgrounds/cloud-night.jpg")';
                    }
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    if (parseInt(hours) > 7 && parseInt(hours) < 20) {
                        background.style.backgroundImage = 'url("images/backgrounds/haze-day.jpg")';
                    } else {
                        background.style.backgroundImage = 'url("images/backgrounds/haze-night.jpg")';
                    }
                    break;
                default:
                    image.src = '';
            }
            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            cityName.innerHTML = `${json.name}`;
            time.innerHTML = `${getDate}`;
            cloudy.innerHTML = `${json.clouds.all}%`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
        });


};

const mentionName = document.getElementById("name").addEventListener("click", ()=> {
    document.querySelector(".popup").classList.add("active");
});

const closeButton = document.querySelector(".close").addEventListener("click", ()=> {
    document.querySelector(".popup").classList.remove("active");
});