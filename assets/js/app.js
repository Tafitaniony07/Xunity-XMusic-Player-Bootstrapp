// Sélection des éléments du DOM nécessaires pour le lecteur de musique
const wrapper = document.querySelector(".wrapper"),
	musicImg = wrapper.querySelector("img"),
	musicName = wrapper.querySelector(".name"),
	musicArtist = wrapper.querySelector(".artist"),
	playPauseBtn = wrapper.querySelector(".play-pause"),
	prevBtn = wrapper.querySelector("#prev"),
	nextBtn = wrapper.querySelector("#next"),
	mainAudio = wrapper.querySelector("#main-audio"),
	progressArea = wrapper.querySelector(".progress-area"),
	progressBar = wrapper.querySelector(".progress-bar");

// Index aléatoire pour la première chanson et état initial de pause
let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
isMusicPaused = true;

// Chargement de la musique au démarrage de la page
window.addEventListener("load", () => {
	loadMusic(musicIndex);
});

// Fonction pour charger les détails d'une musique (titre, artiste, image, fichier audio)
function loadMusic(indexNumb) {
	musicName.innerText = allMusic[indexNumb - 1].name;
	musicArtist.innerText = allMusic[indexNumb - 1].artist;
	musicImg.src = `assets/img/${allMusic[indexNumb - 1].img}.jpg`;
	mainAudio.src = `assets/audio/${allMusic[indexNumb - 1].src}.mp3 `;
}

// Fonction pour lancer la lecture de la musique
function playMusic() {
	wrapper.classList.add("paused");
	musicImg.classList.add("rotate");
	playPauseBtn.innerHTML = `<i class="fas fa-pause"></i>`;
	mainAudio.play();
}

// Fonction pour mettre en pause la musique
function pauseMusic() {
	wrapper.classList.remove("paused");
	musicImg.classList.remove("rotate");
	playPauseBtn.innerHTML = `<i class="fas fa-play"></i>`;
	mainAudio.pause();
}

// Fonction pour passer à la musique précédente
function prevMusic() {
	musicIndex--;
	musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
	loadMusic(musicIndex);
	playMusic();
}

// Fonction pour passer à la musique suivante
function nextMusic() {
	musicIndex++;
	musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
	loadMusic(musicIndex);
	playMusic();
}

// Gestionnaire d'événement pour le bouton play/pause
playPauseBtn.addEventListener("click", () => {
	const isMusicPlay = wrapper.classList.contains("paused");
	isMusicPlay ? pauseMusic() : playMusic();
});

// Gestionnaires d'événements pour les boutons précédent et suivant
prevBtn.addEventListener("click", () => {
	prevMusic();
});
nextBtn.addEventListener("click", () => {
	nextMusic();
});

// Mise à jour de la barre de progression et du temps
mainAudio.addEventListener("timeupdate", (e) => {
	const currentTime = e.target.currentTime;
	const duration = e.target.duration;
	let progressWidth = (currentTime / duration) * 100;
	progressBar.style.width = `${progressWidth}%`;

	let musicCurrentTime = wrapper.querySelector(".current-time"),
		musicDuration = wrapper.querySelector(".max-duration");

	// Mise à jour de la durée totale de la musique
	mainAudio.addEventListener("loadeddata", () => {
		let mainAdDuration = mainAudio.duration;
		let totalMin = Math.floor(mainAdDuration / 60);
		let totalSec = Math.floor(mainAdDuration % 60);

		if (totalSec < 10) {
			totalSec = `0${totalSec}`;
		}
		musicDuration.innerText = `${totalMin}:${totalSec}`;
	});

	// Mise à jour du temps actuel
	let currentMin = Math.floor(currentTime / 60);
	let currentSec = Math.floor(currentTime % 60);

	if (currentSec < 10) {
		currentSec = `0${currentSec}`;
	}
	musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Gestion du clic sur la barre de progression pour changer la position de lecture
progressArea.addEventListener("click", (e) => {
	let progressWidth = progressArea.clientWidth;
	let clickedOffsetX = e.offsetX;
	let songDuration = mainAudio.duration;

	mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
	playMusic();
});

// Passage automatique à la musique suivante quand la lecture est terminée
mainAudio.addEventListener("ended", () => {
	nextMusic();
});
