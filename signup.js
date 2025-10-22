// Toggle child fields when "Create for My Child" is selected
const accountTypeRadios = document.querySelectorAll('input[name="accountType"]');
const childFields = document.getElementById('childFields');

accountTypeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'child' && radio.checked) {
      childFields.classList.remove('hidden');
    } else {
      childFields.classList.add('hidden');
    }
  });
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const accountType = document.querySelector('input[name="accountType"]:checked').value;
  const name = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (accountType === 'personal') {
    const user = { name, email, password, role: 'personal' };
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'personal.html';
  } else {
    const childName = document.getElementById('childName').value;
    const childAge = parseInt(document.getElementById('childAge').value);

    if (!childName || !childAge) {
      alert('Please enter your child’s details.');
      return;
    }

    const parent = { name, email, password, role: 'parent', childName, childAge };
    const child = { name: childName, age: childAge, parentEmail: email, role: 'child' };

    localStorage.setItem('parentUser', JSON.stringify(parent));
    localStorage.setItem('childUser', JSON.stringify(child));
    localStorage.setItem('currentUser', JSON.stringify(parent));

    window.location.href = 'parent.html';
  }
});
