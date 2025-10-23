
        document.addEventListener('DOMContentLoaded', () => {
  const parentUser = JSON.parse(localStorage.getItem('parentUser'));
  const parentNameEl = document.getElementById('parentName');
  const alertsEl = document.getElementById('alerts');

  if (parentUser && parentUser.name) {
    parentNameEl.textContent = parentUser.name;
  }

  // Load saved guardian alerts
  const alerts = JSON.parse(localStorage.getItem('guardianAlerts')) || [];

  if (alerts.length === 0) {
    alertsEl.innerHTML = "No flagged activity. All clear!";
  } else {
    alertsEl.innerHTML = alerts.map(a => `
      <div class="alert-box">
        <p><strong>${a.child}</strong> searched for <em>${a.query}</em></p>
        <p>${a.message}</p>
        <small>${a.time}</small>
      </div>
    `).join('') + `<button id="clearAlerts">Clear Alerts</button>`;
          }
          
// Load all child searches
const allSearches = JSON.parse(localStorage.getItem('allChildSearches')) || [];
const searchListEl = document.getElementById('childSearchList');

if (allSearches.length === 0) {
  searchListEl.innerHTML = "<li>No searches yet.</li>";
} else {
  searchListEl.innerHTML = allSearches.map(entry => `
    <li><strong>${entry.child}</strong> searched for: "${entry.query}" at ${entry.time}</li>
  `).join('');
}


  // Clear alerts when clicked
  document.addEventListener('click', (e) => {
    if (e.target.id === 'clearAlerts') {
      localStorage.removeItem('guardianAlerts');
      location.reload();
    }
  });
});

// Home button function
function goHome() {
  window.location.href = "index.html";
}
