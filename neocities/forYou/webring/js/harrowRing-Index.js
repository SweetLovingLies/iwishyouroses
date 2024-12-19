// ! Credits to onionring for the base code!

document.addEventListener('DOMContentLoaded', () => {
    const tag = document.getElementById('index');
    const memberCount = sites.length;
    const indexCountElement = document.getElementById('indexCount');

    if (indexCountElement) {
        indexCountElement.textContent = memberCount;
    }

    let membersHTML = "";
    for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        const isNSFW = site.nsfw ? `<span class="nsfw-warning">⚠️ NSFW Warning </span>` : "";
        const isWebringOwner = site.webringOwner ? `<img src="/Assets/pixels/menhera/brokenheart2.webp" alt="Webring Owner" class="owner-badge">` : "";
        const styleClass = site.style ? `style-${site.style}` : "";

        const linkContent = site.siteButton
            ? `<img src="${site.siteButton}" alt="${site.webmasterName}'s Site Button" class="siteButton">`
            : site.url.replace(/^https?:\/\//, "").replace(/\/$/, ""); 

        membersHTML += `
            <div class="memberCard ${styleClass} ${site.nsfw ? "nsfw" : ""} ${site.webringOwner ? "owner" : ""}">
                <img class="profilePic" src="${site.profilePicture}" alt="${site.webmasterName}'s Profile Picture">
                <div class="detailWrapper">
                    <h1 class="webmasterName">
                        ${site.webmasterName} ${isWebringOwner}
                    </h1>
                    <p class="description">${site.description}</p>
                </div>
                <div class="linksNtags">
                    <a class="link" href="${site.url}">
                        ${linkContent}
                    </a>
                    ${isNSFW}
                </div>
            </div>
        `;
    }

    tag.insertAdjacentHTML('afterbegin', membersHTML);
});
