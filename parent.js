const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const Filter = require('bad-words'); // Profanity Filter
const fs = require('fs');
// NOTE: http, Server, and io imports are REMOVED.

// Load environment variables
dotenv.config();

// Standard Express setup
const app = express();
// NOTE: server = http.createServer(app) and io = new Server(server) are REMOVED.

// Initialize the profanity filter
const filter = new Filter();
filter.addWords('kill', 'suicide', 'self-harm', 'explicit-site', 'dark-web', 'violence'); 

// ... (OpenAI client initialization) ...

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

// --- Helper Functions for File Logging (MODIFIED) ---
const LOG_FILE = 'search_log.json'; 

function getSearchLog() {
    try {
        const data = fs.readFileSync(LOG_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return []; 
    }
}

// MODIFIED: Added isAlert parameter
function logSearch(username, prompt, isAlert = false) {
    const log = getSearchLog();
    log.push({
        timestamp: new Date().toISOString(),
        user: username,
        prompt: prompt,
        alert: isAlert // ⬅️ NEW: Flag the log entry if it contains a bad word
    });
    // Keep log file size reasonable (e.g., last 200 entries)
    const recentLog = log.slice(-200); 
    fs.writeFileSync(LOG_FILE, JSON.stringify(recentLog, null, 2), 'utf8');
}


// ----------------------------------------------------
// ➡️ MODIFIED CHAT API ROUTE (LOGGING THE ALERT)
// ----------------------------------------------------
app.post('/chat', async (req, res) => {
    const userPrompt = req.body.prompt;
    
    if (!userPrompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    // 1. CHECK FOR PROFANITY
    const isProfane = filter.isProfane(userPrompt);

    // 2. Log the search, using the new 'alert' flag
    logSearch('child', userPrompt, isProfane); // Pass the alert status
    
    if (isProfane) {
        console.warn(`[🚨 ALERT] Profanity detected: "${userPrompt}". Logged with alert flag.`);
        // In this non-real-time version, the server does nothing else here.
        // The parent will see the alert when they next load the dashboard.
    }
    
    // 3. Clean the prompt before sending it to the AI
    const sanitizedPrompt = filter.clean(userPrompt); 

    try {
        // AI Model Call uses the sanitizedPrompt
        const messages = [
            { role: "system", content: "You are a helpful and friendly chatbot named Chatly." },
            { role: "user", content: sanitizedPrompt }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.7,
            max_tokens: 150,
        });

        const aiResponse = completion.choices[0].message.content;
        res.json({ response: aiResponse });

    } catch (error) {
        console.error("AI API Error:", error.message);
        res.status(500).json({ error: 'Failed to get a response from the AI.' });
    }
});


// ----------------------------------------------------
// ➡️ PARENT DASHBOARD ROUTE (FOR DISPLAYING THE LOG/ALERTS)
// ----------------------------------------------------
app.get('/parent-dashboard', (req, res) => {
    // Get the entire search log
    const searchLog = getSearchLog();
    
    // The alert is built into the log data. The frontend handles the display.
    // In the Chatly style, we would typically send a separate HTML file, 
    // but here we just return the data to be rendered by the HTML we create below.
    res.send(renderParentDashboard(searchLog));
});

// Helper function to render the dashboard HTML directly (simplifies the demo)
function renderParentDashboard(log) {
    // Reverse the log so newest entries are at the top
    const reversedLog = [...log].reverse(); 
    
    let logHtml = '';
    
    reversedLog.forEach(entry => {
        const isAlert = entry.alert ? 'alert' : '';
        logHtml += `
            <div class="log-entry ${isAlert}">
                ${entry.alert ? '<strong>🚨 BAD WORD DETECTED!</strong><br>' : ''}
                <span class="timestamp">${new Date(entry.timestamp).toLocaleString()}</span>
                <p><strong>Search:</strong> ${entry.prompt}</p>
            </div>
        `;
    });

    return `
    `;
}


// Start the server
app.listen(PORT, () => {
    console.log(`Guardian Agent server running on http://localhost:${PORT}`);
    console.log(`Parent Dashboard: http://localhost:${PORT}/parent-dashboard`);
});
