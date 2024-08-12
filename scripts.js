// scripts.js

document.addEventListener('DOMContentLoaded', function () {
    const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');
    const playPauseButton = document.getElementById('playPauseButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const volumeControl = document.getElementById('volumeControl');
    const playlistContainer = document.getElementById('playlist');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Liste over MP4-filer med navne og thumbnails
    const songs = [
        { src: 'music/Den_Mandige_Hund_-_Country_Race.mp4', name: 'Country Race', thumbnail: 'thumbnail.jpg' },
        { src: 'music/Den_Mandige_Hund_-_Kre_rs.mp4', name: 'Kre rs', thumbnail: 'thumbnail.jpg' },
        { src: 'music/PepsiMax_sangen.mp4', name: 'PepsiMax Sangen', thumbnail: 'thumbnail.jpg' },
        { src: 'music/Untitled-2024-07-28_12_00_59copy-highlight.mp4', name: 'Untitled 2024', thumbnail: 'thumbnail.jpg' }
    ];
    let currentSongIndex = 0;

    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function populatePlaylist() {
        playlistContainer.innerHTML = ''; // Clear existing playlist
        songs.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.dataset.index = index;

            const thumbnail = document.createElement('div');
            thumbnail.className = 'song-thumbnail';

            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = song.thumbnail;
            thumbnailImg.alt = song.name;
            thumbnailImg.onerror = () => thumbnailImg.src = 'thumbnails/placeholder.jpg'; // Placeholder image

            thumbnail.appendChild(thumbnailImg);

            const info = document.createElement('div');
            info.className = 'song-info';

            const title = document.createElement('div');
            title.className = 'song-title';
            title.textContent = song.name;

            // Create a hidden video element to fetch the duration
            const hiddenVideo = document.createElement('video');
            hiddenVideo.src = song.src;
            hiddenVideo.preload = 'metadata';
            hiddenVideo.addEventListener('loadedmetadata', function() {
                const duration = formatDuration(hiddenVideo.duration);
                const durationElem = document.createElement('div');
                durationElem.className = 'song-duration';
                durationElem.textContent = duration;
                info.appendChild(durationElem);
            });

            info.appendChild(title);

            songCard.appendChild(thumbnail);
            songCard.appendChild(info);

            songCard.addEventListener('click', function () {
                updateSong(parseInt(songCard.dataset.index));
            });

            playlistContainer.appendChild(songCard);
        });
    }

    function updateSong(index) {
        if (index < 0 || index >= songs.length) return; // Validér indeks

        currentSongIndex = index;
        audioSource.src = songs[currentSongIndex].src;
        audioPlayer.load(); // Genindlæsning af kilden
        audioPlayer.play().catch(error => console.error('Playback failed:', error)); // Håndter afspilningsfejl
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    }

    playPauseButton.addEventListener('click', function () {
        if (audioPlayer.paused) {
            audioPlayer.play().catch(error => console.error('Playback failed:', error)); // Håndter afspilningsfejl
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audioPlayer.pause();
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    prevButton.addEventListener('click', function () {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        updateSong(currentSongIndex);
    });

    nextButton.addEventListener('click', function () {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        updateSong(currentSongIndex);
    });

    volumeControl.addEventListener('input', function () {
        audioPlayer.volume = volumeControl.value;
    });

    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.toLowerCase();
        playlistContainer.innerHTML = ''; // Clear existing playlist
        songs
            .filter(song => song.name.toLowerCase().includes(searchTerm))
            .forEach((song, index) => {
                const songCard = document.createElement('div');
                songCard.className = 'song-card';
                songCard.dataset.index = index;

                const thumbnail = document.createElement('div');
                thumbnail.className = 'song-thumbnail';

                const thumbnailImg = document.createElement('img');
                thumbnailImg.src = song.thumbnail;
                thumbnailImg.alt = song.name;
                thumbnailImg.onerror = () => thumbnailImg.src = 'thumbnails/placeholder.jpg'; // Placeholder image

                thumbnail.appendChild(thumbnailImg);

                const info = document.createElement('div');
                info.className = 'song-info';

                const title = document.createElement('div');
                title.className = 'song-title';
                title.textContent = song.name;

                // Create a hidden video element to fetch the duration
                const hiddenVideo = document.createElement('video');
                hiddenVideo.src = song.src;
                hiddenVideo.preload = 'metadata';
                hiddenVideo.addEventListener('loadedmetadata', function() {
                    const duration = formatDuration(hiddenVideo.duration);
                    const durationElem = document.createElement('div');
                    durationElem.className = 'song-duration';
                    durationElem.textContent = duration;
                    info.appendChild(durationElem);
                });

                info.appendChild(title);

                songCard.appendChild(thumbnail);
                songCard.appendChild(info);

                songCard.addEventListener('click', function () {
                    updateSong(parseInt(songCard.dataset.index));
                });

                playlistContainer.appendChild(songCard);
            });
    });

    // Initial song load
    populatePlaylist();
    updateSong(0); // Start med den første sang
});
