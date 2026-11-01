# Biblioteca de onboarding PXSOL — español

**Versión:** 0.1.0  
**Estado:** borrador editorial  
**Fuente de producto disponible al crearla:** ninguna  
**Formato previsto:** grabación de pantalla  
**Idioma:** español

## Alcance

La biblioteca estructurada está en [pxsol-onboarding-es.v1.json](../../content/onboarding/pxsol-onboarding-es.v1.json). Contiene 20 guiones distribuidos en cuatro etapas (4 + 6 + 6 + 4), con objetivo, plan de pantalla, narración, duración objetivo y verificaciones obligatorias.

## Veracidad y estados

- `proposed`: contenido de proceso/acompañamiento que no afirma una función concreta del PMS.
- `pending_validation`: requiere comprobar pantallas, procesos o funcionalidades del PMS real.
- `verified_hub_only`: reservado para evidencia del Onboarding Hub; no equivale a verificación del PMS.

La fuente de producto fue declarada como inexistente. Por tanto, ningún menú, botón, pantalla, integración, permiso ni proceso específico del PMS se considera verificado. No se deben grabar tomas que aparenten mostrar el producto real hasta disponer de un ambiente demo o evidencia funcional aprobada.

## Contrato editorial

Cada entrada incluye:

- `step_number`, `stage_id`, `title`, `language`, `format`.
- `duration_seconds`, `objective`, `screen_plan`, `narration`.
- `verification_status`, `validation_required`.
- `editorial_status`, `video_status`, `video_url`, `thumbnail_url`, `version`.
- Campos de aprobación y revisión, inicialmente nulos.

Los estados editoriales/audiovisuales son independientes del estado de ejecución del paso de un cliente. Ver un video no completa automáticamente el paso.

## Producción segura

1. Obtener acceso a un ambiente demo autorizado y confirmar funcionalidades con producto/implementación.
2. Reemplazar cada plan de pantalla genérico por una secuencia reproducible de la interfaz real.
3. Grabar con datos sintéticos, sin credenciales ni datos personales.
4. Editar, subtitular y revisar la exactitud funcional.
5. Obtener aprobación explícita de PXSOL.
6. Publicar solo después de aprobar el archivo audiovisual y disponer de una URL real.

No se crean URLs ficticias, no se cargan registros de videos como publicados, no se envían comunicaciones y no se activan automatizaciones desde esta biblioteca.

## Limitación de integración

El JSON es un artefacto editorial versionado en Git. No se inserta en Supabase ni se vincula automáticamente con clientes porque la configuración de Supabase sigue sin credenciales y el modelo de autorización/ownership aún no está aprobado. La estructura SQL existente para `videos` tampoco contiene todos los campos editoriales de este contrato; requiere una migración diseñada después de inspeccionar la base real y aprobar el modelo.
