# AGENTS.md — Directrices del Proyecto "Happy Profesor" 🎓✨

Bienvenido al repositorio de **Happy Profesor**. Este proyecto es una experiencia web interactiva, inmersiva y emotiva creada con motivo del Día del Docente para **Naila**, profesora de educación física apasionada por sus alumnos ("los gorditos"), el fútbol, el hockey, el pádel y la moda urbana.

---

## 1. 🏛️ Estructura y Roles Agénticos

Cuando cualquier agente de IA opere en este repositorio, debe asumir y respetar los siguientes roles y responsabilidades:

1. **Lead Architect & PM**:
   - Mantiene la coherencia funcional, el propósito emotivo y la integridad técnica del proyecto.
   - Vela por la compatibilidad sin fricción en dispositivos móviles (**Mobile-First**) y despliegues limpios en Vercel.

2. **3D WebGL / Three.js Engineer**:
   - Responsable de los componentes tridimensionales en `src/three/`.
   - Garantiza que los modelos procedurales (Zapatilla Jordan 1 Low Panda, Pelota de Fútbol clásica y Silbato de Corazón de Cristal) mantengan fidelidad estética HD con respecto a las referencias visuales.
   - Implementa físicas lúdicas y elásticas (*squash & stretch* estilo *Worms 3D*), optimizando el render loop para sostener 60 FPS en móviles.
   - Controla el ciclo de vida de Three.js (disposal de geometrías, materiales y texturas para prevenir memory leaks).

3. **UI/UX & Creative Designer**:
   - Asegura la estética *Rich Aesthetics*: diseño moderno, toques urbanos/oversize, glassmorphism sutil, tipografía legible y micro-animaciones placenteras.
   - Preserva los sellos de identidad y expresiones de Naila (*"tremendaki"*, *"weke"*, *"los gorditos"*).
   - Mantiene la pantalla final emotiva (*ClimaxModal*) con polaroids, confeti y dedicatoria personalizada.

4. **QA & Optimization Specialist**:
   - Verifica que no existan errores de TypeScript (`npm run build`).
   - Prueba la experiencia táctil en viewports móviles (e.g. 390x844) y desktop.

---

## 2. 📂 Registro Obligatorio de Sesiones con IA

Toda interacción de desarrollo con IA debe quedar registrada en la carpeta `docs/sessions/`:
- **Ruta**: `docs/sessions/`
- **Nomenclatura**: `NNN_tema_de_la_sesion.md` (e.g., `001_3d_experience_setup.md`).
- Cada archivo debe registrar: objetivo, fecha, agente/modelo utilizado, cambios realizados y próximos pasos.

---

## 3. 🎨 Estándares Visuales y Técnicos

- **HD & Estilo Worms 3D**: Entorno 3D colorido, sombreado suave con `PCFSoftShadowMap`, iluminación cálida matutina y rebotes animados con elasticidad jugosa.
- **Fidelidad de Objetos**:
  - *Fútbol*: Textura clásica pentagonal/hexagonal con brillo satinado.
  - *Zapa Urbana*: Jordan 1 Low Panda con suela texturizada, puntera perforada y Swoosh lateral negro.
  - *Silbato*: Corazón de cristal rubí translúcido con refracción óptica (`MeshPhysicalMaterial`) y boquilla deportiva.
- **Mobile First**: Controles accesibles para usuarios no gamers (tap to snap + drag interactivo).
- **Rendimiento**: Evitar dependencias pesadas innecesarias y asegurar carga instantánea.
