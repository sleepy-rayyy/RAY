let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const progressBar = document.getElementById('progress-bar');
const slideCounter = document.getElementById('slideCounter');

const transitionSound = document.getElementById('transition-sound');
const memeVideo = document.getElementById('meme-video');
const endingVideo = document.getElementById('ending-video');

const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const seekBar = document.getElementById('seek-bar');

function init() {
    updateSlide();
}

function changeSlide(direction) {
    // Play transition sound on every slide change
    if (transitionSound) {
        transitionSound.currentTime = 0; 
        transitionSound.play().catch(err => {
            console.log("Audio autoplay blocked until first user interaction.");
        });
    }

    slides[currentSlide].classList.remove('active');
    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = 0;
    } else if (currentSlide >= totalSlides) {
        currentSlide = totalSlides - 1;
    }

    slides[currentSlide].classList.add('active');
    updateSlide();
}

function updateSlide() {
    slideCounter.innerText = `${currentSlide + 1} / ${totalSlides}`;
    const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 0;
        prevBtn.style.opacity = currentSlide === 0 ? "0.5" : "1";
    }
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides - 1;
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? "0.5" : "1";
    }

    // Handle Meme Video logic
    if (memeVideo) {
        if (slides[currentSlide].contains(memeVideo)) {
            memeVideo.currentTime = 0;
            memeVideo.muted = false; 
            if (muteBtn) muteBtn.innerText = '🔊';

            memeVideo.play().then(() => {
                if (playPauseBtn) playPauseBtn.innerText = '⏸';
            }).catch(err => console.log("Meme autoplay blocked.", err));
        } else {
            memeVideo.pause();
        }
    }

    // Handle Full-Screen Ending Video logic
    if (endingVideo) {
        if (slides[currentSlide].contains(endingVideo)) {
            endingVideo.currentTime = 0;
            endingVideo.muted = false; // Ensure sound plays if requested
            endingVideo.play().catch(err => console.log("Ending video autoplay blocked.", err));
        } else {
            endingVideo.pause();
        }
    }
}

// Custom controls for Meme Video
if (memeVideo && playPauseBtn && muteBtn && seekBar) {
    playPauseBtn.addEventListener('click', () => {
        if (memeVideo.paused) {
            memeVideo.play();
            playPauseBtn.innerText = '⏸';
        } else {
            memeVideo.pause();
            playPauseBtn.innerText = '▶️';
        }
    });

    muteBtn.addEventListener('click', () => {
        memeVideo.muted = !memeVideo.muted;
        muteBtn.innerText = memeVideo.muted ? '🔇' : '🔊';
    });

    memeVideo.addEventListener('timeupdate', () => {
        const value = (100 / memeVideo.duration) * memeVideo.currentTime;
        seekBar.value = value || 0;
    });

    seekBar.addEventListener('input', () => {
        const time = memeVideo.duration * (seekBar.value / 100);
        memeVideo.currentTime = time;
    });
    
    memeVideo.addEventListener('ended', () => {
        playPauseBtn.innerText = '▶️';
    });
}

// Keyboard Navigation
document.addEventListener('keydown', (event) => {
    if (['INPUT', 'BUTTON', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (event.key === 'ArrowRight' || event.key === ' ') {
        changeSlide(1);
    } else if (event.key === 'ArrowLeft') {
        changeSlide(-1);
    }
});

init();