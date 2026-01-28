/**
 * Movistar+ Keyboard Controller v1.3
 * Ejecutando en MAIN WORLD (Acceso directo a window.shakaPlayer y yomvi)
 */
(function() {
	"use strict";

	const CONFIG = {
		SEEK_TIME: 15,
		VOL_STEP: 0.05,
		// Selectores ordenados por prioridad
		SELECTORS: ["#player-multidrm", "#player_mid_roll", "video"]
	};

	// --- OSD (Visual Feedback) ---
	const showOSD = (() => {
		const id = "movistar-enhancer-osd";
		return (text) => {
			let el = document.getElementById(id);
			if (!el) {
				el = document.createElement("div");
				el.id = id;
				Object.assign(el.style, {
					position: "fixed", top: "12%", left: "50%", transform: "translateX(-50%)",
					background: "rgba(16, 16, 16, 0.95)", color: "#00ffed", padding: "14px 30px",
					borderRadius: "50px", zIndex: "2147483647", pointerEvents: "none",
					fontFamily: "'Segoe UI', system-ui, sans-serif", fontWeight: "700", letterSpacing: "0.5px",
					border: "2px solid #00ffed", transition: "opacity 0.2s ease, transform 0.2s ease",
					fontSize: "20px", textAlign: "center", boxShadow: "0 8px 32px rgba(0,255,237,0.2)"
				});
				document.body.appendChild(el);
			}
			el.textContent = text;
			el.style.opacity = "1";
			el.style.transform = "translateX(-50%) scale(1.05)";
			clearTimeout(el.timer);
			el.timer = setTimeout(() => {
				el.style.opacity = "0";
				el.style.transform = "translateX(-50%) scale(1)";
			}, 1500);
		};
	})();

	// Acceso directo gracias a "world": "MAIN"
	const getPlayer = () => window.shakaPlayer || window.yomvi?.player?.getPlayer?.();

	const getVideo = () => {
		for (const selector of CONFIG.SELECTORS) {
			const el = document.querySelector(selector);
			if (el && el.tagName === "VIDEO") return el;
		}
		return null;
	};

	const handleKey = (e) => {
		// Ignorar si el usuario escribe en un input
		if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable) return;

		const video = getVideo();
		const player = getPlayer();

		// Si no hay video, no hacemos nada
		if (!video) return;

		switch (e.code) {
			case "Space":
				e.preventDefault();
				e.stopPropagation(); // Evitar scroll nativo
				video.paused ? video.play() : video.pause();
				showOSD(video.paused ? "⏸ PAUSA" : "▶ REPRODUCIENDO");
				break;

			case "ArrowRight":
				// Sin preventDefault para permitir navegación nativa si se prefiere, o agregar si molesta
				video.currentTime += CONFIG.SEEK_TIME;
				showOSD(`⏩ +${CONFIG.SEEK_TIME}s`);
				break;

			case "ArrowLeft":
				video.currentTime -= CONFIG.SEEK_TIME;
				showOSD(`⏪ -${CONFIG.SEEK_TIME}s`);
				break;

			case "ArrowUp":
				e.preventDefault();
				video.volume = Math.min(1, video.volume + CONFIG.VOL_STEP);
				showOSD(`🔊 VOLUMEN: ${Math.round(video.volume * 100)}%`);
				break;

			case "ArrowDown":
				e.preventDefault();
				video.volume = Math.max(0, video.volume - CONFIG.VOL_STEP);
				showOSD(`🔉 VOLUMEN: ${Math.round(video.volume * 100)}%`);
				break;

			case "KeyM":
				e.preventDefault();
				video.muted = !video.muted;
				showOSD(video.muted ? "🔇 SILENCIO" : "🔊 SONIDO ACTIVADO");
				break;

			case "KeyF":
				e.preventDefault();
				if (!document.fullscreenElement) {
					const container = video.closest(".objetoPlayer") || video.parentElement;
					(container?.requestFullscreen ? container : video).requestFullscreen().catch(err => console.log(err));
				} else {
					document.exitFullscreen();
				}
				break;

			case "KeyL": // CAMBIO DE AUDIO (Fix ABR incluido)
				if (player) {
					e.preventDefault();
					try {
						const tracks = player.getVariantTracks();
						// Filtrar variantes de audio únicas
						const langs = [...new Set(tracks.filter(t => t.language).map(t => t.language))];

						if (langs.length > 1) {
							// Encontrar idioma actual buscando la pista activa
							const activeTrack = tracks.find(t => t.active);
							const currentLang = activeTrack ? activeTrack.language : langs[0];

							const nextIndex = (langs.indexOf(currentLang) + 1) % langs.length;
							const nextLang = langs[nextIndex];

							console.log(`MovPlus++: Cambiando audio de ${currentLang} a ${nextLang}`);

							// Fix Crítico: Desactivar ABR para evitar que Shaka revierta el cambio
							const config = player.getConfiguration();
							if (config.abr.enabled) {
								player.configure({ abr: { enabled: false } });
							}

							player.selectAudioLanguage(nextLang);
							showOSD(`🔊 AUDIO: ${nextLang.toUpperCase()}`);
						} else {
							showOSD("🔊 SOLO 1 IDIOMA DISPONIBLE");
						}
					} catch (err) {
						console.error("MovPlus++ Error Audio:", err);
					}
				}
				break;

			case "KeyC": // CAMBIO DE SUBTÍTULOS
				if (player) {
					e.preventDefault();
					try {
						const textTracks = player.getTextTracks();
						if (textTracks.length === 0) {
							showOSD("🚫 SIN SUBTÍTULOS");
							return;
						}

						if (!player.isTextTrackVisible()) {
							// Paso 1: Activar el primero
							player.setTextTrackVisibility(true);
							player.selectTextTrack(textTracks[0]);
							showOSD(`💬 SUBS: ${textTracks[0].language.toUpperCase()}`);
						} else {
							// Paso 2: Rotar o Apagar
							const currentTrack = textTracks.find(t => t.active);
							const currIdx = textTracks.indexOf(currentTrack);
							const nextIdx = currIdx + 1;

							if (nextIdx >= textTracks.length) {
								player.setTextTrackVisibility(false);
								showOSD("💬 SUBS: OFF");
							} else {
								player.selectTextTrack(textTracks[nextIdx]);
								showOSD(`💬 SUBS: ${textTracks[nextIdx].language.toUpperCase()}`);
							}
						}
					} catch (err) {
						console.error("MovPlus++ Error Subs:", err);
					}
				}
				break;
		}
	};

	// Usamos 'true' para fase de captura, asegurando prioridad sobre los eventos de la web
	window.addEventListener("keydown", handleKey, true);

	console.log("🚀 MovPlus++ Cargado.");

})();