# MovPlus++ 🚀 | Movistar+ Keyboard Controller

![Version](https://img.shields.io/badge/version-1.3.0-00ffed?style=flat-square)
![Manifest](https://img.shields.io/badge/manifest-V3-blue?style=flat-square)
![Environment](https://img.shields.io/badge/context-Main%20World-success?style=flat-square)

**Lleva la experiencia de usuario de Movistar+ al siguiente nivel.**
Esta extensión de Chrome inyecta un controlador avanzado en el reproductor web de Movistar+, habilitando atajos de teclado universales, gestión de pistas de audio/subtítulos y feedback visual (OSD) en tiempo real.

---

## ✨ Características Premium

* **🕹️ Control Nativo:** Navegación por teclado estilo YouTube/Netflix (Espacio, Flechas, F, M).
* **🎧 Gestión de Audio Inteligente:** Ciclo de pistas de audio con **corrección automática de ABR** (evita que el reproductor revierta el idioma por cambios de calidad).
* **💬 Subtítulos Cíclicos:** Sistema rotativo inteligente: `OFF` ➔ `Idioma 1` ➔ `Idioma 2` ➔ `OFF`.
* **👁️ OSD Cyberpunk:** Interfaz en pantalla (On-Screen Display) con estética neón (`#00ffed`) que confirma cada acción sin invadir el contenido.
* **🛡️ Ingeniería "Main World":** Ejecución directa en el contexto principal para interactuar con la API `window.shakaPlayer` sin violar las políticas CSP (Content Security Policy).

---

## ⌨️ Mapa de Teclado

| Tecla | Acción | Descripción Técnica |
| :--- | :--- | :--- |
| **`Espacio`** | Play / Pause | Controla el estado del motor de video HTML5. |
| **`Flecha Derecha`** | +15 Segundos | Salto rápido (`currentTime + 15`). |
| **`Flecha Izquierda`** | -15 Segundos | Rebobinado rápido (`currentTime - 15`). |
| **`Flecha Arriba`** | Vol + 5% | Incremento logarítmico de volumen. |
| **`Flecha Abajo`** | Vol - 5% | Decremento de volumen. |
| **`L`** | Audio | **Cycle Track:** Cambia al siguiente idioma disponible. *Desactiva ABR temporalmente.* |
| **`C`** | Subtítulos | **Cycle Subs:** Rota entre pistas de texto y estado apagado. |
| **`M`** | Mute | Silenciar / Activar sonido (Toggle). |
| **`F`** | Fullscreen | Pantalla completa inteligente (detecta contenedor `.objetoPlayer`). |

---

## 🛠️ Instalación (Modo Desarrollador)

Este proyecto es una herramienta de optimización personal. Para instalarla:

1.  **Clona este repositorio:**
    ```bash
    git clone [https://github.com/overloadd/movplus-plus.git](https://github.com/overloadd/movplus-plus.git)
    ```
2.  Abre Google Chrome y navega a `chrome://extensions/`.
3.  Activa el interruptor **"Modo de desarrollador"** (arriba a la derecha).
4.  Haz clic en **"Cargar descomprimida"** y selecciona la carpeta del proyecto.
5.  Refresca la web de Movistar+ y disfruta.

---

## 🏗️ Arquitectura Técnica

Este proyecto resuelve desafíos complejos de la plataforma Movistar+ (basada en Shaka Player y protegida por SES Lockdown):

### 1. Inyección en "Main World" (Manifest V3)
En lugar de luchar contra el *Isolated World* de las extensiones, configuramos el `manifest.json` para ejecutar `content.js` en el contexto principal:
```json
"world": "MAIN"
```
## Apoya el Proyecto

Si esta extensión mejora tu experiencia diaria, considera invitarme a un café para mantener las actualizaciones:


[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?logo=paypal&style=for-the-badge)](https://www.paypal.com/donate/?hosted_button_id=BSBVZ96SC4HQU)
