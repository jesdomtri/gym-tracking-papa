/* Configuracion personal: no se inventan datos de contacto. */
const CONFIG = {
  whatsappNumber: "",
  emailAddress: "",
  fatherName: ""
};

const STORAGE_PREFIX = "entrenamiento-padre-v1";
const state = { plan: null, selectedIndex: null, records: {}, session: {}, warmup: {}, completed: false };
const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const response = await fetch("plan.json");
    if (!response.ok) throw new Error("No se pudo cargar plan.json");
    state.plan = await response.json();
    state.selectedIndex = getInitialDay();
    bindStaticEvents();
    renderDayPicker();
    render();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js").catch(() => {});
  } catch (error) {
    $("main").innerHTML = `<section class="rest-card"><h2>No se pudo cargar el plan</h2><p>Comprueba que la web se abre desde un servidor local o web. Detalle: ${error.message}</p></section>`;
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
  document.addEventListener("click", handleQuickButton);
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
  return date.toISOString().slice(0, 10);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function weekLabel() {
  const monday = getMonday();
  const friday = new Date(monday);
  friday.setDate(friday.getDate() + 4);
  return `Semana del ${formatDate(monday)} al ${formatDate(friday)}`;
}

function storageKey(index) {
  return `${STORAGE_PREFIX}:${dateKey()}:${state.plan.days[index].id}`;
}

function blankRecord(exercise) {
  return { weight: "", reps: Array(exercise.sets).fill(""), rir: "", feeling: "", discomfort: "", lumbarPain: "" };
}

function loadDay(index) {
  const saved = JSON.parse(localStorage.getItem(storageKey(index)) || "null");
  state.records = Object.fromEntries(state.plan.days[index].exercises.map((exercise, i) => [i, { ...blankRecord(exercise), ...(saved?.records?.[i] || {}), reps: Array.from({ length: exercise.sets }, (_, setIndex) => saved?.records?.[i]?.reps?.[setIndex] || "") }]));
  state.session = saved?.session || { status: "normal", painStart: "", painEnd: "", painNext: "", comments: "" };
  state.warmup = saved?.warmup || {};
  state.completed = Boolean(saved?.completed);
}

function saveDay() {
  if (state.selectedIndex < 0) return;
  localStorage.setItem(storageKey(state.selectedIndex), JSON.stringify({
    version: 1,
    weekStart: dateKey(),
    day: state.plan.days[state.selectedIndex].id,
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
  $("#day-picker").innerHTML = state.plan.days.map((day, index) => `<button class="day-tab" type="button" role="tab" aria-selected="false" data-day-index="${index}">${day.label}</button>`).join("");
  $("#day-picker").addEventListener("click", (event) => {
    const button = event.target.closest("[data-day-index]");
    if (button) selectDay(Number(button.dataset.dayIndex));
  });
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
    renderWarmup();
    renderSessionFields();
    renderExercises(day);
    renderSummary();
    $("#summary-section").classList.toggle("hidden", !state.completed);
    $("#completion-note").textContent = state.completed ? "✓ Sesión terminada. Los datos siguen guardados." : "";
  }
  [...document.querySelectorAll(".day-tab")].forEach((button, index) => button.setAttribute("aria-selected", String(index === state.selectedIndex)));
}

function renderWarmup() {
  const steps = state.plan.warmup.steps;
  $("#warmup-list").innerHTML = steps.map((step) => `<div class="warmup-step"><input type="checkbox" id="warmup-${step.id}" data-warmup="${step.id}" ${state.warmup[step.id] ? "checked" : ""}><label for="warmup-${step.id}"><strong>${step.title}</strong><span class="warmup-detail">${step.detail}</span></label></div>`).join("");
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
    const record = state.records[index] || blankRecord(exercise);
    const sets = Array.from({ length: exercise.sets }, (_, setIndex) => `<label>Serie ${setIndex + 1}<input type="number" min="0" inputmode="numeric" placeholder="-" data-exercise="${index}" data-field="reps" data-set="${setIndex}" value="${escapeHTML(record.reps[setIndex] || "")}"></label>`).join("");
    const lumbar = exercise.lumbar ? `<label class="lumbar-field">Dolor lumbar durante <span class="unit">0-10</span><select data-exercise="${index}" data-field="lumbarPain"><option value="">-</option>${painOptions(record.lumbarPain)}</select></label>` : "";
    return `<article class="exercise-card">
      <div class="exercise-title"><span class="exercise-number">${index + 1}.</span><h3>${exercise.name}</h3>${exercise.optional ? '<span class="optional-tag">Opcional</span>' : ""}</div>
      <p class="programmed"><span>PROGRAMADO</span><span>${exercise.setsLabel || exercise.sets} series × ${exercise.reps} rep</span><span>RIR ${exercise.rir}</span><span>Descanso ${exercise.rest}</span></p>
      <p class="alternatives"><strong>Alternativas:</strong> ${exercise.alternatives}</p>
      ${exercise.note ? `<p class="exercise-note">${exercise.note}</p>` : ""}
      <p class="actual-label">REALIZADO</p>
      <div class="exercise-main-fields"><label>Peso utilizado <span class="unit">kg o unidad</span><input type="text" inputmode="decimal" placeholder="Sin peso" data-exercise="${index}" data-field="weight" value="${escapeHTML(record.weight || "")}"></label><label>RIR real <span class="unit">repeticiones en reserva</span><select data-exercise="${index}" data-field="rir"><option value="">-</option>${rirOptions(record.rir)}</select></label></div>
      <div class="set-grid">${sets}</div>
      <label>Sensaciones<textarea rows="2" data-exercise="${index}" data-field="feeling" placeholder="Cómodo, difícil, buena máquina...">${escapeHTML(record.feeling || "")}</textarea></label>
      <div class="quick-buttons">${["👍 Bien", "😐 Normal", "👎 Mal"].map((text) => `<button type="button" class="quick-button${record.feeling === text.slice(2) ? " selected" : ""}" data-quick="${index}" data-value="${text.slice(2)}">${text}</button>`).join("")}</div>
      <label>Molestias<textarea rows="2" data-exercise="${index}" data-field="discomfort" placeholder="Ninguna, leve, moderada...">${escapeHTML(record.discomfort || "")}</textarea></label>
      ${lumbar}
    </article>`;
  }).join("");
}

function painOptions(value) { return Array.from({ length: 11 }, (_, i) => `<option value="${i}"${String(value) === String(i) ? " selected" : ""}>${i}</option>`).join(""); }
function rirOptions(value) { return [0, 1, 2, 3, 4, "5+"].map((i) => `<option value="${i}"${String(value) === String(i) ? " selected" : ""}>${i}</option>`).join(""); }
function escapeHTML(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character])); }

