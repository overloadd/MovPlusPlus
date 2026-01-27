# Movistar+ Keyboard Controller 🚀

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Chrome%20|%20Edge-blue)

**Estandarización de controles de accesibilidad para la plataforma Movistar Plus.**

Esta extensión de Chrome tiene como objetivo unificar la experiencia de usuario en el reproductor de Movistar+, mapeando atajos de teclado universales (estilo YouTube/Netflix) para mejorar la productividad y la accesibilidad.

---

## ✨ Características Principales

* **🕹️ Control Universal:** Uso de `Espacio` para pausa/play y `Flechas` para volumen y tiempo.
* **🛡️ Ingeniería Defensiva:** Implementación con **Shadow DOM** para evitar conflictos de CSS con la web original.
* **📺 Feedback Visual (OSD):** Indicadores en pantalla dinámicos y minimalistas para confirmar acciones.
* **⚡ Optimizado para Shaka Player:** Integración directa con la API de Shaka para el control de subtítulos y tracks.

---

## ⌨️ Atajos de Teclado

| Tecla | Acción |
| :--- | :--- |
| `Espacio` | Reproducir / Pausar |
| `Flecha Derecha` | Avanzar 15 segundos |
| `Flecha Izquierda` | Retroceder 15 segundos |
| `Flecha Arriba` | Subir volumen (5%) |
| `Flecha Abajo` | Bajar volumen (5%) |
| `M` | Silenciar / Activar sonido |
| `F` | Pantalla Completa |
| `C` | Toggle de Subtítulos (Beta) |

---

## 🛠️ Instalación (Modo Desarrollador)

Como esta es una herramienta de optimización personal, puedes instalarla manualmente siguiendo estos pasos:

1.  **Clona este repositorio:**
    ```bash
    git clone [https://github.com/TU_USUARIO/movistar-enhancer.git](https://github.com/TU_USUARIO/movistar-enhancer.git)
    ```
2.  Abre **Chrome** y navega a `chrome://extensions/`.
3.  Activa el **"Modo de desarrollador"** en la esquina superior derecha.
4.  Haz clic en **"Cargar descomprimida"** y selecciona la carpeta donde clonaste el proyecto.

---

## 🏗️ Arquitectura Técnica

El proyecto utiliza un patrón de **Inyección de Scripts** en fase de captura para priorizar los eventos del usuario sobre los manejadores nativos de la web.

* **`manifest.json`**: Configuración de permisos mínimos (Host Permissions) siguiendo la política de *Single Purpose* de Google.
* **`content.js`**: Lógica principal con desacoplamiento entre el manejador de eventos y las acciones del hardware.
* **Encapsulamiento**: Uso de **IIFE** (Immediately Invoked Function Expression) para proteger el scope global y evitar colisiones en entornos SES/Lockdown.

---

## 🚧 Estado del Proyecto (WIP)

- [x] Controles básicos de reproducción.
- [x] OSD dinámico con Shadow DOM.
- [ ] **TODO:** Mejorar la resiliencia de la tecla `C` (subtítulos) tras cambios de bitrate en Shaka Player.
- [ ] **TODO:** Persistencia de volumen mediante `chrome.storage`.

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia **MIT**.
