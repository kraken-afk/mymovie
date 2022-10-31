import moment from "moment/moment";
import star from "../../public/icons/star-solid.svg";

class SectionDetail extends HTMLElement {
  constructor() {
    super();
    this.tmdb_id = this.getAttribute("tmdb_id");
  }

  #getDetail(res) {
    const genres = [];
    res.genres.forEach(e => genres.push(e.name));

    return(
      `<tr>
          <td class="fw-bold">Genre: </td>
          <td>${genres.join(", ")}</td>
       </tr> 
       <tr>
          <td class="fw-bold">Status: </td>
          <td>${res.status || "-"}</td>
       </tr>
       <tr>
          <td class="fw-bold">Release: </td>
          <td>${moment(res.release_date).format("LL") || moment(res.first_air_date).format("LL") || "-"}</td>
       </tr>
       <tr>
          <td class="fw-bold">Duration: </td>
          <td>${res.runtime || res.last_episode_to_air.runtime || "-"} min</td>
       </tr>

       ${res.number_of_episodes === undefined ? "" :
       `
        <tr>
          <td class="fw-bold">Total eps: </td>
          <td>${res.number_of_episodes} Eps</td>
        </tr>`}
       `
       );
  }

  #getUrl() {
    const type = document.getElementById("trending-section").type;

    switch (type) {
      case "movie":
      case "search_movie":
        return `https://api.themoviedb.org/3/movie/${this.tmdb_id}?api_key=49a1a6e90615c7725e0006f987afde1f`;
      case "tv":
      case "search_tv":
        return `https://api.themoviedb.org/3/tv/${this.tmdb_id}?api_key=49a1a6e90615c7725e0006f987afde1f`;
      default: return false;
    }
  }

  #getData() {
    const URL = this.#getUrl();
      fetch(URL)
      .then(res => res.json())
      .then(res => {
        const spinner = document.getElementById("spinner");

        this.#render(res);
        spinner.hidden = true;
      })
      .catch(err => console.log(err))
  }

  #render(res) {
    const outer = document.createElement("section")  ;
    const title = document.createElement("h1");
    const figure = document.createElement("figure");
    const poster = document.createElement("img");
    const ratingWrapper = document.createElement("div");
    const starSvg = document.createElement("img");
    const rateSpan = document.createElement("span");
    const tableDetail = document.createElement("table");
    const overview = document.createElement("p");
    const backBtn = document.createElement("button");
    const tagline = document.createElement("q");

    outer.setAttribute("class", "container");
    title.setAttribute("class", "text-center fw-bold");
    figure.setAttribute("class", "figure-detail mx-auto mt-5");

    poster.setAttribute("class", "w-100 rounded");
    poster.setAttribute("src", "https://image.tmdb.org/t/p/w500" + res.poster_path);
    poster.setAttribute("alt", res.title) || res.name;

    ratingWrapper.setAttribute("class", "fw-bold d-flex align-items-center mx-auto my-2 rate-bar")

    starSvg.setAttribute("class", "star")
    starSvg.setAttribute("src", star);
    console.log(starSvg);
    starSvg.width = 18;
    starSvg.style.marginRight = "1rem"

    rateSpan.setAttribute("class", "fw-6");
    rateSpan.textContent = Number(res.vote_average).toFixed(2);

    title.textContent = res.title || res.name;

    tableDetail.setAttribute("class", "table mw-100 mx-auto");
    tableDetail.innerHTML = this.#getDetail(res);

    tagline.setAttribute("class", "lead text-center d-block mx-auto fw-bold");
    tagline.textContent = res.tagline;

    figure.appendChild(poster);

    ratingWrapper.appendChild(starSvg);
    ratingWrapper.appendChild(rateSpan);

    overview.setAttribute("class", "py-3")
    overview.textContent = res.overview;

    backBtn.setAttribute("class", "btn btn-danger")
    backBtn.textContent = "Back";

    backBtn.onclick = () => {
      const sectionTrending = document.getElementById("trending-section");
      this.remove();
      sectionTrending.hidden = false;
    }

    outer.appendChild(title);
    outer.appendChild(figure);
    outer.appendChild(ratingWrapper);
    outer.appendChild(tableDetail);
    outer.appendChild(tagline);
    outer.appendChild(overview);
    outer.appendChild(backBtn);

    this.appendChild(outer);
  }

  // connectedCallback() {
  //   this.#getData();
  // }

  disconnectedCallback() {
    console.log("clear");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
    this.#getData();
  }

  static get observedAttributes() {
    return ["tmdb_id"];
  }
}

customElements.define("section-detail", SectionDetail);