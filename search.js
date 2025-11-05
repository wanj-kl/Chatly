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

// New Main function to set up the chat listener (Renamed to 'setupChatbot' for clarity)
async function setupChatbot() {
    // We use the simpler hardcoded list if the metta file doesn't load
    const unsafeKeywords = await loadUnsafeKeywords(); 

    // IMPORTANT: Use the new ID for the green arrow button
    const sendButton = document.getElementById('sendBtn'); 
    
    // IMPORTANT: Use the ID for the main input field
    const chatInput = document.getElementById('searchInput'); 

    const handleSendMessage = () => {
        // Use chatInput.value since the input is now a standard input/textarea
        const query = chatInput.value.toLowerCase().trim(); 
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!query) {
            appendMessage("Please enter a search term.", 'bot-message'); 
            return;
        }

        // 1. Display User Message & Clear Input
        appendMessage(query, 'user-message');
        chatInput.value = '';

        // *** ADDED FROM PREVIOUS SUGGESTION ***
        // Auto-resize logic (important if you use a <textarea>)
        // You might need to adjust this depending on if your final HTML uses <input> or <textarea>
        if (chatInput.tagName === 'TEXTAREA') {
            chatInput.style.height = 'auto'; // Reset height
        }
        // *** END ADDED LOGIC ***

        // 2. Check for Unsafe Keywords
        const foundUnsafe = unsafeKeywords.some(word => query.includes(word));
        let botMessage = '';

        if (foundUnsafe) {
            if (currentUser && currentUser.role === 'child') {
                botMessage = "⚠️ **Content blocked.** This search may be unsafe. Please try a different query.";
            } else {
                botMessage = "⚠️ **Content blocked.** This search may be unsafe.";
            }
        } else {
            botMessage = `✅ **Safe content found** for: **${query}**<br>
            Here’s what Chatly found: educational and friendly results.`;
        }
        
        // 3. Display the Bot's Message
        appendMessage(botMessage, 'bot-message');
    };

    // New Event Listeners for click and Enter key
    sendButton.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, allow Shift+Enter for new line
            e.preventDefault(); 
            handleSendMessage();
        }
    });

    // Optional: Auto-resize textarea logic (only necessary if using <textarea>)
    if (chatInput.tagName === 'TEXTAREA') {
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto'; // Reset height
            chatInput.style.height = chatInput.scrollHeight + 'px'; // Set to scroll height
        });
    }
}

// Initialize the chatbot functionality
document.addEventListener('DOMContentLoaded', setupChatbot);

// Optional: Home button redirect
function goHome() {
    window.location.href = "index.html";
}
