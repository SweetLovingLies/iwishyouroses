// ! Credits to onionring for the base code!

document.addEventListener('DOMContentLoaded', () => {
    var tag = document.getElementById('index');

    let membersHTML = "";
    for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        membersHTML += `
            <div class="memberCard">
                <img src="${site.profilePicture}" alt="${site.webmasterName}'s Profile Picture">
                <div class="detailWrapper">
                    <h1 class="webmasterName">${site.webmasterName}</h1>
                    <p class="description">${site.description}</p>
                    <a class="link" href="${site.url}">${site.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>
                </div>
            </div>
        `;
    }
    
    tag.insertAdjacentHTML('afterbegin', membersHTML);
});