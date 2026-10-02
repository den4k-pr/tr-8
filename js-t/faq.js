document.addEventListener('DOMContentLoaded', function() {
    var faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function(question) {
      question.addEventListener('click', function() {
        var item = this.parentElement;
        var wrapper = item.querySelector('.faq-answer-wrapper');
        var isActive = item.classList.contains('active');

        if (!isActive) {
          item.classList.add('active');
          wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        } else {
          // Відкриті за замовчуванням мають max-height: none — фіксуємо висоту, щоб анімація стартувала
          wrapper.style.maxHeight = wrapper.scrollHeight + "px";
          wrapper.offsetHeight;
          item.classList.remove('active');
          wrapper.style.maxHeight = null;
        }
      });
    });
  });
