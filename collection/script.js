document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter');
  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      filterButtons.forEach((item) => item.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const navButtons = document.querySelectorAll('.topbar-nav .nav-link');
  navButtons.forEach((button) => {
    button.addEventListener('click', function () {
      navButtons.forEach((item) => item.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
