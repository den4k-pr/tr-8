document.addEventListener('DOMContentLoaded', () => {

    const LAZY_THRESHOLD = 0.01;

    // 1. ЛЕЗИВНЕ ЗАВАНТАЖЕННЯ 
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const video = entry.target;
            if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
                video.preload = 'metadata';
                video.load();
            }
            lazyObserver.unobserve(video);
        });
    }, { threshold: LAZY_THRESHOLD, rootMargin: '200px 0px' });

    document.querySelectorAll('.video-player').forEach(v => lazyObserver.observe(v));

    // 2. КАСТОМНИЙ ПЛЕЄР
    document.querySelectorAll('.video-card-item').forEach(card => {
        const video = card.querySelector('video');
        const wrapper = card.querySelector('.video-wrapper-big, .video-wrapper-small');
        if (!video || !wrapper) return;

        video.controls = false;
        video.removeAttribute('controls');

        let overlay = wrapper.querySelector('.video-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'video-overlay';
            // Рожеве свічення додано в CSS svg фільтром
            overlay.innerHTML = `
                <div class="video-play-btn" aria-label="Play">
                    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="40" cy="40" r="38" fill="rgba(52,52,52,0.4)" stroke="white" stroke-width="2.5"/>
                        <polygon class="icon-play" points="34,24 58,40 34,56" fill="white"/>
                        <g class="icon-pause" style="display:none"> 
                            <rect x="26" y="24" width="9" height="32" rx="2" fill="white"/>
                            <rect x="45" y="24" width="9" height="32" rx="2" fill="white"/>
                        </g>
                    </svg>
                </div>
            `;
            wrapper.style.position = 'relative';
            wrapper.appendChild(overlay);
        }

        const iconPlay = overlay.querySelector('.icon-play');
        const iconPause = overlay.querySelector('.icon-pause');

        let isHandling = false;

        const setIcon = (playing) => {
            if(iconPlay) iconPlay.style.display = playing ? 'none' : '';
            if(iconPause) iconPause.style.display = playing ? '' : 'none';
        };

        const stopAllOthers = () => {
            document.querySelectorAll('.video-card-item video').forEach(v => {
                if (v !== video && !v.paused) {
                    v.pause();
                    const otherOverlay = v.closest('.video-card-item')?.querySelector('.video-overlay');
                    if (otherOverlay) {
                        const pIcon = otherOverlay.querySelector('.icon-play');
                        const paIcon = otherOverlay.querySelector('.icon-pause');
                        if(pIcon) pIcon.style.display = ''; 
                        if(paIcon) paIcon.style.display = 'none'; 
                    }
                }
            });
        };

        const togglePlay = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isHandling) return;
            isHandling = true;
            setTimeout(() => { isHandling = false; }, 250);

            if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
            }

            video.muted = false;

            if (video.paused) {
                stopAllOthers();
                
                video.play()
                    .then(() => {
                        setIcon(true);
                    })
                    .catch(err => {
                        console.log('Спроба запуску зі звуком заблокована браузером, вмикаємо без звуку:', err);
                        video.muted = true;
                        video.play()
                            .then(() => setIcon(true))
                            .catch(e => console.error('Повна блокування медіа:', e));
                    });
            } else {
                video.pause();
                setIcon(false);
            }
        };

        overlay.addEventListener('click', togglePlay);

        video.addEventListener('play', () => {
            setIcon(true);
            overlay.classList.add('is-playing');
        });
        video.addEventListener('pause', () => {
            setIcon(false);
            overlay.classList.remove('is-playing');
        });
        video.addEventListener('ended', () => {
            setIcon(false);
            overlay.classList.remove('is-playing');
        });
    });
});