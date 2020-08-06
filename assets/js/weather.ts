import { WEATHER_APPID } from './weather_app_id'
import { getRandomInt } from './utilities'

const apiAddr = (lat: string, lon: string) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${WEATHER_APPID}`

const defaultLatLon = [
  {
    lat: '55.751244',
    lon: '37.618423',
    city: 'Moscow'
  },
  {
    lat: '40.730610',
    lon: '-73.935242',
    city: 'New York'
  },
  {
    lat: '51.509865',
    lon: '-0.118092',
    city: 'London'
  },
  {
    lat: '-23.533773',
    lon: '-46.625290',
    city: 'Sao Paulo'
  },
  {
    lat: '35.652832',
    lon: '139.839478',
    city: 'Tokio'
  }
]

function fetchWeather(lat: string, lon: string) {
  return fetch(apiAddr(lat, lon))
    .then(res => res.json())
    .then(weather => weather)
    .catch(err => console.log('weather api:', err))
}

function fetchCacheDecorator(this:any, wrapped: any) {
  return (...args: any[]) => {
    const weather = localStorage.getItem('weather')
    if(weather) {
      const weatherFetchTime = localStorage.getItem('weather_fetch_time')
      if(weatherFetchTime) {
        const weatherDate = new Date(weatherFetchTime)
        weatherDate.setHours(weatherDate.getHours() + 3)
        if(weatherDate.getTime() > new Date().getTime()) {
          return Promise.resolve(JSON.parse(weather))
        }
      }
    }
    const res = wrapped.apply(this, args)
    res.then((weather: any) => {
      localStorage.setItem('weather', JSON.stringify(weather))
      localStorage.setItem('weather_fetch_time', new Date().getTime().toString())
    })
    return res
  }
}

const cachedWeather = fetchCacheDecorator(fetchWeather)

function removeActiveIcon() {
  const weatherElement = document.querySelector('.js-weather')
  const activeIcon = weatherElement.querySelector('.svg-active')
  if(!activeIcon) {
    return
  }
  activeIcon.classList.remove('svg--active')
}

function renderWeatherIcon(weatherId: number) {
  removeActiveIcon()

  const weatherElement = document.querySelector('.js-weather')
  if(weatherId >= 200 && weatherId < 300) {
    const cloudIcon = weatherElement.querySelector('.svg-cloud')
    cloudIcon.classList.add('svg--active');
  } else if (weatherId >= 300 && weatherId < 400) {
    const cloudIcon = weatherElement.querySelector('.svg-cloud')
    cloudIcon.classList.add('svg--active');
  } else if (weatherId >= 500 && weatherId < 600) {
    const rainIcon = weatherElement.querySelector('.svg-rain-cloud')
    rainIcon.classList.add('svg--active');
  } else if (weatherId >= 600 && weatherId < 700) {
    const snowIcon = weatherElement.querySelector('.svg-snowflake')
    snowIcon.classList.add('svg--active')
  } else if (weatherId === 800) {
    const sunIcon = weatherElement.querySelector('.svg-sun')
    sunIcon.classList.add('svg--active')
  } else if (weatherId === 801) {
    const cloudWithSunIcon = weatherElement.querySelector('.svg-cloud-sun')
    cloudWithSunIcon.classList.add('svg--active')
  } else {
    const cloudIcon = weatherElement.querySelector('.svg-cloud')
    cloudIcon.classList.add('svg--active')
  }
}

function success(position: any) {
  console.log('pos', position)
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log('lat', latitude, 'lon', longitude)
  const status = document.querySelector<HTMLDivElement>('.c-weather__status');

  status.textContent = '';
  const weather = cachedWeather(latitude, longitude)
  weather.then(w => {
    renderWeatherIcon(w.weather[0].id)
    weatherButton.remove()
    console.log('weather', w)
  })
}
function error() {
  const status = document.querySelector<HTMLDivElement>('.c-weather__status');
  status.textContent = 'Unable to retrieve your location';
}


const weatherButton = document.querySelector('.js-weather-button')

function handleWeatherButton() {
  if('geolocation' in navigator) {
    const status = document.querySelector<HTMLDivElement>('.c-weather__status');
    status.textContent === 'Locating...'
    navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
  } else {
    const randomCity = getRandomInt(0, defaultLatLon.length)
    const weather = cachedWeather(randomCity.lat, randomCity.lon)
    weather.then(w => {
      renderWeatherIcon(w.weather[0].id)
      weatherButton.remove()
      console.log('weather', w)
    })
  }
}

weatherButton.addEventListener('click', handleWeatherButton)

const randomCity = getRandomInt(0, defaultLatLon.length)

if(window.location.host !== 'localhost:1313') {
  const weather = fetchWeather(randomCity.lat, randomCity.lon)
  weather.then(w => {
    renderWeatherIcon(w.weather[0].id)
    weatherButton.remove()
    console.log('weather', w)
  })
}
