import AbstractView from "./AbstractViews.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Games");
  }

  async getHtml() {
    return `
    <div class="leap-no-content-container container d-none flex-column align-items-center justify-content-center" id="leap-games-no-content">
        <h2 class="leap-no-content-heading">No recent games found.</h2>
        <p class="leap-paragraph">Keep track your game performance by recording your League of Legend games. Get started by selecting a rank, champion, vision score, CS / min and damage / min.</p>
        <div class="d-flex align-items-center">
            <button class="leap-btns leap-btn-red d-block me-3" data-bs-toggle="modal" data-bs-target="#leap-record-game-modal">Record Game</button>
        </div>
    </div>

    <div class="container pt-5 pe-0 pe-md-5" id="leap-games-has-content">
        <div class="leap-no-entries-wrapper"></div>
            <div class="leap-has-entries-wrapper">
                <h1 class="leap-content-h1 mb-4">Recent Games</h1>
                <div class="leap-recent-games-wrapper"></div>
                <button class="leap-btns leap-btn-red d-block me-3" data-bs-toggle="modal" data-bs-target="#leap-record-game-modal">Record Game</button>
            </div>
    </div>
        `;
  }
}
