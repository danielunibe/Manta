# Arquitectura MANTA MVP

## Autoridad

La fuente única del MVP es el registro editorial y comercial tipado. Portadas, escenas, hotspots, productos, Store y menú deben derivarse de esa fuente; ningún componente debe reconstruir inventario mediante índices o arrays paralelos.

## Capas

```text
app/                 shell, estado compartido, acciones
domain/              contratos, registro, selectores y media editorial
data/                contenido editorial y productos
features/editorial/  carrusel, transición, escenas, hotspots y notas
features/store/      descubrimiento, filtros, campañas y catálogo
features/commerce/   panel contextual, look composer y bolsa
features/audio/      AudioDock compartido con fallback local
components/navigation/ controles visuales y eventos
```

`App.tsx` coordina el shell y las superficies persistentes. El estado comercial no se duplica dentro de Store, menú y paneles.

## Contratos importantes

```ts
type EditionStatus = 'live' | 'upcoming';

interface Edition {
  id: string;
  status: EditionStatus;
  storeEnabled: boolean;
  stories: Story[];
}

interface Story {
  id: string;
  editionId: string;
  image: AssetRef;
  hotspots: Hotspot[];
  notes?: StoryNote[];
  campaign?: StoryCampaign;
}

interface Hotspot {
  id: string;
  storyId: string;
  productId: string;
  label: string;
  x: number;
  y: number;
}
```

Los productos tienen `releaseEditionId`, `storeVisible` y `sourceStoryId`. Store consume únicamente `getLiveProducts()`. Los productos de Septiembre y Octubre pueden existir en datos para preparar el contenido, pero no pasan ese selector.

El contenido audiovisual usa `EditorialMedia`, `StoryNote` y `StoryCampaign`. Los prompts de Flow y Suno viven junto a los medios, mientras que las rutas físicas pasan por el manifest de assets. Los tres videos recibidos desde Flow y las tres pistas locales están en estado `ready`; el poster y el texto siguen siendo el fallback si un archivo multimedia no carga.

## Estado

El estado compartido se concentra en `MantaState` y se modifica mediante acciones explícitas: selección de edición, apertura de historia/producto, composición del look, favoritos, bolsa, cambio de modo y avisos.

La escena no se desmonta al consultar un producto. El panel contextual se monta sobre ella y el `LookComposer` mantiene las piezas seleccionadas como continuidad de lectura.

Las notas se renderizan dentro de la escena activa. El `AudioDock` es único, se abre solo por interacción, usa `preload="none"` y pausa al cambiar de escena. Store muestra un rail editorial derivado de las mismas historias y no crea una copia de catálogo.

## Assets

Los assets editoriales principales viven bajo `public/assets/editorial/` y se referencian con `AssetRef`, incluyendo `src` y `alt`. El MVP conserva una carpeta de productos separada para controlar recortes y reutilización.

Estado visual del lanzamiento:

- Agosto: edición viva con tres escenas y productos asociados.
- Septiembre y Octubre: teaser visual, sin catálogo comercial.
- Agosto: quince notas editoriales, tres posters de campaña, tres videos locales y tres pistas de audio locales.
- Catálogo vivo: 20 productos únicos, con categorías infantiles y de bebé además de Mujer, Hombre y Unisex.
- Producto futuro nunca se vuelve visible por un filtro, rail o búsqueda.

## Rendimiento

Store y motores visuales pesados deben cargarse de forma diferida cuando sea seguro hacerlo. Three.js no debe bloquear la primera superficie editorial. Los componentes deben permanecer pequeños, con datos derivados por selectores y sin lógica de negocio repetida.

## QA mínimo

- `pnpm.cmd -s lint`.
- `pnpm.cmd -s build`.
- Contratos de IDs, referencias de hotspots y estado de publicación.
- Recorrido editorial completo en desktop y móvil.
- Teclado, foco, `Escape` y `prefers-reduced-motion`.
- Confirmación de que Store solo muestra Agosto.
- Confirmación de que el gesto táctil vertical conserva la transición Flipboard y que las notas avanzan como carrusel sin scrollbar interno.
- Los controles interactivos usan superficies glass sin contorno visible; el foco de teclado se conserva como estado accesible y no como decoración permanente.
