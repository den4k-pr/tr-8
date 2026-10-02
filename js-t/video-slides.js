(function () {
  // Слайдер "Real Stories, Real Results" (як s4 у s28)
  function initStories() {
    var el = document.querySelector('.stories-swiper');
    if (!el) return;
    new Swiper(el, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      grabCursor: true,
      loop: false,
      navigation: {
        nextEl: '.stories-next',
        prevEl: '.stories-prev'
      }
    });
  }

  // Слайдер "Video Testimonials" (як s6 у s28)
  function initVideos() {
    var el = document.querySelector('.videos-swiper');
    if (!el) return;
    var swiper = new Swiper(el, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      navigation: {
        nextEl: '.videos-next',
        prevEl: '.videos-prev'
      }
    });

    swiper.on('slideChangeTransitionStart', killAllVideos);
    swiper.on('sliderMove', killAllVideos);
  }

  // Знищення активних плеєрів та відновлення фотографій
  function killAllVideos() {
    document.querySelectorAll('.video-slide video').forEach(function (v) {
      v.pause();
      v.removeAttribute('src');
      v.load();
      var slide = v.closest('.video-slide');
      if (slide) slide.classList.remove('is-playing');
      v.remove();
    });
  }

  // Відкриття та відтворення відео
  function openVideo(slide, url) {
    killAllVideos();

    var v = document.createElement('video');
    v.setAttribute('src', url);
    v.setAttribute('controls', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('autoplay', '');
    v.setAttribute('preload', 'auto');
    v.className = 'video-slide-video';
    v.addEventListener('ended', killAllVideos);

    slide.classList.add('is-playing');
    slide.appendChild(v);

    var p = v.play();
    if (p && typeof p.then === 'function') {
      p.catch(function () {
        v.muted = true;
        v.play();
      });
    }
  }

  function initGlobalListeners() {
    initStories();
    initVideos();

    // Перехоплюємо клік у фазі capture, щоб Swiper не з'їв його
    document.addEventListener('click', function (e) {
      if (e.target.tagName === 'VIDEO') return;
      var slide = e.target.closest('.video-slide');
      if (!slide) return;
      var url = slide.getAttribute('data-video');
      if (url) {
        e.preventDefault();
        e.stopPropagation();
        openVideo(slide, url);
      }
    }, true);

    document.addEventListener('touchmove', function (e) {
      if (e.target.tagName === 'VIDEO') return;
      if (e.target.closest('.video-slide')) killAllVideos();
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalListeners);
  } else {
    initGlobalListeners();
  }
})();
