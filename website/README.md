# Web de seguimiento

Aplicacion estatica para consultar el plan activo y registrar sesiones localmente. No usa frameworks, dependencias, servidores propios, analytics ni trackers.

## Abrirla

Para probarla localmente, desde la carpeta `website/` usar cualquier servidor estatico, por ejemplo:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. No se recomienda abrir `index.html` con doble clic porque el navegador puede bloquear la lectura de `plan.json`. En un hosting estatico funcionara normalmente. El service worker y el modo sin conexion requieren HTTPS o `localhost`.

## Uso

1. La pantalla muestra automaticamente el dia actual de lunes a viernes.
2. Antes de los ejercicios aparece el **calentamiento obligatorio** en tres pasos: cardio, movimientos generales y series de aproximacion. La rutina se desbloquea al completar los tres pasos.
3. En cada tarjeta se ve primero **lo programado** y despues se anotan los datos **realizados**.
4. Los campos y los pasos del calentamiento se guardan automaticamente en `localStorage`.
5. `Terminar entrenamiento` marca la sesion como completada sin borrar datos.
6. El resumen aparece debajo y puede copiarse, compartirse, enviarse por WhatsApp o email.

La web muestra una semana local cuyo inicio es el lunes. Cada registro se almacena con una clave que incluye el prefijo de la aplicacion, la fecha de inicio de semana y el dia. Al comenzar otra semana se usan claves nuevas y no se eliminan registros anteriores.

## Configuracion

Los datos personales se modifican unicamente al principio de `app.js`:

```js
const CONFIG = {
  whatsappNumber: "",
  emailAddress: "",
  fatherName: ""
};
```

Escribir el numero de WhatsApp con prefijo internacional, solo digitos, sin `+`, espacios ni guiones. La web usa el formato estandar `https://wa.me/numero?text=...`. Si se deja vacio, abre WhatsApp sin destinatario. No hay ningun numero o email incluido por defecto.

## Sincronizar el plan

`plan_activo.md` y la seccion de calentamiento de `gimnasio_padre/README.md` siguen siendo las fuentes de verdad. Como una web estatica no puede convertir Markdown de forma fiable en todos los navegadores, `plan.json` es una copia estructurada que debe actualizarse manualmente cuando cambien el plan o el calentamiento. Solo debe contener los patrones, series, repeticiones, RIR, descansos, alternativas, notas y pasos de calentamiento de las fuentes. No poner pesos reales en `plan.json`.

La plantilla `semana_actual.md` y la carpeta `historial/` siguen siendo el registro oficial de archivos. La web no modifica esos archivos: sus datos locales se pueden exportar como copia JSON y trasladar manualmente al diario.

Cuando el plan indica un rango de series, por ejemplo `2-3`, la web muestra ese rango y prepara el numero maximo de campos. La ultima serie se puede dejar vacia si ese dia se realizan menos series.

## Borrar y restaurar

El borrado de un dia esta dentro de `Opciones` y pide confirmacion explicita. Recargar o cambiar de dia no borra datos. Para hacer una copia, usar `Exportar datos`, que descarga un JSON con todas las semanas guardadas por esta aplicacion.

La restauracion automatica no esta habilitada para evitar sobrescrituras accidentales. Para restaurar una copia, hay que revisar el JSON y cargar sus entradas mediante las herramientas de desarrollo del navegador o implementar un importador controlado.

## Mantenimiento

- Cambios visuales: `style.css`.
- Comportamiento y almacenamiento: `app.js`.
- Plan mostrado: `plan.json`, sincronizado con `../gimnasio_padre/plan_activo.md`.
- Archivos offline: lista `FILES` de `service-worker.js`; incrementar `CACHE_NAME` tras cambios importantes.

No se calcula progresion automaticamente, no se diagnostica dolor y no se envian datos a ningun servidor. WhatsApp, email o compartir solo se usan cuando se pulsa expresamente el boton correspondiente.
