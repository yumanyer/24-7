document.addEventListener('DOMContentLoaded', function () {
  const paymentButtons = document.querySelectorAll('.payment-option');
  paymentButtons.forEach((button) => {
    button.addEventListener('click', function () {
      paymentButtons.forEach((item) => item.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
});
