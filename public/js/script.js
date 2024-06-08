// Global variable - set up an array of existing games recorded.
var games = localStorage.getItem("games") == undefined ? [] : JSON.parse(localStorage.getItem("games"));

// For initialising the select box for games view
function initChampionSelect() {
  // URL from league of legends API
  let url = "https://ddragon.leagueoflegends.com/cdn/14.11.1/data/en_US/champion.json";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        // response handling
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // get champions data from the API
      const championSelect = document.getElementById("leap-champions-select");
      const championsData = Object.entries(data.data);

      if (championSelect != undefined) {
        // insert option element into the select box with data from the API
        championsData.forEach((element, key) => {
          championSelect[key] = new Option(element[1].name, element[1].name, false, false);

          if (championSelect.options[key].value != "") {
            championSelect.options[key].setAttribute("data-img", "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/" + element[0] + ".png");
          }
        });

        // initialise the select box with image with BVselect.js (library)
        var initChampionSelect = new BVSelect({
          selector: "#leap-champions-select",
          width: "100%",
          searchbox: true,
          offset: false,
          placeholder: "Select a Champion",
          search_placeholder: "Search...",
          search_autofocus: true,
        });
      }
    })
    .catch((error) => {
      // error handling
      console.error("There has been a problem with your fetch operation:", error);
    });
}

initChampionSelect();

// show and hide no content placeholders for goals and games views

function showHidePlaceNoContentPlaceholder() {
  // required data and elements from the DOM
  const gamesData = localStorage.getItem("games");
  const gamesPlaceholder = document.querySelector("#leap-games-no-content");
  const gamesMainContent = document.querySelector("#leap-games-has-content");
  const goalsData = localStorage.getItem("goals");
  const goalsPlaceholder = document.querySelector("#leap-goals-no-content");
  const goalsMainContent = document.querySelector("#leap-goals-has-content");

  // condition for show and hide for goals view
  if (goalsPlaceholder != undefined && goalsMainContent != undefined) {
    if (goalsData == undefined || goalsData == "[]" || goalsData == "") {
      goalsPlaceholder.classList.remove("d-none");
      goalsPlaceholder.classList.add("d-flex");

      goalsMainContent.classList.add("d-none");
    } else {
      goalsPlaceholder.classList.add("d-none");
      goalsPlaceholder.classList.remove("d-flex");

      goalsMainContent.classList.remove("d-none");
    }
  }
  // condition for show and hide for games view
  if (gamesPlaceholder != undefined && gamesMainContent != undefined) {
    if (gamesData == undefined || gamesData == "[]" || gamesData == "") {
      gamesPlaceholder.classList.remove("d-none");
      gamesPlaceholder.classList.add("d-flex");

      gamesMainContent.classList.add("d-none");
    } else {
      gamesPlaceholder.classList.add("d-none");
      gamesPlaceholder.classList.remove("d-flex");

      gamesMainContent.classList.remove("d-none");
    }
  }
}

// function for inserting entries in games view
function insertGameHtml(champion, rank, cs, vision, dmg, id) {
  // container for games entries
  const entriesWrapper = document.querySelector(".leap-recent-games-wrapper");
  // html markup
  const html = `
  <div class="leap-recent-game-entry d-flex flex-column flex-md-row align-items-center pe-md-4 pb-4 mb-4" data-id="${id}">
    <div class="leap-recent-game-avatar-wrapper me-md-4 mb-3 mb-md-0">
      <div class="leap-recent-game-champion">
        <img src="https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/${champion}.png" alt="" class="leap-recent-game-champion-img"/>
      </div>
      <div class="leap-recent-game-rank">
        <img src="img/${rank}.png" alt="" />
      </div>
    </div>
    <div class="leap-recent-game-data d-flex flex-column flex-md-row w-100 align-items-md-center">
      <div class="leap-recent-game-data-item pe-md-5 mb-3 mb-md-0">
        <h3 class="leap-recent-game-data-title fs-6 text-secondary">
          Vision Score
        </h3>
        <span class="leap-recnet-game-data d-block fs-3 text-light">${vision}</span>
      </div>
      <div class="leap-recent-game-data-item pe-md-5 mb-3 mb-md-0">
        <h3 class="leap-recent-game-data-title fs-6 text-secondary">
          CS / Min
        </h3>
        <span class="leap-recnet-game-data d-block fs-3 text-light">${cs}</span>
      </div>
      <div class="leap-recent-game-data-item pe-md-5 mb-4 mb-md-0">
        <h3 class="leap-recent-game-data-title fs-6 text-secondary">
          Damage / Min
        </h3>
        <span class="leap-recnet-game-data d-block fs-3 text-light">${dmg}</span>
      </div>
      <button class="btn btn-danger ms-md-auto leap-delete-games-btn">Delete</button>
    </div>
  </div>
  `;

  // inserting entries
  if (entriesWrapper != undefined) {
    entriesWrapper.insertAdjacentHTML("beforeend", html);
  }
}

