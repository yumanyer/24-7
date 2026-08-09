document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.filter');
  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      buttons.forEach((item) => item.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const heroButton = document.querySelector('.btn-primary');
  if (heroButton) {
    heroButton.addEventListener('click', function (event) {
      event.preventDefault();
      const target = document.querySelector('#products');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const navLinks = document.querySelectorAll('.primary-nav a');
  const sections = [document.querySelector('#products'), document.querySelector('#collection')].filter(Boolean);

  function updateActiveNav() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.25;
    let activeLink = navLinks[0];

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top + window.scrollY <= scrollPosition) {
        activeLink = document.querySelector(`.primary-nav a[href="#${section.id}"]`);
      }
    });

    navLinks.forEach((link) => link.classList.remove('active'));
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
});
