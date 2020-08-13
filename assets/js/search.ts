import throttle from 'lodash-es/throttle'

const mediumViewportBreakpoint = 672

let searchButton: HTMLElement;
if(window.innerWidth >= mediumViewportBreakpoint) {
  searchButton = document.querySelector(".js-search-button");
} else {
  searchButton = document.querySelector('.js-bottom-menu__search-button')
}

let header: HTMLElement
if(window.innerWidth >= mediumViewportBreakpoint) {
  header = document.querySelector(".js-header");
} else {
  header = document.querySelector(".js-bottom-menu");
}

let searchElement: HTMLElement;

interface State {
  index: Array<Object>;
}

const state: State = {
  index: [],
};

const stateHandler = {
  set: (obj: State, prop: string, value: Array<Object>) => {
    if (prop === "index" && searchElement) {
      searchElement.setAttribute("searchIndex", JSON.stringify(state.index));
    }
    obj[prop] = value;
    return true;
  },
};

const stateProxy = new Proxy(state, stateHandler);

searchButton.addEventListener("mouseenter", () => {
  fetch("/index.json")
    .then((res) => res.json())
    .then((json) => {
      stateProxy.index = json;
    })
    .catch((e) => console.error(e));
});

function handleSearchButtonClick() {
  header.classList.add("u-header-hidden");
  header.classList.remove("u-header-show");
  searchElement = document.createElement("search-element");
  document.body.append(searchElement);

  searchElement.setAttribute("searchIndex", JSON.stringify(state.index));

  function handleSearchClose() {
    header.classList.remove("u-header-hidden");
    header.classList.add("u-header-show");
    const searchWrapper = searchElement.shadowRoot.querySelector('.o-search-wrapper')
    searchWrapper.classList.remove('.u-search-show')
    searchWrapper.classList.add('.u-search-hide')
    searchElement.removeEventListener("close", handleSearchClose);
    searchElement.remove();
  }
  searchElement.addEventListener("close", handleSearchClose);
}

function handleResize() {
  if(window.innerWidth >= mediumViewportBreakpoint) {
    header = document.querySelector('.js-header')
    searchButton.removeEventListener("click", handleSearchButtonClick);
    searchButton = document.querySelector('.js-search-button')
    searchButton.addEventListener("click", handleSearchButtonClick);
  } else {
    header = document.querySelector('.js-bottom-menu')
    searchButton.removeEventListener("click", handleSearchButtonClick);
    searchButton = document.querySelector('.js-bottom-menu__search-button')
    searchButton.addEventListener("click", handleSearchButtonClick);
  }
}

const throttledResize = throttle(handleResize, 200)

window.addEventListener('resize', throttledResize)
searchButton.addEventListener("click", handleSearchButtonClick);
