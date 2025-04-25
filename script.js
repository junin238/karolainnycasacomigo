document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('playButton');
    const volumeDown = document.getElementById('volumeDown');
    const volumeUp = document.getElementById('volumeUp');
    const volumeBar = document.getElementById('volumeBar');
    const daysElement = document.getElementById('days');
    const loveButton = document.getElementById('loveButton');
    const heartsContainer = document.getElementById('heartsContainer');
    
    // Variáveis de estado
    let hasInteracted = false;
    
    // Inicializa o player de áudio
    function initializeAudioPlayer() {
        audioPlayer.volume = 0.7;
        audioPlayer.loop = true;
        
        // Tenta reproduzir automaticamente
        attemptAutoplay();
        
        // Configura os listeners de interação
        setupInteractionListeners();
        
        // Atualiza a barra de volume visual
        updateVolumeBar();
    }
    
    // Tenta reprodução automática
    function attemptAutoplay() {
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay funcionou
                playButton.style.display = 'none';
            }).catch(error => {
                // Autoplay bloqueado
                playButton.style.display = 'flex';
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            });
        }
    }
    
    // Configura listeners de interação
    function setupInteractionListeners() {
        // Listener para primeiro clique/touch na página
        const firstInteraction = () => {
            if (!hasInteracted) {
                hasInteracted = true;
                attemptAutoplay();
                document.body.removeEventListener('click', firstInteraction);
                document.body.removeEventListener('touchstart', firstInteraction);
            }
        };
        
        document.body.addEventListener('click', firstInteraction);
        document.body.addEventListener('touchstart', firstInteraction);
    }
    
    // Atualiza a barra de volume visual
    function updateVolumeBar() {
        volumeBar.style.width = `${audioPlayer.volume * 100}%`;
    }
    
    // Configura o contador de dias
    function initializeDayCounter() {
        const today = new Date();
        const savedFirstVisit = localStorage.getItem('firstVisitDate');
        const savedDaysCount = localStorage.getItem('daysCount');
        
        if (savedFirstVisit) {
            const firstVisitDate = new Date(savedFirstVisit);
            const diffTime = today - firstVisitDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            const totalDays = 7 + diffDays;
            daysElement.textContent = totalDays;
            localStorage.setItem('daysCount', totalDays);
        } else {
            localStorage.setItem('firstVisitDate', today.toISOString());
            localStorage.setItem('daysCount', 7);
            daysElement.textContent = 7;
        }
    }
    
    // Player de música
    playButton.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audioPlayer.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Controles de volume
    volumeDown.addEventListener('click', function() {
        if (audioPlayer.volume > 0.1) {
            audioPlayer.volume -= 0.1;
        } else {
            audioPlayer.volume = 0;
        }
        updateVolumeBar();
    });
    
    volumeUp.addEventListener('click', function() {
        if (audioPlayer.volume < 0.9) {
            audioPlayer.volume += 0.1;
        } else {
            audioPlayer.volume = 1;
        }
        updateVolumeBar();
    });
    
    // Pausa a música quando a página é minimizada
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            audioPlayer.pause();
            if (!audioPlayer.paused) {
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        } else {
            audioPlayer.play().catch(e => console.log("Play prevented:", e));
            if (!audioPlayer.paused) {
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
        }
    });
    
    // Efeito do botão de amor
    loveButton.addEventListener('click', function() {
        heartsContainer.style.display = 'block';
        
        for (let i = 0; i < 50; i++) {
            createHeart();
        }
        
        setTimeout(() => {
            const message = document.createElement('div');
            message.className = 'message';
            message.textContent = 'Eu te amo demais garota';
            document.body.appendChild(message);
            message.style.display = 'block';
            
            setTimeout(() => {
                message.style.display = 'none';
                message.remove();
            }, 3000);
        }, 500);
        
        setTimeout(() => {
            heartsContainer.style.display = 'none';
            heartsContainer.innerHTML = '';
        }, 5000);
    });
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️<span style="font-size: 0.6em; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">K</span>';
        
        const xPos = Math.random() * window.innerWidth;
        const yPos = Math.random() * window.innerHeight;
        const size = Math.random() * 20 + 10;
        const duration = Math.random() * 3 + 2;
        
        heart.style.left = `${xPos}px`;
        heart.style.top = `${yPos}px`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;
        
        heartsContainer.appendChild(heart);
    }
    
    // Inicializações quando a página carrega
    initializeAudioPlayer();
    initializeDayCounter();
    
    // Força uma interação inicial em alguns navegadores
    setTimeout(() => {
        if (!hasInteracted) {
            document.body.click();
        }
    }, 1000);
});