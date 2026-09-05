## TAREA: MIGRAR EL DISEÑO DE `product_detail/index.html` A LA FICHA DE PRODUCTO DE SHOPIFY

Quiero que migres **el diseño visual y la estructura de `product_detail/index.html` del prototipo Vanilla** hacia la página de producto del theme de Shopify.

### 1. REFERENCIA VISUAL

La fuente de verdad para el DISEÑO es:

```text
/product_detail/index.html
```

Debes inspeccionar también todos los CSS y JS que utiliza esa página para entender completamente:

* estructura HTML
* layout
* imágenes
* galería
* título
* precio
* información del producto
* variantes
* talles
* botones
* cantidades
* información adicional
* responsive
* estados visuales
* interacciones

NO quiero que inventes un diseño nuevo.

NO quiero que simplemente uses el diseño visual de Dawn.

NO quiero que hagas una aproximación genérica de una página de producto.

El objetivo es que la página de producto de Shopify se vea visualmente como `product_detail/index.html`.

---

## 2. IMPORTANTE: NO CONFUNDIR LA RUTA DEL PROTOTIPO CON LA RUTA DE SHOPIFY

`product_detail/index.html` es solamente un archivo HTML estático del prototipo.

NO debes intentar crear una ruta fija:

```text
/products/product-detail
```

ni asumir que esa será la URL de todos los productos.

En Shopify las URLs de productos son dinámicas:

```text
/products/<product-handle>
```

Ejemplos:

```text
/products/carbon-oversized-hoodie
/products/acid-wash-tee
/products/otro-producto
```

Todos esos productos deben utilizar el MISMO sistema de template de producto.

La arquitectura correcta es:

```text
/products/<handle>
        ↓
templates/product.json
        ↓
sections/vanilla-product.liquid
        ↓
product
        ↓
HTML final
```

Por lo tanto:

**NO crees una página específica para `product-detail`.**

**NO hardcodees un producto concreto.**

**NO hardcodees el handle.**

**NO hardcodees título, precio, imágenes, talles ni variantes.**

El diseño debe ser reutilizable para cualquier producto de Shopify.

---

## 3. ARCHIVO PRINCIPAL QUE DEBES MODIFICAR

El documento técnico del proyecto confirma que actualmente la arquitectura de producto es:

```text
templates/product.json
        ↓
sections/vanilla-product.liquid
```

Y que `vanilla-product.liquid` es la sección personalizada utilizada actualmente para la ficha de producto.

Por lo tanto, empieza revisando:

```text
templates/product.json
sections/vanilla-product.liquid
```

Después revisa todos los snippets, CSS y JS que estos archivos utilizan.

No reemplaces arbitrariamente toda la arquitectura de Shopify si no es necesario.

La migración debe integrarse con la arquitectura existente del theme.

---

## 4. OBJETIVO EXACTO

Quiero conservar:

### DEL PROTOTIPO

El diseño de:

```text
product_detail/index.html
```

Incluyendo su:

* estructura
* distribución
* tamaños
* espaciados
* tipografía
* colores
* botones
* galería
* imágenes
* información
* selector de variantes
* selector de cantidad
* responsive
* comportamiento visual

### DE SHOPIFY

Quiero conservar la funcionalidad real de Shopify:

```liquid
product
product.variants
product.media
product.selected_or_first_available_variant
routes.cart_add_url
product.metafields
```

Y el sistema existente de:

```text
product-variant-picker
product-form
buy-buttons
price
cart
Ajax Cart API
```

No simules la lógica de Shopify con datos hardcodeados.

---

## 5. REEMPLAZAR DATOS ESTÁTICOS POR DATOS DE SHOPIFY

Todo dato que actualmente esté hardcodeado en:

```text
product_detail/index.html
```

debe convertirse en dato dinámico de Shopify.

Por ejemplo:

HTML estático:

```html
<h1>CARBON OVERSIZED HOODIE</h1>
```

debe convertirse conceptualmente en:

```liquid
<h1>{{ product.title }}</h1>
```

Precio estático:

```html
<span>$120.00</span>
```

debe utilizar:

```liquid
{{ product.price | money }}
```

La imagen estática debe convertirse en:

```liquid
product.media
```

Las variantes/talles deben venir de:

```liquid
product.variants
```

El producto seleccionado debe respetar:

```liquid
product.selected_or_first_available_variant
```

Los metafields existentes deben mantenerse si forman parte del diseño.

El documento técnico confirma que actualmente `vanilla-product.liquid` utiliza:

```text
product.metafields.custom.features
```

por lo que debes revisar cómo se utilizan los metafields existentes antes de modificar su estructura.

---

## 6. VARIANTES Y AGREGAR AL CARRITO

NO implementes un sistema falso de variantes.

NO uses JavaScript para inventar precios o inventario.

El selector visual debe terminar seleccionando una variante real de Shopify.

El botón de agregar al carrito debe utilizar el sistema existente del theme:

```text
product-form.js
product-form-shrine.js
buy-buttons
routes.cart_add_url
```

La arquitectura documentada indica que el flujo correcto es:

```text
usuario selecciona variante
        ↓
product-variant-picker
        ↓
variant-change
        ↓
se actualiza la variante
        ↓
product-form
        ↓
POST /cart/add.js
        ↓
Shopify valida la variante
        ↓
cart drawer
```

No rompas este flujo al modificar el HTML/CSS.

---

## 7. NO MODIFICAR EL DISEÑO DE SHOPIFY PARA QUE SE PAREZCA A DAWN

El theme deriva de Dawn, pero la ficha de producto personalizada ya utiliza:

