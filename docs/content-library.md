# Biblioteca de contenidos PXSOL

## Alcance

La biblioteca permite al equipo interno gestionar videos, documentos PDF y presentaciones, y asociarlos a una de las cuatro etapas y opcionalmente a un paso del itinerario de 20 pasos.

## Modelo

- `content_resources`: metadatos, tipo, idioma, etapa, paso, orden y origen del recurso.
- `storage_path`: archivos almacenados en el bucket privado `pxsol-onboarding-content`.
- `external_url`: URL HTTP(S), habilitada para videos alojados en un proveedor externo.
- `content_type`: `video`, `pdf` o `presentation`.

La tabla heredada `videos` y `onboarding_steps.video_id` se conservan sin cambios.

## Seguridad

- El bucket es privado; los archivos no tienen URLs públicas permanentes.
- RLS restringe lectura/escritura a sesiones autenticadas, coherente con el alcance de demo interna compartida.
- Archivos: máximo 100 MB; MP4/WebM, PDF, PPT/PPTX.
- La UI crea URLs firmadas de cinco minutos para abrir recursos almacenados.
- No se usa service_role en el navegador.
- No hay envíos automáticos, WhatsApp, email ni exposición a clientes externos.

## Activación

1. Revisar y aprobar la migración `20261101170000_content_resources.sql`.
2. Aplicar la migración al proyecto Supabase PXSOL después del merge aprobado.
3. Esperar el deployment de Vercel.
4. Ingresar con una cuenta interna en `/content`.
5. Cargar primero recursos editoriales aprobados y comprobar lectura/descarga.

La migración no se aplica automáticamente a producción desde esta rama. No cargar contenido de prueba en la base compartida.
