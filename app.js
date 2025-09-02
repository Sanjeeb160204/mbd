// Application Data
const appData = {
    recipient: "Mama",
    balloonLetters: ["H", "B", "D", "A", "Y", "M", "A", "M", "A"],
    balloonColors: ["#F2B300", "#0719D4", "#D14D39", "#8FAD00", "#8377E4", "#99C96A", "#20CFB4", "#D14D39", "#F2B300"],
    messages: [
        "Happy Birthday",
        "Mama!!!!",
        "God bless uhhh!!!",
        "May uhh receive the greatest joys",
        "& everlasting bliss"
    ],
    bulbColors: ["yellow", "red", "blue", "green", "pink", "orange"],
    audioFile: "hbd.mpeg"
};


// Application State
const appState = {
    currentStep: 0,
    messageIndex: 0,
    audioContext: null,
    isAnimating: false,
    audioPlaying: false,
    audioMuted: false
};


// Updated button sequence (removed story button)
const buttonSequence = ['lights', 'music', 'banner', 'balloons', 'cake', 'candles', 'message'];


// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    banner: document.getElementById('banner'),
    cake: document.getElementById('cake'),
    messagesContainer: document.getElementById('messagesContainer'),
    messageText: document.getElementById('messageText'),
    progressBar: document.querySelector('.progress-bar'),
    bulbs: document.querySelectorAll('.bulb'),
    balloons: document.querySelectorAll('.balloon'),
    flames: document.querySelectorAll('.flame'),
    confetti: document.querySelectorAll('.confetti'),
    audio: document.getElementById('birthdayAudio'),
    audioControls: document.getElementById('audioControls'),
    pauseBtn: document.getElementById('pauseBtn'),
    volumeBtn: document.getElementById('volumeBtn'),
    buttons: {
        lights: document.getElementById('lightsBtn'),
        music: document.getElementById('musicBtn'),
        banner: document.getElementById('bannerBtn'),
        balloons: document.getElementById('balloonsBtn'),
        cake: document.getElementById('cakeBtn'),
        candles: document.getElementById('candlesBtn'),
        message: document.getElementById('messageBtn')
    }
};


// Audio Management
function setupAudio() {
    if (elements.audio) {
        elements.audio.preload = 'metadata';
        elements.audio.loop = true;
        elements.audio.volume = 0.6;

        elements.audio.addEventListener('loadeddata', () => {
            console.log('Audio loaded successfully');
        });

        elements.audio.addEventListener('error', (e) => {
            console.log('Audio error:', e);
            showAudioControls();
        });

        elements.audio.addEventListener('play', () => {
            appState.audioPlaying = true;
            updateAudioControls();
        });

        elements.audio.addEventListener('pause', () => {
            appState.audioPlaying = false;
            updateAudioControls();
        });
    }
}

function showAudioControls() {
    if (elements.audioControls) {
        elements.audioControls.classList.remove('hidden');
        updateAudioControls();
    }
}

function playBirthdayMusic() {
    showAudioControls();

    if (elements.audio && !appState.audioPlaying) {
        const playPromise = elements.audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                appState.audioPlaying = true;
                updateAudioControls();
            }).catch((error) => {
                console.log('Audio autoplay blocked:', error);
                showAudioMessage();
            });
        }
    }
}

function updateAudioControls() {
    if (elements.pauseBtn) {
        elements.pauseBtn.textContent = appState.audioPlaying ? '⏸️' : '▶️';
    }
    if (elements.volumeBtn) {
        elements.volumeBtn.textContent = appState.audioMuted ? '🔇' : '🔊';
    }
}