```text
vanilla-product
```

El objetivo de esta tarea NO es recuperar:

```text
main-product.liquid
```

ni volver a utilizar el diseño estándar de Dawn.

El documento técnico confirma que `main-product.liquid` existe pero NO es la sección montada actualmente por `product.json`.

Por lo tanto, utiliza:

```text
vanilla-product.liquid
```

como punto principal de implementación.

---

## 8. CSS

Primero identifica qué CSS utiliza:

```text
product_detail/index.html
```

y determina qué reglas corresponden exclusivamente al prototipo.

Después adapta esas reglas al markup Liquid de Shopify.

Prioridad:

```text
1. Mantener fidelidad visual con product_detail/index.html
2. Reutilizar variables y estilos globales existentes del theme cuando sea posible
3. Evitar duplicar CSS innecesariamente
4. No romper otras páginas
```

Si necesitas crear CSS específico para la ficha de producto, utiliza un archivo claramente identificado y cárgalo de manera correcta.

No hagas un bloque enorme de CSS inline dentro del Liquid salvo que sea estrictamente necesario.

---

## 9. JAVASCRIPT

Inspecciona primero el JavaScript del prototipo:

```text
product_detail/
```

Determina qué comportamiento necesita realmente Shopify.

No copies ciegamente el JavaScript del prototipo si éste depende de:

```text
localStorage
datos hardcodeados
IDs estáticos
productos estáticos
```

Adapta solamente la parte visual/interactiva necesaria.

Shopify ya dispone de lógica para:

* cambio de variantes
* agregar al carrito
* disponibilidad
* actualización de precio
* carrito
* estados de carga
* errores

No dupliques esa lógica si ya existe en el theme.

Ten especial cuidado porque el documento técnico indica que varios JS del theme dependen fuertemente de determinadas clases, IDs y `data-*` generados por Liquid.

---

## 10. RESPONSIVE

El resultado debe funcionar correctamente en:

```text
desktop
tablet
mobile
```

No basta con que coincida con el HTML original en escritorio.

Compara visualmente:

```text
product_detail/index.html
```

contra:

```text
/products/<cualquier-producto>
```

en las tres resoluciones.

---

## 11. NO ROMPER OTRAS PÁGINAS

La modificación debe afectar principalmente a:

```text
/products/<handle>
```

No debes alterar accidentalmente:

```text
/
 /collections
 /cart
 /pages/contact
 /search
```

ni el header/footer global salvo que sea estrictamente necesario.

La arquitectura del theme utiliza:

```text
theme.liquid
    ↓
header-group
    ↓
content_for_layout
    ↓
template específico
    ↓
section específica
    ↓
footer-group
```

Por lo tanto, trabaja principalmente en el nivel de:

```text
templates/product.json
sections/vanilla-product.liquid
snippets relacionados
assets CSS/JS relacionados
```

Evita modificar `layout/theme.liquid` para resolver un problema que pertenece exclusivamente a la página de producto.

---

## 12. CRITERIO DE ACEPTACIÓN

La tarea NO está terminada simplemente porque:

```text
/products/product-handle
```

funcione.

Debe cumplirse TODO esto:

### Diseño

La ficha de Shopify debe ser visualmente equivalente a:

```text
product_detail/index.html
```

### Dinamismo

Debe funcionar con cualquier:

```text
/products/<handle>
```

sin modificar código.

### Datos

Debe mostrar los datos reales de Shopify:

```text
nombre
precio
imágenes
variantes
talles
disponibilidad
metafields
```

### Variantes

Cambiar talla/color/etc. debe seleccionar una variante real.

### Carrito

Agregar al carrito debe utilizar el sistema real de Shopify y mantener funcionando el cart drawer existente.

### Responsive

Debe coincidir correctamente con el diseño del prototipo en:

```text
desktop
tablet
mobile
```

### Integración

No debe romper:

```text
header
footer
cart drawer
product-form
variant picker
otras páginas
```

---

## 13. ANTES DE EDITAR

NO empieces a modificar archivos inmediatamente.

Primero inspecciona:

```text
product_detail/index.html

todos los CSS utilizados por product_detail

todos los JS utilizados por product_detail

templates/product.json

sections/vanilla-product.liquid

snippets utilizados por vanilla-product

assets relacionados con producto

product-form.js

product-variant-picker

buy-buttons

price
```

Después explícame brevemente:

1. qué estructura tiene actualmente `product_detail/index.html`
2. qué estructura tiene actualmente `vanilla-product.liquid`
3. qué partes se pueden migrar directamente
4. qué partes deben adaptarse a Shopify
5. qué archivos vas a modificar
6. qué archivos NO necesitas modificar

Recién después realiza la implementación.

---

## REGLA PRINCIPAL

Piensa en esta migración así:

```text
product_detail/index.html
        =
REFERENCIA VISUAL
```

y:

```text
/products/<handle>
        =
RUTA DINÁMICA DE SHOPIFY
```

y:

```text
templates/product.json
        ↓
sections/vanilla-product.liquid
        =
IMPLEMENTACIÓN REAL
```

El resultado final debe ser:

```text
DISEÑO DEL PROTOTIPO
        +
DATOS DINÁMICOS DE SHOPIFY
        +
FUNCIONALIDAD REAL DE SHOPIFY
        =
FICHA DE PRODUCTO FINAL
```

No quiero una nueva página llamada `product-detail`.

Quiero que **la ficha de producto estándar de Shopify, independientemente del producto que se abra, utilice el diseño de `product_detail/index.html`.**
