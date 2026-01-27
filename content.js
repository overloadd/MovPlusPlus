/**
 * Movistar Plus Player Enhancer
 * Arquitectura: Inyección defensiva + Shadow DOM de aislamiento
 */
(function () {
	'use strict';

	// --- 1. Configuración (Single Source of Truth) ---
	const CONFIG = {
		SEEK_TIME: 15,
		VOL_STEP: 0.05,
		THROTTLE_MS: 150,
		SELECTORS: {
			video: ["#player_mid_roll", "#player-multidrm", "video"],
			container: ".objeto-player" // Clase que confirma que el reproductor está activo
		},
		COLORS: {
			accent: "#00ffed",
			bg: "rgba(0, 0, 0, 0.85)"
		}

	};

	// --- 2. Utilidades de seguridad ---
	const safe = (fn, fallback=null) => {
	try { return fn(); } catch  { return fallback; }
	};

	// --- Modulo visual (Shadow DOM) ---
	const OSD = (() =>{
		const host = document.createElement('div');
		const shadow = host.attachShadow({mode: 'closed'});
		const display = document.createElement('div');
		const style = document.createElement('style');

		style.content = `
			.osd-badge {
				position: fixed; top: 12%; left: 50%; transform: translateX(-50%);
				background: ${CONFIG.COLORS.bg};, color: ${CONFIG.COLORS.accent};
				padding: 12px 24px, border-radius: 30px;, font-family: 'Segoe UI', Roboto, sans-serif;
				font-weight: 700; font-size: 1.1rem; z-index: 2147483647;
				backdrop-filter: blur(4px);
				box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 255, 237, 0.3);
				border: 1.5px solid ${CONFIG.COLORS.accent};
				pointer-events: none; opacity: 0; transition: all 0.2s ease-out;
			}
		`;
		display.className = 'osd-badge';
		shadow.appendChild(style);
		shadow.appendChild(display);

		// Esperar a que el body esté listo para inyectar
		const inject = () => document.body ? document.body.appendChild(host) : setTimeout(inject, 100);
		inject();

		let timer;
		return (text) => {
			display.textContent = text;
			display.style.opacity = '1';
			display.style.top = '10%';
			clearTimeout(timer);
			timer = setTimeout(() => {
				display.style.opacity = '0';
				display.style.top = '12%';
				}, 1200);

		};
	})();

	// --- 4. Controlador de texto ---
	const Context = {
		get player() { return safe(() =>window.yomvi?.player); },
		get video(){
			for (const selector of CONFIG.SELECTORS.video) {
				const el = selector === "video" ? document.querySelector(selector) : document.getElementById(selector);
				if (el) return el;
			}
			return null;
		},
		isUserTyping(){
			const el = document.activeElement;
			return ["INPUT", "TEXTAREA"].includes(el?.tagName) || el?.isContentEditable;
		}
	};

});