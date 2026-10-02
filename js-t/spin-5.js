/* =============================================================================
   Wheel of Fortune + Exit-Trap + Telegram (тільки після використання колеса).
   Підключати на ГОЛОВНІЙ сторінці ПІСЛЯ data.js:
     <script src="./js-t/data.js"></script>
     <script src="./js-t/spin-5.js"></script>

   ЛОГІКА "НАЗАД" (надійна, живе тут, а не в /test):
     • пастку ставимо через history.pushState на головній (це працює завжди);
     • «Назад» не з'їдаємо на місці, а НАВІГУЄМО на /test — як і треба:
         1-ше «Назад» -> location.href = '/test?go=popup'  -> /test -> /?exit=1 (попап)
         2-ге «Назад» -> location.href = '/test?go=google' -> /test -> google
     • /test — тупий роутер за ?go, від історії не залежить.

   TELEGRAM: шлемо ОДИН раз — лише коли людина натиснула CLAIM після виграшу.
   Ніяких сигналів на pageview / показ попапу (щоб бот не спамив).
   ============================================================================= */
(function () {
    'use strict';

    /* ===================== НАЛАШТУВАННЯ ===================== */
    var OFFER_URL   = 'https://mmoschool.online/shop/item/13404';
     var TEST_POPUP  = '/test?go=popup';
    var TEST_GOOGLE = '/test?go=google';
    var BACK_KEY    = '__back_stage';

    function hasExitParam() {
        return /(?:^|[?&])exit=1(?:&|$)/.test(location.search);
    }

    /* ---- етап "Назад": 0 -> наступне показує попап; 1 -> наступне у гугл ---- */
    function readBackStage() {
        try { var s = sessionStorage.getItem(BACK_KEY); if (s !== null) return parseInt(s, 10) || 0; } catch (e) {}
        var m = /__back_stage:(\d+)/.exec(window.name || '');
        return m ? (parseInt(m[1], 10) || 0) : 0;
    }
    function writeBackStage(n) {
        try { sessionStorage.setItem(BACK_KEY, String(n)); } catch (e) {}
        var b = (window.name || '').replace(/__back_stage:\d+/g, '');
        window.name = b + '__back_stage:' + n;
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
    }

    /* ===================== UTM (зберігаємо на першому вході, щоб дожили до CLAIM) ===================== */
    var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
    function captureUTM() {
        try {
            var p = new URLSearchParams(location.search);
            UTM_KEYS.forEach(function (k) {
                var v = p.get(k);
                if (v && !sessionStorage.getItem('__utm_' + k)) sessionStorage.setItem('__utm_' + k, v);
            });
        } catch (e) {}
    }
    function utmVal(k) {
        try {
            var v = new URLSearchParams(location.search).get(k);
            if (v) return v;
            return sessionStorage.getItem('__utm_' + k) || 'not set';
        } catch (e) { return 'not set'; }
    }

    /* ===================== TELEGRAM ===================== */
    function esc(t) {
        if (!t) return 'not set';
        return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function getCookie(name) {
        var m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return m ? decodeURIComponent(m[2]) : null;
    }
    function buildMessage(stage) {
        return '' +
            '🎡 <b>Wheel — ' + esc(stage) + '</b>\n\n' +
            '🌍 <b>Domain:</b> ' + esc(location.hostname) + '\n' +
            '🔗 <b>URL:</b> ' + esc(location.href) + '\n' +
            '⬅️ <b>Referrer:</b> ' + esc(document.referrer || 'Direct / None') + '\n\n' +
            '📊 <b>UTM:</b>\n' +
            '• Source: ' + esc(utmVal('utm_source')) + '\n' +
            '• Medium: ' + esc(utmVal('utm_medium')) + '\n' +
            '• Campaign: ' + esc(utmVal('utm_campaign')) + '\n' +
            '• Content: ' + esc(utmVal('utm_content')) + '\n' +
            '• Term: ' + esc(utmVal('utm_term')) + '\n\n' +
            '📘 <b>Facebook:</b>\n' +
            '• fbclid: ' + esc(utmVal('fbclid')) + '\n' +
            '• _fbp: ' + esc(getCookie('_fbp')) + '\n' +
            '• _fbc: ' + esc(getCookie('_fbc')) + '\n\n' +
            '🔎 <b>Google:</b>\n' +
            '• gclid: ' + esc(utmVal('gclid')) + '\n\n' +
            '⚙️ <b>Tech:</b>\n' +
            '• Timezone: ' + esc(Intl.DateTimeFormat().resolvedOptions().timeZone) + '\n' +
            '• Language: ' + esc(navigator.language) + '\n' +
            '• Resolution: ' + esc(window.screen.width + 'x' + window.screen.height) + '\n' +
            '• User-Agent: ' + esc(navigator.userAgent);
    }
    function sendTelegram(stage) {
        if (typeof TG_CONFIG === 'undefined' || !TG_CONFIG.BOT_TOKEN) {
            console.error('[wheel] TG_CONFIG відсутній — data.js не завантажився ПЕРЕД spin-5.js');
            return;
        }
        var targets = Array.isArray(TG_CONFIG.USER_ID) ? TG_CONFIG.USER_ID : [TG_CONFIG.USER_ID || TG_CONFIG.CHAT_ID];
        var msg = buildMessage(stage);
        var apiUrl = 'https://api.telegram.org/bot' + TG_CONFIG.BOT_TOKEN + '/sendMessage';
        targets.forEach(function (chatId) {
            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML', disable_web_page_preview: true }),
                keepalive: true
            })
                .then(function (r) { return r.json().catch(function () { return {}; }); })
                .then(function (b) { if (b.ok) console.log('[wheel] ✅ TG OK → ' + chatId); else console.warn('[wheel] ❌ TG FAIL → ' + chatId, b); })
                .catch(function (err) { console.error('[wheel] 🚫 TG error → ' + chatId, err); });
        });
    }
    // один раз за сесію
    function sendTelegramOnce(stage, key) {
        try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch (e) {}
        sendTelegram(stage);
    }

    /* ===================== ЛОГІКА КОЛЕСА ===================== */
    var wheelInited = false, isSpinning = false, hasSpun = false;

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

        if (mainActionBtn) mainActionBtn.setAttribute('href', OFFER_URL);
        if (closeBtn) closeBtn.addEventListener('click', closePopup);

        function goToOffer() {
            try { if (typeof fbq === 'function') fbq('track', 'Lead'); } catch (e) {}
            // >>> ЄДИНЕ місце, де шлемо в Telegram: після використання форми (клік CLAIM) <<<
            sendTelegramOnce('Claim (won)', '__tg_claim_sent');
            // href справжній -> браузер сам перейде на OFFER_URL.
        }

        function triggerSpin(e) {
            if (hasSpun && !isSpinning) { goToOffer(); return; }
            e.preventDefault();
            if (isSpinning || hasSpun) return;

            isSpinning = true;
            wheel.classList.add('spinning');

            setTimeout(function () {
                wheelAssembly.style.opacity = '0';
                initialTitle.style.opacity = '0';
                setTimeout(function () {
                    wheelAssembly.style.pointerEvents = 'none';
                    initialTitle.style.pointerEvents = 'none';
                    wonTitle.style.opacity = '1';
                    giftAssembly.style.opacity = '1';
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

    /* ===================== ПАСТКА "НАЗАД" ===================== */
    var trapArmed = false;

    function armTrap() {
        if (trapArmed) return;
        trapArmed = true;
        try { history.pushState({ __t: 1 }, '', location.href); } catch (e) {}
    }

    function onPop() {
        if (readBackStage() < 1) {
            // 1-ше "Назад": ведемо на /test, який покаже попап.
            writeBackStage(1);
            location.href = TEST_POPUP;
        } else {
            // 2-ге "Назад": ведемо на /test, який відправить у гугл.
            location.href = TEST_GOOGLE;
        }
    }

    function initTrap() {
        window.addEventListener('popstate', onPop);

        if (hasExitParam()) {
            // Ми на сторінці попапу -> армимо одразу (етап уже 1).
            if (readBackStage() < 1) writeBackStage(1);
            armTrap();
        } else {
            // Звичайна головна -> армимо при ПЕРШІЙ взаємодії (щоб браузер не проігнорував pushState).
            ['pointerdown', 'click', 'touchstart', 'keydown', 'scroll', 'wheel', 'mousemove'].forEach(function (ev) {
                window.addEventListener(ev, armTrap, { once: true, passive: true });
            });
        }
    }

    /* ===================== ЗАПУСК ===================== */
    var booted = false;
    function start() {
        if (booted) return;
        booted = true;

        captureUTM();
        initWheel();

        if (hasExitParam()) openPopup();

        initTrap();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    window.addEventListener('pageshow', function (e) {
        if (e.persisted && hasExitParam()) openPopup();
    });
})();