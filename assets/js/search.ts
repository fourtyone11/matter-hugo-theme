const searchButton = document.querySelector('.js-search-button');

function handleSearchButtonClick({target}) {
  target.classList.toggle('.c-au')
}

searchButton.addEventListener('click', handleSearchButtonClick);
