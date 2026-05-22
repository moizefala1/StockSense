# Decisiones Técnicas — StockSense E2

## 1. Estructura de carpetas por dominio

Reorganizamos `components/` en `ui/` (primitivos), `layout/` (header, footer) y `analysis/` (búsqueda, resultados, veredicto). La sección 3.3 del enunciado exige *"estructura de carpetas clara, componentes organizados por responsabilidad."* En la E1 convivían header, footer y botones en una misma carpeta raíz sin criterio. La clase 08 (React Recap) insiste en cohesión: agrupar lo que cambia junto. Ahora si preguntan "¿dónde está el veredicto?", la respuesta es inmediata: `components/analysis/verdict-badge.tsx`.

## 2. Tipos y mock data centralizados

`analizar/page.tsx` tenía 441 líneas mezclando tipos, datos mock, lógica de generación y JSX. La sección 3.3 pide *"código legible: funciones con una responsabilidad."* Extraer `Verdict` y `AnalysisResult` a `lib/types.ts` elimina re-declaraciones y permite importarlos desde cualquier archivo; mover `generateMockAnalysis()` a `lib/mock-data.ts` garantiza consistencia (sección 3.1: *"el mock debe ser consistente: misma forma de datos, estados de carga, error y vacíos"*). La página pasó de 441 a 23 líneas.

## 3. Server Components vs. Client Components

El Footer era `"use client"` solo por `usePathname` — lo convertimos a Server Component eliminando ese hook (la pérdida del link activo en el footer es aceptable porque el header ya lo cubre). El Header sigue siendo Client Component porque necesita `useState` para el menú mobile. La página `/analizar` pasó de monolito `"use client"` de 322 líneas a una página Server de 23 líneas que compone `<Header />`, `<Suspense><StockAnalysis /></Suspense>` y `<Footer />`. La clase 10 establece que un componente va al cliente solo si necesita estado, efectos o eventos. La estrategia resultante: `/` y `/como-funciona` → SSG (estático, sin datos dinámicos); `/analizar` → mixto (shell en servidor, isla interactiva en cliente). El build confirma `○ (Static)` para las tres. Al ser Server Component, `/analizar` ahora puede exportar `metadata` para SEO.

## 4. Hook customizado `useAnalysis`

Creamos `hooks/use-analysis.ts` encapsulando 5 estados + 3 acciones del flujo de análisis. La sección 3.3 pide *"uso correcto de hooks; no se evalúa la cantidad, se evalúa la pertinencia."* La clase 09 enseña que los custom hooks extraen lógica con estado del JSX. `StockAnalysis` pasó de 55 líneas de lógica a 5 líneas de destructuring. `useMemo` en `filteredStocks` evita refiltrar en cada render. Si en la E3 se agrega un historial de análisis, el mismo hook se reutiliza sin duplicar código.

## 5. Estados de interacción

Implementamos error, empty, disabled, y mejoramos hover, focus-visible y active donde corresponde (sección 3.2). El error —crítico para un producto cuyo pain principal es la desconfianza— incluye icono, mensaje y botón "Reintentar"; el mock tiene 15% de probabilidad de fallo. El empty guía al usuario: "Selecciona una acción para comenzar". Todos los elementos interactivos tienen `focus-visible:ring-2 focus-visible:ring-accent` para navegación por teclado, `hover` con transiciones y `active` con feedback táctil (`active:scale-95`). La clase 11 asocia las transiciones con affordance: un elemento que no cambia al hover es indistinguible de uno estático.

## 6. Progressive disclosure

La clase 11 define progressive disclosure como revelar información gradualmente según el interés del usuario. Aplicamos tres niveles en los resultados: (1) veredicto y confianza siempre visibles, (2) botón "¿Por qué esta recomendación?" que revela el razonamiento, (3) botón "Indicadores técnicos" que revela las 4 cards con RSI y medias móviles. Ambos toggles arrancan cerrados. El `ChevronDown` rota 180° al expandirse, comunicando estado sin texto. Esto ataca directamente el pain principal declarado en la E1: la sobrecarga informacional. El usuario controla cuánta información recibe.

## 7. Componentes reutilizables

Extrajimos `StockSearch` (input + resultados + tags populares) y `AnalysisResult` (veredicto + razonamiento + indicadores). `StockAnalysis` quedó como coordinador de 90 líneas que compone las piezas en vez de contenerlas. La clase 08 enfatiza composición sobre herencia. La sección 3.3 pide *"componentes reutilizables cuando tiene sentido."* Si en la E3 se comparan dos acciones lado a lado, `StockSearch` y `AnalysisResult` se reutilizan sin cambios porque solo dependen de sus props, no del contexto de página.

## 8. Context API — no implementado

No usamos `useContext` porque no hay estado compartido entre rutas ni prop drilling. La clase 09 enseña que Context resuelve el paso de props a través de muchos niveles del árbol; aquí la jerarquía es plana (`StockAnalysis` → `StockSearch` + `AnalysisResult`, un solo nivel). Agregar Context sin necesidad real sería sobre-engineering. La sección 3.3 evalúa pertinencia, no cantidad de hooks.

## 9. Variables CSS en lugar de colores hardcodeados

Reemplazamos 29 ocurrencias de `slate-*`, `emerald/amber/rose-*` y `#2bc8d1` por las variables del sistema (`--muted-foreground`, `--success`, `--warning`, `--danger`, `--accent`, `--border`). La sección 3.2 exige *"aplicación consistente de principios visuales"* y la sección 7 del enunciado advierte que *"se penaliza cuando la UI se desvía del style guide declarado."* Nuestro style guide define `--muted-foreground` para texto secundario y `--success/warning/danger` para el semáforo. Usar `slate-500` o `emerald-700` directamente rompe ese compromiso y obliga a cambiar N archivos ante cualquier ajuste de paleta. Con variables, un cambio en `globals.css` se propaga a toda la app.

## 10. Search params en la URL

El hook `useAnalysis` ahora sincroniza el estado del análisis con la URL: al seleccionar una acción se llama `router.replace("/analizar?symbol=AAPL")`; al cargar con `?symbol=`, un `useEffect` busca el stock y ejecuta el análisis automáticamente. La sección 3.1 pide *"navegable de punta a punta sin callejones sin salida."* Sin search params, compartir `/analizar` muestra un empty state; con `?symbol=AAPL` el link es autocontenido. La clase 10 enseña que los search params son estado que pertenece a la URL, no a `useState`: el navegador ya ofrece back, forward, bookmarks e historial sobre la URL. El `useRef` previene doble análisis en Strict Mode.

## 11. TypeScript estricto y metadata

Eliminamos `ignoreBuildErrors: true` de `next.config.mjs` porque ocultaba errores de tipo — la definición misma de "por si acaso" que la sección 3.3 prohíbe. Agregamos `metadata` con título y descripción a las tres páginas, posible gracias a que el Paso 3 las convirtió en Server Components (la clase 10 enseña que `export const metadata` solo funciona en servidor). Eliminamos comentarios redundantes (`{ /* hero */ }`) y corregimos dobles espacios e indentación inconsistente. El build final pasa con TypeScript estricto: cero errores, cero warnings.
