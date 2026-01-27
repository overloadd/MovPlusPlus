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
		// Shaka suele estar enterrado en el objeto de la web o el video
		return window.yomvi?.player?.getPlayer?.() || null;
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
		const shaka = getShaka();
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
			case "KeyC": // Subtítulos (Específico para Shaka Player)
				if (shaka) {
					const isVisible = shaka.isTextTrackVisible();
					shaka.setTextTrackVisibility(!isVisible);
					showOSD(isVisible ? "Subtítulos: OFF" : "Subtítulos: ON");
				}
				break;
			case "KeyM":
				e.preventDefault();
				video.muted = !video.muted;
				// Feedback dinámico basado en el estado real del hardware
				showOSD(video.muted ? "🔇 SILENCIO" : "🔊 SONIDO ON");
				break;
		}
	};

	// Usamos el 'true' para saltarnos el sandboxing del Lockdown de la web
	document.addEventListener("keydown", handleKey, true);
	console.log("✅ Movistar Enhancer inyectado (Shaka Player Detected)");
})();