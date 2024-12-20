const userInput = document.getElementById("userInput");
const submitButton = document.getElementById("submitBTN");
const messageContainer = document.getElementById("messageContainer");
const thinkingIcon = document.getElementById("thinkingIcon");

let tooltips = [];  // Things to do around the site
let general = [];   // Try having a convo with her!
let achievements = [];  // Hints for treasure island!

fetch("js/shiranai/shiranaiTooltips.json")
    .then((response) => response.json())
    .then((data) => {
        tooltips = data.tooltips || [];
        general = data.general || [];
        achievements = data.achievements || [];
    })
    .catch((error) => console.error("Error loading tooltips:", error));

function createMessage(isUser, text) {
    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add(isUser ? "user-response" : "shiranai-response");

    const avatarWrapper = document.createElement("div");
    avatarWrapper.classList.add("avatarWrapper");

    const avatar = document.createElement("img");
    avatar.classList.add("avatar");
    avatar.src = isUser
        ? localStorage.getItem("selectedIcon") || "/Assets/other/anonIcon.jpg"
        : "/Assets/customNavIcons/shiranaiIcon.png";
    avatar.alt = isUser ? "It's You!" : "SHIRANAI";

    avatarWrapper.appendChild(avatar);

    const statusIndicator = document.createElement("div");
    statusIndicator.classList.add("status-indicator");
    avatarWrapper.appendChild(statusIndicator);

    const responseBubble = document.createElement("div");
    responseBubble.classList.add("response-bubble");

    const responseText = document.createElement("p");

    if (!isUser) {
        const thinkingIcon = document.createElement("span");
        thinkingIcon.classList.add("thinking-icon");
        thinkingIcon.innerHTML = `<iconify-icon icon="svg-spinners:3-dots-bounce" width="24" height="24"></iconify-icon>`;
        responseText.appendChild(thinkingIcon);
    }

    responseBubble.appendChild(responseText);
    messageWrapper.appendChild(avatarWrapper);
    messageWrapper.appendChild(responseBubble);
    messageContainer.appendChild(messageWrapper);

    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (!isUser) {
        setTimeout(() => {
            typeWriter(responseText, text, 20); 
        }, 2000); 
    } else {
        responseText.textContent = text; 
    }
}

function typeWriter(element, text, delay) {
    let i = 0;
    const thinkingIcon = element.querySelector(".thinking-icon");

    function type() {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
            setTimeout(type, delay);
        } else {
            if (thinkingIcon) {
                thinkingIcon.style.display = "none";
            }
        }
    }
    type();
}

function removeSpecialCharacters(str) {
    return str.replace(/[^\w\s]/g, ''); // Removes non-alphanumeric characters except spaces
}

function handleUserInput() {
    const input = userInput.value.trim();
    const cleanedInput = removeSpecialCharacters(input.toLowerCase());
    if (!cleanedInput) {
        createMessage(false, "Did you mean to type something? I can wait!");
        return;
    }

    userInput.value = "";

    createMessage(true, input);

    // Check in general responses
    const matchedGeneral = general.find((response) => {
        console.log("Checking general response for:", cleanedInput);
        return response.keywords.some(keyword => {
            let keywordRegex = keyword;

            // If it's a string, convert it to a regex that matches the whole word
            if (typeof keyword === "string") {
                // Clean up keyword by removing special characters as well
                keywordRegex = new RegExp(`\\b${removeSpecialCharacters(keyword)}\\b`, 'i');
            }

            console.log("Matching with regex:", keywordRegex); // Log the regex used
            return keywordRegex.test(cleanedInput); // Match using regex
        });
    });

    if (matchedGeneral) {
        console.log("Matched general:", matchedGeneral); // Log the matched general response
        createMessage(false, matchedGeneral.tooltip);
        return;
    }

    // Check in tooltips
    const matchedTooltip = tooltips.find((tooltip) => {
        console.log("Checking tooltip for:", cleanedInput); // Log the cleaned input
        return tooltip.keywords.some(keyword => {
            let keywordRegex = keyword;

            // If it's a string, convert it to a regex that matches the whole word
            if (typeof keyword === "string") {
                // Clean up keyword by removing special characters as well
                keywordRegex = new RegExp(`\\b${removeSpecialCharacters(keyword)}\\b`, 'i');
            }

            console.log("Matching with regex:", keywordRegex); // Log the regex used
            return keywordRegex.test(cleanedInput);
        });
    });

    if (matchedTooltip) {
        console.log("Matched tooltip:", matchedTooltip); // Log the matched tooltip response
        createMessage(false, matchedTooltip.tooltip);
        return;
    }

    // Check in achievements
    const matchedAchievement = achievements.find((achievement) => {
        console.log("Checking achievement for:", cleanedInput); // Log the cleaned input
        return achievement.keywords.some(keyword => {
            let keywordRegex = keyword;

            // If it's a string, convert it to a regex that matches the whole word
            if (typeof keyword === "string") {
                // Clean up keyword by removing special characters as well
                keywordRegex = new RegExp(`\\b${removeSpecialCharacters(keyword)}\\b`, 'i');
            }

            console.log("Matching with regex:", keywordRegex); // Log the regex used
            return keywordRegex.test(cleanedInput);
        });
    });

    if (matchedAchievement) {
        console.log("Matched achievement:", matchedAchievement); // Log the matched achievement response
        createMessage(false, matchedAchievement.tooltip);
        return;
    }

    // Default response if no matches found
    console.log("No match found, default response triggered."); // Log when no match is found
    createMessage(false, "I'm not sure what you mean. Could you try rephrasing?");
}

submitButton.addEventListener("click", handleUserInput);

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleUserInput();
    }
});
