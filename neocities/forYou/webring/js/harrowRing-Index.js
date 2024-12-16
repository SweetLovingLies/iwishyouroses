// ! Credits to onionring for the base code!

document.addEventListener('DOMContentLoaded', () => {
    const tag = document.getElementById('index');

    let membersHTML = "";
    for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        const isNSFW = site.nsfw ? `<span class="nsfw-warning">⚠️ NSFW</span>` : "";
        const isWebringOwner = site.webringOwner ? `<img src="/Assets/pixels/menhera/brokenheart2.webp" alt="Webring Owner" class="owner-badge">` : "";

        membersHTML += `
            <div class="memberCard ${site.nsfw ? "nsfw" : ""} ${site.webringOwner ? "owner" : ""}">
                <img src="${site.profilePicture}" alt="${site.webmasterName}'s Profile Picture">
                <div class="detailWrapper">
                    <h1 class="webmasterName">
                        ${site.webmasterName} ${isWebringOwner}
                    </h1>
                    <p class="description">${site.description}</p>
                    <a class="link" href="${site.url}">
                        ${site.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                    ${isNSFW}
                </div>
            </div>
        `;
    }
    
    tag.insertAdjacentHTML('afterbegin', membersHTML);
});