import {
  LitElement,
  html,
  customElement,
  css,
  property,
  internalProperty,
} from "lit-element";

import Fuse from "fuse.js";

/**
 * The static search element.
 */
@customElement("search-element")
export class MyElement extends LitElement {
  static styles = css`
    :host {
      --overlay-color: hsla(0, 0%, 0%, 0.3);
      --bg-color: hsla(0, 0%, 95%);
      --text-color: hsla(0, 0%, 0%);
      color: var(--text-color);
    }
    :host * {
      box-sizing: border-box;
    }
    .o-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      max-width: 100%;
      height: 100vh;
      background-color: var(--overlay-color);
    }
    .o-search-wrapper {
      position: relative;
      top: 1.25rem;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 4rem);
      max-width: 1280px;
    }
    .u-search-show {
      animation-name: show;
      animation-timing-function: ease;
      animation-duration: 400ms;
    }
    .u-search-hide {
      animation-name: hide;
      animation-timing-function: ease;
      animation-duration: 400ms;
    }
    .c-search-input {
      width: 100%;
      padding: 0.5rem 0.8rem;
      border-radius: 6px;
      font-size: 1.2rem;
    }
    .c-search-input:focus {
      box-shadow: none;
      outline: none;
      border: 4px solid var(--link-color-light);
    }
    .c-search-list {
      list-style-type: none;
      padding: 0;
      margin: 0.3rem 0;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-color);
      padding: 0.5rem;
      border-radius: 6px;
    }
    .c-search-list__item {
      font-family: var(--sans-serif, sans-serif);
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
    }
    .c-search-list__item:hover {
      background: hsla(0, 0%, 80%, 0.8);
    }
    .c-search-list__item.active {
      background: hsla(0, 0%, 80%, 0.8);
    }
    .c-search-list__link {
      color: var(--text-color);
      width: 100%;
      display: inline-block;
    }
    .c-search-list__link:visited {
      color: var(--main-color);
    }
    .c-item-title .c-item-match {
       background: hsl(11, 100%, 81%);
    }
    @keyframes show {
      0% {
        opacity: 0;
        top: -10rem;
      }
      100% {
        opacity: 1;
        top: 1.25rem;
      }
    }
    @keyframes hide {
      0% {
        opacity: 1;
        top: 1.25rem;
      }
      100% {
        opacity: 0;
        top: -10rem;
      }
    }
  `;

  @property()
  searchIndex = [];

  @internalProperty()
  private searchList: Array<Record<string, any>> = [];

  @internalProperty()
  private showList: boolean = false;

  @internalProperty()
  private activeElement?: HTMLLIElement | null;

  @internalProperty()
  private fuse: Fuse<any, any>;

  @internalProperty()
  private fuseOptions = {
    keys: ["title", "tags", "uri"],
    includeMatches: true
  };

  connectedCallback() {
    super.connectedCallback();
    this.fuse = new Fuse(this.searchIndex, this.fuseOptions);
    setTimeout(() => {
      this.shadowRoot
        .querySelector<HTMLInputElement>(".c-search-input")
        .focus();
    }, 0);
  }

  attributeChangedCallback(
    name: string,
    oldValue: any | null,
    newValue: any | null
  ) {
    if (newValue && name === "searchindex") {
      this.searchIndex = JSON.parse(newValue);
      this.fuse = new Fuse(this.searchIndex, this.fuseOptions);
    }
  }

  private handleOverlayClick({ target }: { target: HTMLElement }) {
    const shadowRoot = this.shadowRoot;
    if (shadowRoot) {
      const searchWrapper = shadowRoot.querySelector<HTMLDivElement>(
        ".o-search-wrapper"
      );
      if (searchWrapper && searchWrapper.contains(target)) {
        return;
      }
      const closeEvent = new Event("close");
      this.dispatchEvent(closeEvent);
    }
  }

