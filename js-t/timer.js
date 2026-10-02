document.addEventListener("DOMContentLoaded", () => {
  // Відлік "Your 2 free bonuses expire in" — 1 година по колу, старт зберігається в localStorage
  function startHourTimer(selector, storageKey, minutesTotal) {
    const el = document.querySelector(selector);
    if (!el) return;

    const TOTAL_TIME = minutesTotal * 60 * 1000;

    let startTime = NaN;
    try { startTime = parseInt(localStorage.getItem(storageKey), 10); } catch (e) {}
    if (!startTime) {
      startTime = Date.now();
      try { localStorage.setItem(storageKey, startTime); } catch (e) {}
    }

    const pad = (n) => String(n).padStart(2, "0");

    function updateTimer() {
      const now = Date.now();
      let elapsed = now - startTime;

      if (elapsed >= TOTAL_TIME || elapsed < 0) {
        startTime = now;
        try { localStorage.setItem(storageKey, startTime); } catch (e) {}
        elapsed = 0;
      }

      const remaining = TOTAL_TIME - elapsed;
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      el.textContent = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  startHourTimer("[data-timer-hour]", "bonusTimerStart", 60);
});


document.addEventListener("DOMContentLoaded", () => {
  // Таймер у липкому футері: 30 хв по колу
  const boxes = document.querySelectorAll(".timer-display .timer-box");
  if (boxes.length < 3) return;

  const TOTAL_TIME = 30 * 60 * 1000;
  const KEY = "footerTimerStart";
  let startTime = NaN;
  try { startTime = parseInt(localStorage.getItem(KEY), 10); } catch (e) {}
  if (!startTime) {
    startTime = Date.now();
    try { localStorage.setItem(KEY, startTime); } catch (e) {}
  }

  const pad = (n) => String(n).padStart(2, "0");

  function update() {
    const now = Date.now();
    let elapsed = now - startTime;
    if (elapsed >= TOTAL_TIME || elapsed < 0) {
      startTime = now;
      try { localStorage.setItem(KEY, startTime); } catch (e) {}
      elapsed = 0;
    }
    const remaining = TOTAL_TIME - elapsed;
    boxes[0].textContent = pad(Math.floor(remaining / 3600000));
    boxes[1].textContent = pad(Math.floor((remaining % 3600000) / 60000));
    boxes[2].textContent = pad(Math.floor((remaining % 60000) / 1000));
  }

  update();
  setInterval(update, 1000);

  // Показ футера після 700px прокрутки
  const footer = document.getElementById("footer-bg");
  if (!footer) return;
  const toggle = () => footer.classList.toggle("active", window.scrollY >= 700);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
});
