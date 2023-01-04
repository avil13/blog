addEventListener('DOMContentLoaded', () => {
  const $ = document.querySelector.bind(
    document
  ) as typeof document.querySelector;

  const burgerButton = $('#burger-button');
  const navbarMenu = $('#navbar-menu');

  burgerButton?.addEventListener('click', (ev) => {
    navbarMenu?.classList.toggle('is-active');
    burgerButton?.classList.toggle('is-active');
  });

  // social
  if ('ontouchstart' in window) {
    $('.social-box')?.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      ($('.social-text') as HTMLAnchorElement).style.display = 'none';
      ($('.social-btns') as HTMLAnchorElement).style.display = 'block';
    }, { once: true });
  }
});
