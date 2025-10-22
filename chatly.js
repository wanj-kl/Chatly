/* frontend/app.js
 Handles signup/login/dashboard interactions and calls backend APIs.
 Session is stored in localStorage as a lightweight mock session.
*/

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return res;
}

// Signup page logic
if (document.getElementById('signupBtn')) {
  document.getElementById('signupBtn').addEventListener('click', async () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const ageInput = document.getElementById('age').value;
    const msg = document.getElementById('msg');

    if (!name || !email || !password) { msg.textContent = 'Please fill name, email, password'; return; }
    if (role === 'child' && (!ageInput || Number(ageInput) <= 0)) { msg.textContent = 'Please enter child age'; return; }

    const body = { name, email, password, role, age: role === 'child' ? Number(ageInput) : null };
    const res = await postJson('/api/signup', body);
    const j = await res.json();
    if (res.ok) {
      // auto-login
      localStorage.setItem('session', JSON.stringify({ userId: j.userId, role: j.role }));
      window.location.href = 'dashboard.html';
    } else {
      msg.textContent = j.error || 'Signup failed';
    }
  });
}

// Dashboard & login utilities
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    localStorage.removeItem('session');
    window.location.href = 'login.html';
  });
}

// Dashboard initialization
if (document.body.contains(document.querySelector('.container')) && window.location.pathname.endsWith('dashboard.html')) {
  (async function initDashboard(){
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    if (!session || !session.userId) {
      window.location.href = 'login.html';
      return;
    }

    // fetch user info
    const r = await fetch('/api/me', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: session.userId }) });
    const me = await r.json();
    if (!r.ok) { alert('Session expired'); localStorage.removeItem('session'); window.location.href='login.html'; return; }

    // show area depending on role
    if (me.role === 'child') {
      document.getElementById('childArea').style.display = 'block';
      document.getElementById('childAge').value = me.age || '';
      document.getElementById('title').textContent = `AI Guardian — Child: ${me.name}`;
    } else {
      document.getElementById('parentArea').style.display = 'block';
      document.getElementById('title').textContent = `AI Guardian — Parent: ${me.name}`;
      // populate guardian email & linked children
      document.getElementById('guardianEmail').value = me.email;
      renderLinkedChildren(me.linkedChildren || []);
      renderAlerts(me.alerts || []);
    }

    // analyze button (child)
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', async () => {
        const age = Number(document.getElementById('childAge').value) || me.age || 0;
        const content = document.getElementById('childContent').value.trim();
        const resultDiv = document.getElementById('result');

        if (!content) { resultDiv.textContent = 'Enter some text to analyze'; return; }

        resultDiv.textContent = '🔍 Analyzing...';

        const res = await postJson('/api/analyze', { age, content, userId: me.id });
        const j = await res.json();
        if (!res.ok) { resultDiv.textContent = 'Error analyzing'; return; }

        if (j.status === 'blocked') {
          resultDiv.innerHTML = `<strong>🚫 Blocked</strong><div>${j.explanation}</div>`;
        } else if (j.status === 'flagged') {
          resultDiv.innerHTML = `<strong>⚠️ Flagged</strong><div>${j.explanation}</div>`;
        } else {
          resultDiv.innerHTML = `✅ Safe: ${j.explanation}`;
        }
      });
    }

    // diversion demo button
    const divert = document.getElementById('playDivertBtn');
    if (divert) {
      divert.addEventListener('click', () => {
        const resultDiv = document.getElementById('result');
        // playful diversion: a short text-based "game"
        resultDiv.innerHTML = `<div><strong>🔮 Quick Game:</strong> Press the glowing star 3 times!</div>
          <div style="margin-top:8px;"><button id="star">⭐</button> <span id="count">0</span>/3</div>
        `;
        let count = 0;
        document.getElementById('star').addEventListener('click', () => {
          count++; document.getElementById('count').textContent = count;
          if (count >= 3) {
            resultDiv.innerHTML = `<div>Nice! Here's a safe fun fact: <em>Did you know octopuses have three hearts?</em></div>`;
          }
        });
      });
    }

    // parent actions
    const saveSettingsBtn = document.getElementById('saveSettings');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', async () => {
        const email = document.getElementById('guardianEmail').value.trim();
        const res = await postJson('/api/update-guardian', { userId: me.id, guardianEmail: email });
        const j = await res.json();
        if (res.ok) alert('Saved'); else alert('Save failed');
      });
    }

    const linkChildBtn = document.getElementById('linkChildBtn');
    if (linkChildBtn) {
      linkChildBtn.addEventListener('click', async () => {
        const childEmail = document.getElementById('linkChildEmail').value.trim();
        if (!childEmail) return alert('Enter child email');
        const res = await postJson('/api/link-child', { parentId: me.id, childEmail });
        const j = await res.json();
        if (res.ok) {
          renderLinkedChildren(j.linkedChildren || []);
          alert('Child linked (if email exists).');
        } else alert(j.error || 'Could not link');
      });
    }

    // helpers
    function renderLinkedChildren(list) {
      const ul = document.getElementById('linkedChildren');
      ul.innerHTML = '';
      (list || []).forEach(c => {
        const li = document.createElement('li');
        li.textContent = `${c.name} (${c.email}) - age ${c.age || 'N/A'}`;
        ul.appendChild(li);
      });
    }
    function renderAlerts(list) {
      const ul = document.getElementById('alertsList');
      ul.innerHTML = '';
      (list || []).forEach(a => {
        const li = document.createElement('li');
        li.textContent = `${new Date(a.ts).toLocaleString()} — ${a.message}`;
        ul.appendChild(li);
      });
    }

  })();
}
