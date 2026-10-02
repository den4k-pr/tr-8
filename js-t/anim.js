document.addEventListener("DOMContentLoaded", () => {
  const statsBanner = document.querySelector(".coach-stats");
  if (!statsBanner) return;

  const animateNumbers = (element) => {
    const targetText = element.textContent.trim();
    
    // Шукаємо тільки цифри (включаючи крапки/коми для десяткових або тисячних)
    const numericMatch = targetText.match(/[\d.,]+/);
    if (!numericMatch) return;

    const numericString = numericMatch[0];
    // "2.2M" — це десяткове число, а не роздільник тисяч
    const isMillions = /M/i.test(targetText);
    // Визначаємо оригінальний формат (чи є крапка, щоб потім її зберегти)
    const hasDot = numericString.includes('.') && !isMillions;
    
    // Отримуємо чисте число для математичного підрахунку
    const targetValue = isMillions
      ? parseFloat(numericString.replace(/,/g, '.'))
      : parseFloat(numericString.replace(/\./g, '').replace(/,/g, '.'));

    // Фіксуємо ширину фінального тексту, щоб колонки не "стрибали" під час рахунку
    element.style.minWidth = element.getBoundingClientRect().width + 'px';
    
    // Отримуємо все, що йде ДО та ПІСЛЯ числа (наприклад, "M" або "+")
    const prefix = targetText.split(numericString)[0] || "";
    const suffix = targetText.split(numericString)[1] || "";

    const duration = 2000; // Тривалість анімації в мілісекундах (2 секунди)
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Функція плавного сповільнення (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * targetValue;

      // Форматування числа назад під час анімації
      let formattedValue;
      if (hasDot) {
        // Якщо в оригіналі була крапка (як у 12.500), повертаємо її як роздільник тисячних
        formattedValue = Math.floor(currentValue).toString().replace(/\B(?=(\d{3})+(?!\n))/g, ".");
        
        // Маленький хак для специфічного формату "12.500" (якщо це дробове 12.5)
        if (numericString.includes('.') && numericString.split('.')[1].length === 3 && targetValue < 100000) {
           // Якщо це дробове число з 3 знаками після крапки
           formattedValue = (currentValue / 1000).toFixed(3).replace('.', '.');
        }
      } else {
        // Якщо крапки не було, просто округлюємо до цілого (або залишаємо 1 знак для мільйонів типу 2.2)
        if (isMillions) {
          formattedValue = (currentValue).toFixed(1);
        } else {
          formattedValue = Math.floor(currentValue).toString();
        }
      }

      // Виводимо проміжний результат з префіксом та суфіксом
      element.textContent = `${prefix}${formattedValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        // В самому кінці забиваємо залізобетонно оригінальний текст з макету
        element.textContent = targetText;
      }
    };

    requestAnimationFrame(updateNumber);

    // Страховка: якщо rAF призупинився (вкладка у фоні), все одно показуємо фінальне число
    setTimeout(() => { element.textContent = targetText; }, duration + 100);
  };

  // Налаштування Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1 // Спрацює, коли 10% банеру з'явиться на екрані
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Знаходимо всі класи з числами всередині банеру
        const numbers = entry.target.querySelectorAll(".coach-stat-num");
        numbers.forEach(num => animateNumbers(num));
        
        // Вимикаємо спостереження, щоб анімація відпрацювала лише 1 раз за візит
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(statsBanner);
});