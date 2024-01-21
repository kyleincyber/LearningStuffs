document.addEventListener('DOMContentLoaded', function() {
    loadTopics();
});

function loadTopics() {
    // Assuming your JSON structure is an array of objects with 'topic' and 'content' keys
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const topicContainer = document.getElementById('topic-container');
            data.forEach(item => {
                const button = document.createElement('button');
                button.textContent = item.topic;
                button.onclick = () => displayContent(item.content);
                topicContainer.appendChild(button);
            });
        });
}

function displayContent(content) {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = `<p>${content}</p>`;
}
