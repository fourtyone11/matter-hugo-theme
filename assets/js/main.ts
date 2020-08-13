import Swiper, {Navigation} from 'swiper'
import { initWeather } from './weather'

Swiper.use([Navigation])

new Swiper('.swiper-container', {
  slidesPerView: 3,
  spaceBetween: 20,
  // Navigation arrows
  navigation: {
    nextEl: '.c-slider-button--next',
    prevEl: '.c-slider-button--prev',
    disabledClass: 'c-slider-button--disabled'
  },
})

initWeather()
