# MANTA editorial-commerce: comparación con Iconix

## Decisión de producto

Iconix / Urban Icons sirve como referencia del patrón de interacción: un look editorial puede conservarse visible mientras se consulta una pieza y se ejecutan acciones comerciales. No es autoridad para el inventario, la identidad ni la arquitectura de MANTA.

MANTA parte de una edición, una historia y una atmósfera. El producto aparece como una capa contextual de la narración, no como el destino automático de la navegación.

| Aspecto | Iconix / Urban Icons | MANTA |
|---|---|---|
| Entrada | Look o catálogo | Edición editorial |
| Producto | Hotspot comercial | Pieza con relación narrativa |
| Navegación | Tienda → producto → bolsa | Editorial → escena → look → combinación → bolsa |
| Superficie | La imagen se conserva parcialmente | La escena permanece como superficie principal |
| Identidad | Urbana/comercial | Latinoamericana, México y Guadalajara |
| Futuro | Inventario presentado como disponible | Ediciones con estado `live` o `upcoming` |
| Diferenciador | Acciones de compra y probador | Continuidad narrativa, composición de look y drops editoriales |

## Qué reutilizamos

- Hotspots sobre la escena.
- Panel contextual de producto.
- Bolsa y favoritos compartidos entre modos.
- Variantes de talla/color.
- Acción explícita para volver al look.

## Qué no copiamos

- Inventario, nombres, imágenes o identidad visual de Iconix.
- El funnel tradicional portada → producto → ficha → catálogo.
- Hotspots genéricos representados únicamente por `+`.
- Productos futuros mezclados con el catálogo vivo.
- Afirmaciones de procedencia, colaboración o ubicación sin fuente verificada.

## Criterios derivados de la auditoría

MANTA debe mantener consistencia entre intención, interfaz y resultado:

- Los filtros deben cambiar realmente los resultados.
- La búsqueda debe reflejar el término introducido.
- Cada hotspot debe tener una etiqueta descriptiva y un nombre accesible.
- Las ediciones futuras deben tener un estado visible y un bloqueo funcional.
- Cuenta, ayuda, privacidad y guía de tallas no se presentarán como completas mientras sean solo placeholders.

## Primera edición

Agosto es la edición viva del MVP: **Monzón tapatío**. Sus historias son **La ciudad después del agua**, **Oficio que se lleva** y **Noche de barrio**. La dirección visual toma Guadalajara como punto de partida editorial sin convertir referencias conceptuales en afirmaciones documentales.

Septiembre (**Patria cotidiana**) y Octubre (**Noche tapatía**) aparecen como teasers navegables. Sus escenas pueden revelarse, pero no tienen productos comprables ni acceso a Store.

## Flujo aprobado

```text
Edición → escena → hotspot descriptivo → panel contextual
       → añadir al look / agregar a la bolsa / ver detalles
       → volver al look
```

El catálogo es una entrada paralela para quien ya quiere explorar piezas. No es el destino automático de la lectura editorial.

