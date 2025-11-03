// search.js

// 1. Hardcoded Unsafe Keywords List
const unsafeKeywords = ["violence", "fight", "kill", "blood", "sex", "drugs", "hate", "weapon"];

// 2. Click Listener: The main function that runs when the 'Search' button is clicked
document.getElementById('searchBtn').addEventListener('click', () => {
    // Get the user's input and convert it to lowercase
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    // The element where the result was originally displayed (before the chat interface)
    // NOTE: This element ID is now replaced by the chat interface logic!
    const resultBox = document.getElementById('searchResult'); 
    
    // Get the current user's role from local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // --- Start Logic ---

    if (!query) {
        // Simple alert if input is empty
        alert("Please enter a search term.");
        return;
    }

    // Check if the query contains any unsafe words
    const foundUnsafe = unsafeKeywords.some(word => query.includes(word));

    if (foundUnsafe) {
        if (currentUser && currentUser.role === 'child') {
            // Child view: Blocked message
            // In the original, basic setup, this used innerHTML:
            resultBox.innerHTML = "<p class='alert'>⚠️ Content blocked. This search may be unsafe.</p>";
            
            // NOTE: The alert saving was usually done here as well, but we exclude it for the "initial" code
        } else {
            // Parent view: Caution message
            resultBox.innerHTML = "<p>⚠️ This content might be unsafe. Proceed with caution.</p>";
        }
    } else {
        // Safe response
        resultBox.innerHTML = `<p>✅ Safe content found for: <strong>${query}</strong><br>
        Here’s what AI Guardian found: educational and friendly results.</p>`;
    }
});
