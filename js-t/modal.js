document.addEventListener('DOMContentLoaded', () => {

  // Порядок = порядок карток у блоці .s2 (id збігаються з data-program на картках)
  const programsData = [
    {
      id: 'front-split',
      image: './images-t2/swipe/card10.webp', // FRONTSPLIT (Longitudinal Split Course)
      title: 'INSIDE FRONT SPLIT',
      subtitle: 'Work step by step toward a safer, deeper front split.',
      lessons: '30 lessons',
      time: '16-25 min/day',
      category: 'Front split flexibility',
      forYou: 'You want to improve hamstrings, hip flexors, and lateral split depth',
      theme: 'dark'
    },
    {
      id: 'middle-split',
      image: './images-t2/swipe/card11.webp', // MIDDLESPLIT (Middle Split Course)
      title: 'INSIDE MIDDLE SPLIT',
      subtitle: 'Develop the mobility and flexibility for your middle split',
      lessons: '30 lessons',
      time: '16-25 min/day',
      category: 'Middle split flexibility',
      forYou: 'You want to open your hips, inner thighs and get to the middle split range',
      theme: 'dark'
    },
    {
      id: 'front-split-2',
      image: './images-t2/swipe/card13.webp', // REACH YOUR FRONT SPLIT — білий фон
      title: 'INSIDE FRONT SPLIT 2.0',
      subtitle: 'Front Split program with new lessons tips, guidance and a more complete path to deeper flexibility.',
      lessons: '30 lessons',
      time: '20–25 min/day',
      category: 'Front split depth & control',
      forYou: 'You want to build a deeper, cleaner front split with better control',
      theme: 'light'
    },
    {
      id: 'middle-split-2',
      image: './images-t2/swipe/card14.webp', // OPEN YOUR MIDDLE SPLIT — білий фон
      title: 'INSIDE MIDDLE SPLIT 2.0',
      subtitle: 'Middle Split program - with new lessons and more focused work for deeper range',
      lessons: '30 lessons',
      time: '20–25 min/day',
      category: 'Middle split depth & hip mobility',
      forYou: 'You want to progress beyond the original program and work toward a deeper middle split',
      theme: 'light'
    },
    {
      id: 'beginner-mobility',
      image: './images-t2/swipe/card2.webp', // BEGINNERMOBILITY — темний фон
      title: 'INSIDE BEGINNER MOBILITY',
      subtitle: 'Start here if your body feels stiff, weak, or “not ready.”',
      lessons: '30 lessons',
      time: '15–20 min/day',
      category: 'Full-body mobility',
      forYou: 'You’re starting from zero and want a safe, simple foundation.',
      theme: 'dark'
    },
    {
      id: 'upper-body-mobility',
      image: './images-t2/swipe/card15.webp', // Upper Body Mobility — світлий бежевий фон
      title: 'INSIDE UPPER BODY MOBILITY',
      subtitle: 'Release neck, shoulders, and upper-back tension.',
      lessons: '30 lessons',
      time: '10–15 min/day',
      category: 'Posture & thoracic mobility',
      forYou: 'Tension keeps coming back, posture doesn’t hold',
      theme: 'light'
    },
    {
      id: 'only-flexibility',
      image: './images-t2/swipe/card16.webp', // ONLY FLEXIBILITY — темний фон
      title: 'INSIDE ONLY FLEXIBILITY',
      subtitle: 'Build flexibility with short, guided daily sessions',
      lessons: '30 lessons',
      time: '7–15 min/day',
      category: 'Full-body flexibility',
      forYou: 'You want a simple daily flexibility routine without long workouts',
      theme: 'dark'
    },
    {
      id: 'beginner-mobility-2',
      image: './images-t2/swipe/card12.webp', // BEGINNER MOBILITY (Full year access) — темний фон
      title: 'INSIDE BEGINNER MOBILITY 2.0',
      subtitle: 'Start here if your body feels stiff, weak, or “not ready.”',
      lessons: '30 lessons',
      time: '20 min/day',
      category: 'Full-body mobility',
      forYou: 'Upgraded Starter Program for your safe foundation',
      theme: 'dark'
    },
    {
      id: 'hip-mobility',
      image: './images-t2/swipe/card8.webp', // HIP MOBILITY — білий фон
      title: 'INSIDE HIP MOBILITY',
      subtitle: 'Open tight hips and improve the way your lower body moves.',
      lessons: '30 lessons',
      time: '10–15 min/day',
      category: 'Hip mobility & range',
      forYou: 'Your hips feel blocked, restricted, or stiff in daily movement',
      theme: 'light'
    },
    {
      id: 'back-mobility',
      image: './images-t2/swipe/card6.webp', // BACK MOBILITY — низ темно-червоний, білий текст
      title: 'INSIDE BACK MOBILITY',
      subtitle: 'Move your spine more freely and reduce daily stiffness',
      lessons: '30 lessons',
      time: '10–15 min/day',
      category: 'Back health & posture',
      forYou: 'Your back feels tight, heavy, or tired from sitting and everyday life',
      theme: 'dark'
    },
    {
      id: 'inhomepower-bikini',
      image: './images-t2/swipe/card1.webp', // INHOMEPOWER Bikini Booty Plan — темно-червоний фон
      title: 'INSIDE INHOMEPOWER: BIKINI BODY',
      subtitle: 'A full-body shaping program for strength and tone at home',
      lessons: '30 lessons',
      time: '15–20 min/day',
      category: 'Body shaping & tone',
      forYou: 'You want a leaner, stronger, more toned body with a clear plan.',
      theme: 'dark'
    },
    {
      id: 'powerfit-core',
      image: './images-t2/swipe/card5.webp', // POWERFIT CORE — червоний фон
      title: 'INSIDE POWERFIT 2.0 CORE',
      subtitle: 'Strengthen your core and improve body control.',
      lessons: '30 lessons',
      time: '10–15 min/day',
      category: 'Core strength & stability',
      forYou: 'You want a stronger waist, better posture, and more control in movement.',
      theme: 'dark'
    },
    {
      id: 'fit-program',
      image: './images-t2/swipe/card4.webp', // FIT PROGRAM — світлий сірий фон
      title: 'INSIDE FIT PROGRAM',
      subtitle: 'Full Body strength, tone, and mobility at home with completely new program!',
      lessons: '30 lessons',
      time: '15–20 min/day',
      category: 'Strength & endurance',
      forYou: 'You want a stronger body and mobility that holds under load',
      theme: 'light'
    },
    {
      id: 'powerfit-body',
      image: './images-t2/swipe/card9.webp', // POWERFITBODY — червоний фон
      title: 'INSIDE POWERFIT BODY',
      subtitle: 'Train your full body for strength, shape, and endurance.',
      lessons: '30 lessons',
      time: '15–20 min/day',
      category: 'Full-body strength',
      forYou: 'You want a stronger, more defined body with short effective workouts',
      theme: 'dark'
    },
    {
      id: 'project-glutes',
      image: './images-t2/swipe/card7.webp', // INHOMEPOWER Project Glutes — насичений рожевий, білий текст
      title: 'INSIDE PROJECT GLUTES',
      subtitle: 'Focused lower-body training to build stronger glutes',
      lessons: '30 lessons',
      time: '15–20 min/day',
      category: 'Glutes & legs',
      forYou: 'You want targeted glute work and a stronger lower body at home.',
      theme: 'dark'
    },
    {
      id: 'handstand-mastery',
      image: './images-t2/swipe/card3.webp', // HANDSTAND MASTERY — чорно-жовтий фон
      title: 'INSIDE HANDSTAND MASTERY',
      subtitle: 'Build the strength, line, and balance for your handstand',
      lessons: '30 lessons',
      time: '20–25 min/day',
      category: 'Handstand strength & control',
      forYou: 'You want to go from wall work toward a cleaner freestanding handstand',
      theme: 'dark'
    }
  ];

  const swiperWrapper = document.getElementById('modalSwiperWrapper');
  const modalOverlay = document.getElementById('programsModal');
  const closeBtn = document.getElementById('closeModalBtn');

  // 1. Генерація слайдів: front — обкладинка, back — інфо про курс
  programsData.forEach(program => {
    const isDark = program.theme === 'dark';
    const textColorClass = isDark ? 'text-dark-theme' : 'text-light-theme';

    const strokeColor = isDark ? 'white' : 'black';
    const lineOpacity = isDark ? 0.2 : 0.4;
    const svgLine = `<svg width="196" height="1" viewBox="0 0 196 1" fill="none" style="display:block;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><path opacity="${lineOpacity}" d="M0 0.5H196" stroke="${strokeColor}" shape-rendering="crispEdges"/></svg>`;

    const iconPlay = isDark ? './images-t2/play-w.png' : './images-t2/play.png';
    const iconTime = isDark ? './images-t2/time-w.png' : './images-t2/time.png';
    const iconMan  = isDark ? './images-t2/man-w.png' : './images-t2/man.png';

    const slideHTML = `
      <div class="swiper-slide modal-slide" data-program="${program.id}">
        <div class="modal-card-inner">
          <div class="modal-flip">
            <div class="modal-face modal-face-front">
              <img src="${program.image}" alt="${program.title}" class="modal-cover-img">
            </div>
            <div class="modal-face modal-face-back">
              <img src="${program.image}" alt="" class="modal-back-bg">
              <div class="modal-content-wrap ${textColorClass}">
                <div class="modal-back-header">
                  <div class="modal-back-title">${program.title}</div>
                  <div class="modal-back-subtitle">${program.subtitle}</div>
                </div>
                ${svgLine}
                <div class="modal-features">
                  <div class="modal-feature">
                    <div class="modal-f-icon-wrap"><img src="${iconPlay}" alt="Play" class="modal-f-icon"></div>
                    <span>${program.lessons}</span>
                  </div>
                  <div class="modal-feature">
                    <div class="modal-f-icon-wrap"><img src="${iconTime}" alt="Time" class="modal-f-icon"></div>
                    <span>${program.time}</span>
                  </div>
                  <div class="modal-feature">
                    <div class="modal-f-icon-wrap"><img src="${iconMan}" alt="Category" class="modal-f-icon"></div>
                    <span>${program.category}</span>
                  </div>
                </div>
                ${svgLine}
                <div class="modal-for-you">
                  <strong>For you if:</strong><br>
                  ${program.forYou}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    swiperWrapper.insertAdjacentHTML('beforeend', slideHTML);
  });

  // 2. Фліп активного слайда: показуємо обкладинку, потім розвертаємо на інфо
  const FLIP_DELAY_OPEN = 700;  // після появи модалки
  const FLIP_DELAY_SLIDE = 450; // після перегортання слайда
  let flipTimer = null;

  const unflipAll = () => {
    clearTimeout(flipTimer);
    swiperWrapper.querySelectorAll('.modal-slide.is-flipped').forEach(s => s.classList.remove('is-flipped'));
  };

  const scheduleFlip = (delay) => {
    clearTimeout(flipTimer);
    flipTimer = setTimeout(() => {
      const active = modalSwiper.slides[modalSwiper.activeIndex];
      if (active && modalOverlay.classList.contains('active')) active.classList.add('is-flipped');
    }, delay);
  };

  // 3. Swiper
  const modalSwiper = new Swiper('.modal-swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: -34,
    loop: true,
    grabCursor: true,
    slideToClickedSlide: true,
    navigation: {
      nextEl: '.modal-btn-next',
      prevEl: '.modal-btn-prev',
    },
    on: {
      slideChangeTransitionStart: () => unflipAll(),
      slideChangeTransitionEnd: () => scheduleFlip(FLIP_DELAY_SLIDE),
    },
  });

  // Тап по активній картці — перевернути назад/вперед
  swiperWrapper.addEventListener('click', (e) => {
    const slide = e.target.closest('.modal-slide');
    if (!slide || modalSwiper.animating || !slide.classList.contains('swiper-slide-active')) return;
    clearTimeout(flipTimer);
    slide.classList.toggle('is-flipped');
  });

  // 4. Відкриття на тому курсі, по якому тапнули
  const openModal = (programId) => {
    const index = Math.max(0, programsData.findIndex(p => p.id === programId));
    unflipAll();
    modalOverlay.classList.add('active');
    modalSwiper.update();
    modalSwiper.slideToLoop(index, 0, false);
    scheduleFlip(FLIP_DELAY_OPEN);
  };

  document.querySelectorAll('.s2 [data-program]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.program));
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    unflipAll();
  };

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
  });
});
