class LoadSpinner extends HTMLElement {
  constructor() {
    super();

    this.id = "spinner";
    this.hidden = true;
  }

  #render() {
    this.innerHTML =
    `
    <div class="spinner-border text-danger" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    `;
  }

  connectedCallback() {
    this.#render();
    console.log("spinner rendered");
  }
}

customElements.define("load-spinner", LoadSpinner);