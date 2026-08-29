# Informe de Auditoría del Tema de Shopify "24-siete"

## Resumen General
Este es un tema de Shopify llamado "24-siete" (parece ser un tema personalizado basado en Dawn). El tema sigue la estructura estándar de Shopify, con plantillas Liquid, assets de CSS/JS y archivos de configuración.

## Auditoría de la Estructura de Directorios

### `assets/`
Contiene todos los archivos CSS, JavaScript, fuentes y assets estáticos (210 archivos).
**Categorías principales de assets:**

- **Archivos CSS** (`*.css`): Estilos de componentes, secciones, plantillas y estilos base
  - `24sie7e.css` / `24sie7e-home.css` - Hojas de estilo principales del tema
  - `base.css` - Reseteos base y tipografía
  - `component-*.css` - Estilos de componentes individuales (tarjetas, valoraciones, sliders, etc.)
  - `ds-*.css` - Estilos de componentes de Dawn
  - `template-*.css` - Estilos específicos de plantillas
  - `section-*.css` - Estilos específicos de secciones

- **Archivos JavaScript** (`*.js`): Funcionalidad del tema
  - `global.js` - Funcionalidad principal del tema, manejo de eventos
  - `animations.js` - Animaciones al hacer scroll (cargado condicionalmente)
  - `cart-drawer.js`, `cart.js` - Funcionalidad del carrito
  - `predictive-search.js` - Funcionalidad de búsqueda
  - `quick-add.js`, `quick-order-list.js` - Pedidos rápidos
  - `facets.js`, `price-per-item.js` - Facetas y precios
  - `details-disclosure.js`, `details-modal.js` - Modales de detalle
  - `product-form.js`, `product-form-shrine.js` - Formularios de producto
  - `product-model.js` - Visor de modelo 3D del producto
  - `loading-spinner.js`, `mask-arch.svg`, etc.
  - Polyfills como `jquery.js`

- **Imágenes/Íconos** (`*.svg`, `*.gif`): Íconos y assets SVG
  - Íconos de carpetas para cuenta, carrito, búsqueda, redes sociales, etc.
  - `loading-spinner.svg`, `sparkle.gif`

- **Archivos de utilidad**:
  - `constants.js` - Constantes del tema
  - `pubsub.js` - Patrón pub/sub para el manejo de eventos
  - `mask-blobs.css` - Efectos de máscara/desenfoque
  - `template-giftcard.css`

### `config/`
Configuración del tema.

- **`settings_data.json`**: Valores actuales de la configuración del tema (colores, tipografía, diseños, animaciones, configuración del carrito, etc.)
- **`settings_schema.json`**: Define todas las configuraciones personalizables del tema que aparecen en el Personalizador de Temas de Shopify. Organizado en grupos:
  - Información del tema (nombre, versión, autor)
  - Esquemas de color
  - Configuración de colores (texto, fondos, botones)
  - Configuración de tipografía (selectores de fuente, escalas)
  - Configuración de diseño (ancho de página, espaciado)
  - Animaciones (revelado al hacer scroll, efectos hover)
  - Botones, campos de entrada, tarjetas, tarjetas de colección, tarjetas de blog
  - Popups, cajones (drawers), insignias, información de marca
  - Enlaces a redes sociales, campo de búsqueda, formato de moneda
  - Configuración del carrito (tipo, variantes mostradas, insignias de pago)

### `layout/`
- **`theme.liquid`**: El archivo de layout principal, envoltorio de todas las páginas del tema. Contiene:
  - `<head>` HTML con metaetiquetas, inclusión de assets, etiquetas CSS/JS
  - `<body>` con enlace de accesibilidad para saltar contenido, secciones de header/footer, área de contenido principal
  - Variables CSS dinámicas generadas a partir de la configuración del tema
  - Carga condicional de tipos de cajón/carrito, búsqueda predictiva, localización
  - Configuración global de JavaScript (rutas, cadenas de texto, cadenas de accesibilidad)

- **`password.liquid`**: Layout de la página de contraseña (modo "próximamente"/mantenimiento)

### `locales/`
Contiene archivos de localización para más de 39 idiomas (archivos `.json` con traducciones).
- Cada idioma tiene un archivo `.json` y un archivo `.schema.json`
- El idioma predeterminado es inglés (`en.default.json`)
- Los idiomas incluyen: es (español), fr (francés), de (alemán), pt-BR (portugués de Brasil), zh-CN, zh-TW, etc.
- Se usan para las cadenas de texto del tema traducidas mediante el filtro `t()` en Liquid

### `sections/`
Contiene todos los archivos Liquid de secciones (74 secciones). Las secciones son bloques de contenido reutilizables que se pueden agregar a las páginas de Shopify a través del personalizador de temas.

**Categorías principales de secciones:**

- **Secciones de la página de inicio**:
  - `24sie7e-home-hero.liquid` - Sección de hero/banner
  - `24sie7e-home-features.liquid` - Sección de características
  - `24sie7e-home-inventory.liquid` - Visualización de inventario/colección
  - `24sie7e-home-spec-banner.liquid` - Banner de especificaciones

- **Secciones de producto**:
  - `featured-product.liquid` - Visualización principal del producto
  - `ds-featured-collection.liquid` - Colección destacada
  - `image-banner.liquid`, `image-with-text.liquid` - Contenido basado en imágenes

- **Secciones de colección**:
  - `collection-list.liquid` - Lista de colecciones
  - `main-collection-banner.liquid`, `main-collection-product-grid.liquid`

- **Secciones de blog**:
  - `featured-blog.liquid`, `main-blog.liquid`
  - `rich-text.liquid`

