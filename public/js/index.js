/* eslint-disable */
import '@babel/polyfill'
import { login, sigup, logout, addToFavorit, rateMovie } from './auth'

let loginError = false;

// FORMS
const loginForm = document.querySelector('#login');
const signupForm = document.querySelector('#signup');

// BTNS
const settingsBtn = document.querySelector('.profile-btns.settings');
const resPassBtn = document.querySelector('.profile-btns.pass');
const registerBtn = document.querySelector('.register');
const loginBtn = document.querySelector('.login-link');
const nxtBtn = document.querySelector('.nxtBtn');
const brvBtn = document.querySelector('.brvBtn');
const regbtns = document.querySelectorAll('.regbtns input');
const logoutbtnA = document.querySelector('#loggaut')
const addToListBtn = document.querySelector('.add-to-list');
const rateBtn = document.querySelector('.rate');

// ELEMENTS
const step1Elements = document.querySelectorAll('.step-1');
const step2Elements = document.querySelectorAll('.step-2');
const steps = document.querySelectorAll('.step');
const stars = document.querySelectorAll('.rate svg')
const rating = document.querySelector('.rate p').getAttribute('rating')

// LAYOUTS
const layout = document.querySelectorAll('.layout');
const settingsLayout = document.querySelector('.layout.settings');
const passLayout = document.querySelector('.layout.pass');

const inputs = document.querySelectorAll('input');


const patterns = {
  name: /^[a-z]+$/i,
  email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,8})?$/,
  pass: /^[\w@-]{8,20}$/i,
};

function validate(field, regex, e) {
  if (regex.test(field.value)) {
    loginError = false;
    field.className = 'valid';
    document.querySelector(
      `#${field.attributes.name.value}-err`
    ).style.display = 'none';
  } else {
    loginError = true;
    field.className = 'invalid';
    document.querySelector(
      `#${field.attributes.name.value}-err`
    ).style.display = 'inline-block';
  }
}

inputs.forEach((input) => {
  input.addEventListener('keyup', (e) => {
    let field = e.target.attributes.name.value;
    if (e.target.attributes.type !== 'submit') {
      validate(e.target, patterns[field], e);
    }
  });
});

if(settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    layout.forEach((el) => {
      el.classList.remove('active');
    });
  
    settingsLayout.classList.add('active');
  });
}

// DS was here ;-)
if (resPassBtn) {
  resPassBtn.addEventListener('click', () => {
    layout.forEach((el) => {
      el.classList.remove('active');
    });
  
    passLayout.classList.add('active');
  });
}

if (registerBtn) {
  registerBtn.addEventListener('click', (e) => {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    loginBtn.parentElement.style.display = 'block';
    registerBtn.parentElement.style.display = 'none';
  })
}

if (loginBtn) {
  loginBtn.addEventListener('click', (e) => {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    loginBtn.parentElement.style.display = 'none';
    registerBtn.parentElement.style.display = 'block';
  })
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!loginError) {
      const email = loginForm.email.value;
      const pass = loginForm.pass.value;
    
      login(email, pass);
    }
  })
}

if (signupForm) {
  nxtBtn.addEventListener('click', (e) => {
    step1Elements.forEach(el => {
      if (!el.classList.contains('err')) {
        el.style.display = 'none';
      }
    })

    step2Elements.forEach(el => {
      if (!el.classList.contains('err')) {
        el.style.display = 'block';
      }
    })

    steps[0].classList.remove('active');
    steps[1].classList.add('active');

    regbtns[0].classList.remove('active');
    regbtns[1].classList.add('active');
    regbtns[2].classList.add('active');
  })

  brvBtn.addEventListener('click', (e) => {
    step2Elements.forEach(el => {
      if (!el.classList.contains('err')) {
        el.style.display = 'none';
      }
    })

    step1Elements.forEach(el => {
      if (!el.classList.contains('err')) {
        el.style.display = 'block';
      }
    })

    steps[1].classList.remove('active');
    steps[0].classList.add('active');

    regbtns[0].classList.add('active');
    regbtns[1].classList.remove('active');
    regbtns[2].classList.remove('active');
  })


  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if(!loginError) {
      const name = signupForm.name.value;
      const email = signupForm.email.value;
      const pass = signupForm.pass.value;
      const passConf = signupForm.passConf.value;
    
      sigup(name, email, pass, passConf);
    }
  })
}

if (logoutbtnA) {
  logoutbtnA.addEventListener('click', (e) => {
    logout();
  })
}

if (addToListBtn) {
  addToListBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const movieId = e.target.getAttribute('movieId')
    
    addToFavorit(movieId, e.target);

  })
}

// if (rateBtn) {
//   rateBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     const movieId = e.target.getAttribute('movieId')
    
//     rateMovie(movieId, e.target);

//   })
// }

if (stars) {
  stars.forEach((item, index1) => {
    item.addEventListener('click', (e) => {
      const movieId = e.target.getAttribute('movieid')
      const user = e.target.getAttribute('currentuser')
      rateMovie(movieId, user, (index1+1)*2);
      
      stars.forEach((star, index2) => {
        index1 >= index2 ? star.classList.add('active') : star.classList.remove('active') 
      })
    })
  })

  stars.forEach((star, index2) => {
    ((rating/2) - 1) >= index2 ? star.classList.add('active') : star.classList.remove('active') 
  })
}
