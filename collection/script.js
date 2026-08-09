document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter');
  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      filterButtons.forEach((item) => item.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
