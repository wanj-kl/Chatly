const unsafeKeywords = ["violence", "fight", "kill", "blood", "sex", "drugs", "hate", "weapon"];

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const resultBox = document.getElementById('searchResult');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
}) 

//   if (!query) {
//     resultBox.innerHTML = "<p>Please enter a search term.</p>";
//     return;
//   }

//   // Check if unsafe
//   const foundUnsafe = unsafeKeywords.some(word => query.includes(word));

//   if (foundUnsafe) {
//     if (currentUser.role === 'child') {
//       // Block search + send simulated alert
//       resultBox.innerHTML = "<p class='alert'>⚠️ Content blocked. This search may be unsafe.</p>";

//       // Save simulated alert for the parent dashboard
//       localStorage.setItem('guardianAlert', '⚠️ Guardian Alert: Unsafe search attempt detected.');
//     } else {
//       resultBox.innerHTML = "<p>⚠️ This content might be unsafe. Proceed with caution.</p>";
//     }
//   } else {
//     // Simulate safe response
//     resultBox.innerHTML = `<p>✅ Safe content found for: <strong>${query}</strong><br>
//     Here’s what AI Guardian found: educational and friendly results.</p>`;
//   }
// });



// async function loadUnsafeKeywords() {
//   try {
//     const response = await fetch('guardian_rules.metta');
//     const text = await response.text();

//     // Extract the words between quotes after (unsafe ...)
//     const matches = [...text.matchAll(/\(unsafe\s+"(.*?)"\)/g)];
//     return matches.map(m => m[1].toLowerCase());
//   } catch (error) {
//     console.error("Failed to load .metta rules:", error);
//     return [];
//   }
// }

// async function setupSearch() {
//   const unsafeKeywords = await loadUnsafeKeywords();

//   document.getElementById('searchBtn').addEventListener('click', () => {
//     const query = document.getElementById('searchInput').value.toLowerCase();
//     const resultBox = document.getElementById('searchResult');
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
//     if (!query) {
//       resultBox.innerHTML = "<p>Please enter a search term.</p>";
//       return;
//     }

//     const foundUnsafe = unsafeKeywords.some(word => query.includes(word));

//     if (foundUnsafe) {
//       if (currentUser.role === 'child') {
//         resultBox.innerHTML = "<p class='alert'>⚠️ Content blocked. This search may be unsafe.</p>";
//         localStorage.setItem('guardianAlert', '⚠️ Guardian Alert: Unsafe search attempt detected.');
//       } else {
//         resultBox.innerHTML = "<p class='alert'>⚠️ Content blocked. This search may be unsafe.</p>";
//       }
//     } else {
//       resultBox.innerHTML = `<p>✅ Safe content found for: <strong>${query}</strong><br>
//       Here’s what Chatly found: educational and friendly results.</p>`;
//     }
//   });
// }

// setupSearch();


// function goHome() {
//   window.location.href = "index.html";
// }



// let alerts = JSON.parse(localStorage.getItem('guardianAlerts')) || [];
// alerts.push(`⚠️ Unsafe search detected: "${query}" at ${new Date().toLocaleString()}`);
// localStorage.setItem('guardianAlerts', JSON.stringify(alerts));


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

async function setupSearch() {
  const unsafeKeywords = await loadUnsafeKeywords();

  document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultBox = document.getElementById('searchResult');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!query) {
      resultBox.innerHTML = "<p>Please enter a search term.</p>";
      return;
    }

    const foundUnsafe = unsafeKeywords.some(word => query.includes(word));

    if (foundUnsafe) {
      if (currentUser.role === 'child') {
        // 1️⃣ Show warning to the child
        resultBox.innerHTML = "<p class='alert'>⚠️ Content blocked. This search may be unsafe.</p>";
        // Save **all searches** (safe or unsafe) for the parent dashboard
if (currentUser.role === 'child') {
  let allSearches = JSON.parse(localStorage.getItem('allChildSearches')) || [];
  allSearches.push({
    child: currentUser.name,
    query: query,
    time: new Date().toLocaleString()
  });
  localStorage.setItem('allChildSearches', JSON.stringify(allSearches));
}

        // 2️⃣ Save the alert in an array for parent dashboard
        let alerts = JSON.parse(localStorage.getItem('guardianAlerts')) || [];
        alerts.push({
          child: currentUser.name,
          query: query,
          message: "Unsafe search attempt detected.",
          time: new Date().toLocaleString()
        });
        localStorage.setItem('guardianAlerts', JSON.stringify(alerts));

      } else {
        // Parent user
        resultBox.innerHTML = "<p class='alert'>⚠️ Content blocked. This search may be unsafe.";
      }

    } else {
      resultBox.innerHTML = `<p>✅ Safe content found for: <strong>${query}</strong><br>
      Here’s what Chatly found: educational and friendly results.</p>`;
    }
  });
}

setupSearch();

// Optional: Home button redirect
function goHome() {
  window.location.href = "index.html";
}
