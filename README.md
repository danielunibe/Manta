# MANTA · Experiencia editorial-commerce

MANTA es un prototipo de revista digital interactiva que convierte una edición editorial en una experiencia de descubrimiento, contexto y comercio. La edición piloto, **Monzón tapatío**, parte de Guadalajara para explorar lluvia, oficio, movilidad urbana y encuentro cotidiano.

## Demo

**[Abrir MANTA](https://manta-editorial-commerce.danielalexisis.chatgpt.site/)**

La experiencia está diseñada para funcionar en móvil y escritorio: portada, lectura por hojas, transición tipo flipboard entre historias, productos contextuales, favoritos y bolsa local.

## Qué explora

- Revista editorial vertical con narrativa visual y lectura por escenas.
- Historias de Agosto: *La ciudad después del agua*, *Oficio que se lleva* y *Noche de barrio*.
- Productos integrados dentro de la escena, sin convertir la portada en una ficha comercial.
- Ficha contextual, variantes, favoritos, look y bolsa simulada.
- Video local, música ambiental bajo demanda y comportamiento responsive.
- Septiembre y Octubre como adelantos editoriales sin compra.

## Enfoque

MANTA toma la lógica útil de un catálogo digital —ediciones, páginas, producto contextual y bolsa— y la reorganiza desde una filosofía de revista. La historia es la superficie principal; el producto aparece como parte de la composición y como una puerta de regreso a la escena.

## Stack

- React + TypeScript
- Vite
- Motion
- Three.js para capas visuales secundarias
- Assets locales de imagen, video y audio
- Estado local, sin backend, pagos ni cuentas reales

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Validaciones disponibles:

```bash
pnpm lint
pnpm check:content
pnpm build
pnpm verify
```

## Alcance del prototipo

La bolsa, favoritos, variantes y disponibilidad son simulaciones locales para demostrar el flujo editorial-commerce. Agosto es la única edición comprable; las ediciones futuras se mantienen bloqueadas hasta que exista una decisión editorial y comercial.

## Autoría

© 2026 Daniel Aguilar. MANTA es un prototipo original de portafolio. El código y los assets no se ofrecen bajo una licencia de reutilización.
