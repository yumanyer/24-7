document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.filter');
  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      buttons.forEach((item) => item.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const scrollLink = document.querySelector('.btn-secondary[href^="#"]');
  if (scrollLink) {
    scrollLink.addEventListener('click', function (event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
