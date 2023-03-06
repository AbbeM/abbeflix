const settingsBtn = document.querySelector('.profile-btns.settings');
const resPassBtn = document.querySelector('.profile-btns.pass');

const layout = document.querySelectorAll('.layout');
const settingsLayout = document.querySelector('.layout.settings');
const passLayout = document.querySelector('.layout.pass');

settingsBtn.addEventListener('click', () => {
  layout.forEach((el) => {
    el.classList.remove('active');
  });

  settingsLayout.classList.add('active');
});

resPassBtn.addEventListener('click', () => {
  layout.forEach((el) => {
    el.classList.remove('active');
  });

  passLayout.classList.add('active');
});
