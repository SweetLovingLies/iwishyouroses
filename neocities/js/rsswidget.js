const feedUrl = 'https://iwishyouroses.bearblog.dev/feed/?type=rss';
        const apiKey = 'tlcfsziakgz4yum8e33ynpst4abvo7r62o9nkfot';
        const apiEndpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&api_key=${apiKey}`;

        async function fetchRSSFeed() { // async function because there may not be an update for a long time!
            try { // try allows us to check for errors
                const response = await fetch(apiEndpoint); // Check for updates
                const data = await response.json(); // API updates every 1 hour 

                if (data.status === 'ok') {
                    displayRSSFeed(data.items);
                } else {
                    console.error('Error fetching the RSS feed:', data.message);
                }
            } catch (error) {
                console.error('Error fetching or parsing the RSS feed:', error);
            }
        }

        // Displays items!
        function displayRSSFeed(items) {
            const feedContainer = document.getElementById("rssFeedContainer");
        
            items.forEach(item => {
                const feedItem = document.createElement("div");
                feedItem.classList.add("feed-item");
                feedItem.classList.add("columnFlex2");
        
                const charLimit = 200;
                let truncatedDescription = item.description;
                
                if (truncatedDescription.length > charLimit) {
                    truncatedDescription = truncatedDescription.slice(0, charLimit) + '...';
                }
        
                feedItem.innerHTML = `
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p>${truncatedDescription}</p>
                    <small>${new Date(item.pubDate).toLocaleDateString()}</small>
                `;
        
                feedContainer.appendChild(feedItem);
            });
        }
        

        fetchRSSFeed();