window.requestAnimationFrame =
window.__requestAnimationFrame ||
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
(function () {
  return function (callback, element) {
    let lastTime = element.__lastTime || 0;
    let currTime = Date.now();
    let timeToCall = Math.max(1, 33 - (currTime - lastTime));

    window.setTimeout(callback, timeToCall);
    element.__lastTime = currTime + timeToCall;
  };
})();

window.isDevice =
/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
.test(
((navigator.userAgent ||
navigator.vendor ||
window.opera))
.toLowerCase()
);

let loaded = false;

// AUDIO
let analyser = null;
let dataArray = null;

// ===========================
// FUNCIÓN PRINCIPAL
// ===========================
function init() {

  if (loaded) return;
  loaded = true;

  let mobile = window.isDevice;
  let koef = mobile ? 0.5 : 1;

  let canvas =
  document.getElementById('heart');

  let ctx =
  canvas.getContext('2d');

  let width =
  canvas.width =
  koef * innerWidth;

  let height =
  canvas.height =
  koef * innerHeight;

  let rand = Math.random;
// =====================
// ESTRELLAS
// =====================
let stars = [];

for(let i = 0; i < 180; i++){

  stars.push({
    x: rand() * width,
    y: rand() * height,
    radius: rand() * 2,
    alpha: rand(),
    speed: rand() * 0.02 + 0.003,
    pulse: rand() * Math.PI * 2
  });
}

function drawStars(){

  for(let star of stars){

    star.pulse += star.speed;

    let glow =
    0.4 +
    Math.sin(star.pulse) * 0.5;

    ctx.beginPath();

    ctx.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
    `rgba(
      255,
      255,
      255,
      ${glow}
    )`;

    ctx.shadowBlur = 8;
    ctx.shadowColor =
    "rgba(255,255,255,.8)";

    ctx.fill();
  }

  ctx.shadowBlur = 0;
}
  ctx.fillStyle =
  "rgba(0,0,0,1)";

  ctx.fillRect(
    0, 0,
    width,
    height
  );

  let heartPosition =
  function (rad) {

    return [
      Math.pow(
        Math.sin(rad), 3
      ),

      -(
      15 *
      Math.cos(rad)
      - 5 *
      Math.cos(2 * rad)
      - 2 *
      Math.cos(3 * rad)
      - Math.cos(4 * rad)
      )
    ];
  };

  let scaleAndTranslate =
  function (
    pos,
    sx,
    sy,
    dx,
    dy
  ) {

    return [
      dx +
      pos[0] * sx,

      dy +
      pos[1] * sy
    ];
  };

  window.addEventListener(
    'resize',
    function () {

      width =
      canvas.width =
      koef *
      innerWidth;

      height =
      canvas.height =
      koef *
      innerHeight;

      ctx.fillStyle =
      "rgba(0,0,0,1)";

      ctx.fillRect(
        0, 0,
        width,
        height
      );
    }
  );

  let traceCount =
  mobile ? 20 : 50;

  let pointsOrigin = [];
  let i;

  let dr =
  mobile ? 0.3 : 0.1;

  for (
    i = 0;
    i < Math.PI * 2;
    i += dr
  )

  pointsOrigin.push(
    scaleAndTranslate(
      heartPosition(i),
      210,
      13,
      0,
      0
    )
  );

  for (
    i = 0;
    i < Math.PI * 2;
    i += dr
  )

  pointsOrigin.push(
    scaleAndTranslate(
      heartPosition(i),
      150,
      9,
      0,
      0
    )
  );

  for (
    i = 0;
    i < Math.PI * 2;
    i += dr
  )

  pointsOrigin.push(
    scaleAndTranslate(
      heartPosition(i),
      90,
      5,
      0,
      0
    )
  );

  let heartPointsCount =
  pointsOrigin.length;

  let targetPoints = [];

  // =====================
  // PULSO DEL CORAZÓN
  // =====================
  let pulse =
  function (kx, ky) {

    for (
      i = 0;
      i < pointsOrigin.length;
      i++
    ) {

      targetPoints[i] = [];

      targetPoints[i][0] =
      kx *
      pointsOrigin[i][0] +
      width / 2;

      targetPoints[i][1] =
      ky *
      pointsOrigin[i][1] +
      height / 2;
    }
  };

  let e = [];

  for (
    i = 0;
    i < heartPointsCount;
    i++
  ) {

    let x =
    rand() * width;

    let y =
    rand() * height;

    e[i] = {
      vx: 0,
      vy: 0,
      speed:
      rand() + 5,

      q:
      ~~(
      rand() *
      heartPointsCount
      ),

      D:
      2 *
      (i % 2) - 1,

      force:
      0.2 *
      rand() + 0.7,

      f:
      `hsla(
      0,
      ${
      ~~(
      40 *
      rand() + 60
      )
      }%,
      ${
      ~~(
      60 *
      rand() + 20
      )
      }%,
      .3
      )`,

      trace: []
    };

    for (
      let k = 0;
      k < traceCount;
      k++
    ) {

      e[i]
      .trace[k] = {
        x,
        y
      };
    }
  }

  let config = {
    traceK: 0.4
  };

  // =====================
  // AUDIO LEVEL
  // =====================
  function getAudioLevel() {

    if (
      !analyser ||
      !dataArray
    ) {
      return 0;
    }

    analyser
    .getByteFrequencyData(
      dataArray
    );

    let bass = 0;

    for (
      let i = 0;
      i < 20;
      i++
    ) {

      bass +=
      dataArray[i];
    }

    bass /= 20;

    return bass / 255;
  }
// =====================
// MENSAJES BONITOS PRO
// =====================
const mensajes = [
  "Eres mi lugar favorito ❤️",
  "Mi corazón sonríe contigo ✨",
  "Todo es más bonito cuando estás 💕",
  "Qué bonito coincidir contigo 🌹",
  "No sé cómo explicarlo, pero me haces feliz ❤️",
  "Tienes algo que me da paz 💖",
  "Tu sonrisa vale muchísimo ✨",
  "Siempre me alegras el día 💞",
  "Gracias por existir ❤️",
  "Contigo el tiempo se siente bonito 🌙"
];

let textos = [];
let ultimoMensaje = 0;

function crearMensaje() {

  const mobile =
  window.innerWidth < 768;

  textos.push({

    texto:
    mensajes[
      Math.floor(
        Math.random() *
        mensajes.length
      )
    ],

    // centro horizontal
    x:
    width / 2,

    // aparece abajo
    y:
    height + 100,

    opacity: 0,

    scale: 0.9,

    speed:
    mobile ? 0.35 : 0.55,

    life: 0,

    maxLife: 420,

    fontSize:
    mobile ? 22 : 34
  });
}
  // =====================
  // LOOP
  // =====================
  function loop() {

    // AUDIO REACTIVO
    let beat =
    getAudioLevel();

    // Tamaño base
    let scale =
    0.55 +
    beat * 0.25;

    pulse(scale, scale);

    ctx.fillStyle =
    "rgba(0,0,0,.1)";

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    for (
      i = e.length;
      i--;
    ) {

      let u = e[i];
      let q =
      targetPoints[u.q];

      let dx =
      u.trace[0].x -
      q[0];

      let dy =
      u.trace[0].y -
      q[1];

      let length =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

      if (
        length === 0
      )
      length = 1;

      if (
        length < 10
      ) {

        if (
          rand() > 0.95
        ) {

          u.q =
          ~~(
          rand() *
          heartPointsCount
          );

        } else {

          if (
            rand() > 0.99
          ) {
            u.D *= -1;
          }

          u.q += u.D;
          u.q %=
          heartPointsCount;

          if (
            u.q < 0
          ) {

            u.q +=
            heartPointsCount;
          }
        }
      }

      u.vx +=
      -dx /
      length *
      u.speed;

      u.vy +=
      -dy /
      length *
      u.speed;

      u.trace[0].x +=
      u.vx;

      u.trace[0].y +=
      u.vy;

      u.vx *=
      u.force;

      u.vy *=
      u.force;

      for (
        let k = 0;
        k <
        u.trace.length - 1;
      ) {

        let T =
        u.trace[k];

        let N =
        u.trace[++k];

        N.x -=
        config.traceK *
        (N.x - T.x);

        N.y -=
        config.traceK *
        (N.y - T.y);
      }

      ctx.fillStyle =
      u.f;

      for (
        let k = 0;
        k <
        u.trace.length;
        k++
      ) {

        ctx.fillRect(
          u.trace[k].x,
          u.trace[k].y,
          1,
          1
        );
      }
    }

ctx.fillStyle =
"rgba(0,0,0,.18)";

ctx.fillRect(
  0,
  0,
  width,
  height
);
drawStars();
    for (
      i = 0;
      i <
      targetPoints.length;
      i++
    ) {

      ctx.fillRect(
        targetPoints[i][0],
        targetPoints[i][1],
        2,
        2
      );
    }
// =====================
// CREAR MENSAJES
// =====================
ultimoMensaje++;

const intervalo =
window.innerWidth < 768
? 220
: 180;

if (
  ultimoMensaje >
  intervalo
) {

  crearMensaje();
  ultimoMensaje = 0;
}

// =====================
// DIBUJAR MENSAJES
// =====================
ctx.textAlign =
"center";

ctx.textBaseline =
"middle";

for (
  let i =
  textos.length - 1;
  i >= 0;
  i--
) {

  let t = textos[i];

  t.life++;

  // movimiento suave
  t.y -= t.speed;

  // fade in
  if (
    t.life < 60
  ) {

    t.opacity +=
    0.02;

    t.scale +=
    0.002;
  }

  // fade out
  if (
    t.life >
    t.maxLife - 80
  ) {

    t.opacity -=
    0.02;
  }

  ctx.save();

  ctx.translate(
    t.x,
    t.y
  );

  ctx.scale(
    t.scale,
    t.scale
  );

  ctx.globalAlpha =
  Math.max(
    0,
    t.opacity
  );

  ctx.font =
  `300 ${
    t.fontSize
  }px Arial`;

  // glow romántico
  ctx.shadowBlur =
  25;

  ctx.shadowColor =
  "rgba(255,80,140,.8)";

  // degradado bonito
  const gradient =
  ctx.createLinearGradient(
    -150,
    0,
    150,
    0
  );

  gradient
  .addColorStop(
    0,
    "#ff7eb3"
  );

  gradient
  .addColorStop(
    1,
    "#ffd1dc"
  );

  ctx.fillStyle =
  gradient;

  ctx.fillText(
    t.texto,
    0,
    0
  );

  ctx.restore();

  // borrar
  if (
    t.life >
    t.maxLife
  ) {

    textos.splice(
      i,
      1
    );
  }
}
    requestAnimationFrame(
      loop
    );
  }

  loop();
}

