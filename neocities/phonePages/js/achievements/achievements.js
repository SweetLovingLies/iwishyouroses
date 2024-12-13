// & Code by LilithDev. Adding my own comments so I can understand everything (or mark things I don't understand...)

// & Stores data from achievements.json file
let achievementData;

fetch('achievements.json', {cache: "no-store"}) //& cache: "no-store" keeps the browser from caching anything so only the newest info is retrieved
    .then((response) => response.json()) // & Syntax: then(onRetrieved, onRejected) 
    .then((json) => { // & Requests the Data from the JSON file 
      achievementData = json;
      window.achievementData = achievementData;
      // console.log(achievementData);
});

// & Loads toast CSS as necessary
// ! Must be Async because there may not be any achievement data
async function loadAssets(namespace) { // ? Not sure what namespace is yet.
  const toastStyleID = "toast-style-" + namespace;
  if(!document.getElementById(toastStyleID)) {
    // Load the achievement style in advance just to preload it
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.id = toastStyleID;
    // document.currentScript.getAttribute('namespace');
    link.href = achievementData[namespace].style;

    // Append link element to HTML head
    document.head.appendChild(link);
  }
  
  // & Loads an HTML file for displaying the achievements
  const toastTemplateID = "toast-template-" + namespace;
  if(!document.getElementById(toastTemplateID)) {
    /*fetch(achievementData[namespace].template, {cache: "no-store"})
    .then((response) => response.text())
    .then((text) => {
      document.body.insertAdjacentHTML("beforeend", "<template id=" + toastTemplateID + ">" + text + "</template>");
      //achievementTemplate = document.querySelector("#" + toastTemplateID);
    });*/
    const response = await fetch(achievementData[namespace].template, {cache: "no-store"});
    const templateData = await response.text();
    document.body.insertAdjacentHTML("beforeend", "<template id=" + toastTemplateID + ">" + templateData + "</template>");   // ? Why an HTML File though?
  }
}

function hasAchievement(namespace, achievementID) {
  // console.log("Achievement already unlocked:", namespace, achievementID);
  return window.localStorage.getItem(namespace + ":" + achievementID) === 'true';
}

// & Waits for achievement data to load 
function waitForAchievementData(checkInterval = 100) {
  return new Promise((resolve) => { // & A promise is what you get from an async function when it's called.
    if(achievementData) resolve(); // & Discovering that you can shorthand 1 statement if statements
    
    const interval = setInterval(() => {
      if (achievementData) { // or any specific condition
        clearInterval(interval); // Stop checking
        resolve(); // Resolve the promise
      }
    }, checkInterval); // Check every 'checkInterval' milliseconds
  });
}

async function getAchievement(namespace, achievementID) {
  //console.log("Got " + namespace + ":" + achievementID);
  
  // You already have the achievement
  if(hasAchievement(namespace, achievementID)) {
    return;
  }
  
  // Wait for the critical data (I know, gross)
  await waitForAchievementData();
  
  // Achievement doesn't exist
  if(!(achievementID in achievementData[namespace].achievements)) {
    return;
  }
  
  window.localStorage.setItem(namespace + ":" + achievementID, true);
  
  loadAssets(namespace).then(() => {
    const achievementTemplate = document.getElementById("toast-template-" + namespace);
  
    const clone = achievementTemplate.content.cloneNode(true);

    clone.querySelector(".achievement-toast").className += " " + achievementData[namespace].achievements[achievementID].class;
    clone.querySelector(".toast-icon").src = achievementData[namespace].achievements[achievementID].icon;
    clone.querySelector(".toast-title").textContent = achievementData[namespace].achievements[achievementID].title;
    clone.querySelector(".toast-description").textContent = achievementData[namespace].achievements[achievementID].description;

    // Play the achievement SFX
    let soundToPlay;
    soundToPlay = achievementData[namespace].sfx;
    if("sfx" in achievementData[namespace].achievements[achievementID])
      soundToPlay = achievementData[namespace].achievements[achievementID].sfx;

    if(soundToPlay) {
      let pienSFX = new Audio(soundToPlay);
      pienSFX.volume = 0.2;
      pienSFX.play();
    }

    const toast = clone.querySelector(".achievement-toast");
    setTimeout(() => {
      if(getComputedStyle(toast)["animation-name"] == "none") {
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
    }, 10000);

    document.body.appendChild(clone);
  });
}

document.onkeypress = function (e) {
  switch(e.key) {
    case "q":
      console.log("test");
      getAchievement("general", "yanShrine");
      break;
    case "w":
      console.log("test");
      getAchievement("general", "iwishyouroses");
      break;
    case "e":
      console.log("test");
      getAchievement("general", "Nice");
      break;
    case "r":
      console.log("gay");
      getAchievement("general", "Hangman");
      break;
  }
};

window.addEventListener("message", (e) => {
  if("achievement" in e.data) {
    getAchievement(e.data.namespace, e.data.achievement);
  }
});