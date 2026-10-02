// 3D-переворот карток "What do I get": кожна картка перевертається окремо
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.flip-card').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('flipped');
      card.classList.remove('is-animating');
      card.offsetWidth; // перезапуск анімації підйому
      card.classList.add('is-animating');
    });
    card.addEventListener('animationend', function () {
      card.classList.remove('is-animating');
    });
  });
});
