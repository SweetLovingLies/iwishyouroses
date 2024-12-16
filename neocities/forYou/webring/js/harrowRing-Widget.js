// ! Credits to onionring for the base code!

document.addEventListener('DOMContentLoaded', () => {
  let tag = document.getElementById("HarrowRing");

  const headerSplit = document.createElement("h1");
  ringID.split("").forEach(letter => {
    const span = document.createElement("span"); 
    span.textContent = letter; 
    headerSplit.appendChild(span);
  });

  const cssFile = document.createElement('link');
  cssFile.rel = 'stylesheet';
  cssFile.href = 'js/HRwidget.css';
  document.head.appendChild(cssFile);

  thisSite = window.location.href;
  console.log(thisSite)
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
      <table>
        <tr>
          <td>This site hasn't been added to the ${ringName} webring yet. Sorry!</td>
        </tr>
      </table>
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
      <table>
        <tr>
          <td class='webring-prev'><a href='${sites[previousIndex]}'>previous</a></td>
          <td class='webring-info'></br>
          <span class='webring-links'>
            ${randomText}
            ${indexText}
          <td class='webring-next'><a href='${sites[nextIndex]}'>next</a></td>
        </tr>
      </table>
    `);

    const infoCell = tag.querySelector('.webring-info');
    infoCell.appendChild(headerSplit);

    if (useRandom) {
      const randomLink = tag.querySelector('.randomLink');
      randomLink.addEventListener('click', randomSite);
    }
  }
});