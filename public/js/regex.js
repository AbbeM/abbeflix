/* eslint-disable */
const inputs = document.querySelectorAll('input');

const patterns = {
  name: /^[a-z]+$/i,
  email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,8})?$/,
  pass: /^[\w@-]{8,20}$/i,
};

function validate(field, regex, e) {
  if (regex.test(field.value)) {
    field.className = 'valid';
    document.querySelector(
      `#${field.attributes.name.value}-err`
    ).style.display = 'none';
  } else {
    field.className = 'invalid';
    document.querySelector(
      `#${field.attributes.name.value}-err`
    ).style.display = 'inline-block';
  }
}

inputs.forEach((input) => {
  input.addEventListener('keyup', (e) => {
    field = e.target.attributes.name.value;
    if (e.target.attributes.type !== 'submit') {
      validate(e.target, patterns[field], e);
    }
  });
});
