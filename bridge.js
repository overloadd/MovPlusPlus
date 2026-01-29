// bridge.js (Corre en Isolated World)
const defaults = {
	seekTime: 15,
	volStep: 0.05,
	SELECTORS: ["#player-multidrm", "#player_mid_roll", "video"],
	keys: {
		play: "Space",
		forward: "ArrowRight",
		rewind: "ArrowLeft",
		volUp: "ArrowUp",
		volDown: "ArrowDown",
		mute: "KeyM",
		audio: "KeyL",
		subs: "KeyC",
		fullscreen: "KeyF"
	}
};

// 1. Cargar config al inicio y enviarla al Main World
chrome.storage.sync.get(defaults, (config) => {
	window.postMessage({ type: "MOVPLUS_INIT_CONFIG", payload: config }, "*");
});

// 2. Escuchar cambios en tiempo real (si el usuario cambia opciones con el video abierto)
/*
* USANDO addEventListener
chrome.storage.addEventListener(MediaQueryListEvent, (changes, area) => {
	if (area === "sync"){
		chrome.storage.sync.get(defaults, (newConfig) => {
			window.postMessage({ type: "MOVPLUS_UPDATE_CONFIG", payload: newConfig }, "*");
		});
	}
});

 */

// Deprecado: Usando onChanged
chrome.storage.onChanged.addListener((changes, area) => {
	if (area === "sync") {
		chrome.storage.sync.get(defaults, (newConfig) => {
			window.postMessage({ type: "MOVPLUS_UPDATE_CONFIG", payload: newConfig }, "*");
		});
	}
});