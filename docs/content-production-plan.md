# Plan de producción y carga de contenidos PXSOL

**Proyecto:** onboarding-hub  
**Versión:** 1.0  
**Idioma editorial:** español (es-AR)  
**Responsable:** Development  
**Origen:** producción desde cero  
**Modelo audiovisual:** híbrido — grabaciones reales de pantalla + animaciones/motion graphics  
**Estado:** plan de ejecución; los materiales no se consideran publicados hasta superar QA editorial y funcional.

## 1. Decisión editorial y responsables

Development es el responsable integral de la producción: planificación, guiones, capturas, edición, animaciones, diseño de PDFs y presentaciones, metadatos, carga en la biblioteca y control de versiones.

La producción se realizará con estas funciones. Son responsabilidades del proceso, no personas contratadas o asignadas:

| Función | Responsable operativo | Intervención |
|---|---|---|
| Coordinación y producción | Development | Planifica, produce, edita, carga y mantiene los recursos |
| Validación funcional del producto | Referente de Producto/Operaciones PXSOL por designar | Confirma que pantallas, nombres, procesos, permisos y resultados descritos son reales |
| Revisión editorial | Development | Claridad, consistencia, ortografía, accesibilidad y lenguaje |
| Aprobación de publicación | Referente PXSOL autorizado por designar | Autoriza que el material validado quede activo y visible |

**Respuesta a “¿quién producirá los materiales?”:** los producirá Development de punta a punta. No se presupone la existencia de un equipo audiovisual externo. Para evitar enseñar procedimientos incorrectos, un referente de Producto/Operaciones de PXSOL deberá validar los hechos del producto antes de publicar cada lote. Si ese referente aún no está designado, los recursos quedan en estado de borrador y no se activan.

## 2. Objetivo y alcance del primer lote

Crear un paquete de contenidos completo para los 20 pasos del onboarding, organizado en las cuatro etapas ya definidas en la aplicación.

| Entregable | Cantidad objetivo | Formato |
|---|---:|---|
| Microtutoriales por paso | 20 | MP4, grabación real de pantalla con apoyos animados |
| Guías por etapa | 4 | PDF accesible |
| Presentaciones por etapa | 4 | PPTX editable |
| **Total** | **28 recursos** | 20 videos + 4 PDF + 4 presentaciones |

Los videos serán híbridos: la demostración principal mostrará la interfaz y el flujo real; títulos, llamadas de atención, transiciones y conceptos abstractos se resolverán con animación. No se simularán pantallas ni se inventarán funcionalidades para completar una pieza.

### Distribución por etapa

| Etapa | Pasos | Videos | PDF | Presentación |
|---|---:|---:|---:|---:|
| 1. Bienvenida | 1–3 | 3 | 1 | 1 |
| 2. Configuración | 4–8 | 5 | 1 | 1 |
| 3. Capacitación | 9–14 | 6 | 1 | 1 |
| 4. Integraciones y puesta en marcha | 15–20 | 6 | 1 | 1 |
| **Total** | **20** | **20** | **4** | **4** |

Los títulos y objetivos concretos de cada pieza se derivarán de los 20 pasos vigentes en el onboarding. No se asignarán nombres de pantallas, botones, integraciones ni resultados que no estén comprobados en el producto.

## 3. Especificación de producción

### Videos
- Formato maestro: 1920×1080, 16:9, MP4/H.264, audio AAC.
- Resolución de publicación: 1080p; crear versión comprimida si el peso supera el límite operativo.
- Duración objetivo: 2–5 minutos por paso; priorizar una tarea concreta por video.
- Narración en español argentino neutro, ritmo claro y vocabulario consistente con la interfaz.
- Captura sobre entorno de demo con datos completamente ficticios; nunca usar datos personales, credenciales, tokens o información de clientes.
- Cursor visible, zoom legible, subtítulos incrustados o archivo de subtítulos asociado como mejora de accesibilidad.
- Animaciones sobrias para introducción, conceptos, alertas y cierre; no reemplazan la demostración real.
- Cierre estándar: resultado esperado, siguiente paso y canal interno de soporte definido por PXSOL. No inventar canales ni SLA.

### PDFs
- Un documento por etapa.
- Estructura: propósito, requisitos previos, pasos numerados, capturas verificadas, resultado esperado, errores frecuentes confirmados y referencia al video correspondiente.
- Texto seleccionable, jerarquía de encabezados, enlaces descriptivos, contraste suficiente y páginas numeradas.
- Exportación PDF optimizada; mantener archivo fuente editable.

### Presentaciones
- Una presentación por etapa, en PPTX editable.
- Entre 6 y 10 diapositivas: objetivo, mapa del proceso, conceptos, demostración resumida, checklist y cierre.
- Diseñadas para capacitación guiada; no duplicar íntegramente la guía PDF.
- No incluir precios, datos internos sensibles ni promesas comerciales no aprobadas.

## 4. Flujo de producción

