
# Chatly

Chatly is a web application designed to create a safer online experience for children. While the initial description is limited, this README provides a comprehensive overview of the project based on the available file structure and code snippets.

## Key Features & Benefits

- **AI Guardian:** The project leverages AI to provide online safety measures.
- **Parental Control:**  Offers tools for parents to manage and monitor their child's online activity.
- **Child Dashboard:** A dedicated dashboard for children with restricted and safe access.
- **User Authentication:** Includes signup, login, and logout functionalities.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

- **Web Browser:** Chrome, Firefox, Safari, or Edge
- **Text Editor or IDE:** VS Code, Sublime Text, Atom, etc.
- **(Optional) Web Server:**  For local testing (e.g., `python -m http.server` or `npx serve`)

## Installation & Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wanj-kl/Chatly.git
   cd Chatly
   ```

2. **Open `index.html` in your web browser.**  The `index.html` likely acts as the entry point.

3. **(Optional) For local testing with a web server:**
   - Navigate to the project directory in your terminal.
   - Run a simple HTTP server:
     ```bash
     python -m http.server
     ```
     or
     ```bash
     npx serve
     ```
   - Open your browser and navigate to the address provided by the server (usually `http://localhost:8000` or similar).

## Usage Examples & API Documentation

Based on the file `chatly.js`, the application likely uses JavaScript to handle user interactions and communicate with a backend API (although the backend details are not provided).

**Example: Signup Functionality (from `chatly.js`)**
```javascript
async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return res;
}

// Signup page logic (example)
if (document.getElementById('signupBtn')) {
  document.getElementById('signupBtn').addEventListener('click', async () => {
    // ... Signup form data retrieval and processing ...
    // Example using postJson:
    // const response = await postJson('/api/signup', signupData);
  });
}
```
**Explanation:**

- The `postJson` function facilitates sending POST requests with JSON data to the backend.  The `url` would be the endpoint to send the data to.
- The signup logic (partially shown) demonstrates how event listeners are used to trigger actions when the signup button is clicked. It gathers data from the signup form and then (hypothetically, as the provided snippet is incomplete) makes a `postJson` call to a signup API endpoint (e.g., `/api/signup`).

**Note:** Since there's no explicit backend API documentation, you'll need to refer to the server-side code (if available) for detailed API endpoints and request/response structures.

## Configuration Options

Configuration options are not explicitly detailed in the provided files. However, potential configurations might include:

- **API Endpoints:**  The URLs for backend API calls in `chatly.js` might need to be configured based on your backend setup.  Look for variable assignments for these URLs.
- **Guardian Rules:** The `guardian_rules.metta` file suggests configurable rules for the AI Guardian functionality. The content of this file is needed to determine what can be configured.
- **Styling:**  The `Dashboard.css` and `style.css` files control the visual appearance of the application.  You can modify these files to customize the look and feel.

## Contributing Guidelines

Contributions are welcome! To contribute to Chatly:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Create a pull request.

Please ensure your code adheres to the existing style and includes appropriate comments.

## License Information

License information is not specified in the provided repository details. It's recommended to add a license file (e.g., MIT, Apache 2.0) to clearly define the terms of use and distribution.  Example: Create a file named `LICENSE` in the root directory with the contents of the chosen license.

## Acknowledgments

While no specific acknowledgments are provided, we thank the open-source community for providing valuable tools and libraries that make projects like Chatly possible.
