<petition>

Necesito que definas los criterios para el siguiente proyecto y luego lo implementes usando tu mayor poder visual, UX, y logico. tienes que saber que cuento con antigravity por si quieres desarrollar todo en un tsx y luego lo acomodo en un proyecto real con vite. A continuacion, el pedido:

"""
Contexto del proyecto
La destinataria de esta web app es Naila, mi novia. Mañana, 11 de septiembre, es el Día del Docente en Argentina y quiero sorprenderla con un detalle digital único. Ella es profesora de educación física: le apasiona enseñar tanto a infantes ("los gorditos", como les dice con cariño) como a primaria y secundaria, y le encantan deportes como fútbol, hockey y pádel. Tiene una personalidad súper alegre, divertida y luminosa; le gusta la moda urbana, el estilo oversize y la ropa deportiva. Además, usa expresiones muy suyas como "tremendaki" y "weke". La idea es regalarle una experiencia que capture su esencia, su vocación y lo mucho que la admiro.
Objetivo
Crear una experiencia web interactiva, emotiva y tierna que celebre su día como docente. Debe generar sorpresa inmediata, sentirse pensada 100% para ella y funcionar con rendimiento óptimo y fluidez total en dispositivos móviles (ella accede casi exclusivamente desde su celular, por lo que el enfoque debe ser mobile-first). La interacción debe ser intuitiva, accesible (no es gamer) y libre de fricciones.
Mecánica seleccionada: "El Vestuario de las Cualidades"

Concepto visual: Un vestuario deportivo estilizado con diseño limpio y moderno (toques pasteles combinados con estética urbana/oversize). En la parte superior hay un casillero o perchero abierto con 3 ganchos/perchas vacías. En la parte inferior se presentan 3 objetos interactivos ilustrados o estilizados en 3D/2.5D:
Pelota de fútbol suave o estilizada.
Zapatillas de estilo urbano/deportivo.
Silbato en forma de corazón.
Mecánica interactiva: Mediante drag & drop táctil (o tap para seleccionar y ubicar en la percha correspondiente):
Al colocar la pelota, se activa una micro-animación de destellos y aparece la palabra: DIVERSIÓN.
Al colocar las zapatillas, aparece con energía la palabra: ENERGÍA.
Al colocar el silbato corazón, aparece con partículas suaves la palabra: AMOR.
Clímax y cierre: Una vez colocadas las tres piezas:
El vestuario se ilumina suavemente con una lluvia sutil de confeti/corazones.
Se despliega un panel central o tarjeta destacada con 1 o 2 fotos de ella (de su graduación / sonriendo) y el mensaje principal:

"Estas tres cualidades te hacen la profe más tremendaki. ¡Feliz día!"
Espacio final para una dedicatoria personal breve.
Tecnologías sugeridas y despliegue

Stack sugerido: React con TypeScript y Tailwind CSS para estilizado rápido y responsivo. Se pueden incorporar librerías de animación e interacción como Framer Motion (ideal para drag & drop suave en touch y micro-animaciones) o Three.js / React Three Fiber si se desea un toque 3D ligero y optimizado.
Libertad técnica: Queda a criterio técnico la selección exacta de librerías y componentes para garantizar tiempos de carga instantáneos, soporte touch fluido y animaciones a 60 fps en móviles.
Despliegue: La estructura del repositorio debe estar lista para conectarse y desplegarse de manera directa y sin configuraciones complejas en Vercel.

"""
</petition>


<gem_dev_response>

¡Hola! Como **Architect & Tech PM**, me encanta este proyecto. Tiene un propósito claro, un usuario final definido y una métrica de éxito puramente emocional y experiencial.

### FASE 2: Consejo Técnico & Arquitectura (Plan Mode)

Para lograr esa sensación de "magia", fluidez móvil (60fps) y cero fricción, he diseñado la siguiente arquitectura front-end:

1. **Patrón de Interacción "Auto-Snap" (UX sin fricción):** Implementar un drag & drop tradicional en móviles suele fallar por los bordes táctiles. Utilizaremos el motor de físicas de **Framer Motion** con un modelo de *Layout Animations*. La mecánica será: si Naila arrastra el objeto hacia arriba (superando un umbral de -100px en el eje Y), el objeto volará automáticamente a su percha correspondiente mediante un `layoutId`. Esto es indulgente, satisfactorio y no requiere precisión gamer.
2. **Estética "Pastel Urban":** Usaremos Tailwind para crear un fondo suave (off-white/pastel), pero con tipografías gruesas, bordes redondeados extremos y sombras pronunciadas (estilo Neo-Brutalismo suave o *oversize UI*), reflejando su estilo de moda.
3. **Partículas Nativas (Zero-Dependencies extra):** En lugar de añadir librerías pesadas de Canvas, he codificado un sistema de confeti usando puramente Framer Motion para mantener el peso del bundle al mínimo, ideal para conexiones móviles.

---

### FASE 3: Implementación & Desarrollo (Build Mode)

Aquí tienes el código completo. Al estar optimizado para tu entorno (Antigravity/Vite), todo está consolidado en un único archivo `App.tsx`.

*Nota: Asegúrate de tener instalados `framer-motion`, `lucide-react` y `tailwindcss` en tu proyecto Vite final.*

### FASE 4: Despliegue, Operación & Cierre

**Validación y Pasos para Desplegar (Vercel):**

1. **Setup Local (Vite):**
Abre tu terminal y ejecuta:

```bash
   npm create vite@latest naila-app -- --template react-ts
   cd naila-app
   npm install framer-motion lucide-react tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   

```

2. **Reemplazo de Assets:**

Copia el código provisto y reemplázalo íntegramente en `src/App.tsx`.
⚠️ *Importante:* Busca las URLs de Unsplash en el código (líneas de `<img>`) y cámbialas por rutas a fotos reales de Naila que hayas guardado en tu carpeta `public/` (ej: `/foto-naila-1.jpg`).

3. **Despliegue Cero-Fricción:**

* Sube tu código a un repositorio de GitHub.
* Entra a [Vercel.com](https://vercel.com), vincula tu cuenta de GitHub, selecciona el repositorio `naila-app`.
* Vercel detectará automáticamente que es un proyecto Vite. Haz clic en "Deploy" y en 45 segundos tendrás el link en vivo para enviárselo por WhatsApp mañana.



**Detalles UX agregados para ella:**

* **Micro-interacciones:** Los iconos botan cuando los tocas (`whileDrag={{ scale: 1.2 }}`).
* **Estilo Oversize:** Botones grandes, paddings exagerados y bordes de `2rem` (`rounded-[2rem]`).
* **Huevos de Pascua:** Agregué un sticker rotado que dice "WEKE! ✨" en la tarjeta final, tal como pediste.

¡Éxitos con la sorpresa, es un detalle increíble! Quedo atento si necesitas ajustar alguna física de animación.

</gem_dev_response>