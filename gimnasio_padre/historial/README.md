# Historial semanal

Guardar un archivo Markdown inmutable por cada semana natural de entrenamiento (de lunes a domingo). El nombre contiene la fecha del lunes para que las semanas se ordenen cronologicamente:

```text
semana_2026-09-07.md
semana_2026-09-14.md
semana_2026-09-21.md
```

Cada archivo incluye la fecha de cada sesion y conserva lo recibido: recomendacion prevista, pesos y repeticiones reales, RIR, descansos, estado, sensaciones, molestias, configuraciones de maquina, dolor lumbar, comentarios y campos pendientes. No inferir datos omitidos ni corregir valores en la transcripcion. Si una sesion no se hizo y esta confirmado, indicarlo; la ausencia de un mensaje no basta para concluirlo. Los valores dudosos permanecen en el historico aunque el entrenador decida excluirlos de la progresion.

Usar `../semana_actual.md` como plantilla de trabajo para resumir la semana y la decision de la siguiente recomendacion. Al cerrar la semana, incorporar la informacion recibida al fichero fechado correspondiente. Nunca sobrescribir un historico; si hay que corregir una transcripcion, dejar constancia de la correccion.

La web mantiene el historial en `localStorage` y permite exportarlo como JSON. Este directorio es el archivo documental oficial del entrenador; la web no escribe en el repositorio.

Para preparar la siguiente semana, comparar el mismo ID y la misma maquina, conservar el rango de repeticiones y revisar tecnica, RIR, fatiga y respuesta del dia siguiente. En doble progresion, subir carga cuando todas las series previstas y validas alcanzan el maximo; si un resultado fiable queda por debajo del minimo, revisar una reduccion. Los datos desconocidos o excluidos no deciden la carga. La recomendacion se revisa y publica manualmente en `website/recommendation.json`; no se calcula automaticamente.
