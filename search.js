const unsafeKeywords = ["violence", "fight", "kill", "blood", "sex", "drugs", "hate", "weapon"];

// Helper function to create and append a message to the chat log
function appendMessage(text, type) {
    const log = document.getElementById('message-log'); 
    
    // Create the message bubble HTML structure
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', type);
    
    const textNode = document.createElement('p');
    // Using innerHTML to support bold tags (like **Content blocked**)
    textNode.innerHTML = text; 
    
    messageDiv.appendChild(textNode);
    log.appendChild(messageDiv);
    
    // Auto-scroll to the newest message at the bottom
    log.scrollTop = log.scrollHeight;
}

// Function to load keywords from the metta file
async function loadUnsafeKeywords() {
    try {
        const response = await fetch('guardian_rules.metta');
        const text = await response.text();

        // Extract the words between quotes after (unsafe ...)
        const matches = [...text.matchAll(/\(unsafe\s+"(.*?)"\)/g)];
        return matches.map(m => m[1].toLowerCase());
    } catch (error) {
        console.error("Failed to load .metta rules:", error);
        return [];
    }
}

// Main function to set up the search listener
async function setupSearch() {
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
        appendMessage(query, 'user-message');
        document.getElementById('searchInput').value = '';
        
        // 3. Log ALL searches for the child dashboard
        if (currentUser && currentUser.role === 'child') {
            let allSearches = JSON.parse(localStorage.getItem('allChildSearches')) || [];
            allSearches.push({
                child: currentUser.name,
                query: query,
                time: new Date().toLocaleString()
            });
            localStorage.setItem('allChildSearches', JSON.stringify(allSearches));
        }

        // 4. Check for Unsafe Keywords
        const foundUnsafe = unsafeKeywords.some(word => query.includes(word));
        let botMessage = '';

        if (foundUnsafe) {
            if (currentUser.role === 'child') {
                botMessage = "⚠️ **Content blocked.** This search may be unsafe. Please try a different query.";
                
                // Save the alert for the parent dashboard
                let alerts = JSON.parse(localStorage.getItem('guardianAlerts')) || [];
                alerts.push({
                    child: currentUser.name,
                    query: query,
                    message: "Unsafe search attempt detected.",
                    time: new Date().toLocaleString()
                });
                localStorage.setItem('guardianAlerts', JSON.stringify(alerts));

            } else {
                // Parent user response
                botMessage = "⚠️ **Content blocked.** This search may be unsafe.";
            }

        } else {
            // Safe search response
            botMessage = `✅ **Safe content found** for: **${query}**<br>
            Here’s what Chatly found: educational and friendly results.`;
        }
        
        // 5. Display the Bot's Message
        appendMessage(botMessage, 'bot-message');
    });
}

// Initialize the search functionality
setupSearch();

// Optional: Home button redirect
function goHome() {
    window.location.href = "index.html";
}
