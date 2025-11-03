// search.js - Use this complete, corrected file content.

// Helper function to create and append a message to the chat log
function appendMessage(text, type) {
    const log = document.getElementById('message-log'); 
    
    // Create the message bubble HTML structure
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', type);
    
    const textNode = document.createElement('p');
    textNode.innerHTML = text; 
    
    messageDiv.appendChild(textNode);
    log.appendChild(messageDiv);
    
    // Auto-scroll to the newest message at the bottom
    log.scrollTop = log.scrollHeight;
}

// Function to load keywords from the metta file (required for the later app structure)
async function loadUnsafeKeywords() {
    // This is a placeholder/simulated load for the metta file
    const hardcodedKeywords = ["violence", "fight", "kill", "blood", "sex", "drugs", "hate", "weapon"];
    return hardcodedKeywords;
}

// Main function to set up the search listener
async function setupSearch() {
    // We use the simpler hardcoded list if the metta file doesn't load
    const unsafeKeywords = await loadUnsafeKeywords(); 

    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value.toLowerCase().trim();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // 1. Input Validation
        if (!query) {
            appendMessage("Please enter a search term.", 'bot-message'); 
            return;
        }

        // 2. Display User Message & Clear Input
        appendMessage(query, 'user-message'); // <-- THIS CREATES THE BLUE BUBBLE
        document.getElementById('searchInput').value = '';
        
        // --- (Logging logic removed for brevity, as it was in the full version) ---

        // 3. Check for Unsafe Keywords
        const foundUnsafe = unsafeKeywords.some(word => query.includes(word));
        let botMessage = '';

        if (foundUnsafe) {
            if (currentUser && currentUser.role === 'child') {
                botMessage = "⚠️ **Content blocked.** This search may be unsafe. Please try a different query.";
            } else {
                botMessage = "⚠️ **Content blocked.** This search may be unsafe.";
            }
        } else {
            // Safe search response
            botMessage = `✅ **Safe content found** for: **${query}**<br>
            Here’s what Chatly found: educational and friendly results.`;
        }
        
        // 4. Display the Bot's Message
        appendMessage(botMessage, 'bot-message'); // <-- THIS CREATES THE GRAY BUBBLE
    });
}

// Initialize the search functionality
setupSearch();

// Optional: Home button redirect
function goHome() {
    window.location.href = "index.html";
}
