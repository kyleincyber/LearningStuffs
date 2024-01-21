document.addEventListener('DOMContentLoaded', function() {
    loadPrimaryTopics();
});

function loadPrimaryTopics() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQUFJ257F6uJbC2MEalwRoMcShK8n7JNDdG343EVxt1jYlOXNj9KnAvaqe0rn5o07WICpQQdZx8E2nI/pub?output=csv')
        .then(response => response.text())
        .then(csv => {
            const topics = parseCSV(csv);
            window.currentTopics = topics;
            displayPrimaryTopics(topics);
            document.getElementById('main-title').textContent = 'Select a Topic to Study';

        });
}

function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const topics = lines.slice(1).map(line => {
        const [primary, secondary, content, link] = line.split(','); // Adjust based on your CSV structure
        return { primary, secondary, content, link };
    });
    return topics;
}

function displayPrimaryTopics(topics) {
    const topicContainer = document.getElementById('topic-container');
    topicContainer.innerHTML = '';
    let primaryTopics = new Set(topics.map(topic => topic.primary));

    primaryTopics.forEach(primary => {
        const button = document.createElement('button');
        button.textContent = primary;
        button.onclick = () => displaySecondaryTopics(primary);
        topicContainer.appendChild(button);
    });
    document.getElementById('content-container').innerHTML = ''; // Clear content
}

function displaySecondaryTopics(primary) {
    const topicContainer = document.getElementById('topic-container');
    topicContainer.innerHTML = `<button class="back-button" onclick="loadPrimaryTopics()">←</button>`;
    window.currentTopics.filter(topic => topic.primary === primary).forEach(topic => {
        const button = document.createElement('button');
        button.textContent = topic.secondary;
        button.onclick = () => {
            displayContent(topic);
            document.getElementById('main-title').textContent = topic.content; // Update the title with content
        };
        topicContainer.appendChild(button);
    });
}


function displayContent(topic) {
    const contentContainer = document.getElementById('content-container');
    let contentHtml = `<p>${topic.content}</p>`;

    if (topic.link) {
        if (topic.link.includes('youtube.com')) {
            const videoId = extractYoutubeId(topic.link);
            contentHtml += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            contentHtml += `<img src="http://www.google.com/s2/favicons?domain=${new URL(topic.link).hostname}" class="favicon" /> <a href="${topic.link}" target="_blank">${topic.link}</a>`;
        }
    }

    contentContainer.innerHTML = contentHtml;
}

function extractYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return match[2];
    } else {
        return 'error';
    }
}
