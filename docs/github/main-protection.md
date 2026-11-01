# Protección de la rama `main`

## Estado observado

En la auditoría del 30/10/2026, GitHub devolvió:

- `main.protected = false`.
- `protection.enabled = false`.
- Ruleset ID `26239850`, nombre `main`, con `enforcement = disabled`.
- El Ruleset existente no seleccionaba ramas: `conditions.ref_name.include = []`.

El conector GitHub disponible permite leer Rulesets, pero no modificarlos. El endpoint clásico de protección responde `403 Resource not accessible by integration`.

## Aplicar el Ruleset preparado

1. Abrí [Settings → Rules → Rulesets](https://github.com/popnegro/onboarding-hub/settings/rules).
2. Descargá `main-protection.ruleset.json` desde esta carpeta de la rama candidata.
3. Elegí **New branch ruleset → Import a ruleset** y cargá el JSON.
4. Revisá que el nombre sea `main`, el target sea Branch y la condición incluya exactamente `refs/heads/main`.
5. Confirmá que el enforcement esté en **Active** y que no haya bypass actors.
6. Guardá el Ruleset.
7. Verificá que GitHub muestre `main` como protegida y que el Ruleset figure Active.

## Controles incluidos

- Requiere Pull Request para cambiar `main`.
- Requiere resolver conversaciones de revisión.
- Exige que el check de Vercel termine correctamente antes de mergear.
- Exige que la rama esté actualizada con la base al validar los checks.
- Bloquea force-push y borrado de `main`.
- Descarta aprobaciones obsoletas al recibir nuevos commits.
- No configura aprobación obligatoria de otro usuario (`required_approving_review_count = 0`) para no bloquear un repositorio administrado por un único usuario. El merge continúa sujeto al HUMAN GATE manual del propietario.

## Verificación posterior

Consultar:

- [Branch main](https://github.com/popnegro/onboarding-hub/branches)
- [Rulesets](https://github.com/popnegro/onboarding-hub/settings/rules)

La configuración solo se considera aplicada cuando GitHub devuelve `protected = true` o el Ruleset activo muestra la condición `refs/heads/main` y las reglas esperadas. La existencia del archivo JSON o de un Ruleset desactivado no cuenta como protección.
