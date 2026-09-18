# Web de seguimiento

Aplicacion estatica para mostrar los cinco dias de ejercicios y maquinas fijos, publicar la recomendacion semanal del entrenador y registrar localmente lo que el cliente realiza. No usa frameworks, backend, analytics ni trackers.

## Abrirla

Desde la carpeta `website/`, usar un servidor estatico, por ejemplo:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. No abrir `index.html` con doble clic: la aplicacion carga `plan.json` y `recommendation.json` mediante `fetch`. El service worker y el modo sin conexion requieren HTTPS o `localhost`.

## Datos publicados

- `plan.json` contiene los ejercicios fijos, sus IDs, maquinas, rangos, RIR, descansos, calentamiento y notas de configuracion. No contiene pesos reales.
- `recommendation.json` contiene la recomendacion actual publicada por el entrenador: semana, series, peso previsto por serie, rango de repeticiones y RIR.
- Para preparar la siguiente semana, revisar el resumen recibido por WhatsApp y editar manualmente `recommendation.json`. No se importan mensajes de WhatsApp ni se calcula progresion automaticamente.
- Si cambia un ejercicio fijo, conservar su ID solo si sigue siendo el mismo ejercicio; una sustitucion requiere un nuevo ID y revision de los datos historicos.

## Uso del cliente

1. La pantalla muestra automaticamente el dia actual de lunes a viernes.
2. Antes de los ejercicios aparece el calentamiento obligatorio en tres pasos.
3. Cada tarjeta muestra la maquina, la configuracion, los valores previstos y los campos de realizado.
4. El cliente puede introducir un peso distinto, menos o mas repeticiones y menos o mas series. Las series extra no tienen un objetivo previsto inventado.
5. Los campos y el calentamiento se guardan automaticamente en `localStorage`, separados por semana y por ID de ejercicio.
6. `Terminar entrenamiento` muestra un resumen que distingue lo previsto de lo realizado.
7. El resumen puede copiarse, compartirse, enviarse por WhatsApp o email.

## Datos locales y exportacion

La web no envia los registros a ningun servidor. El historial permanece en el navegador y se conserva al publicar una nueva recomendacion semanal porque cada semana tiene una clave distinta. `Exportar datos` descarga una copia JSON de todas las semanas y de los datos antiguos conservados.

Los registros nuevos usan un formato versionado e IDs estables. Los datos de la version anterior se conservan como legado y no se reasignan automaticamente si su correspondencia no es segura. Exportar antes de borrar los datos del navegador.

## Configuracion personal

Los datos personales solo se modifican al principio de `app.js`:

```js
const CONFIG = {
  whatsappNumber: "",
  emailAddress: "",
  fatherName: ""
};
```

No inventar ni publicar numeros, correos o nombres por defecto.

## Mantenimiento

- Comportamiento y almacenamiento: `app.js`.
- Ejercicios fijos y reglas: `plan.json`, sincronizado con `../gimnasio_padre/plan_activo.md`.
- Recomendacion semanal: `recommendation.json`, revisada manualmente a partir del informe del cliente.
- Aspecto visual: `style.css`.
- Archivos offline: lista `FILES` de `service-worker.js`; incrementar `CACHE_NAME` despues de cambiar cualquier asset publicado.
- Los archivos Markdown de `../gimnasio_padre/` son el registro documental del entrenador. La web no los modifica.
