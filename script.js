const distance = document.getElementById("distance");
const distanceValue = document.getElementById("distanceValue");
const meterFill = document.getElementById("meterFill");
const adcValue = document.getElementById("adcValue");
const deltaValue = document.getElementById("deltaValue");
const outputValue = document.getElementById("outputValue");

const stateLabel = document.getElementById("stateLabel");
const stateName = document.getElementById("stateName");
const stateDesc = document.getElementById("stateDesc");

const buzzer = document.getElementById("buzzer");
const themeBtn = document.getElementById("themeBtn");

const blueDot = document.querySelectorAll(".blue");
const greenDot = document.querySelectorAll(".green");
const redDot = document.querySelectorAll(".red");

const box0 = document.getElementById("box0");
const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");

const exampleTitle = document.getElementById("exampleTitle");
const exampleText = document.getElementById("exampleText");
const exampleList = document.getElementById("exampleList");
const exampleVisual = document.getElementById("exampleVisual");
const exampleControls = document.getElementById("exampleControls");

const examples = {
  celular: {
    title: "Pantalla táctil capacitiva",
    text: "El dedo cambia el campo eléctrico en la superficie del panel.",
    items: [
      "Se detecta una variación del campo eléctrico.",
      "El contacto genera una respuesta inmediata.",
      "Es la misma idea básica que usa tu proyecto."
    ],
    controls: `
      <button class="small-btn" data-action="touch">Tocar pantalla</button>
      <button class="small-btn" data-action="clear">Limpiar</button>
    `,
    visual: `
      <div class="screen" id="screenDemo">
        <div class="finger" id="fingerDemo" style="display:none;"></div>
        <div class="touch-point" id="touchPointDemo" style="display:none;"></div>
      </div>
    `
  },
  puerta: {
    title: "Puerta automática",
    text: "Un sensor detecta la cercanía y abre la puerta sin contacto físico.",
    items: [
      "Detecta proximidad sin tocar.",
      "Activa una acción automática.",
      "Se usa en tiendas, bancos y edificios."
    ],
    controls: `
      <button class="small-btn" data-action="approach">Acercarse</button>
      <button class="small-btn" data-action="open">Abrir</button>
      <button class="small-btn" data-action="close">Cerrar</button>
    `,
    visual: `
      <div style="position:relative;">
        <div class="door-wrap">
          <div class="door left" id="doorLeft"></div>
          <div class="door right" id="doorRight"></div>
        </div>
        <div class="person" id="personDemo"></div>
      </div>
    `
  },
  boton: {
    title: "Botón táctil",
    text: "El toque en la superficie activa una función sin mecanismo mecánico.",
    items: [
      "No necesita una pieza mecánica.",
      "Es más moderno y fácil de limpiar.",
      "Se usa en ascensores, cocinas y paneles."
    ],
    controls: `
      <button class="small-btn" data-action="press">Pulsar</button>
      <button class="small-btn" data-action="release">Soltar</button>
    `,
    visual: `
      <div class="button-device">
        <div class="cap-button" id="capButton">Tocar</div>
      </div>
    `
  },
  nivel: {
    title: "Sensor de nivel de líquido",
    text: "Detecta cambios capacitivos para saber si un tanque está vacío, medio o lleno.",
    items: [
      "Mide la presencia de líquido o material.",
      "Sirve en tanques y procesos industriales.",
      "Aplica el mismo principio eléctrico."
    ],
    controls: `
      <button class="small-btn" data-action="low">Bajo</button>
      <button class="small-btn" data-action="mid">Medio</button>
      <button class="small-btn" data-action="high">Alto</button>
    `,
    visual: `
      <div class="tank">
        <div class="tank-fill" id="tankFill"></div>
      </div>
    `
  },
  industria: {
    title: "Aplicación industrial",
    text: "Los sensores capacitivos detectan presencia y ayudan a automatizar procesos.",
    items: [
      "Automatización industrial.",
      "Control de presencia en línea de producción.",
      "Reduce errores y mejora eficiencia."
    ],
    controls: `
      <button class="small-btn" data-action="factory1">Pieza 1</button>
      <button class="small-btn" data-action="factory2">Pieza 2</button>
      <button class="small-btn" data-action="factory3">Pieza 3</button>
    `,
    visual: `
      <div class="factory" id="factoryDemo">
        <div class="factory-box" style="background:#3b82f6;"></div>
        <div class="factory-box" style="background:#22c55e;"></div>
        <div class="factory-box" style="background:#ef4444;"></div>
      </div>
    `
  }
};

