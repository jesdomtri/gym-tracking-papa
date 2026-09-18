# Sistema de entrenamiento de gimnasio

Sistema para planificar, entrenar, registrar, analizar y ajustar el entrenamiento a largo plazo. La web muestra los ejercicios fijos y la recomendacion semanal publicada por el entrenador; el cliente registra los datos reales en su navegador y envia el resumen por WhatsApp.

> Este documento organiza el entrenamiento, pero no diagnostica ni trata el dolor. Si existe duda sobre la seguridad de entrenar, conviene consultar con un profesional sanitario.

## Fuentes y flujo de trabajo

1. `plan_activo.md` define los 20 ejercicios, maquinas, rangos, RIR, descansos y reglas estables.
2. `website/plan.json` es la copia estructurada del plan fijo. No contiene pesos reales.
3. `website/recommendation.json` contiene la recomendacion de peso, series, repeticiones y RIR de la semana publicada.
4. El cliente registra el resultado real en la web. Los datos se guardan en `localStorage` y se pueden exportar.
5. El cliente envia el resumen terminado por WhatsApp.
6. El entrenador revisa el informe y publica manualmente la siguiente recomendacion.
7. Al cerrar la semana, se copia `semana_actual.md` a `historial/` con el siguiente numero libre. Nunca se sobrescribe una semana anterior.

La web no modifica estos archivos Markdown. La carpeta `evaluaciones/` puede contener revisiones cada 4-6 semanas o cuando exista un cambio relevante.

## Objetivo y recuperacion

El objetivo es desarrollar fuerza de forma gradual, aprender los movimientos y mantener una rutina sostenible. El trabajo diario cuenta como carga fisica real, especialmente para piernas, espalda baja, cadera y agarre.

- Cinco visitas no significan cinco sesiones duras.
- En dias cansados se reducen primero accesorios y despues series.
- No se compensa una sesion perdida acumulando volumen.
- No se programa el fallo muscular.
- La comodidad, la tecnica y la tolerancia tienen prioridad sobre subir peso.

## Calentamiento

- Unos 5 minutos de bicicleta, cinta o eliptica a intensidad baja o moderada.
- 2-3 minutos de movimientos generales sencillos.
- Series de aproximacion con poca carga y pocas repeticiones, aumentando gradualmente sin cansarse.
- Si el calentamiento empeora una molestia, se detiene y se reevalua.

## RIR

RIR significa repeticiones en reserva: cuantas repeticiones buenas quedarian antes de que la tecnica se deteriore o no se pudiera completar otra repeticion.

- RIR 4: quedarian unas cuatro repeticiones buenas.
- RIR 3: quedarian unas tres.
- RIR 2: quedarian unas dos.
- RIR 0: seria el fallo y no es el objetivo habitual.

El cliente debe detener la serie cuando alcance el RIR previsto aunque no haya llegado al maximo del rango. Si la tecnica empeora, la serie termina antes.

## Dolor y respuesta

Registrar dolor lumbar de 0 a 10 antes, durante, despues y al dia siguiente. El numero sirve para detectar patrones, no para diagnosticar.

Si la molestia aumenta claramente, cambia la forma de moverse, irradia, persiste o empeora al dia siguiente, no se publica una subida de carga hasta revisar el caso. Detener la actividad y buscar valoracion profesional si el dolor es intenso, persistente o progresivo, si aparecen sintomas neurologicos, dolor toracico, falta de aire anormal, mareo intenso u otros sintomas preocupantes.

## Progresion manual

La progresion se revisa normalmente cada 2-3 semanas. El entrenador compara sesiones del mismo ID de ejercicio y considera:

- Repeticiones realizadas frente al rango previsto.
- RIR real frente al objetivo.
- Tecnica y sensaciones.
- Estado de fatiga.
- Molestias y respuesta del dia siguiente.

El entrenador puede subir, mantener o bajar peso, series y repeticiones en `website/recommendation.json`. La web no calcula ni publica progresiones automaticamente.

## Biblioteca de apoyo

Los documentos de `ejercicios/` explican la tecnica y las precauciones de los patrones relacionados. No representan alternativas seleccionables en la web: los ejercicios y maquinas del plan activo son fijos.
