/* Configuracion personal: no se inventan datos de contacto. */
const CONFIG = {
  whatsappNumber: "",
  emailAddress: "",
  fatherName: ""
};

const STORAGE_PREFIX = "entrenamiento-padre-v2";
const LEGACY_PREFIX = "entrenamiento-padre-v1";
const STORAGE_VERSION = 3;
const state = {
  plan: null,
  recommendation: null,
  selectedIndex: null,
  records: {},
  session: {},
  warmup: {},
  completed: false,
  legacyKeys: []
};
const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const [plan, recommendation] = await Promise.all([
      loadJSON("plan.json"),
      loadJSON("recommendation.json")
    ]);
    validatePlan(plan, recommendation);
    state.plan = plan;
    state.recommendation = recommendation;
    state.legacyKeys = findLegacyKeys();
    state.selectedIndex = getInitialDay();
    bindStaticEvents();
    renderDayPicker();
    render();
    renderLegacyNotice();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js").catch(() => {});
  } catch (error) {
    $("main").innerHTML = `<section class="rest-card"><h2>No se pudo cargar el plan</h2><p>Comprueba que la web se abre desde un servidor local o web. Detalle: ${escapeHTML(error.message)}</p></section>`;
  }
}

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.json();
}

function validatePlan(plan, recommendation) {
  if (!Array.isArray(plan.days) || plan.days.length !== 5) throw new Error("plan.json debe contener cinco dias");
  const exercises = plan.days.flatMap((day) => day.exercises || []);
  if (exercises.length !== 20 || new Set(exercises.map((exercise) => exercise.id)).size !== 20) {
    throw new Error("plan.json debe contener 20 ejercicios con IDs unicos");
  }
  for (const day of plan.days) {
    for (const exercise of day.exercises) {
      if (!recommendation.days?.[day.id]?.exercises?.[exercise.id]) {
        throw new Error(`Falta recomendacion para ${exercise.id}`);
      }
    }
  }
}

function bindStaticEvents() {
  $("#previous-day").addEventListener("click", () => selectDay(state.selectedIndex <= 0 ? 4 : state.selectedIndex - 1));
  $("#next-day").addEventListener("click", () => selectDay(state.selectedIndex < 0 || state.selectedIndex >= 4 ? 0 : state.selectedIndex + 1));
  $("#today-button").addEventListener("click", () => selectDay(getInitialDay()));
  $("#finish-button").addEventListener("click", finishSession);
  $("#copy-button").addEventListener("click", copySummary);
  $("#whatsapp-button").addEventListener("click", sendWhatsApp);
  $("#email-button").addEventListener("click", sendEmail);
  $("#share-button").addEventListener("click", shareSummary);
  $("#export-button").addEventListener("click", exportData);
  $("#clear-button").addEventListener("click", clearDay);
  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleInput);
  document.addEventListener("click", handleAction);
}

function getInitialDay() {
  const day = new Date().getDay();
  return day >= 1 && day <= 5 ? day - 1 : -1;
}

