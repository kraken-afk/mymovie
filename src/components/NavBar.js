import { navCollapsed } from "../utils/navCollapsed";

class Navbar extends HTMLElement {
  constructor() {
    super();
    this.brand = this.getAttribute("brand") || String();
  }

  #render() {
    this.innerHTML =
    `<nav class="navbar navbar-dark navbar-expand-lg bg-dark py-1 px-2 sticky-top">
      <div class="container-fluid">
        <a class="navbar-brand text-danger fw-bold fs-1">${this.brand}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 fs-5">
            <li class="nav-item">
              <a type="movie" class="nav-link active" aria-current="page">Movie</a>
            </li>
            <li class="nav-item">
              <a type="tv" class="nav-link">TV Shows</a>
            </li>
          </ul>
          <form class="d-flex" role="search" id="form">
            <input class="form-control me-2" type="search" placeholder="Search Movie" aria-label="Search" id="form-input">
            <button id="submit-btn" class="btn btn-outline-danger" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>`;
  }

 connectedCallback() {
  this.#render();
  const navBtns = document.querySelectorAll(".nav-item");

  document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("form-input");
    const form = document.getElementById("form");
    const navbarBrand = document.querySelector(".navbar-brand");

    navBtns.forEach(element => {
      element.addEventListener("click", (event) => {

        navBtns.forEach(e => {
          e.children[0].classList.remove("active");
          e.children[0].removeAttribute("aria-current");
        });

        event.target.classList.add("active");
        event.target.setAttribute("aria-current", "page");
        searchBar.setAttribute("placeholder", "Search " + event.target.type[0].toUpperCase() + event.target.type.split("").slice(1, Infinity).join(""));

        window["current_type"] = event.target.type;

        const sectionTrending = document.getElementById("trending-section");
        const sectionDetail = document.querySelector("section-detail");

        sectionTrending.setAttribute("type", event.target.type);
        sectionTrending.hidden = false;

        sectionDetail?.remove();
        navCollapsed();
      })
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!searchBar.value) return;

      const section = document.getElementById("trending-section");
      const sectionTrending = document.getElementById("trending-section");
      const sectionDetail = document.querySelector("section-detail");

      sectionTrending.hidden = false;

      sectionDetail?.remove();
      section.setAttribute("type", "search_" + window["current_type"]);
      navCollapsed();
    });

    navbarBrand.addEventListener("click", () => window.location.href = window.location.href);
  })
 }

 attributeChangedCallback(name, oldValue, newValue) {
  this[name] = newValue;
  this.#render();
 }

 static get observedAttributes() {
  return ["brand"];
 }

}

customElements.define("nav-bar", Navbar);