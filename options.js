const defaults = {
	seekTime: 15,
	volStep: 0.05,
	SELECTORS: ["#player-multidrm", "#player_mid_roll", "video"],
	keys: {
		play: "Space"
		, next: "ArrowRight", rewind: "ArrowLeft"
		, volUp: "ArrowUp", volDown: "ArrowDown"
		, mute: "KeyM", fullscreen: "KeyF"
		, audio: "KeyL", subs: "KeyC"
	}
};

const labels = {
	play: "Play/Pausa", next: "Avanzar", rewind: "Retroceder",
	volUp: "Subir Volumen", volDown: "Bajar Volumen", mute: "Silenciar",
	audio: "Cambiar Audio", subs: "Cambiar Subtítulos", fullscreen: "Pantalla Completa"
};

// Generar UI de teclas
const container = document.getElementById("keyMapSection");
Object.keys(defaults.keys).forEach(action=> {
	const div = document.createElement("div");
	div.className = "row";
	div.innerHTML = `<label>${labels[action]}</label>
 					<div class="key-binder" data-action="${action}" tabindex="0">Cargando...</div>`;
	container.appendChild(div);
});

// Cargar datos
chrome.storage.sync.get(defaults, (items)=> {
	document.getElementById("seekTime").value = items.seekTime;
	document.getElementById("volStep").value = items.volStep;
	document.querySelectorAll(".key-binder").forEach(el=> {
		const action = el.dataset.action;
		el.textContent = items.keys[action];
		el.dataset.code = items.keys[action];
	});
});

// Lógica de grabación de teclas
document.querySelectorAll(".key-binder").forEach(btn=> {
	btn.addEventListener("click", () => {
		btn.textContent = "Pulse tecla...";
		btn.classList.add("recording");
		const handler = (e) => {
			e.preventDefault();
			btn.textContent = e.code;
			btn.dataset.code = e.code;
			btn.classList.remove("recording");
			window.removeEventListener("keydown", handler);
		};
		document.addEventListener("keydown", handler);
	});
});

// Guardar opciones
document.getElementById("save").addEventListener("click", () => {
	const newKeys = {};
	document.querySelectorAll(".key-binder").forEach(el => {
		newKeys[el.dataset.action] = el.dataset.code;
	});
	const config = {
		seekTime: Number(document.getElementById("seekTime").value),
		volStep: Number(document.getElementById("volStep").value),
		SELECTORS: defaults.SELECTORS,
		keys: newKeys
	};
	chrome.storage.sync.set(config, () => {
		const status = document.getElementById("status");
		status.textContent = "Configuracion guardada.";
		setTimeout(() => status.textContent = "", 2000);
	});
});