// initialising BVselect library for ranks select box in games view
const ranksOptions = document.querySelectorAll("#leap-ranks option");

ranksOptions.forEach((element) => {
  const imagePath = "img/" + element.innerText.toLowerCase() + ".png";
  element.setAttribute("data-img", imagePath);
});

function initRankSelect() {
  var initRankSelect = new BVSelect({
    selector: "#leap-ranks",
    width: "100%",
    searchbox: true,
    offset: false,
    placeholder: "Select a rank",
    search_placeholder: "Search...",
    search_autofocus: true,
  });
}

// add games function starts here
const selectAllInputs = document.querySelectorAll("#leaps-record-game-modal .leap-inputs, #leaps-record-game-modal .leap-selects");
const submitGameBtn = document.querySelector("#leap-submit-game-btn");
var getGameModalInstance = document.getElementById("leap-record-game-modal") != undefined ? bootstrap.Modal.getOrCreateInstance(document.getElementById("leap-record-game-modal")) : "";

// on click function for add games view
if (submitGameBtn != undefined) {
  submitGameBtn.addEventListener("click", () => {
    const alert = document.querySelector(".leap-record-game-alert");

    // validation - check if required fields are empty
    let emptyFound = Array.from(selectAllInputs).find((element) => {
      if (element.value == "") {
        return true;
      }

      return false;
    });

    // if there is empty field, show alert
    if (emptyFound) {
      if (alert.classList.contains("d-none")) {
        alert.classList.remove("d-none");
      }

      // hide alert after 2 seconds
      setTimeout(() => {
        if (!alert.classList.contains("d-none")) {
          alert.classList.add("d-none");
        }
      }, 2000);
    } else {
      if (!alert.classList.contains("d-none")) {
        alert.classList.add("d-none");
      }

      // get data from all inputs

      const championImage = document.getElementById("leap-champions-select").value;
      const csPerMin = document.getElementById("leap-cs-min").value;
      const dmgPerMin = document.getElementById("leap-dmg-min").value;
      const visionScore = document.getElementById("leap-vision-score").value;
      const rank = document.getElementById("leap-ranks").value;
      const id = "id" + Math.random().toString(16).slice(2);

      getGameModalInstance.hide();

      // insert entries into container
      insertGameHtml(championImage, rank, csPerMin, visionScore, dmgPerMin, id);

      // insert data into localstorage

      const gameData = {
        id: id,
        champion: championImage,
        rank: rank,
        cs: csPerMin,
        vision: visionScore,
        dmg: dmgPerMin,
      };

      games.push(gameData);

      localStorage.setItem("games", JSON.stringify(games));

      // hide placeholder if number of entries go from 0 to 1
      showHidePlaceNoContentPlaceholder();
    }
  });
}

// reset record game modal form data on modal close
const recordGameModal = document.getElementById("leap-record-game-modal");

if (recordGameModal != undefined) {
  recordGameModal.addEventListener("hidden.bs.modal", () => {
    const selects = document.querySelectorAll(".bv_mainselect");
    const inputs = document.querySelectorAll(".leap-inputs");

    selects.forEach((element) => {
      element.remove();
    });

    inputs.forEach((element) => {
      element.value = "";
    });

    // reset the 2 selects - to have empty value when reopened
    initRankSelect();
    initChampionSelect();
  });
}

if (recordGameModal != undefined) {
  document.addEventListener("DOMContentLoaded", () => {
    initRankSelect();
  });
}

// add goals function starts here

const goals = localStorage.getItem("goals") == undefined ? [] : JSON.parse(localStorage.getItem("goals"));

// Goals limit - the goals system is limited to 3 types of goals: cs/min, vision score and dmg per minute
let goalsTypeLimit = [];

if (localStorage.getItem("goalsTypeLimit") == undefined) {
  // if localstorage has no goals limit , set the limit to an empty array
  localStorage.setItem("goalsTypeLimit", JSON.stringify([]));
}

const addGoalsBtn = document.querySelector("#leap-submit-goal-btn");

// get goals modal
var getGoalModalInstance = document.getElementById("leap-add-goals-modal") != undefined ? bootstrap.Modal.getOrCreateInstance(document.getElementById("leap-add-goals-modal")) : "";

// inseet goals function similar to insert games
function insertGoalHtml(type, average, target, percentage) {
  var html = `
  <div class="leap-goal w-100 pb-4 mb-4">
    <div class="leap-goal-info-wrapper d-flex align-items-center w-100 mb-4">
      <div class="leap-goal-info-left d-flex align-items-center">
        <i class="material-icons-outlined text-light fs-1 me-2">emoji_events</i>
        <h2 class="text-secondary fs-5 mb-0">${type}</h2>
      </div>
      <div class="leap-goal-info-right text-light fs-5 ms-auto">
        <span class="leap-goal-achieved">${average}</span>
        <span> / </span>
        <span class="leap-goal-target">${target}</span>
      </div>
    </div>
    <div class="leap-goal-progress-wrapper">
      <div class="progress" role="progressbar" aria-label="Basic example" style="height: 8px">
        <div class="progress-bar bg-danger" style="width: ${percentage}%"></div>
      </div>
    </div>
  </div>
  `;

  const goalsEntriesWrapper = document.querySelector(".leap-goals-wrapper");

  if (goalsEntriesWrapper != undefined) {
    goalsEntriesWrapper.insertAdjacentHTML("beforeend", html);
  }
}