  private handleOverlayInput({ target }: { target: HTMLInputElement }) {
    const res = this.fuse.search(target.value);
    if (!Array.isArray(res)) {
      this.searchList = [];
      this.searchList.push(res);
    } else {
      this.searchList = res;
    }

    if (res.length > 0) {
      this.showList = true;
      setTimeout(() => {
        if (this.activeElement) {
          this.activeElement.classList.remove("active");
          this.activeElement.tabIndex = -1
        }
        this.activeElement = this.getFirstElementOfList();
        if (this.activeElement) {
          this.activeElement.classList.add("active");
          this.activeElement.tabIndex = 0
        }
      }, 0);
    } else {
      this.showList = false;
    }
  }

  private getFirstElementOfList(): HTMLLIElement | null | undefined {
    return this.shadowRoot?.querySelector<HTMLLIElement>(
      "li.c-search-list__item:first-child"
    );
  }

  private getLastElementOfList(): HTMLLIElement | null | undefined {
    return this.shadowRoot?.querySelector<HTMLLIElement>(
      "li.c-search-list__item:last-child"
    );
  }

  private handleListKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (this.activeElement) {
          this.activeElement.classList.remove("active");
          this.activeElement.tabIndex = -1
          const next = this.activeElement.nextElementSibling as HTMLLIElement;
          if (next) {
            this.activeElement = next;
            this.activeElement.classList.add("active");
            this.activeElement.tabIndex = 0
          } else {
            this.activeElement = this.getFirstElementOfList();
            if (this.activeElement) {
              this.activeElement.classList.add("active");
              this.activeElement.tabIndex = 0
            }
          }
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (this.activeElement) {
          this.activeElement.classList.remove("active");
          this.activeElement.tabIndex = -1;
          const prev = this.activeElement
            .previousElementSibling as HTMLLIElement;
          if (prev) {
            this.activeElement = prev;
            this.activeElement.classList.add("active");
            this.activeElement.tabIndex = 0;
          } else {
            this.activeElement = this.getLastElementOfList();
            if (this.activeElement) {
              this.activeElement.classList.add("active");
              this.activeElement.tabIndex = 0;
            }
          }
        }
        break;
      case "Enter":
        e.preventDefault();
        if (this.activeElement) {
          this.activeElement.querySelector<HTMLAnchorElement>("a")?.click();
        }
        break;
      case "Tab":
        e.preventDefault();
    }
  }

  highlightMatches(match: any) {
    const templateArray = []
    let currIndex = 0
    match.indices.forEach((i: any) => {
      templateArray.push(html`${match.value.slice(currIndex, i[0])}`);
      templateArray.push(html`<span class="c-item-match">${match.value.slice(i[0], i[1] + 1)}</span>`)
      currIndex = i[1] + 1
    })
    templateArray.push(html`${match.value.slice(currIndex)}`);

    return html`${templateArray.map(item => item)}`
  }

  render() {
    return html`
      <div @click="${this.handleOverlayClick}" class="o-overlay">
        <div class="o-search-wrapper u-search-show">
          <input
            @keydown="${this.handleListKeyDown}"
            @input="${this.handleOverlayInput}"
            class="c-search-input"
            type="text"
          />
          ${this.showList
            ? html`<ul class="c-search-list">
                ${this.searchList
                  .filter((i) => 
                    i.item.title !== "" && i.item.title !== undefined
                  )
                  .map(
                    (i) => html`<li class="c-search-list__item">
                    <a href="${i.item.uri}" class="c-search-list__link">
                      <div>
                        <span class="c-item-title">${this.highlightMatches(i.matches.find(match => match.key === 'title'))}</span>
                      </div>
                      ${i.item.tags ? html`
                        <div>
                          [<span class="c-item-tags">${i.item.tags}</span>]
                        </div>
                      ` : ""}
                    <a/>
                  </li>`
                  )}
              </ul>`
            : ""}
        </div>
      </div>
    `;
  }
}
