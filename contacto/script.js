document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      navLinks.forEach((item) => item.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
