# MANTA · contenido editorial audiovisual

## Propósito

Esta capa amplía **Monzón tapatío** sin convertir la revista en un catálogo convencional. La secuencia de lectura y comercio es:

`edición → escena → nota → poster/video/audio → pieza contextual → look → Store`

La escena sigue siendo la superficie principal. El producto se deriva de la historia y puede abrirse en un panel contextual sin perder el contexto editorial.

## Registro canónico

La fuente única está en:

- `src/domain/editorialMedia.ts`: posters, videos planificados, pistas, prompts de Flow, prompts de Suno y letras.
- `src/domain/editorialMediaTypes.ts`: contratos `StoryNote` y `StoryCampaign`.
- `src/domain/content.ts`: asociación de notas y campañas con cada `Story`.
- `src/data/assetManifest.ts`: rutas semánticas de assets locales.

No se crean catálogos paralelos ni estados comerciales alternos. Los productos se resuelven con `getProduct()` y `getLiveProducts()` desde `src/domain/catalog.ts`.

## Agosto · quince hojas editoriales

Cada nota ocupa una hoja vertical del lector de revista. La portada, las tres escenas y sus cinco notas por escena mantienen la lectura narrativa; el comercio aparece solo como una capa contextual dentro de la hoja activa.

### La ciudad después del agua

1. **Mapa sensorial de una calle mojada** — microcrónica de reflejos, cantera, café, transporte y ritmo posterior a la lluvia. Audio `Después del agua`; paraguas, impermeable y botas.
2. **Salir también es una forma de vestir** — movimiento, clima y encuentro sin convertir la historia en ficha comercial. Impermeable terracota y botas humo.
3. **La familia como composición** — color, capas y movimiento en una escena familiar latinoamericana. Look Monzón Tapatío.
4. **Pequeña escala, mismo clima** — la lluvia también organiza una salida familiar y sus objetos de movimiento. Impermeable, botas y mochila infantil.
5. **La prueba del aguacero** — una prenda se entiende al cruzar la banqueta, recibir el agua, plegarse y volver a salir. Impermeable, botas y pieza infantil.

### Oficio que se lleva

1. **Materia que camina** — telas, superficies, costuras y el cambio de una pieza al entrar en la ciudad. Audio `Materia que camina`; camisa, bolsa y capa.
2. **El detalle que sostiene el look** — bordado, forro, cierre, textura, material y color. Camisa y detalle de piel.
3. **Objetos para una jornada larga** — bolsa, capa y accesorios como herramientas sensibles de movilidad urbana.
4. **Lo que vuelve también cambia** — repetición, uso y memoria de una prenda que acompaña distintos días. Camisa bordada y punto Bruma.
5. **El color contra el cielo gris** — mostaza, terracota y teal como herramientas de orientación y continuidad. Camisa, capa y bolsa.

### Noche de barrio

1. **La mesa también es una escena** — reunión, composición colectiva y pertenencia cotidiana. Audio `La noche nos junta`; chaqueta teal y punto Bruma.
2. **Luces de esquina** — neón, sombra, reflejos y trayectos breves después de la lluvia. Tenis Paso Mojado y pañoleta Ruta de Agua.
3. **Un look para quedarse un rato** — combinación para pasar de la calle a una reunión. Cuatro piezas de la escena.
4. **La ciudad guarda un lugar** — una pausa nocturna donde chaqueta y pañoleta sostienen el tránsito entre calle y mesa.
5. **Lo que llevamos a la mesa** — bolsas y accesorios como memoria práctica de una noche compartida. Bolso Azul de Noche y Bolso Café de Terraza.

Los textos son conceptuales. No presentan colaboraciones, talleres, procedencias artesanales ni ubicaciones concretas como hechos verificados.

## Hoja de ruta editorial para los siguientes números

Estas líneas amplían la narrativa sin convertir cada edición en una lista de tendencias. Cada tema debe partir de una situación reconocible, resolverse con una escena y terminar en producto solo cuando exista una relación natural.

1. **Vestir para dos climas** — calor en la calle, aire frío bajo techo y lluvia en el trayecto. Capas ligeras, camisas, impermeables y calzado.
2. **Una prenda, tres vidas** — trabajo, fin de semana y aguacero narrados con la misma pieza en tres momentos.
3. **La prueba del aguacero** — movimiento, cierres, capucha, suela y uso real; demostrar en vez de prometer.
4. **Regreso a clases sin comprar de más** — revisar lo que todavía funciona, priorizar resistencia y conectar Niños, mochilas y calzado.
5. **El color contra el cielo gris** — mostaza, terracota, teal, rojo y marfil como sistema visual para unir Mujer, Hombre, Unisex, Niños y Bebé.
6. **Ropa que se mueve** — una pieza quieta, caminando, girando, bajo lluvia y en detalle; formato prioritario para video vertical.
7. **¿Por qué comprarlo?** — cuatro razones verificables de uso, combinación, mantenimiento y duración; nunca una promesa no comprobada.
8. **La ropa real** — cuerpos, jornadas, pausas y detrás de escena sin perfección artificial; la ciudad como contexto, no como postal.

