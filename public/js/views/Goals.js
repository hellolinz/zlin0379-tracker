import AbstractView from "./AbstractViews.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Goals");
  }

  async getHtml() {
    return `
    <div class="leap-no-content-container container d-none flex-column align-items-center justify-content-center" id="leap-goals-no-content">
        <h2 class="leap-no-content-heading">Oops! Seems like there is no goals</h2>
        <p class="leap-paragraph">Elevate your game performance by setting smart goals. Get started by selecting a goal type and your goal target.</p>
        <div class="d-flex align-items-center">
        <button class="leap-btns leap-btn-red d-block me-3" data-bs-toggle="modal" data-bs-target="#leap-add-goals-modal" id="leap-add-goals-btn">Add Goals</button>
        </div>
    </div>

    <div class="container pt-md-5 pe-0 pe-md-5 leap-mobile-padding-top" id="leap-goals-has-content">
        <div class="leap-has-entries-wrapper">
            <h1 class="leap-content-h1 mb-4">Goals</h1>
            <div class="leap-goals-wrapper"></div>
            <button class="leap-btns leap-btn-red d-block me-3" data-bs-toggle="modal" data-bs-target="#leap-add-goals-modal" id="leap-add-goals-btn">Add Goals</button>
        </div>
    </div>

        `;
  }
}
