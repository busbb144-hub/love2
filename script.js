// Global variable for YouTube player
let player;
let isMusicPlaying = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'zBG8Ica6U3Y', // New Song
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'loop': 1,
            'playlist': 'zBG8Ica6U3Y',
            'start': 62 // Start at 62 seconds
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.setVolume(100);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. (Slideshow removed)

    // 2. Initialize Background Hearts/Photos
    createFloatingHearts();

    // 3. Load YouTube API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 4. Verification Logic
    const verifyOverlay = document.getElementById('verification-overlay');
    const dateInput = document.getElementById('date-input');
    const verifyBtn = document.getElementById('verify-btn');
    const errorMsg = document.getElementById('error-msg');
    const CORRECT_DATE = "081268";

    verifyBtn.addEventListener('click', checkDate);
    dateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkDate();
    });

    function checkDate() {
        const input = dateInput.value.trim();
        if (input === CORRECT_DATE) {
            // Success - Hide overlay
            verifyOverlay.classList.add('hidden');

            // Play Music
            if (player && typeof player.playVideo === 'function') {
                player.playVideo();
                isMusicPlaying = true;
                const musicBtn = document.getElementById('music-toggle');
                musicBtn.classList.remove('hidden');
                musicBtn.innerText = '🎵';
            }
        } else {
            // Fail
            errorMsg.classList.remove('hidden');
            dateInput.style.borderColor = 'red';
            dateInput.classList.add('shake');
            setTimeout(() => {
                dateInput.classList.remove('shake');
                dateInput.style.borderColor = '#ddd';
            }, 500);
        }
    }


    // 5. Handle Gift Box Click
    const giftContainer = document.getElementById('gift-container');
    const messageCard = document.getElementById('message-card');
    const musicBtn = document.getElementById('music-toggle');

    // Add click event
    giftContainer.addEventListener('click', () => {
        if (!giftContainer.classList.contains('open')) {
            openGift();
        }
    });

    // Music Control
    musicBtn.addEventListener('click', () => {
        if (player && typeof player.getPlayerState === 'function') {
            const state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
                musicBtn.innerText = '🔇';
            } else {
                player.playVideo();
                musicBtn.innerText = '🎵';
            }
        }
    });

    function openGift() {
        // Animate the Box
        giftContainer.classList.add('open');

        // Wait for lid animation then show message
        setTimeout(() => {
            // Fade out container
            giftContainer.style.opacity = '0';
            giftContainer.style.pointerEvents = 'none';

            // Show Message
            messageCard.classList.remove('hidden');
            requestAnimationFrame(() => {
                messageCard.classList.add('visible');
            });

            // Burst of hearts/confetti styling
            createBurstEffect();
        }, 600);
    }



    // Function to create ambient floating hearts AND photos
    function createFloatingHearts() {
        const heartContainer = document.getElementById('hearts-bg');
        const heartSymbols = ['❤️', '💖', '🌸', '✨', '🎀'];
        const photoUrls = [
            'images/bg1.jpg',
            'images/bg2.jpg',
            'images/bg4.png'
            // 'images/bg3.png' // Commented out. Uncomment to bring it back!
        ];

        const count = 25;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                createMixedElement(heartContainer, heartSymbols, photoUrls);
            }, i * 400); // Stagger creation
        }
    }

    function createMixedElement(container, symbols, photos) {
        // 50% chance of photo, 50% chance of heart
        const isPhoto = Math.random() > 0.5;

        const el = document.createElement('div');

        if (isPhoto) {
            el.classList.add('floating-photo');
            const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
            el.style.backgroundImage = `url('${randomPhoto}')`;
            // Random size for photos (Larger)
            const size = Math.random() * 80 + 100; // 100px to 180px
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.animationName = 'floatUpPhoto';
        } else {
            el.classList.add('floating-heart');
            el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            el.style.fontSize = (Math.random() * 20 + 20) + 'px'; // Bigger hearts
            el.style.animationName = 'floatUp';
        }

        // Common random properties
        el.style.left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 5 + 8; // 8-13s duration
        el.style.animationDuration = duration + 's';

        container.appendChild(el);

        el.addEventListener('animationend', () => {
            el.remove();
            createMixedElement(container, symbols, photos); // Recursively create new one
        });
    }

    function createSingleHeart(container, symbols) {
        // Deprecated by createMixedElement loop, keeping for safety if called elsewhere? 
        // No, replaced by recursive call in createMixedElement.
    }

    // Function for visual burst when opening logic
    function createBurstEffect() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '200';

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 200 + 100; // px per sec
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0, .9, .57, 1)',
            }).onfinish = () => particle.remove();

            document.body.appendChild(particle);
        }
    }
});
