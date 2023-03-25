export const hideAlert = () => {
  const el = document.querySelector('.alert');

  if (el) el.parentElement.removeChild(el);
}

// Type is 'success' or 'erroe'
export const showAlert = (type, msg) => {
  hideAlert();

  const body = document.querySelector('body');
  const markup = `<div class="alert alert-${type}">${msg}</div>`;

  body.insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
}