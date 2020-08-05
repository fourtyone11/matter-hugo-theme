import { WEATHER_APPID } from './weather_app_id'
import { getRandomInt } from './utilities'

const apiAddr = (lat: string, lon: string) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${WEATHER_APPID}`

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
    const weather = localStorage.get('weather')
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

function success(position: any) {
  console.log('pos', position)
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log('lat', latitude, 'lon', longitude)
  const status = document.querySelector<HTMLDivElement>('.c-weather__status');

  status.textContent = '';
  cachedWeather(latitude, longitude)

}
function error() {
  const status = document.querySelector<HTMLDivElement>('.c-weather__status');
  status.textContent = 'Unable to retrieve your location';
}


const weatherElement = document.querySelector('.js-weather')
const weatherButton = document.querySelector('.js-weather-button')

function handleWeatherButton() {
  if('geolocation' in navigator) {
    const status = document.querySelector<HTMLDivElement>('.c-weather__status');
    status.textContent === 'Locating...'
    navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
  } else {
    const randomCity = getRandomInt(0, defaultLatLon.length)
    cachedWeather(randomCity.lat, randomCity.lon)
  }
}

weatherButton.addEventListener('click', handleWeatherButton)

const randomCity = getRandomInt(0, defaultLatLon.length)

if(window.location.host !== 'localhost:1313') {
  const weather = fetchWeather(randomCity.lat, randomCity.lon)
}