- **Secciones de utilidad**:
  - `footer.liquid`, `header.liquid`, `header-group.json`, `footer-group.json`
  - `contact-form.liquid`, `newsletter.liquid`
  - `promo-popup.liquid`, `quick-order-list.liquid`
  - `multicollumn.liquid`, `multirow.liquid`

- **Secciones de carrito/cajón**:
  - `cart-drawer.liquid`, `cart-icon-bubble.liquid`
  - `cart-live-region-text.liquid`, `cart-notification*.liquid`

- **Secciones de cliente/cuenta**:
  - `main-account.liquid`, `main-login.liquid`, `main-order.liquid`, etc.

- **Varios**: `announcement-bar.liquid`, `apps.liquid`, `custom-liquid.liquid`, `wd-section-divider.liquid`, `wd-label.liquid`, `wd-wavy-shape.liquid`, `wd-diagonal-shape.liquid`

### `snippets/`
Contiene fragmentos (snippets) Liquid reutilizables (90 archivos). Son similares a las secciones pero no se pueden agregar directamente a las páginas: se incluyen dentro de las secciones.

**Categorías principales de snippets:**

- **Snippets de producto**:
  - `card-product.liquid`, `card-collection.liquid` - Tarjetas de producto
  - `product-thumbnail.liquid`, `product-media.liquid` - Visualización de medios
  - `product-media-gallery.liquid`, `product-media-modal.liquid` - Modales de galería
  - `product-variant-picker.liquid`, `product-variant-options.liquid` - Selección de variantes
  - `ds-card-product.liquid` - Tarjeta de producto estilo Dawn
  - `ds-price.liquid`, `ds-rating-stars-block.liquid` - Visualización de precio y valoración

- **Componentes de interfaz**:
  - `header-drawer.liquid`, `header-dropdown-menu.liquid`, `header-mega-menu.liquid`
  - `header-search.liquid`, `language-localization.liquid`
  - `social-icons.liquid`, `share-button.liquid`
  - `facets.liquid` - Facetas de filtro de colección
  - `pagination.liquid`, `price-facet.liquid`

- **Relacionados con el carrito**:
  - `cart-drawer.liquid`, `cart-notification.liquid`
  - `cart-progress-bar.liquid`, `quick-order-list.liquid`

- **Varios**:
  - `meta-tags.liquid` - Metaetiquetas SEO
  - `country-localization.liquid`
  - `gift-card-recipient-form.liquid`
  - `ds-js-sticky-atc.liquid` - Botón "agregar al carrito" fijo (sticky)
  - `quick-add-bulk.js` (nota: archivo .js dentro de snippets)

### `templates/`
Contiene plantillas JSON que definen la estructura de las páginas (16 archivos más el subdirectorio `customers/`).

- **Páginas de producto**: `product.json`, `article.json` (para entradas de blog)
- **Páginas de colección**: `collection.json`
- **Página de carrito**: `cart.json`
- **Página de búsqueda**: `search.json`
- **Página de blog**: `blog.json`
- **Páginas estáticas**: `page.json`, `page.faq.json`, `page.contact.json`, `page.track-order.json`
- **Cuentas de cliente**: `customers/account.json`, `customers/activate_account.json`, `customers/addresses.json`, `customers/login.json`, `customers/order.json`, `customers/register.json`, `customers/reset_password.json`
- **Páginas especiales**: `gift_card.liquid`, `404.json`, `index.json` (página de inicio)

### Nivel raíz
- No se detectó `package.json`, `gulpfile.js` ni herramientas de compilación
- No se encontró `README.md` inicialmente
- El tema sigue las convenciones de Shopify (Liquid, `.css`, `.js`, `.json`, `.liquid`)

## Auditoría de Archivos Clave

### `layout/theme.liquid` (401 líneas)
El wrapper principal del tema que:
- Define la estructura HTML con las metaetiquetas correspondientes
- Incluye todos los assets CSS y JS de forma condicional
- Genera propiedades personalizadas CSS a partir de la configuración del tema
- Renderiza las secciones de header y footer
- Provee configuración global de JavaScript
- Maneja el cajón de carrito vs. carrito de página según la configuración
- Carga la búsqueda predictiva si está habilitada

### `config/settings_schema.json` (más de 1500 líneas)
Define todas las configuraciones personalizables para el Personalizador de Temas de Shopify, organizadas en más de 28 grupos de configuración que cubren:
- Diseño visual (colores, tipografía)
- Diseño y espaciado
- Animaciones e interacciones
- Configuración de carrito y cajón
- Redes sociales y marca
- Configuración de moneda y búsqueda

### `assets/base.css`
Estilos base que incluyen:
- Reseteos CSS
- Estilos de tipografía (fuentes, tamaños, alturas de línea)
- Configuración de propiedades personalizadas CSS

### `assets/global.js`
JavaScript principal que:
- Inicializa la funcionalidad del tema
- Maneja las actualizaciones del carrito
- Gestiona el enrutamiento de eventos mediante pubsub
- Configura el estado global del tema

## Resumen
Este es un tema de Shopify rico en funcionalidades que incluye:
- Más de 74 secciones reutilizables
- Más de 90 snippets
- Más de 210 archivos de assets
- Soporte completo de localización (más de 39 idiomas)
- Amplia configuración del personalizador de temas (más de 28 grupos)
- Múltiples opciones de diseño de carrito (cajón, página, notificación)
- Capacidad de búsqueda predictiva
- Funcionalidad de pedido rápido y agregado masivo al carrito
- Soporte de visor de modelo 3D de producto
- Funciones de accesibilidad (enlaces para saltar contenido, consideraciones ARIA)