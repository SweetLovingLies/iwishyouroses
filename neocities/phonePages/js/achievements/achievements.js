// & Code by LilithDev! 
// ~ The colorful (symbol preceeding) comments are from me (figuring out how things work!) I learned most of what I know about async functions and json files from this code
// ~ I hope you can too!

let achievementData;

fetch(`/phonePages/js/achievements/achievements.json`, { cache: "no-store" })
  .then((response) => response.json())
  .then((json) => {
    achievementData = json;
    window.achievementData = achievementData;
    // console.log(achievementData);
  });

// & Loads toast CSS as necessary
async function loadAssets(namespace) {
  const toastStyleID = "toast-style-" + namespace;
  if (!document.getElementById(toastStyleID)) {
    // ~ Preloading css link
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.id = toastStyleID;

    // document.currentScript.getAttribute('namespace');
    link.href = achievementData[namespace].style;

    window.top.document.head.appendChild(link);
  }

  // & Loads an HTML file for displaying the achievements
  const toastTemplateID = "toast-template-" + namespace;
  if (!document.getElementById(toastTemplateID)) {
    const response = await fetch(achievementData[namespace].template, { cache: "no-store" });
    const templateData = await response.text();

    // ! Non Destructive way of adding html to the document body
    window.top.document.body.insertAdjacentHTML("beforeend", "<template id=" + toastTemplateID + ">" + templateData + "</template>");
  }
}

function hasAchievement(namespace, achievementID) {
  const achievementKey = `${namespace}:${achievementID}`;
  // console.log("Achievement already unlocked:", achievementKey);

  return localStorage.getItem(achievementKey) === 'true';
}

// & Waits for achievement data to load 
function waitForAchievementData(checkInterval = 100) {
  return new Promise((resolve) => { // & A promise is what you get from an async function when it's called.
    if (achievementData) resolve();

    const interval = setInterval(() => {
      if (achievementData) { // or any specific condition
        clearInterval(interval); // Stop checking
        resolve(); // Resolve the promise
      }
    }, checkInterval);
  });
}

async function getAchievement(namespace, achievementID) {
  // console.log("Got " + namespace + ":" + achievementID + "!");

  // ~ You already have this one!
  if (hasAchievement(namespace, achievementID)) {
    return;
  }

  await waitForAchievementData();

  // ~ Achievement doesn't exist
  if (!(achievementID in achievementData[namespace].achievements)) {
    return;
  }

  localStorage.setItem(namespace + ":" + achievementID, true);

  loadAssets(namespace).then(() => {
    const achievementTemplate = window.top.document.getElementById("toast-template-" + namespace);

    const clone = achievementTemplate.content.cloneNode(true);

    // ~ Set the class for the achievement toast
    const achievementClass = achievementData[namespace].achievements[achievementID].class;
    clone.querySelector(".achievement-toast").className += " " + achievementClass;

    // ~ Set the icon, title, and description
    clone.querySelector(".toast-icon").src = achievementData[namespace].achievements[achievementID].icon;
    clone.querySelector(".toast-title").textContent = achievementData[namespace].achievements[achievementID].title;
    clone.querySelector(".toast-description").textContent = achievementData[namespace].achievements[achievementID].description;

    // ~ Handle the light and dark mode polygons!
    const isHiddenAchievement = achievementClass === "achievementHidden";
    const lightPolygon = clone.querySelector("#light");
    const darkPolygon = clone.querySelector("#dark");

    if (isHiddenAchievement) {
      lightPolygon.style.display = "none";
      darkPolygon.style.display = "block";
    } else {
      lightPolygon.style.display = "block";
      darkPolygon.style.display = "none";
    }

    // ~ Play the achievement SFX
    let soundToPlay;
    soundToPlay = achievementData[namespace].sfx;
    if ("sfx" in achievementData[namespace].achievements[achievementID])
      soundToPlay = achievementData[namespace].achievements[achievementID].sfx;

    if (soundToPlay) {
      let pienSFX = new Audio(soundToPlay);
      pienSFX.volume = 0.2;
      pienSFX.play();
    }

    const toast = clone.querySelector(".achievement-toast");
    setTimeout(() => {
      if (getComputedStyle(toast)["animation-name"] == "none") { // ~ getComputerStyle returns an object with all of an objects CSS styling
        toast.remove();
        return;
      }

      toast.style.animationDirection = "reverse";

      const elm = toast;
      var newone = elm.cloneNode(true);
      elm.parentNode.replaceChild(newone, elm);

      newone.addEventListener("animationend", () => {
        newone.remove();
      });
      // }, 100000);
    }, 10000);

    window.top.document.body.appendChild(clone);
  });
}

window.addEventListener("message", (e) => {
  if ("achievement" in e.data) {
    getAchievement(e.data.namespace, e.data.achievement);
  }
});

// ! Debug Logs

// getAchievement("general", "achievementName");

function logAllAchievements() {
  const achievements = achievementData.general.achievements;
  const namespace = "general";

  Object.keys(achievements).forEach(key => {
    const achievement = achievements[key];

    const isCompleted = localStorage.getItem(namespace + ":" + key) === 'true';

    console.log(`Achievement: ${achievement.title}`);
    console.log(`  Description: ${achievement.description}`);
    console.log(`  Completed: ${isCompleted ? "Yes" : "No"}`);
    console.log(`  Namespace: ${namespace}`);
    console.log(`  ID: ${key}`);
    console.log(`  Hidden: ${achievement.hidden ? "Yes" : "No"}`);
    console.log(`  Icon: ${achievement.icon}`);
    console.log('----------------------------');
  });
}

// document.addEventListener('DOMContentLoaded', async () => {
//   await waitForAchievementData();
//   logAllAchievements();
// })
