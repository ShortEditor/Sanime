// Load HTML5 video player
let videoPlayer;

// Initialize series dropdown
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedAnime();
    setupVideoPlayer();
});

function loadFeaturedAnime() {
    fetch('/api/anime')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const anime = data[0];
                const featuredContent = document.getElementById('featured-content');
                featuredContent.innerHTML = `
                    <div class="featured-banner" onclick="watchAnime(${JSON.stringify(anime).replace(/"/g, '&quot;')})">
                        <img src="${anime.thumbnail_url}" alt="${anime.title}" class="featured-thumbnail">
                        <div class="featured-info">
                            <h2 class="featured-title">${anime.title}</h2>
                            <p class="featured-description">${anime.description}</p>
                            <div class="featured-stats">
                                <span>⭐ ${anime.score}</span>
                                <span>📺 ${anime.episodes.length} Episodes</span>
                            </div>
                            <button class="featured-button mt-3">
                                <i class="fas fa-play"></i>
                                Watch Now
                            </button>
                        </div>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading featured anime:', error);
        });
}

function watchAnime(anime) {
    console.log('Opening modal with anime:', anime); // Debug log
    const video = document.getElementById('customPlayer');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const episodeList = document.getElementById('episodeList');
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    
    modalTitle.textContent = anime.title;
    modalDescription.textContent = anime.description;

    // Load episodes with thumbnails
    episodeList.innerHTML = '';
    if (anime.episodes && anime.episodes.length > 0) {
        console.log('Loading episodes:', anime.episodes); // Debug log
        anime.episodes.forEach((episode, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.className = index === 0 ? 'active' : '';
            
            // Add thumbnail and title
            a.innerHTML = `
                <img src="${episode.thumbnail}" alt="${episode.title}" class="episode-thumbnail">
                <div class="episode-title">${episode.title}</div>
            `;
            
            a.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Playing episode:', episode); // Debug log
                
                // Update video source
                video.src = episode.url;
                video.load();
                video.play().catch(error => {
                    console.error('Error playing video:', error);
                });
                
                // Update active state
                episodeList.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                a.classList.add('active');
            });
            
            li.appendChild(a);
            episodeList.appendChild(li);
        });

        // Load first episode by default
        console.log('Loading first episode:', anime.episodes[0]); // Debug log
        video.src = anime.episodes[0].url;
    }
    
    video.load();
    modal.show();
}

function setupVideoPlayer() {
    const video = document.getElementById('customPlayer');
    const playPauseBtn = document.querySelector('.play-pause');
    const progressBar = document.querySelector('.progress-bar');
    const progressFilled = document.querySelector('.progress-filled');
    const timeDisplay = document.querySelector('.time');
    const currentTimeSpan = timeDisplay.querySelector('.current');
    const durationSpan = timeDisplay.querySelector('.duration');
    const volumeBtn = document.querySelector('.volume');
    const volumeSlider = document.querySelector('.volume-slider');
    const fullscreenBtn = document.querySelector('.fullscreen');
    const videoControls = document.querySelector('.video-controls');
    const episodeLinks = document.querySelectorAll('.episode-link');

    // Play/Pause
    playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    function togglePlay() {
        if (video.paused) {
            video.play();
            playPauseBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
        } else {
            video.pause();
            playPauseBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
        }
    }

    // Update play/pause button on video events
    video.addEventListener('play', () => {
        playPauseBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
    });

    video.addEventListener('pause', () => {
        playPauseBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
    });

    // Progress Bar
    video.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', setProgress);

    function updateProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progressFilled.style.width = `${percent}%`;
        currentTimeSpan.textContent = formatTime(video.currentTime);
    }

    function setProgress(e) {
        const progressTime = (e.offsetX / progressBar.offsetWidth) * video.duration;
        video.currentTime = progressTime;
    }

    // Volume
    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('click', setVolume);

    function toggleMute() {
        video.muted = !video.muted;
        updateVolumeIcon();
    }

    function setVolume(e) {
        const volume = e.offsetX / volumeSlider.offsetWidth;
        video.volume = Math.max(0, Math.min(1, volume));
        volumeSlider.querySelector('.volume-filled').style.width = `${volume * 100}%`;
        updateVolumeIcon();
    }

    function updateVolumeIcon() {
        const icon = volumeBtn.querySelector('i');
        icon.className = 'fas';
        if (video.muted || video.volume === 0) {
            icon.classList.add('fa-volume-mute');
        } else if (video.volume < 0.5) {
            icon.classList.add('fa-volume-down');
        } else {
            icon.classList.add('fa-volume-up');
        }
    }

    // Fullscreen
    fullscreenBtn.addEventListener('click', toggleFullScreen);

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            video.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // Duration handling
    video.addEventListener('loadedmetadata', () => {
        // Force the video to load enough data to get duration
        video.preload = 'metadata';
        
        // Try to get duration immediately
        if (video.duration && !isNaN(video.duration)) {
            durationSpan.textContent = formatTime(video.duration);
        } else {
            // If duration is not available, try to seek to the end
            const seekable = video.seekable;
            if (seekable && seekable.length > 0) {
                video.currentTime = seekable.end(0);
                video.currentTime = 0;
            }
        }
        currentTimeSpan.textContent = formatTime(0);
    });

    video.addEventListener('durationchange', () => {
        if (video.duration && !isNaN(video.duration)) {
            durationSpan.textContent = formatTime(video.duration);
        }
    });

    // Episode selection
    episodeLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            // Remove active class from all episodes
            episodeLinks.forEach(ep => ep.classList.remove('active'));
            // Add active class to clicked episode
            link.classList.add('active');
            
            // Update video source
            const videoFile = link.getAttribute('data-video');
            video.src = videoFile;
            
            // Force metadata preload
            video.preload = 'metadata';
            
            // Wait for metadata to load
            try {
                await video.play();
                // Once playing, we should have duration
                if (video.duration && !isNaN(video.duration)) {
                    durationSpan.textContent = formatTime(video.duration);
                }
            } catch (e) {
                console.log('Auto-play prevented:', e);
            }
            
            // Update modal title
            const episodeTitle = link.querySelector('.episode-title').textContent;
            document.querySelector('.modal-title').textContent = 'Demon Slayer: Swordsmith Village Arc';
            document.querySelector('.modal-description').textContent = episodeTitle;
            
            // Reset video player UI
            playPauseBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            progressFilled.style.width = '0%';
            currentTimeSpan.textContent = formatTime(0);
        });
    });

    // Show/hide controls
    let controlsTimeout;
    videoControls.style.opacity = '0';
    
    function showControls() {
        videoControls.style.opacity = '1';
        clearTimeout(controlsTimeout);
    }

    function hideControls() {
        controlsTimeout = setTimeout(() => {
            if (!video.paused) {
                videoControls.style.opacity = '0';
            }
        }, 2000);
    }

    video.addEventListener('mousemove', showControls);
    video.addEventListener('mouseleave', hideControls);
    videoControls.addEventListener('mousemove', showControls);
    videoControls.addEventListener('mouseleave', hideControls);
}

// Initialize video player
document.addEventListener('DOMContentLoaded', setupVideoPlayer);

// Reinitialize player when modal is shown
document.getElementById('videoModal').addEventListener('shown.bs.modal', setupVideoPlayer);

// Clean up when modal is closed
document.getElementById('videoModal').addEventListener('hidden.bs.modal', function () {
    const video = document.getElementById('customPlayer');
    video.pause();
    video.currentTime = 0;
    video.src = '';
});

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