let selectedExample = "celular";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getState(cm) {
  if (cm > 30) return 0;
  if (cm > 5) return 1;
  return 2;
}

function adcFromDistance(cm) {
  const base = 512;
  const delta = Math.round((100 - cm) * 1.8);
  return clamp(base + delta, 0, 1023);
}

function updateSimulator() {
  const cm = Number(distance.value);
  const state = getState(cm);
  const adc = adcFromDistance(cm);
  const delta = Math.abs(adc - 512);

  const labels = {
    0: { name: "Campo débil", desc: "Objeto lejos del sensor. La señal se mantiene estable.", out: "Sin sonido" },
    1: { name: "Campo medio", desc: "Objeto cerca del sensor. Se activa la respuesta intermedia.", out: "600 Hz" },
    2: { name: "Campo alto", desc: "Objeto muy cerca o en contacto. La respuesta es máxima.", out: "1500 Hz" }
  };

  distanceValue.textContent = `${cm} cm`;
  adcValue.textContent = adc;
  deltaValue.textContent = delta;
  outputValue.textContent = labels[state].out;

  meterFill.style.width = `${100 - cm}%`;
  stateLabel.textContent = `Estado ${state}`;
  stateName.textContent = labels[state].name;
  stateDesc.textContent = labels[state].desc;

  blueDot.forEach(el => el.classList.toggle("active", state === 0));
  greenDot.forEach(el => el.classList.toggle("active", state === 1));
  redDot.forEach(el => el.classList.toggle("active", state === 2));

  box0.classList.toggle("active", state === 0);
  box1.classList.toggle("active", state === 1);
  box2.classList.toggle("active", state === 2);

  buzzer.classList.toggle("active", state !== 0);
}

function renderExample(key) {
  selectedExample = key;
  const data = examples[key];

  exampleTitle.textContent = data.title;
  exampleText.textContent = data.text;
  exampleList.innerHTML = data.items.map(item => `<li>${item}</li>`).join("");
  exampleControls.innerHTML = data.controls;
  exampleVisual.innerHTML = data.visual;

  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.example === key));

  wireExampleEvents();
}

function wireExampleEvents() {
  const actions = exampleControls.querySelectorAll("[data-action]");

  actions.forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;

      if (selectedExample === "celular") {
        const finger = document.getElementById("fingerDemo");
        const touchPoint = document.getElementById("touchPointDemo");
        if (action === "touch") {
          finger.style.display = "block";
          touchPoint.style.display = "block";
        }
        if (action === "clear") {
          finger.style.display = "none";
          touchPoint.style.display = "none";
        }
      }

      if (selectedExample === "puerta") {
        const left = document.getElementById("doorLeft");
        const right = document.getElementById("doorRight");
        const person = document.getElementById("personDemo");
        if (action === "approach" || action === "open") {
          left.classList.add("open");
          right.classList.add("open");
          person.style.bottom = "55px";
        }
        if (action === "close") {
          left.classList.remove("open");
          right.classList.remove("open");
          person.style.bottom = "18px";
        }
      }

      if (selectedExample === "boton") {
        const capButton = document.getElementById("capButton");
        if (action === "press") capButton.classList.add("on");
        if (action === "release") capButton.classList.remove("on");
      }

      if (selectedExample === "nivel") {
        const tankFill = document.getElementById("tankFill");
        if (action === "low") tankFill.style.height = "20%";
        if (action === "mid") tankFill.style.height = "55%";
        if (action === "high") tankFill.style.height = "85%";
      }

      if (selectedExample === "industria") {
        const factory = document.getElementById("factoryDemo");
        const boxes = factory.querySelectorAll(".factory-box");
        boxes.forEach((box, index) => {
          box.style.transform = action === `factory${index + 1}` ? "scale(1.2)" : "scale(1)";
          box.style.boxShadow = action === `factory${index + 1}` ? "0 0 20px rgba(255,255,255,.15)" : "none";
        });
      }
    });
  });
}

distance.addEventListener("input", updateSimulator);

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark")
    ? "Modo claro"
    : "Modo oscuro";
});

document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.scroll);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    renderExample(tab.dataset.example);
  });
});

renderExample("celular");
updateSimulator();