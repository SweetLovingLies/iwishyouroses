fetch('js/achievements/achievements.json', { cache: "no-store" })
    .then(response => response.json())
    .then(data => {
        achievementData = data;
        displayAchievements();
    })
    .catch(error => console.error('Error loading JSON:', error));

// ~ Function to check if achievement is unlocked from localStorage
function hasAchievement(namespace, achievementID) {
    const achievementKey = `${namespace}:${achievementID}`;
    return localStorage.getItem(achievementKey) === 'true';
}

// ~ Function to display achievements
function displayAchievements() {
    const dashboard = document.getElementById("achievements-dashboard");
    const { missing, hidden, achievements } = achievementData.general;

    dashboard.innerHTML = ""; // Clear previous content

    Object.keys(achievements).forEach(achievementID => {
        const achievement = achievements[achievementID];

        const card = document.createElement("div");
        card.classList.add("achievement-card");

        const isHidden = achievement.hidden; // Check if the achievement is hidden
        const isCompleted = hasAchievement("general", achievementID); // Check if completed in localStorage

        // Apply classes based on completion status
        if (isHidden && !isCompleted) {
            card.classList.add(hidden.class); // Hidden achievements if not completed
        } else if (isHidden && isCompleted) {
            card.classList.add("dark"); // Completed hidden achievements should have the "dark" class
        } else if (!isCompleted) {
            card.classList.add(missing.class); // Missing achievements
        } else {
            card.classList.add('completed'); // Normal achievements
        }

        // Update title, description, and icon based on completion and hidden status
        const title = isHidden && !isCompleted ? "???" : achievement.title;
        const description = isHidden && !isCompleted
            ? hidden.description
            : (isCompleted ? achievement.description : missing.description);
        const icon = isHidden && !isCompleted ? hidden.icon : achievement.icon || "";

        // Create card content
        card.innerHTML = `
            <img src="${icon}" alt="${title}">
            <div>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;

        // Handle click event to show hint
        card.addEventListener("click", () => {
            showHint(
                achievement.title,
                achievement.hint,
                isHidden,
                !isCompleted,
                isCompleted
            );
        });

        dashboard.appendChild(card);
    });

    calculateProgress();
}


function showHint(title, hint, isHidden = false, isMissing = false, isCompleted = false) {
    if (isCompleted) {
        return;
    }

    const popover = document.getElementById("popover");
    const popoverTitle = document.getElementById("popover-title");
    const popoverDescription = document.getElementById("popover-description");

    const resolvedTitle = isHidden ? "???" : title || "Unknown Achievement";
    const resolvedHint =
        isHidden ? "There is no hint for the hidden achievements." :
            isMissing ? (hint || "No hint needed!") : hint || "No hint available.";

    popoverTitle.textContent = resolvedTitle;
    popoverDescription.textContent = resolvedHint;

    popover.classList.remove("noShow");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("close-popover").addEventListener("click", () => {
        document.getElementById("popover").classList.add("noShow");
    });
});

// ~ Progress Bar

function calculateProgress() {
    const achievements = achievementData.general.achievements;
    const total = Object.keys(achievements).length;

    const completed = Object.keys(achievements).filter(key => {
        const achievementKey = `general:${key}`;
        return localStorage.getItem(achievementKey) === 'true';
    }).length;

    const percentage = Math.round((completed / total) * 100);

    console.log(`Total achievements: ${total}, Completed: ${completed}`);
    console.log(`Progress: ${percentage}%`);

    document.getElementById("progress-percentage").textContent = `${percentage}%`;
    document.getElementById("progress-bar").style.width = `${percentage}%`;
}