import About from "./views/About.js";
import Games from "./views/Games.js";
import Goals from "./views/Goals.js";

const pathToRegex = (path) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: "/", view: About },
    { path: "/games", view: Games },
    { path: "/goals", view: Goals },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  const view = new match.route.view(getParams(match));

  // output html from each view
  document.querySelector("#leap-main-content").innerHTML = await view.getHtml();

  // insert game data from local storage when page is loaded

  const goalsData = JSON.parse(localStorage.getItem("goals"));
  const gamesData = JSON.parse(localStorage.getItem("games"));

  // empty arrays for datas
  var csGameData = [];
  var visionGameData = [];
  var dmgGameData = [];
  var average;

  if (localStorage.getItem("games") != undefined) {
    gamesData.forEach((element) => {
      // insert game entries from localstorage
      insertGameHtml(element.champion, element.rank, element.cs, element.vision, element.dmg, element.id);

      // push datas into respective arrays to calculate average data (cs, vision score etc)
      csGameData.push(Number(element.cs));
      visionGameData.push(Number(element.vision));
      dmgGameData.push(Number(element.dmg));
    });
  }

  if (localStorage.getItem("goals") != undefined) {
    if (gamesData == undefined || gamesData == "[]" || gamesData == "") {
      goalsData.forEach((element) => {
        // if theres no existing data, set average and progress of goal to 0
        insertGoalHtml(element.type, 0, element.target, 0);
      });
    } else {
      // if there is existing data, calculate average based on goal type
      goalsData.forEach((element) => {
        if (element.type == "CS / min") {
          average = Math.round(csGameData.reduce((a, b) => a + b, 0) / csGameData.length);
        } else if (element.type == "Vision Score") {
          average = Math.round(visionGameData.reduce((a, b) => a + b, 0) / visionGameData.length);
        } else {
          if (element.type == "Damage / min") {
            average = Math.round(dmgGameData.reduce((a, b) => a + b, 0) / dmgGameData.length);
          }
        }
        // get percentage for the progress bar
        const percentage = Math.round((average / Number(element.target)) * 100);

        // insert goal entries into container
        insertGoalHtml(element.type, average, element.target, percentage);
      });
    }
  }

  showHidePlaceNoContentPlaceholder();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});
