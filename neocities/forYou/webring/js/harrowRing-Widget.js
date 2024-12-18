// ! Credits to onionring for the base code!

document.addEventListener('DOMContentLoaded', () => {
  let tag = document.getElementById("HarrowRing");

  const cssFile = document.createElement('link');
  cssFile.rel = 'stylesheet';
  cssFile.href = 'https://iwishyouroses.neocities.org/forYou/webring/js/HRwidget.css';
  document.head.appendChild(cssFile);

  thisSite = window.location.href;
  // console.log(thisSite)
  thisIndex = null;

  for (let i = 0; i < sites.length; i++) {
    if (thisSite.startsWith(sites[i].url)) { 
      thisIndex = i;
      break;
    }
  }

  function randomSite() {
    const otherSites = sites.slice();
    otherSites.splice(thisIndex, 1); // ! Remove current site
    const randomIndex = Math.floor(Math.random() * otherSites.length);
    location.href = otherSites[randomIndex].url;
  }

  if (thisIndex == null) {
    tag.insertAdjacentHTML('afterbegin', `
          <div>This site hasn't been added to the ${ringName} webring yet. Sorry!</div>
    `);
  } else {
    let previousIndex = (thisIndex - 1 < 0) ? sites.length - 1 : thisIndex - 1;
    let nextIndex = (thisIndex + 1 >= sites.length) ? 0 : thisIndex + 1;

    let indexText = "";
    if (useIndex) {
      indexText = `<a href='${indexPage}'>index</a> `;
    }

    let randomText = "";
    if (useRandom) {
      randomText = `<a href='javascript:void(0)' class='randomLink'>random</a> ⌗ `;
    }

    tag.insertAdjacentHTML('afterbegin', `
      <div>
          <div class='webring-info'>
          <img src="https://iwishyouroses.neocities.org/forYou/webring/js/img/harrowRingLogo.png"
          <span class='webring-links'>
          <a href='${sites[previousIndex]}'>previous</a> ⌗
            ${randomText}
            ${indexText}
            ⌗ <a href='${sites[nextIndex]}'>next</a>
      </div>
    `);

    if (useRandom) {
      const randomLink = tag.querySelector('.randomLink');
      randomLink.addEventListener('click', randomSite);
    }
  }
});