function showAudioMessage() {
    const audioMsg = document.createElement('div');
    audioMsg.className = 'audio-message';
    audioMsg.innerHTML = `
        <div class="audio-message-content">
            <p>🎵 Tap to play birthday music! 🎵</p>
            <button class="audio-play-btn">Play Music</button>
        </div>
    `;
    audioMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 15px;
        padding: 1.5rem;
        z-index: 10000;
        text-align: center;
        color: white;
    `;

    const playBtn = audioMsg.querySelector('.audio-play-btn');
    playBtn.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 10px;
        padding: 0.8rem 1.5rem;
        color: white;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(audioMsg);

    playBtn.addEventListener('click', () => {
        elements.audio.play().then(() => {
            appState.audioPlaying = true;
            updateAudioControls();
        });
        document.body.removeChild(audioMsg);
    });

    setTimeout(() => {
        if (document.body.contains(audioMsg)) {
            document.body.removeChild(audioMsg);
        }
    }, 5000);
}

function initializeAudio() {
    try {
        appState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
        console.log('Audio context not supported');
    }
}

function playSound(frequency, duration, type = 'sine') {
    if (!appState.audioContext) return;
    
    try {
        const oscillator = appState.audioContext.createOscillator();
        const gainNode = appState.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(appState.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, appState.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.05, appState.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, appState.audioContext.currentTime + duration);
        
        oscillator.start(appState.audioContext.currentTime);
        oscillator.stop(appState.audioContext.currentTime + duration);
    } catch (error) {
        console.log('Sound playback error:', error);
    }
}

function simulateHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function createRipple(event, element) {
    const ripple = element.querySelector('.btn-ripple');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.transform = 'scale(0)';
    
    ripple.offsetHeight; // Force reflow
    ripple.style.transform = 'scale(4)';
    ripple.style.opacity = '0';
    
    setTimeout(() => {
        ripple.style.transform = 'scale(0)';
        ripple.style.opacity = '1';
    }, 600);
}

function hideLoadingScreen() {
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
        initializeEventListeners();
        initializeAudio();
        setupAudio();
        
        if (elements.buttons.lights) {
            elements.buttons.lights.style.opacity = '1';
            elements.buttons.lights.disabled = false;
        }
    }, 2500);
}

function nextStep() {
    const currentButtonKey = buttonSequence[appState.currentStep];
    const currentButton = elements.buttons[currentButtonKey];
    
    if (currentButton) {
        currentButton.style.opacity = '0.5';
        currentButton.disabled = true;
        currentButton.style.pointerEvents = 'none';
        currentButton.style.filter = 'grayscale(1)';
    }
    
    appState.currentStep++;
    
    if (appState.currentStep < buttonSequence.length) {
        const nextButtonKey = buttonSequence[appState.currentStep];
        const nextButton = elements.buttons[nextButtonKey];
        
        if (nextButton) {
            setTimeout(() => {
                nextButton.classList.remove('hidden');
                nextButton.style.animation = 'buttonAppear 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                nextButton.style.opacity = '1';
                nextButton.disabled = false;
                nextButton.style.pointerEvents = 'auto';

                if (window.innerWidth <= 480) {
                    nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 400);
        }
    }
}

function turnOnLights() {
    if (appState.isAnimating) return;
    appState.isAnimating = true;
    
    playSound(800, 0.3, 'triangle');
    simulateHaptic();
    
    elements.bulbs.forEach((bulb, index) => {
        setTimeout(() => {
            bulb.classList.add('lit');
            playSound(600 + (index * 80), 0.2, 'sine');
        }, index * 150);
    });
    
    setTimeout(() => {
        document.body.style.animation = 'gradientShift 10s ease infinite';
        appState.isAnimating = false;
        nextStep();
    }, elements.bulbs.length * 150 + 400);
}

function playMusic() {
    if (appState.isAnimating) return;
    appState.isAnimating = true;
    
    playSound(523, 0.4);
    simulateHaptic();
    
    playBirthdayMusic();
    
    elements.bulbs.forEach((bulb, index) => {
        setTimeout(() => {
            bulb.style.animation = `bulbGlow 0.6s ease-in-out infinite alternate, 
                                     bulbPulse 1.5s ease-in-out infinite ${index * 0.2}s`;
        }, index * 80);
    });
    
    const notes = [523, 587, 659, 698, 784];
    notes.forEach((note, index) => {
        setTimeout(() => {
            playSound(note, 0.25, 'triangle');
        }, index * 150);
    });
    
    setTimeout(() => {
        appState.isAnimating = false;
        nextStep();
    }, 1500);
}

function showBanner() {
    if (appState.isAnimating) return;
    appState.isAnimating = true;
    
    playSound(1000, 0.5, 'sawtooth');
    simulateHaptic();
    
    elements.banner.classList.remove('hidden');
    elements.banner.classList.add('show');
    
    const bannerText = elements.banner.querySelector('.banner-text');
    if (bannerText) {
        bannerText.style.animation = 'textShimmer 2s linear infinite, textSparkle 3s ease-in-out infinite';
    }
    
    setTimeout(() => {
        appState.isAnimating = false;
        nextStep();
    }, 800);
}

function releaseBalloons() {
    if (appState.isAnimating) return;
    appState.isAnimating = true;
    
    playSound(400, 1, 'sine');
    simulateHaptic();
    
    elements.balloons.forEach((balloon, index) => {
        setTimeout(() => {
            balloon.style.backgroundColor = appData.balloonColors[index];
            balloon.classList.add('float');
            balloon.style.animationDelay = `${index * 0.1}s`;
            playSound(300 + (index * 40), 0.3, 'triangle');
        }, index * 120);
    });
    
    setTimeout(() => {
        appState.isAnimating = false;
        nextStep();
    }, elements.balloons.length * 120 + 800);
}

function showCake() {
    if (appState.isAnimating) return;
    appState.isAnimating = true;
    
    playSound(600, 0.8, 'square');
    simulateHaptic();
    
    elements.cake.classList.remove('hidden');
    elements.cake.classList.add('show');
    
    setTimeout(() => {
        appState.isAnimating = false;
        nextStep();
    }, 1000);
}

function lightCandles() {
    if (appState.isAnimating) return;
    appState.isAnimating = true;
    
    playSound(800, 0.3, 'sine');
    simulateHaptic();
    
    elements.flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.remove('hidden');
            playSound(1000, 0.15, 'triangle');
        }, index * 250);
    });
    
    setTimeout(() => {
        appState.isAnimating = false;
        nextStep();
    }, elements.flames.length * 250 + 400);
}

function showMessage() {
    if (appState.isAnimating) return;
    appState.isAnimating = true;
    
    playSound(1000, 0.5, 'sine');
    simulateHaptic();
    
    startConfetti();
    
    elements.messagesContainer.classList.remove('hidden');
    elements.messagesContainer.classList.add('show');
    
    elements.balloons.forEach((balloon, index) => {
        setTimeout(() => {
            balloon.style.animation = `balloonFloat 3s ease-in-out infinite, 
                                      balloonCelebrate 4s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite ${index * 0.15}s`;
            balloon.style.zIndex = '100';
        }, index * 80);
    });
    
    setTimeout(() => {
        appState.messageIndex = 0;
        showNextMessage();
    }, 1000);
    
    appState.isAnimating = false;
}

function showNextMessage() {
    if (appState.messageIndex >= appData.messages.length) {
        finishCelebration();
        return;
    }
    
    const message = appData.messages[appState.messageIndex];
    elements.messageText.style.opacity = '0';
    elements.messageText.style.transform = 'translateY(15px) scale(0.95)';
    
    setTimeout(() => {
        elements.messageText.textContent = message;
        elements.messageText.style.opacity = '1';
        elements.messageText.style.transform = 'translateY(0) scale(1)';
        
        const progress = ((appState.messageIndex + 1) / appData.messages.length) * 100;
        elements.progressBar.style.width = `${progress}%`;
        
        playSound(500 + (appState.messageIndex * 80), 0.25, 'sine');
    }, 200);
    
    appState.messageIndex++;
    
    setTimeout(() => {
        showNextMessage();
    }, 2200);
}

function finishCelebration() {
    setTimeout(() => {
        elements.balloons.forEach((balloon, index) => {
            setTimeout(() => {
                balloon.style.animation = `balloonFloat 2s ease-in-out infinite, 
                                          balloonCelebrate 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite ${index * 0.1}s`;
                balloon.style.filter = 'brightness(1.2) saturate(1.4)';
            }, index * 60);
        });
        
        elements.bulbs.forEach((bulb, index) => {
            setTimeout(() => {
                bulb.style.animation = `bulbGlow 0.4s ease-in-out infinite alternate, 
                                       bulbPulse 1s ease-in-out infinite ${index * 0.1}s`;
                bulb.style.filter = 'brightness(1.5) saturate(2)';
            }, index * 50);
        });
        
        const celebrationNotes = [523, 659, 784, 1047, 1319];
        celebrationNotes.forEach((note, index) => {
            setTimeout(() => {
                playSound(note, 0.4, 'triangle');
            }, index * 150);
        });
        
        setTimeout(() => {
            elements.messageText.innerHTML = '🎉 Happy Birthday Mama! 🎉<br><small>Hope you enjoyed your special celebration!</small>';
            elements.messageText.style.animation = 'messageGlow 2s ease-in-out infinite, textSparkle 4s ease-in-out infinite';
        }, 3000);
        
    }, 800);
}

function startConfetti() {
    elements.confetti.forEach((piece, index) => {
        piece.style.animationDelay = `${index * 0.15}s`;
        piece.style.opacity = '1';
    });
    
    setTimeout(() => {
        elements.confetti.forEach(piece => {
            piece.style.opacity = '0.7';
        });
    }, 4000);
}

// Event Listeners with fix for Android touch issue
function initializeEventListeners() {
    // Button event listeners
    elements.buttons.lights.addEventListener('click', turnOnLights);
    elements.buttons.music.addEventListener('click', playMusic);
    elements.buttons.banner.addEventListener('click', showBanner);
    elements.buttons.balloons.addEventListener('click', releaseBalloons);
    elements.buttons.cake.addEventListener('click', showCake);
    elements.buttons.candles.addEventListener('click', lightCandles);
    elements.buttons.message.addEventListener('click', showMessage);
    
    // Audio control listeners
    if (elements.pauseBtn) {
        elements.pauseBtn.addEventListener('click', () => {
            if (appState.audioPlaying) {
                elements.audio.pause();
            } else {
                const playPromise = elements.audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        showAudioMessage();
                    });
                }
            }
            simulateHaptic();
        });
    }
    
    if (elements.volumeBtn) {
        elements.volumeBtn.addEventListener('click', () => {
            appState.audioMuted = !appState.audioMuted;
            elements.audio.muted = appState.audioMuted;
            updateAudioControls();
            simulateHaptic();
        });
    }
    
    // Enhanced touch effects for mobile
    Object.values(elements.buttons).forEach(button => {
        button.addEventListener('touchstart', (e) => {
            e.target.style.transform = 'scale(0.95)';
            simulateHaptic();
            createRipple(e.touches[0], button);
        });
        
        button.addEventListener('touchend', (e) => {
            // Removed e.preventDefault() to fix Android Chrome click issue
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        });
        
        button.addEventListener('click', (e) => {
            playSound(800, 0.08, 'square');
            if (!e.touches) {
                createRipple(e, button);
            }
        });
    });
    
    // Balloon interaction effects
    elements.balloons.forEach(balloon => {
        balloon.addEventListener('click', () => {
            if (balloon.classList.contains('float')) {
                balloon.style.animation = 'balloonPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                playSound(1000, 0.15, 'triangle');
                simulateHaptic();
                
                setTimeout(() => {
                    balloon.style.animation = 'balloonFloat 3s ease-in-out infinite';
                }, 500);
            }
        });
        
        balloon.addEventListener('touchstart', () => {
            if (balloon.classList.contains('float')) {
                balloon.style.filter = 'brightness(1.3) saturate(1.5)';
            }
        });
        
        balloon.addEventListener('touchend', () => {
            balloon.style.filter = '';
        });
    });
}

function handleResize() {
    const isMobile = window.innerWidth <= 480;
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (isMobile && isPortrait) {
        elements.balloons.forEach(balloon => {
            if (balloon.classList.contains('float')) {
                balloon.style.animationDuration = '2.5s';
            }
        });
        
        elements.confetti.forEach(piece => {
            piece.style.animationDuration = '2s';
        });
        
        if (elements.audioControls) {
            elements.audioControls.style.top = '55px';
            elements.audioControls.style.right = '0.8rem';
        }
    }
}

let touchStartY = 0;
let touchStartX = 0;

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e) {
    if (!touchStartY || !touchStartX) return;
    
    const touchEndY = e.touches[0].clientY;
    const touchEndX = e.touches[0].clientX;

    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    // Prevent pull-to-refresh on mobile
    if (diffY < 0 && window.scrollY <= 0) {
        e.preventDefault();
    }
}

function handleKeyPress(e) {
    if (appState.isAnimating) return;

    const keyActions = {
        '1': () => appState.currentStep === 0 && turnOnLights(),
        '2': () => appState.currentStep === 1 && playMusic(),
        '3': () => appState.currentStep === 2 && showBanner(),
        '4': () => appState.currentStep === 3 && releaseBalloons(),
        '5': () => appState.currentStep === 4 && showCake(),
        '6': () => appState.currentStep === 5 && lightCandles(),
        '7': () => appState.currentStep === 6 && showMessage()
    };

    if (keyActions[e.key]) {
        keyActions[e.key]();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    hideLoadingScreen();
    window.addEventListener('resize', handleResize);
    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    document.addEventListener('click', () => {
        if (!appState.audioContext) {
            initializeAudio();
        }
    }, { once: true });

    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            elements.balloons.forEach(balloon => {
                balloon.style.willChange = 'transform, opacity, filter';
            });
            elements.bulbs.forEach(bulb => {
                bulb.style.willChange = 'filter, box-shadow';
            });
        });
    }

    handleResize();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('PWA features available');
    });
}

let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);