function handleInput(event) {
  const field = event.target.dataset.sessionField;
  if (field) { state.session[field] = event.target.value; saveDay(); renderSummary(); return; }
  const index = event.target.dataset.exercise;
  const warmup = event.target.dataset.warmup;
  if (warmup) { state.warmup[warmup] = event.target.checked; saveDay(); render(); return; }
  if (index === undefined) return;
  const record = state.records[index] || blankRecord(state.plan.days[state.selectedIndex].exercises[index]);
  const fieldName = event.target.dataset.field;
  if (fieldName === "reps") record.reps[Number(event.target.dataset.set)] = event.target.value;
  else record[fieldName] = event.target.value;
  state.records[index] = record;
  saveDay();
  renderSummary();
}

function handleQuickButton(event) {
  const button = event.target.closest("[data-quick]");
  if (!button) return;
  const index = button.dataset.quick;
  state.records[index] = state.records[index] || blankRecord(state.plan.days[state.selectedIndex].exercises[index]);
  state.records[index].feeling = button.dataset.value;
  saveDay();
  renderExercises(state.plan.days[state.selectedIndex]);
  renderSummary();
}

function sessionSummary() {
  if (state.selectedIndex < 0) return "Hoy no hay entrenamiento programado.";
  const day = state.plan.days[state.selectedIndex];
  const date = formatDate(new Date());
  const lines = [`${day.name} - ${date}`, `${day.label} | ${day.focus}`, ""];
  day.exercises.forEach((exercise, index) => {
    const record = state.records[index] || blankRecord(exercise);
    lines.push(`${index + 1}. ${exercise.name}`);
    lines.push(`Programado: ${exercise.setsLabel || exercise.sets} series x ${exercise.reps}, RIR ${exercise.rir}, descanso ${exercise.rest}`);
    lines.push(`Realizado: ${record.weight ? `${record.weight} kg/unidad` : "sin peso indicado"} | ${record.reps.filter(Boolean).join(" / ") || "sin repeticiones"} | RIR real ${record.rir || "-"}`);
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

function updateShareButton() { $("#share-button").classList.toggle("hidden", !(navigator.share)); }
function allStoredData() { const data = {}; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key?.startsWith(STORAGE_PREFIX)) data[key] = JSON.parse(localStorage.getItem(key)); } return data; }
function exportData() { const blob = new Blob([JSON.stringify(allStoredData(), null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `entrenamientos-${dateKey()}.json`; link.click(); URL.revokeObjectURL(link.href); }
function clearDay() { if (!confirm("¿Seguro que quieres borrar los datos de esta sesión?\n\nEsta acción no se puede deshacer.")) return; localStorage.removeItem(storageKey(state.selectedIndex)); render(); showActionMessage("Datos borrados"); }

updateShareButton();
