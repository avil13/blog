addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('#burger-button');
  const navbarMenu = document.querySelector('#navbar-menu');

  burgerButton?.addEventListener('click', (ev) => {
    navbarMenu?.classList.toggle('is-active');
    burgerButton?.classList.toggle('is-active');
  });
});
