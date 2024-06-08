import AbstractView from "./AbstractViews.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Leap");
  }

  async getHtml() {
    return `
    <div class="leap-no-content-container container d-flex flex-column align-items-center justify-content-center">
      <h2 class="leap-no-content-heading">Welcome to Leap!</h2>
      <p class="leap-paragraph">Leap is a simple tracker app designed to enhance your performance as a League of Legends player. Get started by recording a recent game or setting goals for the game stats you want to improve.</p>
      <div class="d-flex align-items-center">
        <a href="/games" class="leap-btns leap-btn-red d-block me-3" data-link>Record Game</a>
        <a href="/goals" class="leap-btns leap-btn-grey" data-link>Set Goals</a>
      </div>
    </div>
        `;
  }
}
