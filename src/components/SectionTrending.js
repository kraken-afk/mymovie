import { TRENDING_URL, TV_POPULAR, SEARCH_URL_MOVIE, SEARCH_URL_TV } from "../data/constant";

const detailHandler = (event) => {
  const id = event.target.dataset.id;
  const sectionTrending = document.getElementById("trending-section");
  const main = document.getElementById("main");
  const sectionDetail = document.createElement("section-detail");
  const spinner = document.getElementById("spinner");

  spinner.hidden = false;

  sectionDetail.setAttribute("tmdb_id", id);

  sectionTrending.hidden = true;
  main.appendChild(sectionDetail);
}

class SectionTrending extends HTMLElement {
  constructor() {
    super();
    this.cards = Array();
    this.hidden = false;
    this.id = "trending-section";
    this.type = this.getAttribute("type");
  }

  #render() {
    const sectionTitle = document.createElement("h2");
    const div = document.createElement("div");

    sectionTitle.setAttribute("class", "section-title badge text-bg-danger fs-5");
    sectionTitle.textContent = this.type === "search_movie" || this.type === "search_tv" ? "Search Result" : "Trending";

    div.setAttribute("class", "row justify-content-center gap-4");

    this.cards.forEach(e => div.appendChild(e));
    this.append(sectionTitle);

    this.append(div);
  }

  #getCard(e) {
    const outer = document.createElement("div");
    outer.setAttribute("class", "card col-xs bg-dark text-light p-2");
    outer.style.width = "11rem";

    const posterAnchor = document.createElement("a");
    const poster = document.createElement("img");
    poster.setAttribute("src", `https://image.tmdb.org/t/p/w500/${e.poster_path}`);
    poster.setAttribute("class", "card-img-top mt-1");
    poster.setAttribute("alt", e.title || e.name);
    poster.setAttribute("data-id", e.id);
    poster.onclick = detailHandler;
    poster.style.cursor = "pointer";

    posterAnchor.appendChild(poster);

    const cardBody = document.createElement("div");
    const cardTitle = document.createElement("h5");
    cardBody.setAttribute("class", "card-body py-1");
    cardTitle.setAttribute("class", "card-title fw-bold fs-6")
    cardTitle.textContent = e.title || e.name;

    cardBody.appendChild(cardTitle);
    
    outer.append(posterAnchor);
    outer.append(cardBody);
    // outer.setAttribute()

    return outer;
  }

  #get404() {
    const h1 = document.createElement("h1");

    h1.setAttribute("class", "d-block mx-auto display-1 fw-bold text-danger");
    h1.textContent = "Not Found";

    return h1;
  }

  #getUrl() {
    switch (this.type) {
      case "movie":
        return TRENDING_URL;
      case "tv":
        return TV_POPULAR;
      case "search_movie":
        return SEARCH_URL_MOVIE + document.getElementById("form-input").value;
      case "search_tv":
        return SEARCH_URL_TV + document.getElementById("form-input").value;
      default: return false;
    }
  }

  #fetch() {
    const URL = this.#getUrl();
    const spinner = document.getElementById("spinner");

    spinner.hidden = false;
    fetch(URL)
      .then(res => res.json())
      .then(res => {

        if (res.results.length) {
          res.results.forEach(e => {
            this.cards.push(this.#getCard(e));
          });
        } else this.cards.push(this.#get404());

        this.#render();
        spinner.hidden = true;
      })
      .catch(err => console.error(err));
  }

  connectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
    this.innerHTML = String();
    this.cards = Array();
    this.#fetch();
  }

  static get observedAttributes() {
    return ["type"];
  }
}

customElements.define("section-trending", SectionTrending);