// add goals on click function

if (addGoalsBtn != undefined) {
  addGoalsBtn.addEventListener("click", () => {
    // get all input value from the form
    const goalType = document.querySelector("#leap-goal-type").value;
    const goalTarget = document.querySelector("#leap-goal-target").value;

    const existingGoalsTypes = JSON.parse(localStorage.getItem("goalsTypeLimit"));
    var average;
    var data;

    const getAllInputs = document.querySelectorAll("#leap-add-goals-modal .leap-inputs, #leap-goal-type");

    const emptyAlert = document.querySelector(".leap-goals-alert");
    const goalExistsAlert = document.querySelector(".leap-goal-exists-alert");

    // validate for empty fields
    let emptyFound = Array.from(getAllInputs).find((element) => {
      if (element.value == "") {
        return true;
      }

      return false;
    });

    if (emptyFound) {
      if (emptyAlert.classList.contains("d-none")) {
        emptyAlert.classList.remove("d-none");
      }

      setTimeout(() => {
        if (!emptyAlert.classList.contains("d-none")) {
          emptyAlert.classList.add("d-none");
        }
      }, 2000);
    } else {
      // check if localstorage has all 3 goal types
      if (!existingGoalsTypes.includes(goalType)) {
        const dataArray = [];

        const goalAchievedAlert = document.querySelector(".leap-goal-achieved-alert");

        if (localStorage.getItem("games") == undefined) {
          // if there is no existing games, set average to 0
          average = 0;
        } else {
          data = JSON.parse(localStorage.getItem("games"));

          // if thre is game, calculate average based on goal types
          data.forEach((element) => {
            if (goalType == "CS / min") {
              dataArray.push(Number(element.cs));
            } else if (goalType == "Vision Score") {
              dataArray.push(Number(element.vision));
            } else {
              if (goalType == "Damage / min") {
                dataArray.push(Number(element.dmg));
              }
            }
          });

          average = Math.round(dataArray.reduce((a, b) => a + b, 0) / dataArray.length);
        }

        const percentage = Math.round((average / Number(goalTarget)) * 100);

        // validation - if average is greater than the goal users set, prompt error
        if (average >= goalTarget) {
          if (goalAchievedAlert.classList.contains("d-none")) {
            goalAchievedAlert.classList.remove("d-none");
          }

          setTimeout(() => {
            if (!goalAchievedAlert.classList.contains("d-none")) {
              goalAchievedAlert.classList.add("d-none");
            }
          }, 2000);
        } else {
          // update local storage with data
          const goal = {
            type: goalType,
            target: goalTarget,
            average: average,
            percentage: percentage,
          };

          const checkGamesData = localStorage.getItem("games");

          goals.push(goal);
          existingGoalsTypes.push(goalType);

          localStorage.setItem("goals", JSON.stringify(goals));
          // update goal type limits
          localStorage.setItem("goalsTypeLimit", JSON.stringify(existingGoalsTypes));

          if (checkGamesData == undefined || checkGamesData == "[]" || checkGamesData == "") {
            insertGoalHtml(goalType, 0, goalTarget, percentage);
          } else {
            insertGoalHtml(goalType, average, goalTarget, percentage);
          }

          showHidePlaceNoContentPlaceholder();

          getGoalModalInstance.hide();
        }
      } else {
        if (goalExistsAlert.classList.contains("d-none")) {
          goalExistsAlert.classList.remove("d-none");
        }

        setTimeout(() => {
          if (!goalExistsAlert.classList.contains("d-none")) {
            goalExistsAlert.classList.add("d-none");
          }
        }, 2000);
      }
    }
  });
}

// delete game function

const deleteGamesBtn = document.querySelectorAll(".leap-delete-games-btn");

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".leap-delete-games-btn");

  if (btn) {
    // get unique id from parent node of button
    const getElementId = e.target.parentElement.parentElement.getAttribute("data-id");
    const localStorageData = JSON.parse(localStorage.getItem("games"));
    // check if ids match
    const matchedItem = localStorageData.find((element) => element.id == getElementId);

    // remove matched item from local storage
    localStorageData.splice(localStorageData.indexOf(matchedItem), 1);

    // remove entry from front-end
    e.target.parentElement.parentElement.remove();

    // update localstorage
    localStorage.setItem("games", JSON.stringify(localStorageData));

    // toggle no content placeholder when necessary
    showHidePlaceNoContentPlaceholder();
  }
});
