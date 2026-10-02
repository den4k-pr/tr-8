/* =============================================================================
   Wheel of Fortune + Exit-Trap — уся логіка.
   Підключати на ГОЛОВНІЙ сторінці: <script src="./script.js" defer></script>
   Працює у зв'язці зі сторінкою /test (test.html).

   Сценарій:
     • трафік заходить на /test -> невидимо редіректить на головну (в історії лишається /test)
     • 1-ше «Назад» -> головна з ?exit=1 -> відкривається попап-колесо
     • 2-ге «Назад» -> користувача гарантовано викидає на EXIT_TARGET (напр. google)
   ============================================================================= */
(function () {
    'use strict';

    /* ===================== НАЛАШТУВАННЯ ===================== */
    var STAGE_KEY   = '__exit_stage';
    var POPUP_URL   = '/?exit=1';                 // куди вести, щоб відкрився попап
    var EXIT_TARGET = 'https://www.google.com/';  // куди «викинути» при другому виході

    /* ===================== СХОВИЩЕ ЕТАПУ =====================
       Пишемо і в sessionStorage, і в window.name (резерв, що переживає переходи
       між сторінками і працює навіть коли sessionStorage заблоковано). */
    function readStage() {
        try { var s = sessionStorage.getItem(STAGE_KEY); if (s !== null) return s; } catch (e) {}
        var m = /__exit_stage:([a-z]+)/.exec(window.name || '');
        return m ? m[1] : null;
    }
    function writeStage(v) {
        try { sessionStorage.setItem(STAGE_KEY, v); } catch (e) {}
        var base = (window.name || '').replace(/__exit_stage:[a-z]+/g, '');
        window.name = base + '__exit_stage:' + v;
    }
    function hasExitParam() {
        return /(?:^|[?&])exit=1(?:&|$)/.test(location.search);
    }

    /* ===================== ПОПАП ===================== */
    var popupEl = null;

    function openPopup() {
        popupEl = popupEl || document.getElementById('exitPopup');
        if (popupEl) popupEl.classList.add('active');
    }
    function closePopup() {
        popupEl = popupEl || document.getElementById('exitPopup');
        if (popupEl) popupEl.classList.remove('active');
        // Пастку НЕ знімаємо: наступне «Назад» усе одно веде на EXIT_TARGET.
    }

    /* ===================== ЛОГІКА КОЛЕСА ===================== */
    var wheelInited = false;
    var isSpinning = false;
    var hasSpun = false;

    function initWheel() {
        if (wheelInited) return;
        wheelInited = true;

        var wheel             = document.getElementById('spinningWheel');
        var centerBtn         = document.getElementById('centerSpinBtn');
        var mainActionBtn     = document.getElementById('mainActionBtn');
        var mainActionBtnText = document.getElementById('mainActionBtn-text');
        var wheelAssembly     = document.getElementById('wheelAssembly');
        var initialTitle      = document.getElementById('initialTitle');
        var wonTitle          = document.getElementById('wonTitle');
        var giftAssembly      = document.getElementById('giftAssembly');
        var actionSubtext     = document.getElementById('actionSubtext');
        var closeBtn          = document.getElementById('closePopupBtn');

        if (closeBtn) closeBtn.addEventListener('click', closePopup);

        function triggerSpin(e) {
            e.preventDefault();

            if (hasSpun && !isSpinning) {
                // Дія після виграшу — ведемо на цільове посилання/оффер.
                window.location.href = '#claim-bonus';
                return;
            }
            if (isSpinning || hasSpun) return;

            isSpinning = true;
            wheel.classList.add('spinning');

            setTimeout(function () {
                wheelAssembly.style.opacity = '0';
                initialTitle.style.opacity = '0';

                setTimeout(function () {
                    wheelAssembly.style.pointerEvents = 'none';
                    initialTitle.style.pointerEvents = 'none';

                    wonTitle.style.opacity      = '1';
                    giftAssembly.style.opacity  = '1';
                    actionSubtext.style.opacity = '1';

                    if (mainActionBtnText) mainActionBtnText.innerText = 'CLAIM MY BONUS';

                    isSpinning = false;
                    hasSpun = true;
                }, 500);
            }, 4500);
        }

        if (centerBtn)     centerBtn.addEventListener('click', triggerSpin);
        if (mainActionBtn) mainActionBtn.addEventListener('click', triggerSpin);
    }

    /* ===================== EXIT-TRAP ===================== */

    // Останній крок: наступне «Назад» гарантовано веде на EXIT_TARGET.
    function armFinalExit() {
        writeStage('done');
        try { history.pushState({ __exitFinal: 1 }, '', location.href); } catch (e) {}
        window.addEventListener('popstate', function onPop() {
            window.removeEventListener('popstate', onPop);
            location.replace(EXIT_TARGET);
        });
    }

    // Резервна пастка: перше «Назад» відкриває попап навіть якщо запис /test було втрачено.
    function armPopupReinforcement() {
        try { history.pushState({ __exitReinf: 1 }, '', location.href); } catch (e) {}
        window.addEventListener('popstate', function onPop() {
            window.removeEventListener('popstate', onPop);
            location.replace(POPUP_URL);
        });
    }

    /* ===================== ЗАПУСК ===================== */
    function start() {
        initWheel();

        if (hasExitParam()) {
            // Головна з попапом: показуємо колесо і озброюємо фінальний вихід.
            openPopup();
            armFinalExit();
            return;
        }

        // Звичайна головна одразу після /test — ставимо резервну пастку на перше «Назад».
        if (readStage() === 'seeded') {
            armPopupReinforcement();
        }
        // Пряме відкриття (без /test) — нічого не робимо.
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    // Переозброєння при відновленні з bfcache (кнопки назад/вперед).
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) start();
    });
})();