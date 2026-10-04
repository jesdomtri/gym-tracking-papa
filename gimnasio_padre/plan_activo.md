# Plan activo

**Version:** 1.0 - ejercicios y maquinas fijos
**Pesos:** la recomendacion semanal se publica en `website/recommendation.json`; los pesos reales se registran en la web y en el historial.
**Duracion objetivo:** 45-60 minutos por sesion

La web es una aplicacion estatica. Este documento define los ejercicios, maquinas, rangos, RIR y reglas estables. La recomendacion concreta de peso, series y repeticiones se revisa manualmente despues de recibir el informe del cliente y se publica por separado cada semana.

## Reglas comunes

- Completar el calentamiento general y las series de aproximacion antes del trabajo efectivo.
- Usar el peso y el rango de repeticiones publicados para cada serie.
- El cliente puede bajar o subir el peso, hacer menos o mas series y cambiar las repeticiones si su estado lo exige; debe registrar lo realizado.
- El RIR es un limite de esfuerzo: detener la serie cuando se alcance el RIR indicado aunque no se haya llegado al maximo de repeticiones.
- No se busca el fallo muscular. Si la tecnica se deteriora, detener la serie.
- En dias de trabajo duro, reducir primero accesorios y despues series; no compensar una sesion perdida acumulando volumen.
- Registrar peso, repeticiones, RIR real, sensaciones, molestias y dolor lumbar.
- Revisar la respuesta al dia siguiente antes de publicar una subida de peso.
- La web no diagnostica dolor. Ante dolor intenso, persistente, progresivo o sintomas neurologicos, detener la actividad y buscar valoracion profesional.

## Calentamiento

1. Unos 5 minutos de bicicleta, cinta o eliptica a intensidad baja o moderada.
2. 2-3 minutos de movimientos generales sencillos.
3. Series de aproximacion con poca carga y pocas repeticiones, sin cansarse.

## Dia 1 - Empuje

| ID | Ejercicio | Maquina | Series | Repeticiones | RIR | Descanso |
|---|---|---|---:|---:|---:|---:|
| `push-bench-impulse` | Press banca en maquina Impulse | Impulse | 2-3 | 5-8 | 3-4 | 2-3 min |
| `push-shoulder-titan` | Press militar en maquina Titan | Titan | 2 | 6-10 | 3 | 2 min |
| `push-fly` | Aperturas | Maquina de aperturas | 1-2 | 8-12 | 3 | 90-120 s |
| `push-triceps-cable-z` | Empujon hacia abajo con polea y barra Z para triceps | Polea con barra Z | 1-2 | 10-15 | 2-3 | 90 s |

## Dia 2 - Tiron

| ID | Ejercicio | Maquina | Series | Repeticiones | RIR | Descanso |
|---|---|---|---:|---:|---:|---:|
| `pull-lat-flex` | Jalon al pecho en maquina Flex | Flex | 2-3 | 5-8 | 3-4 | 2-3 min |
| `pull-row-dhz` | Remo con agarre prono en maquina Dhz | Dhz | 2-3 | 6-10 | 3 | 2 min |
| `pull-rear-delt-impulse` | Mariposas para hombro posterior en maquina Impulse | Impulse | 1-2 | 10-15 | 3 | 90 s |
| `pull-biceps-impulse` | Curl de biceps en maquina Impulse | Impulse | 1-2 | 10-15 | 2-3 | 90 s |

## Dia 3 - Piernas A

| ID | Ejercicio | Maquina | Series | Repeticiones | RIR | Descanso |
|---|---|---|---:|---:|---:|---:|
| `legs-a-hack-dhz` | Sentadilla jaca en maquina Dhz | Dhz | 2-3 | 5-8 | 3-4 | 2-3 min |
| `legs-a-hip-thrust-dhz` | Hip Thrust en maquina Dhz | Dhz | 2 | 8-12 | 3-4 | 2 min |
| `legs-a-calf` | Gemelos en maquina | Maquina de gemelos | 1-2 | 10-15 | 3 | 90 s |
| `legs-a-hanging-ab` | Abdomen colgado de la barra | Barra | 1-2 | 8-12 o 20-30 s | 3 | 60-90 s |

## Dia 4 - Torso

| ID | Ejercicio | Maquina | Series | Repeticiones | RIR | Descanso |
|---|---|---|---:|---:|---:|---:|
| `torso-incline-impulse` | Press banca inclinado en maquina Impulse | Impulse | 2 | 6-10 | 3 | 2 min |
| `torso-row-titan` | Remo en maquina Titan | Titan | 2 | 6-10 | 3 | 2 min |
| `torso-lateral-dhz` | Vuelos laterales en maquina Dhz | Dhz | 2 | 8-12 | 3 | 2 min |
| `torso-overhead-triceps` | Polea sin agarre por encima de la cabeza para triceps | Polea | 1-2 | 10-15 | 3 | 90 s |

## Dia 5 - Piernas B

| ID | Ejercicio | Maquina | Series | Repeticiones | RIR | Descanso |
|---|---|---|---:|---:|---:|---:|
| `legs-b-press-dhz` | Prensa Dhz | Dhz | 2-3 | 6-10 | 3-4 | 2-3 min |
| `legs-b-leg-curl-impulse` | Curl femoral en maquina Impulse | Impulse | 2 | 8-12 | 3-4 | 2 min |
| `legs-b-back-extension-dhz` | Extension lumbar en maquina Dhz | Dhz | 1-2 | 8-12 | 4 | 2 min |
| `legs-b-pallof` | Pallof Press (Abdomen) | Polea | 1-2 | 8-12 o 20-30 s | 3 | 60-90 s |

## Publicacion semanal

1. Recibir el resumen del cliente por WhatsApp.
2. Revisar peso, repeticiones, RIR real, sensaciones, molestias y respuesta posterior.
3. Actualizar manualmente `website/recommendation.json` con la semana siguiente.
4. Mantener `website/plan.json` sin pesos reales: solo cambia si cambia el ejercicio fijo, la maquina o las reglas.
5. Incrementar la version de cache del service worker al publicar cambios web.

La progresion automatica no forma parte de esta version. La recomendacion la valida y publica el entrenador.
