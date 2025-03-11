// ~ Visitor Count by netfriend - https://netfriend.neocities.org/visitor-count/
// ~ Released under the Unlicense - https://unlicense.org
// & Modified by me!

const visitor_count_source = "neocities";
const neocities_site_name = "iwishyouroses";
const visitor_count_selector = ".visitorCount";
const created_at_selector = ".creationDate";
const last_updated_selector = ".lastUpdated";

(function () {

  let stats_url;
  let info_parser;

  if (visitor_count_source.toLowerCase() === "neocities") {
    stats_url = `https://weirdscifi.ratiosemper.com/neocities.php?sitename=${neocities_site_name}`;

    info_parser = function (data) {
      if (data.result === "error") {
        throw new Error(`${visitor_count_source.toLowerCase()} visitor counter reported an error: ${data.message}`);
      } else {

        // Parse and display views
        const views = parseInt(data.info.views, 10);
        const visitor_count_elements = document.querySelectorAll(visitor_count_selector || ".visitor-count");
        if (visitor_count_elements.length) {
          visitor_count_elements.forEach((item) => item.textContent = views);
        }

        // Format and display creation date
        const createdDate = new Date(data.info.created_at);
        const created_at_formatted = createdDate.toLocaleDateString('en-US', {
          month: '2-digit', day: '2-digit', year: '2-digit'
        });
        const createdAtElement = document.querySelector(created_at_selector);
        if (createdAtElement) {
          createdAtElement.textContent = created_at_formatted;
        }

        // Format and display LastUpdated date
        const updatedDate = new Date(data.info.last_updated);
        const last_updated_formatted = updatedDate.toLocaleDateString('en-US', {
          month: '2-digit', day: '2-digit', year: '2-digit'
        });
        const lastUpdatedElement = document.querySelector(last_updated_selector);
        if (lastUpdatedElement) {
          lastUpdatedElement.textContent = last_updated_formatted;
        }

        return views;
      }
    };
  }

  fetch(stats_url)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else if (response.status === 404) {
        throw new Error(`${visitor_count_source.toLowerCase()} visitor counter reported a 404 Not Found error. Please check the settings.`);
      }
    })
    .then(info_parser)
    .catch((error) => {
      console.error("%c Visitor Count ", "background: #000; color: #fff; font-weight: bold", `${error}`);
      throw new Error("Failed to get visitor count. See previous errors.");
    });
}());

document.addEventListener('DOMContentLoaded', () => {
  const appsOpened = localStorage.getItem('appsOpened') || 0;
  const homeButtonClicks = localStorage.getItem('homeButtonClicks') || 0;
  const herobrineSightings = localStorage.getItem('herobrineSightings') || 0;
  const rosesWished = localStorage.getItem('rosesWished') || 0;

  updateAppsOpened(appsOpened);
  updatehomeButtonClicks(homeButtonClicks);
  updateHBSightings(herobrineSightings);
  updateRosesWishedDisplay(rosesWished);
  incrementWeirdStats()
});

// ~ Weird Stats

function incrementWeirdStats() {
  const weirdStatsElement = document.querySelector('.weirdstats');
  if (weirdStatsElement) {
    let clickCount = parseInt(localStorage.getItem('weirdStatsCount'), 10) || 0;
    weirdStatsElement.textContent = clickCount;

    const weirdStatsButton = document.getElementById('weirdStats');
    if (weirdStatsButton) {
      weirdStatsButton.addEventListener('click', () => {
        if (clickCount >= 69) {
          console.log("Achievement Get!")
          getAchievement("general", "Nice");
        }

        clickCount++;
        weirdStatsElement.textContent = clickCount;
        localStorage.setItem('weirdStatsCount', clickCount);
      });
    }
  }

  const clearStatsButton = document.getElementById('clearStatsButton');
  if (clearStatsButton) {
    clearStatsButton.addEventListener('click', () => {
      localStorage.removeItem('weirdStatsCount');
      clickCount = 0;
      alert("Weird Stats Cleared!");

      if (weirdStatsElement) {
        weirdStatsElement.textContent = clickCount;
      }
    });
  }
}

// ~ Apps Opened

function incrementAppOpenedCount() {
  let appsOpened = parseInt(localStorage.getItem('appsOpened')) || 0;
  appsOpened++;

  localStorage.setItem('appsOpened', appsOpened);

  updateAppsOpened(appsOpened);
}

function updateAppsOpened(count) {
  const display = document.querySelector('.appsOpened');
  if (display) {
    display.textContent = count;
  }
}

// ~ Home Button Clicks
function clicker() {
  let homeButtonClicks = parseInt(localStorage.getItem('homeButtonClicks')) || 0;

  homeButtonClicks++;
  localStorage.setItem('homeButtonClicks', homeButtonClicks);
  updatehomeButtonClicks(homeButtonClicks);
  checkConsecutiveClicks();
}

function updatehomeButtonClicks(count) {
  const display = document.querySelector('.homeButtonClicksCounter');
  if (display) {
    display.textContent = count;
  }
}

function checkConsecutiveClicks() {
  let consecutiveClicks = parseInt(sessionStorage.getItem('consecutiveClicks')) || 0;
  let lastClickTime = parseInt(sessionStorage.getItem('lastClickTime')) || 0;

  const now = Date.now();
  if (now - lastClickTime > 1000) {
    consecutiveClicks = 0;
  }

  consecutiveClicks++;
  sessionStorage.setItem('consecutiveClicks', consecutiveClicks);
  sessionStorage.setItem('lastClickTime', now);

  if (consecutiveClicks === 9) {
    window.parent.location.href = '/shrines/yandereShrine/lovesick.html';
    sessionStorage.setItem('consecutiveClicks', 0); 
  }
}

// * Herobrine Sightings

function trackHerobrineSightings() {
  let sightingsCount = parseInt(localStorage.getItem('herobrineSightings')) || 0;
  if (Math.random() < 0.1) {
    sightingsCount++;
  }
  localStorage.setItem('herobrineSightings', sightingsCount);

  // console.log('Herobrine Sightings:', sightingsCount);
}

setInterval(trackHerobrineSightings, 460000);

function updateHBSightings(count) {
  const display = document.querySelector('.herobrineSightings');
  if (display) {
    display.textContent = count;
  }
}

// ! Roses Wished

function wishOnRose() {
  let count = parseInt(localStorage.getItem('rosesWished')) || 0;

  const audio = new Audio("https://files.catbox.moe/0d4rwa.mp3");
  audio.play();

  if (count >= 18) {
    getAchievement("general", "iwishyouroses");
  }
  if (count >= 18) {
    getAchievement("general", "iwishyouroses");
  }
  count++;
  localStorage.setItem('rosesWished', count);
  updateRosesWishedDisplay(count);
}

function updateRosesWishedDisplay(count) {
  const display = document.querySelector('.rosesWished');
  if (display) {
    display.textContent = count;
  }
}