function getMonday(date = new Date()) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = monday.getDay() || 7;
  monday.setDate(monday.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function dateKey(date = getMonday()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function recommendationWeek() {
  return state.recommendation?.weekStart || dateKey();
}

function parseDateKey(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function weekLabel() {
  const monday = parseDateKey(recommendationWeek());
  const friday = new Date(monday);
  friday.setDate(friday.getDate() + 4);
  return `Semana recomendada del ${formatDate(monday)} al ${formatDate(friday)}`;
}

function storageKey(dayId) {
  return `${STORAGE_PREFIX}:${recommendationWeek()}:${dayId}`;
}

function recommendationFor(dayId, exerciseId) {
  return state.recommendation.days?.[dayId]?.exercises?.[exerciseId] || { series: [] };
}

function blankRecord(exercise) {
  const planned = recommendationFor(state.plan.days[state.selectedIndex]?.id, exercise.id);
  return {
    series: planned.series.map(() => ({ weight: "", reps: "" })),
    rir: "",
    feeling: "",
    discomfort: "",
    lumbarPain: ""
  };
}

function normalizeRecord(exercise, saved) {
  const blank = blankRecord(exercise);
  if (!saved) return blank;
  const series = Array.isArray(saved.series)
    ? saved.series.map((set) => ({ weight: set.weight ?? "", reps: set.reps ?? "" }))
    : blank.series;
  return {
    ...blank,
    ...saved,
    series,
    rir: saved.rir ?? "",
    feeling: saved.feeling ?? "",
    discomfort: saved.discomfort ?? "",
    lumbarPain: saved.lumbarPain ?? ""
  };
}

function loadDay(index) {
  const day = state.plan.days[index];
  const saved = readStorage(storageKey(day.id));
  state.records = Object.fromEntries(day.exercises.map((exercise) => [exercise.id, normalizeRecord(exercise, saved?.records?.[exercise.id])]));
  state.session = saved?.session || { status: "normal", painStart: "", painEnd: "", painNext: "", comments: "" };
  state.warmup = saved?.warmup || {};
  state.completed = Boolean(saved?.completed);
}

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function saveDay() {
  if (state.selectedIndex < 0) return;
  const day = state.plan.days[state.selectedIndex];
  localStorage.setItem(storageKey(day.id), JSON.stringify({
    version: STORAGE_VERSION,
    weekStart: recommendationWeek(),
    day: day.id,
    records: state.records,
    session: state.session,
    warmup: state.warmup,
    completed: state.completed,
    updatedAt: new Date().toISOString()
  }));
  showSaveStatus();
}

function showSaveStatus() {
  const status = $("#save-status");
  status.textContent = "✓ Guardado automáticamente";
  clearTimeout(showSaveStatus.timer);
  showSaveStatus.timer = setTimeout(() => { status.textContent = "✓ Guardado"; }, 1600);
}

function selectDay(index) {
  state.selectedIndex = index;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDayPicker() {
  $("#day-picker").innerHTML = state.plan.days.map((day, index) => `<button class="day-tab" type="button" role="tab" aria-selected="false" data-day-index="${index}">${escapeHTML(day.label)}</button>`).join("");
}

function render() {
  $("#week-label").textContent = weekLabel();
  const isRest = state.selectedIndex < 0;
  $("#session-section").classList.toggle("hidden", isRest);
  $("#workout-section").classList.toggle("hidden", isRest);
  $("#warmup-section").classList.toggle("hidden", isRest);
  $("#rest-day").classList.toggle("hidden", !isRest);
  if (isRest) {
    $("#day-label").textContent = "FIN DE SEMANA";
    $("#day-title").textContent = "Descanso o recuperación activa";
    $("#day-focus").textContent = "Consulta cualquier día laborable con los botones de abajo.";
    $("#exercise-count").textContent = "";
    $("#summary-section").classList.add("hidden");
  } else {
    loadDay(state.selectedIndex);
    const day = state.plan.days[state.selectedIndex];
    const warmupDone = state.plan.warmup.steps.every((step) => state.warmup[step.id]);
    $("#workout-section").classList.toggle("hidden", !warmupDone);
    $("#day-label").textContent = day.label.toUpperCase();
    $("#day-title").textContent = day.name;
    $("#day-focus").textContent = day.focus;
    $("#exercise-count").textContent = `${day.exercises.length} ejercicios`;
    $("#recommendation-label").textContent = `Recomendación publicada: ${formatDate(parseDateKey(recommendationWeek()))}`;
    renderWarmup();
    renderSessionFields();
    renderExercises(day);
    renderSummary();
    $("#summary-section").classList.toggle("hidden", !state.completed);
    $("#completion-note").textContent = state.completed ? "✓ Sesión terminada. Los datos siguen guardados." : "";
  }
  [...document.querySelectorAll(".day-tab")].forEach((button, index) => button.setAttribute("aria-selected", String(index === state.selectedIndex)));
}

function renderLegacyNotice() {
  const notice = $("#legacy-notice");
  if (!notice) return;
  notice.classList.toggle("hidden", state.legacyKeys.length === 0);
  notice.textContent = state.legacyKeys.length ? "Hay datos de una versión anterior conservados como legado. Exporta una copia antes de borrar los datos del navegador." : "";
}

function renderWarmup() {
  const steps = state.plan.warmup.steps;
  $("#warmup-list").innerHTML = steps.map((step) => `<div class="warmup-step"><input type="checkbox" id="warmup-${step.id}" data-warmup="${step.id}" ${state.warmup[step.id] ? "checked" : ""}><label for="warmup-${step.id}"><strong>${escapeHTML(step.title)}</strong><span class="warmup-detail">${escapeHTML(step.detail)}</span></label></div>`).join("");
  const done = steps.filter((step) => state.warmup[step.id]).length;
  $("#warmup-status").textContent = `${done}/${steps.length}`;
  $("#warmup-required").classList.toggle("hidden", done === steps.length);
}

function renderSessionFields() {
  document.querySelectorAll("[data-session-field]").forEach((field) => {
    field.value = state.session[field.dataset.sessionField] || "";
  });
}

function renderExercises(day) {
  $("#exercise-list").innerHTML = day.exercises.map((exercise, index) => {
    const recommendation = recommendationFor(day.id, exercise.id);
    const record = state.records[exercise.id] || blankRecord(exercise);
    const sets = record.series.map((set, setIndex) => {
      const planned = recommendation.series[setIndex];
      const plannedText = planned ? `Previsto: ${planned.weight} kg/unidad · ${planned.repsMin}-${planned.repsMax} rep · RIR ${planned.rir}` : "Serie adicional sin previsión";
      return `<div class="set-fields${planned ? "" : " actual-only-set"}"><span class="set-label">Serie ${setIndex + 1}</span><div class="planned-set">${escapeHTML(plannedText)}</div><label>Peso real <span class="unit">kg/unidad</span><input type="text" inputmode="decimal" placeholder="-" data-exercise-id="${exercise.id}" data-field="weight" data-set="${setIndex}" value="${escapeHTML(set.weight)}"></label><label>Repeticiones<input type="number" min="0" inputmode="numeric" placeholder="-" data-exercise-id="${exercise.id}" data-field="reps" data-set="${setIndex}" value="${escapeHTML(set.reps)}"></label><button type="button" class="remove-set-button" data-action="remove-set" data-exercise-id="${exercise.id}" data-set="${setIndex}" aria-label="Eliminar serie ${setIndex + 1}">Quitar</button></div>`;
    }).join("");
    const lumbar = exercise.lumbar ? `<label class="lumbar-field">Dolor lumbar durante <span class="unit">0-10</span><select data-exercise-id="${exercise.id}" data-field="lumbarPain"><option value="">-</option>${painOptions(record.lumbarPain)}</select></label>` : "";
    return `<article class="exercise-card">
      <div class="exercise-title"><span class="exercise-number">${index + 1}.</span><div><h3>${escapeHTML(exercise.name)}</h3><p class="machine-label">Máquina: ${escapeHTML(exercise.machine)}</p></div></div>
      <p class="exercise-target"><span>Objetivo: ${escapeHTML(exercise.setsLabel || exercise.sets)} series × ${escapeHTML(exercise.reps)} rep</span><span>RIR ${escapeHTML(exercise.rir)}</span><span>Descanso ${escapeHTML(exercise.rest)}</span></p>
      ${exercise.setup ? `<p class="setup-note"><strong>Configuración y técnica:</strong> ${escapeHTML(exercise.setup)}</p>` : ""}
      <p class="actual-label">REALIZADO</p>
      <div class="exercise-main-fields"><label>RIR real <span class="unit">repeticiones en reserva</span><select data-exercise-id="${exercise.id}" data-field="rir"><option value="">-</option>${rirOptions(record.rir)}</select></label></div>
      <div class="set-grid">${sets}</div>
      <button type="button" class="add-set-button" data-action="add-set" data-exercise-id="${exercise.id}">+ Añadir serie realizada</button>
      <label>Sensaciones<textarea rows="2" data-exercise-id="${exercise.id}" data-field="feeling" placeholder="Cómodo, difícil, buena máquina...">${escapeHTML(record.feeling)}</textarea></label>
      <div class="quick-buttons">${["👍 Bien", "😐 Normal", "👎 Mal"].map((text) => `<button type="button" class="quick-button${record.feeling === text.slice(2) ? " selected" : ""}" data-action="quick" data-exercise-id="${exercise.id}" data-value="${text.slice(2)}">${text}</button>`).join("")}</div>
      <label>Molestias<textarea rows="2" data-exercise-id="${exercise.id}" data-field="discomfort" placeholder="Ninguna, leve, moderada...">${escapeHTML(record.discomfort)}</textarea></label>
      ${lumbar}
    </article>`;
  }).join("");
}

function painOptions(value) { return Array.from({ length: 11 }, (_, i) => `<option value="${i}"${String(value) === String(i) ? " selected" : ""}>${i}</option>`).join(""); }
function rirOptions(value) { return [0, 1, 2, 3, 4, "5+"].map((i) => `<option value="${i}"${String(value) === String(i) ? " selected" : ""}>${i}</option>`).join(""); }
function escapeHTML(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character])); }

function ensureRecord(exerciseId) {
  const exercise = state.plan.days[state.selectedIndex].exercises.find((item) => item.id === exerciseId);
  state.records[exerciseId] = state.records[exerciseId] || blankRecord(exercise);
  return state.records[exerciseId];
}

function handleInput(event) {
  const field = event.target.dataset.sessionField;
  if (field) { state.session[field] = event.target.value; saveDay(); renderSummary(); return; }
  const warmup = event.target.dataset.warmup;
  if (warmup) { state.warmup[warmup] = event.target.checked; saveDay(); render(); return; }
  const exerciseId = event.target.dataset.exerciseId;
  if (!exerciseId) return;
  const record = ensureRecord(exerciseId);
  const fieldName = event.target.dataset.field;
  if (fieldName === "weight" || fieldName === "reps") record.series[Number(event.target.dataset.set)][fieldName] = event.target.value;
  else record[fieldName] = event.target.value;
  state.records[exerciseId] = record;
  saveDay();
  renderSummary();
}

function handleAction(event) {
  const button = event.target.closest("[data-action], [data-day-index]");
  if (!button) return;
  if (button.dataset.dayIndex !== undefined) { selectDay(Number(button.dataset.dayIndex)); return; }
  const exerciseId = button.dataset.exerciseId;
  const record = ensureRecord(exerciseId);
  if (button.dataset.action === "quick") {
    record.feeling = button.dataset.value;
  } else if (button.dataset.action === "add-set") {
    record.series.push({ weight: "", reps: "" });
  } else if (button.dataset.action === "remove-set") {
    record.series.splice(Number(button.dataset.set), 1);
  }
  state.records[exerciseId] = record;
  saveDay();
  renderExercises(state.plan.days[state.selectedIndex]);
  renderSummary();
}

function sessionSummary() {
  if (state.selectedIndex < 0) return "Hoy no hay entrenamiento.";
  const day = state.plan.days[state.selectedIndex];
  const lines = [`${day.name} - ${formatDate(new Date())}`, `${day.label} | ${day.focus}`, `Recomendación: semana del ${formatDate(parseDateKey(recommendationWeek()))}`, ""];
  day.exercises.forEach((exercise, index) => {
    const recommendation = recommendationFor(day.id, exercise.id);
    const record = state.records[exercise.id] || blankRecord(exercise);
    lines.push(`${index + 1}. ${exercise.name} (${exercise.machine})`);
    const planned = recommendation.series.map((set, setIndex) => `S${setIndex + 1}: ${set.weight} kg/unidad x ${set.repsMin}-${set.repsMax}, RIR ${set.rir}`).join(" | ");
    lines.push(`Previsto: ${planned || "sin previsión"}`);
    const actual = record.series.map((set, setIndex) => set.reps || set.weight ? `S${setIndex + 1}: ${set.weight || "sin peso"} kg/unidad x ${set.reps || "-"}` : "").filter(Boolean).join(" | ");
    lines.push(`Realizado: ${actual || "sin series registradas"} | RIR real ${record.rir || "-"}`);
    lines.push(`Sensaciones: ${record.feeling || "-"} | Molestias: ${record.discomfort || "-"}`);
    if (exercise.lumbar) lines.push(`Dolor lumbar durante: ${record.lumbarPain === "" ? "-" : `${record.lumbarPain}/10`}`);
    lines.push("");
  });
  lines.push(`Dolor lumbar al empezar: ${state.session.painStart === "" ? "-" : `${state.session.painStart}/10`}`);
  lines.push(`Dolor lumbar al terminar: ${state.session.painEnd === "" ? "-" : `${state.session.painEnd}/10`}`);
  lines.push(`Dolor lumbar al día siguiente: ${state.session.painNext === "" ? "pendiente" : `${state.session.painNext}/10`}`);
  const warmupDone = state.plan.warmup.steps.every((step) => state.warmup[step.id]);
  lines.push(`Calentamiento: ${warmupDone ? "completo" : "incompleto"}`);
  lines.push(`Estado: ${state.session.status === "normal" ? "Normal" : state.session.status === "tired" ? "Cansado" : "Muy cansado / con molestias"}`);
  lines.push(`Comentarios: ${state.session.comments || "-"}`);
  return lines.join("\n");
}

function renderSummary() { if (state.selectedIndex >= 0) $("#summary-text").textContent = sessionSummary(); }

function finishSession() {
  if (!state.plan.warmup.steps.every((step) => state.warmup[step.id])) {
    $("#warmup-required").scrollIntoView({ behavior: "smooth" });
    return;
  }
  state.completed = true;
  saveDay();
  renderSummary();
  $("#completion-note").textContent = "✓ Sesión terminada. Los datos siguen guardados.";
  $("#summary-section").classList.remove("hidden");
  $("#summary-section").scrollIntoView({ behavior: "smooth" });
}

async function copySummary() { await copyText(sessionSummary()); showActionMessage("Resumen copiado"); }
async function copyText(text) { if (navigator.clipboard) return navigator.clipboard.writeText(text); const area = document.createElement("textarea"); area.value = text; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); }
function showActionMessage(message) { const status = $("#save-status"); status.textContent = `✓ ${message}`; setTimeout(() => { status.textContent = "✓ Guardado"; }, 1800); }
function sendWhatsApp() { const number = CONFIG.whatsappNumber.replace(/\D/g, ""); window.open(`https://wa.me/${number}?text=${encodeURIComponent(sessionSummary())}`, "_blank", "noopener"); }
function sendEmail() { window.location.href = `mailto:${CONFIG.emailAddress}?subject=${encodeURIComponent(`Entrenamiento ${state.plan.days[state.selectedIndex].name}`)}&body=${encodeURIComponent(sessionSummary())}`; }
async function shareSummary() { try { await navigator.share({ title: "Entrenamiento", text: sessionSummary() }); } catch (error) { if (error.name !== "AbortError") showActionMessage("No se pudo compartir"); } }

function findLegacyKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`${LEGACY_PREFIX}:`)) keys.push(key);
  }
  return keys;
}

function allStoredData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("entrenamiento-padre-")) data[key] = readStorage(key);
  }
  return data;
}

function exportData() {
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), recommendation: state.recommendation, records: allStoredData() }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `entrenamientos-${recommendationWeek()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function clearDay() {
  if (!confirm("¿Seguro que quieres borrar los datos de esta sesión?\n\nEsta acción no se puede deshacer.")) return;
  localStorage.removeItem(storageKey(state.plan.days[state.selectedIndex].id));
  render();
  showActionMessage("Datos borrados");
}

function updateShareButton() { $("#share-button").classList.toggle("hidden", !(navigator.share)); }
updateShareButton();