// =========================
// BOTÓN + MÚSICA
// =========================
document.addEventListener(
"DOMContentLoaded",
() => {

  const btn =
  document.getElementById(
    "startBtn"
  );

  const screen =
  document.getElementById(
    "startScreen"
  );

  const canvas =
  document.getElementById(
    "heart"
  );

  const music =
  document.getElementById(
    "bgMusic"
  );

btn.addEventListener(
"click",
async () => {

  const cinematic =
  document.getElementById(
    "cinematicText"
  );

  // ocultar pantalla inicial
  screen.style.opacity =
  "0";

  setTimeout(() => {
    screen.style.display =
    "none";
  }, 500);

  // mostrar texto
  cinematic.classList
  .remove("hidden");

  setTimeout(() => {
    cinematic.classList
    .add("show");
  }, 100);

  // esperar unos segundos
  await new Promise(
    resolve =>
    setTimeout(
      resolve,
      3500
    )
  );

  // quitar texto
  cinematic.classList
  .remove("show");

  setTimeout(() => {
    cinematic.style.display =
    "none";
  }, 1500);

  // iniciar música
  music.volume = 0;
  await music.play();

  const audioContext =
  new (
    window.AudioContext ||
    window.webkitAudioContext
  )();

  const source =
  audioContext
  .createMediaElementSource(
    music
  );

  analyser =
  audioContext
  .createAnalyser();

  analyser.fftSize =
  256;

  dataArray =
  new Uint8Array(
    analyser
    .frequencyBinCount
  );

  source.connect(
    analyser
  );

  analyser.connect(
    audioContext.destination
  );

  // fade in audio
  let vol = 0;

  const fade =
  setInterval(() => {

    if(vol < 1){

      vol += 0.02;
      music.volume =
      vol;

    } else {

      clearInterval(
        fade
      );
    }

  }, 100);

  canvas.style.opacity =
  "1";

  init();
});
});