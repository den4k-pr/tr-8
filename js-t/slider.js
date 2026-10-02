(function () {
  function initSwiper4() {
    var swiperEl = document.querySelector('.s4-swiper');
    if (swiperEl) {
      new Swiper(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 24, // Відстань між картками
        pagination: {
          el: '.s4-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.s4-next',
          prevEl: '.s4-prev'
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwiper4);
  } else {
    initSwiper4();
  }
})();