1. **Congelar el temario:** leer los 20 pasos publicados en la aplicación y asociar cada paso con una tarea verificable.
2. **Matriz de contenidos:** definir para cada pieza objetivo, audiencia, precondiciones, guion, evidencia de interfaz, resultado esperado y responsable de validación.
3. **Guionado:** producir guion narrado y storyboard breve. Marcar explícitamente cualquier dato que requiera confirmación de PXSOL.
4. **Validación funcional previa:** el referente PXSOL confirma el flujo real en el producto. Si no está disponible, la pieza permanece en borrador.
5. **Captura y animación:** grabar en entorno ficticio, editar silencios/errores, añadir motion graphics, voz y subtítulos.
6. **Documentación:** crear PDF y PPTX a partir de los mismos flujos validados, manteniendo consistencia entre formatos.
7. **QA editorial y audiovisual:** comprobar exactitud, legibilidad, audio, subtítulos, enlaces, ortografía y ausencia de datos sensibles.
8. **Carga controlada:** subir primero un lote piloto de tres recursos (un video, un PDF y una presentación) a una etapa; comprobar acceso autenticado, URL firmada, descarga y asociación correcta.
9. **Carga por lotes:** cargar los recursos restantes por etapa y paso, verificar metadatos y orden.
10. **Publicación:** activar únicamente recursos aprobados; mantener inactivos los borradores y los materiales pendientes de validación.
11. **Mantenimiento:** versionar archivos fuente y registrar fecha, versión, cambio y motivo de actualización.

## 5. Metadatos y nomenclatura

Cada recurso debe tener:
- título claro y único;
- descripción breve con el resultado que obtendrá la persona;
- tipo: `video`, `pdf` o `presentation`;
- etapa 1–4;
- paso 1–20 cuando corresponda;
- idioma `es`;
- origen del archivo o URL externa (URL externa solo para videos);
- orden de visualización;
- estado activo/inactivo;
- versión editorial registrada en el inventario de producción.

Nomenclatura recomendada para archivos fuente y exportaciones:

`pxsol-es-etapa-XX-paso-YY-tipo-vNN.ext`

Ejemplos:
- `pxsol-es-etapa-01-paso-01-video-v01.mp4`
- `pxsol-es-etapa-01-guia-pdf-v01.pdf`
- `pxsol-es-etapa-01-presentacion-v01.pptx`

La ruta de almacenamiento de Supabase será generada por la aplicación con identificador único; el nombre editorial se conserva en el título y en el inventario. No incluir datos personales en nombres o rutas.

## 6. Matriz de carga en onboarding-hub

| Campo de la biblioteca | Regla |
|---|---|
| Título | Nombre orientado a la tarea |
| Descripción | Qué aprenderá y qué resultado verificable obtendrá |
| Tipo | Video / PDF / Presentación |
| Etapa | Etapa correspondiente del onboarding |
| Paso | Paso específico; opcional solo para material transversal de etapa |
| Idioma | Español (`es`) |
| Archivo | MP4, WebM, PDF, PPT o PPTX permitido por la biblioteca |
| URL externa | Solo para video y únicamente si el alojamiento fue aprobado |
| Activo | Sí únicamente después de validación y aprobación |

La biblioteca utiliza almacenamiento privado y acceso mediante URL firmada temporal. No convertir el bucket en público ni compartir enlaces firmados como enlaces permanentes.

## 7. Criterios de aceptación

Un recurso está listo para activarse solo si cumple todos estos puntos:

- [ ] Corresponde a un paso o etapa vigente del onboarding.
- [ ] El flujo mostrado fue comprobado en el producto actual.
- [ ] La terminología coincide con la interfaz.
- [ ] El contenido está íntegramente en español.
- [ ] No contiene datos reales de clientes, credenciales ni información sensible.
- [ ] El video se entiende con audio y tiene texto/subtítulos legibles.
- [ ] El PDF es seleccionable y legible; el PPTX se abre y es editable.
- [ ] No existen enlaces rotos ni instrucciones ambiguas.
- [ ] El tipo, etapa, paso e idioma están correctamente cargados.
- [ ] La lectura funciona con una sesión autenticada y no funciona como recurso público.
- [ ] La persona validadora PXSOL dejó constancia de conformidad antes de activar.

## 8. Plan de ejecución y puertas de control

| Fase | Resultado | Condición de salida |
|---|---|---|
| A. Inventario y guiones | Matriz de 20 pasos y 28 briefs | Temario contrastado con la aplicación |
| B. Piloto | 1 video + 1 PDF + 1 PPTX | QA funcional/editorial y carga comprobada |
| C. Producción audiovisual | 20 videos finales | 20/20 guiones y flujos validados |
| D. Documentación | 4 PDF + 4 PPTX | 8/8 archivos revisados |
| E. Carga | 28 registros en biblioteca | Metadatos, permisos y orden comprobados |
| F. Publicación | Recursos aprobados activos | Aprobación del referente PXSOL |

No se fija una fecha calendario sin estimación de disponibilidad del referente de Producto/Operaciones ni sin comprobar la complejidad real de los 20 flujos. La secuencia y el volumen quedan definidos; la duración se estima después del inventario y del piloto.

## 9. Controles y límites

- No aplicar migraciones ni modificar configuración de Supabase como parte de la producción editorial.
- No publicar ni cargar archivos finales hasta que la integración técnica esté aprobada, desplegada y validada.
- No habilitar integraciones, email, WhatsApp ni envíos automáticos.
- No grabar sobre cuentas o datos reales.
- No declarar un contenido aprobado por inferencia: la validación funcional requiere evidencia de PXSOL.
- Conservar archivos fuente y exportaciones versionadas para permitir correcciones sin rehacer el material completo.

## 10. Próxima ejecución autónoma

Una vez que la biblioteca esté desplegada y disponible, Development puede preparar los guiones, storyboards, plantillas de video, PDF y PPTX utilizando los 20 pasos vigentes. La validación de comportamiento real del producto y la autorización de activación quedan asignadas al referente PXSOL que deberá designarse.
