let screamTriggered = false;

function triggerScreamer() {
    if (screamTriggered) return;
    
    screamTriggered = true;
    
    const screamer = document.getElementById('screamer');
    const screamSound = document.getElementById('scream-sound');
    const screamSound2 = document.getElementById('scream-sound2');
    
    screamer.classList.add('active');
    
    // Воспроизводим оба звуковых файла бесконечно
    screamSound.volume = 1.0;
    screamSound.loop = true;
    screamSound.play().catch(e => {
        console.log('Не удалось воспроизвести sound.mp3');
    });
    
    screamSound2.volume = 1.0;
    screamSound2.loop = true;
    screamSound2.play().catch(e => {
        console.log('Не удалось воспроизвести sound2.mp3');
    });
    
    // Если оба файла не воспроизводятся, используем программный звук
    setTimeout(() => {
        if (screamSound.paused && screamSound2.paused) {
            createProgrammaticSound();
        }
    }, 1000);
    
    // Блокируем любые попытки закрытия
    function preventClose(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
    
    document.addEventListener('keydown', preventClose, true);
    document.addEventListener('contextmenu', preventClose, true);
    document.addEventListener('click', preventClose, true);
    document.addEventListener('mousedown', preventClose, true);
    document.addEventListener('mouseup', preventClose, true);
    document.addEventListener('touchstart', preventClose, true);
    document.addEventListener('touchend', preventClose, true);
    
    // Пытаемся перейти в полноэкранный режим
    function requestFullscreen() {
        if (screamer.requestFullscreen) {
            screamer.requestFullscreen();
        } else if (screamer.webkitRequestFullscreen) {
            screamer.webkitRequestFullscreen();
        } else if (screamer.msRequestFullscreen) {
            screamer.msRequestFullscreen();
        }
    }
    
    requestFullscreen();
    
    // Бесконечные попытки полноэкранного режима
    setInterval(() => {
        requestFullscreen();
    }, 1000);
}

function createProgrammaticSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Бесконечный программный звук
    function createOscillator() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800 + Math.random() * 400;
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2);
        
        // Создаем новый осциллятор перед тем как текущий закончится
        setTimeout(() => {
            createOscillator();
        }, 1800);
    }
    
    // Запускаем несколько осцилляторов
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            createOscillator();
        }, i * 300);
    }
    
    // Бесконечный белый шум
    function createWhiteNoise() {
        const bufferSize = audioContext.sampleRate * 2;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = audioContext.createBufferSource();
        const noiseGain = audioContext.createGain();
        
        whiteNoise.buffer = buffer;
        whiteNoise.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        
        noiseGain.gain.setValueAtTime(0.3, audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        whiteNoise.start(audioContext.currentTime);
        
        // Создаем новый шум перед тем как текущий закончится
        setTimeout(() => {
            createWhiteNoise();
        }, 1800);
    }
    
    createWhiteNoise();
}

// Обработчики для кнопок
document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    
    // Сразу переходим в полноэкранный режим при загрузке
    function requestInitialFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    }
    
    // Пытаемся войти в полноэкранный режим сразу
    requestInitialFullscreen();
    
    // Повторяем попытки каждые 500мс
    const initialFullscreenInterval = setInterval(() => {
        requestInitialFullscreen();
    }, 500);
    
    // Останавливаем попытки через 3 секунды
    setTimeout(() => {
        clearInterval(initialFullscreenInterval);
    }, 3000);
    
    // Запускаем скример при нажатии на любую кнопку
    yesBtn.addEventListener('click', triggerScreamer);
    noBtn.addEventListener('click', triggerScreamer);
    
    // Запускаем скример при наведении на кнопки (случайно)
    yesBtn.addEventListener('mouseenter', () => {
        if (Math.random() < 0.3) {
            triggerScreamer();
        }
    });
    
    noBtn.addEventListener('mouseenter', () => {
        if (Math.random() < 0.3) {
            triggerScreamer();
        }
    });
    
    // Запускаем скример при попытке уйти с страницы
    window.addEventListener('beforeunload', (e) => {
        if (!screamTriggered) {
            triggerScreamer();
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
    
    // Запускаем скример при нажатии определенных клавиш
    document.addEventListener('keydown', (e) => {
        if (!screamTriggered && (e.key === 'Escape' || e.key === 'F11' || e.key === 'Alt' || e.key === 'Tab' || e.ctrlKey || e.metaKey)) {
            triggerScreamer();
        }
    });
    
    // Запускаем скример при движении мыши за пределы окна
    let mouseLeaveCount = 0;
    document.addEventListener('mouseleave', () => {
        mouseLeaveCount++;
        if (mouseLeaveCount > 1 && !screamTriggered) {
            triggerScreamer();
        }
    });
    
    // Автозапуск через 5 секунд
    setTimeout(() => {
        if (!screamTriggered) {
            triggerScreamer();
        }
    }, 5000);
});
