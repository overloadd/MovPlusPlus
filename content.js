(function() {
	"use strict";

	const CONFIG = {
		SEEK_TIME: 15,
		VOL_STEP: 0.05,
		THROTTLE_MS: 150,
		SELECTORS: {
			video: ["#player_mid_roll", "#player-multidrm", "video"],
			container: "objetoPlayer" // Clase en el html/body
		}
	};

	// --- MINI OSD (Encapsulado para evitar SES/Lockdown) ---
	const showOSD = (() => {
		const id = "movistar-enhancer-osd";
		return (text) => {
			let el = document.getElementById(id);
			if (!el) {
				el = document.createElement("div");
				el.id = id;
				Object.assign(el.style, {
					position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)",
					background: "rgba(0,0,0,0.8)", color: "#00ffed", padding: "12px 24px",
					borderRadius: "30px", zIndex: "999999", pointerEvents: "none",
					fontFamily: "sans-serif", fontWeight: "bold", border: "1px solid #00ffed"
				});
				document.body.appendChild(el);
			}
			el.textContent = text;
			el.style.opacity = "1";
			clearTimeout(el.timer);
			el.timer = setTimeout(() => el.style.opacity = "0", 1000);
		};
	})();

	const getShaka = () => {
		// Shaka suele estar enterrado en el objeto de la web o el video, se llama al reproductor de yomvi
		return window.yomvi?.player?.getPlayer?.() || null;
	};

	const getYomviPlayer = () => {
		return window.yomvi?.player?.() || null;
	};

	const getVideo = () => {
		for (const s of CONFIG.SELECTORS.video) {
			const el = s.startsWith("#") ? document.getElementById(s.slice(1)) : document.querySelector(s);
			if (el) return el;
		}
		return null;
	};

	const handleKey = (e) => {
		if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

		const video = getVideo();
		const shaka = getShaka() || null;
		const yomvi = getYomviPlayer();
		let audioTracks = [];
		let subTracks = [];
		if(shaka){
			let audioList = shaka.getAudioLanguages();
			for (let lang of audioList){
				if(!lang) break;
				audioTracks.add(lang);
			}
			let subLangs = shaka.getTextLanguages();
			for (let lang of subLangs){
				if (!lang) break;
				subTracks.add(lang);
			}
		}

		if (!video) return;

		switch (e.code) {
			case "Space":
				e.preventDefault();
				e.stopImmediatePropagation();
				if (video.paused) { video.play(); showOSD("▶ PLAY"); }
				else { video.pause(); showOSD("⏸ PAUSA"); }
				break;
			case "ArrowRight":
				video.currentTime += CONFIG.SEEK_TIME;
				showOSD(`⏩ +${CONFIG.SEEK_TIME}s`);
				break;
			case "ArrowLeft":
				video.currentTime -= CONFIG.SEEK_TIME;
				showOSD(`⏪ -${CONFIG.SEEK_TIME}s`);
				break;
			case "ArrowUp":
				video.volume = Math.min(1, video.volume + CONFIG.VOL_STEP);
				showOSD(`🔊 ${Math.round(video.volume * 100)}%`);
				break;
			case "ArrowDown":
				video.volume = Math.max(0, video.volume - CONFIG.VOL_STEP);
				showOSD(`🔉 ${Math.round(video.volume * 100)}%`);
				break;
			case "KeyF":
				if (!document.fullscreenElement) video.requestFullscreen();
				else document.exitFullscreen();
				break;
				// Listar idiomas de subtítulos
			case "KeyC": // Subtítulos (Específico para Shaka Player)
				if (shaka) {
					//let subTracks = yomvi.getTracks("text"); => shaka es mas fiable
					let langList = "";
					for (let lang of subTracks){
						if (!lang) break;
						langList += `⌨️SUB: ${lang.toUpperCase()}\n`;
					}
					langList === "" ? console.error("No hay idiomas para mostrar") : showOSD(langList);
				} else {
					console.error("Reproductor no encontrado");
				}
				break;
				// Listar idiomas de audio
			case "KeyA":
				if (shaka) {
					let audioLangList = "";
					for (let lang of audioTracks){
						if(!lang) break;
						audioLangList += `🔊 AUDIO: ${lang.toUpperCase()}`;
					}
					audioLangList === "" ? console.error("No hay idiomas para mostrar") : showOSD(audioLangList);
					break;
				} else {
					console.error("Reproductor no encontrado");
					break;
				}
				// Cambiar idioma
			case "KeyL":
				e.preventDefault();
				if (shaka){
					if (audioTracks.length >= 1){
						let currIndex = shaka.getVariantTracks().findIndex(track => track.active === true);
						let audioLang = audioTracks[shaka.getVariantTracks()[currIndex].language];
						let nextIndex = (currIndex + 1) % audioTracks.length;
						const nextTrack = audioTracks[nextIndex]; // Siguiente idioma en string
						console.log(`Cambiando a ${nextTrack}`);
						showOSD(`🔊${audioLang.toUpperCase()} => 🔊 ${nextTrack.toUpperCase()}`);
						shaka.selectAudioLanguage(nextTrack, true, 2);
						break;
					} else {
						console.error("No hay idiomas para cambiar");
						break;
					}
				} else {
					console.error("Reproductor no encontrado");
					break;
				}
				// Cambiar idioma de subtítulos
			case "KeyS":
				e.preventDefault();
				if (shaka){
					if (subTracks.length >= 1){
						let currIndex = shaka.getTextTracks().findIndex(track => track.active === true);
						let subsLang = subTracks[shaka.getTextTracks()[currIndex].language];
						let nextIndex = (currIndex + 1) % subTracks.length;
						const nextTrack = subTracks[nextIndex]; // Siguiente idioma en string
						console.log(`Cambiando a ${nextTrack}`);
						showOSD(`⌨️SUB: ${subsLang.toUpperCase()} => ⌨️SUB: ${nextTrack.toUpperCase()}`);
						shaka.selectTextTrack(nextTrack, true, 2);
						break;
					} else {
						console.error("No hay idiomas para cambiar");
						break;
					}
				} else {
					console.error("Reproductor no encontrado");
					break;
				}

			case "KeyD":
				e.preventDefault();
				if (shaka) {
					let visible = false;
					shaka.setTextTrackVisibility(!visible);
					visible = !visible;
					showOSD(`MOSTRAR SUBTITULOS: ${visible === true ? "ON" : "OFF"}`);
					break;
				} else {
					console.error("Reproductor no encontrado");
					break;
				}
			case "KeyM":
				e.preventDefault();
				video.muted = !video.muted;
				// Feedback dinámico basado en el estado real del hardware
				showOSD(video.muted ? "🔇 SILENCIO" : "🔊 SONIDO ON");
				break;
			default:
				return;
		}
	};

	// Usamos el 'true' para saltarnos el sandboxing del Lockdown de la web
	document.addEventListener("keydown", handleKey, true);
	console.log("✅ Movistar Enhancer inyectado (Shaka Player Detected)");
})();

/**
 * yomvi.player.getPlayer().selectAudioLanguage("qaa", yomvi.player.getTracks('audio'), true);
 * qaa stands for english?
 * let subTracks = yomvi.player.getTracks('text');
 * for (let i = 0 ; i < subTracks.length ; i++){
 *     console.log(tracks[i].language);
 * };
 * let audioTracks = yomvi.player.getTracks('audio');
 * for (let i = 0 ; i < audioTracks.length ; i++){
 *     console.log(tracks[i].language);
 * };
 * TODO: Testear las nuevas fxs y modificar README.md para mostrarlas
 */