Para Guadalajara, la dirección local se puede extender con **La Americana como pasarela cotidiana**, **Chapultepec después de las seis**, **Hecho en Jalisco**, **El agave como paleta** y **Vestir local sin parecer souvenir**. Son marcos culturales para producir historias, no afirmaciones de procedencia o colaboración.

La proporción editorial recomendada para cada número es **60% vida real y problema cotidiano, 25% cultura o lenguaje visual y 15% comercio directo**. La música, el video y los hotspots deben reforzar la escena; no sustituir el texto ni convertir la página en un anuncio.

## Lote audiovisual

| Registro | Formato | Estado inicial | Uso |
|---|---:|---|---|
| `poster-august-after-rain` | 9:16 | `ready` | Escena 01, nota sensorial, Flow vertical 01 |
| `poster-august-materia` | 9:16 | `ready` | Escena 02, nota táctil, Flow vertical 02 |
| `poster-august-noche-barrio` | 16:9 | `ready` | Escena 03, Store Hero, Flow horizontal 03 |
| `video-august-after-rain` | 9:16 | `ready` | Familia caminando bajo la lluvia |
| `video-august-materia` | 9:16 | `ready` | Persona doblando prenda terracota |
| `video-august-noche-barrio` | 16:9 | `ready` | Amigos brindando en terraza |
| `audio-despues-del-agua` | — | `ready` | `luz-despues-de-la-lluvia.mp3` local |
| `audio-materia-que-camina` | — | `ready` | `papel-picado-suave.mp3` local |
| `audio-la-noche-nos-junta` | — | `ready` | `esquinas-de-lluvia.mp3` local |

Los tres posters están en `public/assets/editorial/campaigns/` y no contienen texto, logotipos ni marcas falsas. Sus prompts de generación y sus alt text están junto al registro para regenerar únicamente una pieza que falle en QA.

Las dos bolsas de Noche de barrio usan assets locales únicos. El bolso café se presenta con el recorte editorial `bolso-cafe-terraza-editorial.png`, tomado de una escena de uso para evitar marcas o microinscripciones visibles en el herraje de la imagen fuente original.

## Entrega a Flow

1. Usar cada poster como imagen de referencia.
2. Copiar el `flowPrompt` del registro correspondiente.
3. Mantener personas, prendas, paleta y composición; no introducir logos ni texto generado.
4. Exportar con el mismo nombre base en `public/assets/editorial/video/`.
5. Cambiar solo ese registro a `status: 'ready'` y añadir `src` local. Mantener `posterSrc`. Este paso ya está aplicado para las tres piezas recibidas.

La interfaz soporta fallback: si una futura pieza vuelve a `planned`, muestra el poster y la etiqueta `Flow · poster listo`.

## Entrega a Suno

Cada pista incluye `sunoPrompt` y `lyrics` en el registro canónico. Generar una versión original en español, sin imitar artistas existentes, de aproximadamente 45–70 segundos.

1. Copiar prompt y letra del audio correspondiente.
2. Exportar a `public/assets/editorial/audio/` con el nombre base del ID.
3. Añadir `src` local y cambiar `status` a `ready`.

El `AudioDock` es compartido: solo admite una pista activa, no usa reproducción automática, emplea `preload="none"`, pausa al cambiar de escena y muestra un fallback honesto si todavía falta el MP3.

## Store y catálogo

- Store mantiene 20 productos vivos de Agosto, incluidos Mujer, Hombre, Unisex, Niños y Bebé.
- El Store Hero usa la campaña horizontal de **Noche de barrio**.
- `Historias de Agosto` muestra las tres escenas, sus posters, estado de video, notas y una pieza contextual.
- Cada producto conserva origen editorial y puede regresar a la escena mediante el panel contextual existente.
- Favoritos, variantes, look y bolsa siguen usando el estado compartido del shell.
- Septiembre y Octubre permanecen `upcoming`, sin Store ni compra.

## QA de contenido

Ejecutar:

```text
pnpm.cmd -s lint
pnpm.cmd -s check:content
pnpm.cmd -s build
pnpm.cmd -s verify
```

`check:content` valida exactamente una edición viva, 20 productos vivos de Agosto, quince notas editoriales, referencias de media y productos existentes, posters locales, dos posters verticales, un poster horizontal y los tres medios audiovisuales locales listos. También verifica que las imágenes vivas no se repitan y que existan las familias infantil y bebé.

La validación visual debe revisar desktop y móvil, especialmente el recorte 9:16/16:9, la lectura del panel de notas, el foco de los botones, el audio activado manualmente y el recorrido completo hasta bolsa y regreso a escena.
