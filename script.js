const KEYS = {
  MAKER: 'malang_maker_selection',
  RESULT: 'malang_result',
  SMASH_COUNT: 'malang_smash_total',
  SMASH_MUTE: 'malang_smash_mute',
  SMASH_FREEZE: 'malang_smash_freeze',
};

const DATA = {
  fillings: [
    { id: 'slime', label: '몽글 슬라임', emoji: '🌊', crunch: -15, squishy: 20 },
    { id: 'clay', label: '폭신 폼클레이', emoji: '☁️', crunch: -10, squishy: 15 },
    { id: 'jelly', label: '탱글 젤리비즈', emoji: '🔮', crunch: 15, squishy: 5 },
    { id: 'butter', label: '스르륵 버터슬라임', emoji: '🧈', crunch: -20, squishy: 25 },
    { id: 'popcorn', label: '바삭 콘칩', emoji: '🍿', crunch: 25, squishy: -15 },
  ],
  colors: [
    { id: 'pink', label: '딸기 핑크', c1: '#ffd1e3', c2: '#ff9ec7' },
    { id: 'mint', label: '민트 소다', c1: '#d3fff0', c2: '#7fe8c8' },
    { id: 'lavender', label: '라벤더 밀크', c1: '#e6dcff', c2: '#c3aefc' },
    { id: 'peach', label: '복숭아 크림', c1: '#ffe8d1', c2: '#ffbb8c' },
    { id: 'lemon', label: '레몬 소다', c1: '#fff9d1', c2: '#ffe97f' },
    { id: 'sky', label: '하늘 소다', c1: '#d8f0ff', c2: '#8ecbff' },
  ],
  toppings: [
    { id: 'star', label: '별가루', emoji: '⭐', destress: 8 },
    { id: 'pearl', label: '펄 구슬', emoji: '🫧', destress: 10 },
    { id: 'ribbon', label: '리본 장식', emoji: '🎀', destress: 5 },
    { id: 'candy', label: '캔디 조각', emoji: '🍬', destress: 8 },
    { id: 'none', label: '토핑 없음 (민낯)', emoji: '', destress: 0 },
  ],
  coatings: [
    { id: 'glossy', label: '반짝 유광 코팅', emoji: '✨', crunch: 10 },
    { id: 'matte', label: '차분 무광 코팅', emoji: '🌫️', squishy: 10 },
    { id: 'pearl', label: '펄샤인 코팅', emoji: '🌈', destress: 10 },
  ],
  emotions: [
    { id: 'stress', label: '스트레스 뿜뿜', emoji: '😤', destress: 20 },
    { id: 'excited', label: '설렘 두근', emoji: '💓', crunch: 10 },
    { id: 'calm', label: '평온 잔잔', emoji: '🌿', squishy: 10 },
    { id: 'hype', label: '신남 텐션업', emoji: '🔥', crunch: 10, destress: 10 },
    { id: 'bored', label: '심심함 몰려옴', emoji: '🥱', squishy: 5, destress: 5 },
  ],
};

const ADJECTIVES = ['몽실몽실', '말랑말랑', '몰랑몰랑', '탱글탱글', '바삭바삭', '폭신폭신', '촉촉한', '반짝이는', '오동통', '말캉말캉'];
const SMASH_PHRASES = ['와그작!', '빠각!', '뿌셔!', '와장창!', '퍽!', '쩍!', '으스러진다!'];

const THEME_BY_COLOR = {
  pink: { shell: [335, 70, 55], shell2: [350, 75, 68], core: [45, 90, 75] },
  mint: { shell: [165, 55, 45], shell2: [150, 55, 60], core: [330, 80, 78] },
  lavender: { shell: [265, 55, 55], shell2: [280, 55, 68], core: [50, 90, 78] },
  peach: { shell: [25, 70, 60], shell2: [35, 65, 70], core: [200, 80, 75] },
  lemon: { shell: [50, 75, 60], shell2: [45, 70, 72], core: [280, 70, 78] },
  sky: { shell: [205, 65, 55], shell2: [190, 60, 68], core: [20, 85, 75] },
};

const TOPPING_POSITIONS = [
  { top: '12%', left: '22%' },
  { top: '18%', left: '68%' },
  { top: '58%', left: '76%' },
  { top: '72%', left: '28%' },
  { top: '42%', left: '48%' },
];

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* localStorage unavailable — ignore */
  }
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clampNum(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function frand(a, b) {
  if (b === undefined) {
    b = a;
    a = 0;
  }
  return a + Math.random() * (b - a);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hsl(c, dl, a) {
  dl = dl || 0;
  a = a === undefined ? 1 : a;
  return `hsla(${c[0] | 0},${clampNum(c[1], 0, 100) | 0}%,${clampNum(c[2] + dl, 0, 100) | 0}%,${a})`;
}

function findById(list, id) {
  return list.find((item) => item.id === id);
}

function generateName(selection) {
  const color = findById(DATA.colors, selection.color);
  const adj = pick(ADJECTIVES);
  const num = randRange(100, 999);
  return `${adj} ${color ? color.label : '시크릿'} 왁뿌볼 No.${num}`;
}

function generateScores(selection) {
  const parts = [
    findById(DATA.fillings, selection.filling),
    findById(DATA.toppings, selection.topping),
    findById(DATA.coatings, selection.coating),
    findById(DATA.emotions, selection.emotion),
  ];
  let crunch = 50;
  let squishy = 50;
  let destress = 50;
  parts.forEach((item) => {
    if (!item) return;
    crunch += item.crunch || 0;
    squishy += item.squishy || 0;
    destress += item.destress || 0;
  });
  crunch += randRange(-8, 8);
  squishy += randRange(-8, 8);
  destress += randRange(-8, 8);
  return { crunch: clamp(crunch), squishy: clamp(squishy), destress: clamp(destress) };
}

function updateBallPreview(ballEl, toppingsEl, selection) {
  if (!ballEl) return;
  const color = findById(DATA.colors, selection.color) || DATA.colors[0];
  ballEl.style.setProperty('--ball-c1', color.c1);
  ballEl.style.setProperty('--ball-c2', color.c2);
  ballEl.dataset.filling = selection.filling || '';
  ballEl.dataset.coating = selection.coating || '';
  if (toppingsEl) {
    renderToppingDecorations(toppingsEl, findById(DATA.toppings, selection.topping));
  }
}

function renderToppingDecorations(container, topping) {
  container.innerHTML = '';
  if (!topping || !topping.emoji) return;
  const count = topping.id === 'ribbon' ? 1 : 4;
  for (let i = 0; i < count; i += 1) {
    const pos = topping.id === 'ribbon' ? { top: '4%', left: '38%' } : TOPPING_POSITIONS[i % TOPPING_POSITIONS.length];
    const span = document.createElement('span');
    span.className = 'topping-deco';
    span.style.top = pos.top;
    span.style.left = pos.left;
    span.textContent = topping.emoji;
    container.appendChild(span);
  }
}

function renderOptions(containerId, items, activeId, onSelect, variant) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  items.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = variant === 'color' ? 'color-swatch' : 'option-chip';
    btn.dataset.id = item.id;
    if (item.id === activeId) btn.classList.add('selected');
    if (variant === 'color') {
      btn.style.background = `linear-gradient(135deg, ${item.c1}, ${item.c2})`;
      btn.innerHTML = `<span class="chip-label">${item.label}</span>`;
    } else {
      btn.innerHTML = `<span class="chip-emoji">${item.emoji || ''}</span><span class="chip-label">${item.label}</span>`;
    }
    btn.addEventListener('click', () => onSelect(item));
    el.appendChild(btn);
  });
}

function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('공유 문구를 복사했어요! 📋');
  } catch (e) {
    showToast('복사에 실패했어요 😢');
  }
  document.body.removeChild(textarea);
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast('공유 문구를 복사했어요! 📋'))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function buildShareText(result) {
  const { crunch, squishy, destress } = result.scores;
  return [
    '🧪 말랑연구소 왁뿌볼 카드',
    `"${result.name}"`,
    `🍪바삭도 ${crunch}% · 🍡말랑도 ${squishy}% · 💆해소력 ${destress}%`,
    '',
    '나도 왁뿌볼 만들어보기 → 말랑연구소 왁뿌볼 공장',
  ].join('\n');
}

function initMaker() {
  const ball = document.getElementById('ballPreview');
  const container = document.getElementById('makerPage');
  if (!container || !ball) return;

  const toppingsEl = document.getElementById('ballToppings');
  const hint = document.getElementById('makerHint');
  const selection = loadJSON(KEYS.MAKER, {});

  function persist() {
    saveJSON(KEYS.MAKER, selection);
  }

  function refresh() {
    updateBallPreview(ball, toppingsEl, selection);
    renderOptions('fillingOptions', DATA.fillings, selection.filling, (item) => {
      selection.filling = item.id;
      persist();
      refresh();
    });
    renderOptions(
      'colorOptions',
      DATA.colors,
      selection.color,
      (item) => {
        selection.color = item.id;
        persist();
        refresh();
      },
      'color',
    );
    renderOptions('toppingOptions', DATA.toppings, selection.topping, (item) => {
      selection.topping = item.id;
      persist();
      refresh();
    });
    renderOptions('coatingOptions', DATA.coatings, selection.coating, (item) => {
      selection.coating = item.id;
      persist();
      refresh();
    });
    renderOptions('emotionOptions', DATA.emotions, selection.emotion, (item) => {
      selection.emotion = item.id;
      persist();
      refresh();
    });
  }

  refresh();

  const completeBtn = document.getElementById('completeBtn');
  completeBtn.addEventListener('click', () => {
    if (!selection.filling || !selection.color) {
      hint.textContent = '속재료와 색상은 꼭 골라주세요! 🙏';
      return;
    }
    const result = {
      id: Date.now(),
      name: generateName(selection),
      selection: { ...selection },
      scores: generateScores(selection),
      createdAt: new Date().toISOString(),
    };
    saveJSON(KEYS.RESULT, result);
    window.location.href = 'result.html';
  });
}

function setStat(key, value) {
  const fill = document.getElementById(`${key}Fill`);
  const label = document.getElementById(`${key}Value`);
  if (fill) fill.style.width = `${value}%`;
  if (label) label.textContent = `${value}%`;
}

function renderSummary(selection) {
  const ul = document.getElementById('summaryList');
  if (!ul) return;
  const rows = [
    ['속재료', findById(DATA.fillings, selection.filling)],
    ['색상', findById(DATA.colors, selection.color)],
    ['토핑', findById(DATA.toppings, selection.topping)],
    ['코팅', findById(DATA.coatings, selection.coating)],
    ['오늘의 기분', findById(DATA.emotions, selection.emotion)],
  ];
  ul.innerHTML = '';
  rows.forEach(([label, item]) => {
    if (!item) return;
    const li = document.createElement('li');
    li.innerHTML = `<span class="summary-key">${label}</span><span class="summary-val">${item.emoji ? `${item.emoji} ` : ''}${item.label}</span>`;
    ul.appendChild(li);
  });
}

function initResult() {
  const card = document.getElementById('resultCard');
  if (!card) return;

  const result = loadJSON(KEYS.RESULT, null);
  const emptyState = document.getElementById('emptyState');

  if (!result) {
    card.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  const ball = document.getElementById('ballPreview');
  const toppingsEl = document.getElementById('ballToppings');
  updateBallPreview(ball, toppingsEl, result.selection);

  document.getElementById('resultName').textContent = result.name;
  document.getElementById('resultNumber').textContent = `No.${String(result.id).slice(-4)}`;

  setStat('crunch', result.scores.crunch);
  setStat('squishy', result.scores.squishy);
  setStat('destress', result.scores.destress);

  renderSummary(result.selection);

  document.getElementById('shareBtn').addEventListener('click', () => {
    copyText(buildShareText(result));
  });
  document.getElementById('smashBtn').addEventListener('click', () => {
    window.location.href = 'smash.html';
  });
  document.getElementById('remakeBtn').addEventListener('click', () => {
    window.location.href = 'maker.html';
  });
}

function initSmash() {
  const canvas = document.getElementById('smashCanvas');
  if (!canvas) return;

  const result = loadJSON(KEYS.RESULT, null);
  const hud = document.querySelector('.hud');
  const counterEl = document.getElementById('smashCounter');
  const hintEl = document.getElementById('smashHint');
  const emptyState = document.getElementById('emptyState');
  const brokenState = document.getElementById('brokenState');
  const adBox = document.getElementById('smashAdBox');

  if (!result) {
    canvas.classList.add('hidden');
    if (hud) hud.classList.add('hidden');
    if (counterEl) counterEl.classList.add('hidden');
    if (hintEl) hintEl.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  const theme = THEME_BY_COLOR[result.selection.color] || THEME_BY_COLOR.pink;
  const shellToughness = 1 + (result.scores.crunch / 100) * 0.6;
  const coreToughness = 1 + (result.scores.squishy / 100) * 0.6;

  const ctx = canvas.getContext('2d');
  const TAU = Math.PI * 2;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0;
  let H = 0;
  let DPR = 1;
  let targetR = 120;
  const computeR = () => {
    const base = Math.min(W, H);
    return Math.max(72, Math.min(base * 0.31, 260));
  };

  let ball = null;
  const flakes = [];
  const parts = [];
  let frost = [];
  let shake = 0;
  let flash = 0;
  let lastT = performance.now();
  let brokenCount = parseInt(localStorage.getItem(KEYS.SMASH_COUNT) || '0', 10) || 0;
  let frozen = localStorage.getItem(KEYS.SMASH_FREEZE) === '1';
  let muted = localStorage.getItem(KEYS.SMASH_MUTE) === '1';
  let held = false;
  let holdX = 0;
  let holdY = 0;
  let pressure = 0;
  let activePointer = null;
  let hintHidden = false;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    layout();
  }
  function layout() {
    const nR = computeR();
    if (ball) {
      const k = nR / ball.R;
      ball.R = nR;
      for (const cr of ball.cracks) for (const p of cr.pts) { p[0] *= k; p[1] *= k; }
      for (const pl of ball.plates) for (const p of pl.pts) { p[0] *= k; p[1] *= k; }
      for (const m of ball.marble) { m.x *= k; m.y *= k; m.r *= k; }
      ball.coreR *= k;
      ball.cx = W / 2;
      ball.cy = H / 2;
      if (ball.phase === 'shell') rebuildShell();
    }
    targetR = nR;
  }

  let actx = null;
  let master = null;
  let comp = null;
  let reverb = null;
  let reverbGain = null;
  let audioFailed = false;
  function ensureAudio() {
    if (audioFailed || muted) return;
    try {
      if (actx) {
        if (actx.state === 'suspended') actx.resume();
        return;
      }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) {
        audioFailed = true;
        return;
      }
      actx = new AC();
      master = actx.createGain();
      master.gain.value = muted ? 0 : 0.9;
      comp = actx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 4;
      comp.attack.value = 0.003;
      comp.release.value = 0.2;
      master.connect(comp);
      comp.connect(actx.destination);
      try {
        reverb = actx.createConvolver();
        reverb.buffer = makeImpulse(1.1, 2.6);
        reverbGain = actx.createGain();
        reverbGain.gain.value = 0.2;
        reverb.connect(reverbGain);
        reverbGain.connect(master);
      } catch (e) {
        reverb = null;
      }
    } catch (e) {
      audioFailed = true;
      actx = null;
    }
  }
  function makeImpulse(dur, decay) {
    const rate = actx.sampleRate;
    const len = Math.max(1, (rate * dur) | 0);
    const buf = actx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch += 1) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i += 1) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }
  function noiseBuf(dur) {
    const n = Math.max(1, (dur * actx.sampleRate) | 0);
    const b = actx.createBuffer(1, n, actx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i += 1) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function crackSound(intensity, big) {
    if (!actx) return;
    const t = actx.currentTime;
    const fr = frozen ? 1 : 0;
    const grains = big ? 14 + ((Math.random() * 10) | 0) : 4 + ((Math.random() * 5) | 0);
    for (let i = 0; i < grains; i += 1) {
      const dt = Math.random() * (big ? 0.22 : 0.05);
      const src = actx.createBufferSource();
      src.buffer = noiseBuf(0.03 + Math.random() * 0.04);
      const bp = actx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1200 + fr * 900 + intensity * 1700 + Math.random() * 2800;
      bp.Q.value = 3 + Math.random() * 8 + fr * 4;
      const g = actx.createGain();
      const amp = (big ? 0.5 : 0.26) * (0.5 + Math.random() * 0.6) * (1 + fr * 0.2);
      const dur = 0.04 + Math.random() * 0.06;
      g.gain.setValueAtTime(0.0001, t + dt);
      g.gain.exponentialRampToValueAtTime(amp, t + dt + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dt + dur);
      src.connect(bp);
      bp.connect(g);
      g.connect(master);
      if (reverb) g.connect(reverb);
      src.start(t + dt);
      src.stop(t + dt + dur + 0.05);
    }
    const mid = actx.createBufferSource();
    mid.buffer = noiseBuf(0.06);
    const mf = actx.createBiquadFilter();
    mf.type = 'bandpass';
    mf.frequency.value = 700 + Math.random() * 500;
    mf.Q.value = 1.2;
    const mg = actx.createGain();
    mg.gain.setValueAtTime(0.0001, t);
    mg.gain.exponentialRampToValueAtTime(big ? 0.4 : 0.18, t + 0.004);
    mg.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    mid.connect(mf);
    mf.connect(mg);
    mg.connect(master);
    mid.start(t);
    mid.stop(t + 0.12);
    if (big) {
      const o = actx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(130, t);
      o.frequency.exponentialRampToValueAtTime(50, t + 0.22);
      const og = actx.createGain();
      og.gain.setValueAtTime(0.0001, t);
      og.gain.exponentialRampToValueAtTime(0.6, t + 0.012);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
      o.connect(og);
      og.connect(master);
      o.start(t);
      o.stop(t + 0.36);
      for (let j = 0; j < 11; j += 1) {
        const dt = Math.random() * 0.3;
        const f = 2300 + Math.random() * 4200;
        const oo = actx.createOscillator();
        oo.type = 'triangle';
        oo.frequency.value = f;
        const gg = actx.createGain();
        gg.gain.setValueAtTime(0.0001, t + dt);
        gg.gain.exponentialRampToValueAtTime(0.1, t + dt + 0.003);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.13);
        oo.connect(gg);
        gg.connect(master);
        if (reverb) gg.connect(reverb);
        oo.start(t + dt);
        oo.stop(t + dt + 0.15);
      }
    }
  }
  function squishSound(big) {
    if (!actx) return;
    const t = actx.currentTime;
    const src = actx.createBufferSource();
    src.buffer = noiseBuf(big ? 0.26 : 0.16);
    const lp = actx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(950, t);
    lp.frequency.exponentialRampToValueAtTime(230, t + (big ? 0.24 : 0.16));
    lp.Q.value = 6;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(big ? 0.42 : 0.3, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (big ? 0.3 : 0.2));
    src.connect(lp);
    lp.connect(g);
    g.connect(master);
    src.start(t);
    src.stop(t + 0.32);
    const o = actx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(240, t);
    o.frequency.exponentialRampToValueAtTime(80, t + 0.16);
    const og = actx.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(big ? 0.22 : 0.15, t + 0.02);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(og);
    og.connect(master);
    o.start(t);
    o.stop(t + 0.22);
  }
  function riseSound() {
    if (!actx) return;
    const t = actx.currentTime;
    const src = actx.createBufferSource();
    src.buffer = noiseBuf(0.4);
    const bp = actx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(500, t);
    bp.frequency.exponentialRampToValueAtTime(1400, t + 0.38);
    bp.Q.value = 2;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    src.connect(bp);
    bp.connect(g);
    g.connect(master);
    src.start(t);
    src.stop(t + 0.42);
  }
  function popSound() {
    if (!actx) return;
    const t = actx.currentTime;
    const o = actx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(300, t);
    o.frequency.exponentialRampToValueAtTime(680, t + 0.09);
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + 0.18);
  }
  let tension = null;
  function startTension(kind) {
    if (!actx || muted) return;
    stopTension(true);
    const src = actx.createBufferSource();
    src.buffer = noiseBuf(1.2);
    src.loop = true;
    const f = actx.createBiquadFilter();
    if (kind === 'shell') {
      f.type = 'bandpass';
      f.frequency.value = 320;
      f.Q.value = 1.4;
    } else {
      f.type = 'lowpass';
      f.frequency.value = 300;
      f.Q.value = 2;
    }
    const g = actx.createGain();
    g.gain.value = 0.0001;
    src.connect(f);
    f.connect(g);
    g.connect(master);
    src.start();
    tension = { src, f, g, kind };
  }
  function updateTension(p) {
    if (!tension || !actx) return;
    const now = actx.currentTime;
    const lvl = (tension.kind === 'shell' ? 0.07 : 0.05) * p;
    tension.g.gain.setTargetAtTime(Math.max(0.0001, lvl), now, 0.05);
    if (tension.kind === 'shell') tension.f.frequency.setTargetAtTime(300 + p * 620 + (frozen ? 200 : 0), now, 0.06);
    else tension.f.frequency.setTargetAtTime(260 + p * 220, now, 0.06);
  }
  function stopTension(immediate) {
    if (!tension) return;
    const t = tension;
    tension = null;
    if (!actx) {
      try { t.src.stop(); } catch (e) { /* noop */ }
      return;
    }
    const now = actx.currentTime;
    try { t.g.gain.setTargetAtTime(0.0001, now, 0.05); } catch (e) { /* noop */ }
    try { t.src.stop(now + (immediate ? 0.02 : 0.3)); } catch (e) { /* noop */ }
  }

  function makeBall() {
    const R = targetR;
    const b = {
      cx: W / 2,
      cy: H / 2,
      R,
      theme,
      phase: 'shell',
      shellInteg: 1,
      coreInteg: 1,
      nextCrackAt: 0.9,
      nextSquishAt: 0.85,
      cracks: [],
      plates: [],
      marble: [],
      coreR: R * 0.99,
      sx: 1,
      sy: 1,
      wob: 0,
      wobv: 0,
      spawning: true,
      spawnT: performance.now(),
      oc: null,
      ocSize: 0,
      ocHalf: 0,
      stressBulge: 0,
    };
    const mn = 3 + ((Math.random() * 3) | 0);
    for (let i = 0; i < mn; i += 1) {
      const a = frand(0, TAU);
      const rr = Math.sqrt(Math.random()) * R * 0.7;
      b.marble.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr, r: R * frand(0.25, 0.55), rot: frand(0, TAU) });
    }
    return b;
  }
  function spawnBall() {
    ball = makeBall();
    buildFrost();
    rebuildShell();
    popSound();
    const b = ball;
    setTimeout(() => { if (b) b.spawning = false; }, 440);
  }
  function buildFrost() {
    frost = [];
    if (!frozen) return;
    const R = ball.R;
    const n = reduceMotion ? 16 : 32;
    for (let i = 0; i < n; i += 1) {
      const a = frand(0, TAU);
      const r = Math.sqrt(Math.random()) * R * 0.95;
      frost.push([Math.cos(a) * r, Math.sin(a) * r, frand(0.6, 2.0)]);
    }
  }

  function growCrack(x, y, ang, len, R) {
    const pts = [[x, y]];
    let cx = x;
    let cy = y;
    let a = ang;
    let dist = 0;
    while (dist < len) {
      const step = 10 + Math.random() * 8;
      a += Math.random() < 0.25 ? frand(-0.9, 0.9) : frand(-0.22, 0.22);
      cx += Math.cos(a) * step;
      cy += Math.sin(a) * step;
      if (cx * cx + cy * cy > R * R * 0.97) break;
      pts.push([cx, cy]);
      dist += step;
    }
    return { pts };
  }
  function platePoly(x, y, r) {
    const n = 3 + ((Math.random() * 3) | 0);
    const pts = [];
    const a0 = frand(0, TAU);
    for (let i = 0; i < n; i += 1) {
      const a = a0 + (i / n) * TAU + frand(-0.3, 0.3);
      const rr = r * (0.6 + Math.random() * 0.7);
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    return { pts };
  }
  function addCracks(lx, ly) {
    const b = ball;
    const R = b.R;
    const baseAng = Math.atan2(ly, lx);
    const br = 3 + ((Math.random() * 3) | 0);
    for (let i = 0; i < br; i += 1) {
      const ang = baseAng + frand(-0.6, 0.6) + (i / br) * TAU * 0.2;
      b.cracks.push(growCrack(lx, ly, ang, R * (0.3 + Math.random() * 0.5), R));
    }
    for (let i = 0; i < 2; i += 1) {
      const ang = frand(0, TAU);
      b.cracks.push(growCrack(lx, ly, ang, R * (0.15 + Math.random() * 0.2), R));
    }
  }

  function paintShellBase(g, R, b) {
    const th = b.theme;
    const grad = g.createRadialGradient(-R * 0.34, -R * 0.4, R * 0.06, 0, 0, R * 1.02);
    grad.addColorStop(0, hsl(th.shell, 26));
    grad.addColorStop(0.5, hsl(th.shell, 4));
    grad.addColorStop(0.82, hsl(th.shell, -10));
    grad.addColorStop(1, hsl(th.shell, -20));
    g.fillStyle = grad;
    g.beginPath();
    g.arc(0, 0, R, 0, TAU);
    g.fill();
    g.save();
    g.beginPath();
    g.arc(0, 0, R, 0, TAU);
    g.clip();
    for (const m of b.marble) {
      const mg = g.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
      mg.addColorStop(0, hsl(th.shell2, 8, 0.55));
      mg.addColorStop(0.6, hsl(th.shell2, -4, 0.25));
      mg.addColorStop(1, 'transparent');
      g.fillStyle = mg;
      g.beginPath();
      g.ellipse(m.x, m.y, m.r, m.r * 0.7, m.rot, 0, TAU);
      g.fill();
    }
    g.restore();
    if (frozen) {
      g.save();
      g.globalCompositeOperation = 'screen';
      for (const f of frost) {
        g.globalAlpha = 0.5;
        const fg = g.createRadialGradient(f[0], f[1], 0, f[0], f[1], f[2] * 3);
        fg.addColorStop(0, 'rgba(225,245,255,.9)');
        fg.addColorStop(1, 'transparent');
        g.fillStyle = fg;
        g.beginPath();
        g.arc(f[0], f[1], f[2] * 3, 0, TAU);
        g.fill();
      }
      g.globalAlpha = 0.16;
      const cold = g.createRadialGradient(0, 0, R * 0.5, 0, 0, R);
      cold.addColorStop(0, 'transparent');
      cold.addColorStop(1, 'rgba(200,235,255,.9)');
      g.fillStyle = cold;
      g.beginPath();
      g.arc(0, 0, R, 0, TAU);
      g.fill();
      g.restore();
    }
    g.save();
    g.globalCompositeOperation = 'screen';
    const rim = g.createRadialGradient(R * 0.4, R * 0.46, R * 0.1, R * 0.4, R * 0.46, R * 0.9);
    rim.addColorStop(0, 'rgba(255,255,255,.28)');
    rim.addColorStop(1, 'transparent');
    g.fillStyle = rim;
    g.beginPath();
    g.arc(0, 0, R, 0, TAU);
    g.fill();
    const hi = g.createRadialGradient(-R * 0.33, -R * 0.4, 0, -R * 0.33, -R * 0.4, R * 0.6);
    hi.addColorStop(0, 'rgba(255,255,255,.95)');
    hi.addColorStop(0.3, 'rgba(255,255,255,.4)');
    hi.addColorStop(1, 'transparent');
    g.fillStyle = hi;
    g.beginPath();
    g.arc(0, 0, R, 0, TAU);
    g.fill();
    g.restore();
    g.fillStyle = 'rgba(255,255,255,.95)';
    g.beginPath();
    g.ellipse(-R * 0.35, -R * 0.44, R * 0.12, R * 0.07, -0.6, 0, TAU);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.5)';
    g.beginPath();
    g.ellipse(-R * 0.18, -R * 0.27, R * 0.05, R * 0.03, -0.6, 0, TAU);
    g.fill();
  }
  function rebuildShell() {
    const b = ball;
    if (!b) return;
    const pad = 10;
    const half = b.R + pad;
    const size = Math.ceil(half * 2);
    if (!b.oc) b.oc = document.createElement('canvas');
    b.oc.width = Math.ceil(size * DPR);
    b.oc.height = Math.ceil(size * DPR);
    b.ocSize = size;
    b.ocHalf = half;
    const g = b.oc.getContext('2d');
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.clearRect(0, 0, size, size);
    g.save();
    g.translate(half, half);
    paintShellBase(g, b.R, b);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.strokeStyle = 'rgba(0,0,0,.32)';
    const vw = 2 + (1 - b.shellInteg) * 7;
    for (const c of b.cracks) {
      g.lineWidth = vw + 2;
      g.beginPath();
      for (let i = 0; i < c.pts.length; i += 1) { const p = c.pts[i]; if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }
      g.stroke();
    }
    g.globalCompositeOperation = 'destination-out';
    for (const c of b.cracks) {
      g.lineWidth = vw;
      g.beginPath();
      for (let i = 0; i < c.pts.length; i += 1) { const p = c.pts[i]; if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }
      g.stroke();
    }
    for (const pl of b.plates) {
      g.beginPath();
      const p = pl.pts;
      for (let i = 0; i < p.length; i += 1) { if (i) g.lineTo(p[i][0], p[i][1]); else g.moveTo(p[i][0], p[i][1]); }
      g.closePath();
      g.fill();
    }
    g.globalCompositeOperation = 'source-over';
    g.restore();
  }

  function drawCoreBody(g, Rc, th) {
    const co = th.core;
    const grad = g.createRadialGradient(-Rc * 0.25, -Rc * 0.3, Rc * 0.05, 0, 0, Rc);
    grad.addColorStop(0, hsl(co, 16));
    grad.addColorStop(0.5, hsl(co, 0));
    grad.addColorStop(1, hsl(co, -16));
    g.fillStyle = grad;
    g.beginPath();
    g.arc(0, 0, Rc, 0, TAU);
    g.fill();
    g.save();
    g.globalCompositeOperation = 'screen';
    const gl = g.createRadialGradient(0, 0, 0, 0, 0, Rc * 0.95);
    gl.addColorStop(0, hsl(co, 22, 0.5));
    gl.addColorStop(1, 'transparent');
    g.fillStyle = gl;
    g.beginPath();
    g.arc(0, 0, Rc, 0, TAU);
    g.fill();
    const hi = g.createRadialGradient(-Rc * 0.28, -Rc * 0.32, 0, -Rc * 0.28, -Rc * 0.32, Rc * 0.5);
    hi.addColorStop(0, 'rgba(255,255,255,.6)');
    hi.addColorStop(1, 'transparent');
    g.fillStyle = hi;
    g.beginPath();
    g.arc(0, 0, Rc, 0, TAU);
    g.fill();
    g.restore();
  }
  function drawBulge(g, x, y, r, co) {
    const nx = Math.hypot(x, y) || 1;
    const ox = x / nx;
    const oy = y / nx;
    const px = x + ox * r * 0.2;
    const py = y + oy * r * 0.2;
    const gr = g.createRadialGradient(px - r * 0.3, py - r * 0.3, r * 0.05, px, py, r);
    gr.addColorStop(0, hsl(co, 24));
    gr.addColorStop(0.6, hsl(co, 6));
    gr.addColorStop(1, hsl(co, -8));
    g.fillStyle = gr;
    g.beginPath();
    g.arc(px, py, r, 0, TAU);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.55)';
    g.beginPath();
    g.arc(px - r * 0.3, py - r * 0.32, r * 0.26, 0, TAU);
    g.fill();
  }
  function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  function drawBall(now, dt) {
    const b = ball;
    const th = b.theme;
    let ss = 1;
    let alpha = 1;
    if (b.spawning) {
      const p = clampNum((now - b.spawnT) / 420, 0, 1);
      ss = easeOutBack(p);
      alpha = clampNum(p * 1.5, 0, 1);
      if (p >= 1) b.spawning = false;
    }
    const recover = b.phase === 'core' ? dt * 2.6 : dt * 7;
    if (!held) {
      b.sx = lerp(b.sx, 1, Math.min(1, recover));
      b.sy = lerp(b.sy, 1, Math.min(1, recover));
      b.stressBulge = lerp(b.stressBulge, 0, Math.min(1, dt * 4));
    }
    if (b.phase === 'core') {
      const stiff = 180;
      const damp = 7.5;
      b.wobv += (-b.wob * stiff - b.wobv * damp) * dt;
      b.wob += b.wobv * dt;
      b.wob = clampNum(b.wob, -0.5, 0.5);
    }
    let tx = 0;
    let ty = 0;
    if (b.phase === 'shell' && b.shellInteg < 0.18 && !reduceMotion) {
      tx = frand(-2.6, 2.6);
      ty = frand(-2.6, 2.6);
    }
    const shellAlpha = clampNum(0.86 + 0.08 * b.shellInteg, 0.86, 0.94);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(b.cx + tx, b.cy + ty);
    let wx = ss * b.sx;
    let wy = ss * b.sy;
    if (b.phase === 'core') {
      wx *= 1 + b.wob * 0.3;
      wy *= 1 - b.wob * 0.3;
    }
    ctx.scale(wx, wy);

    drawCoreBody(ctx, b.coreR, th);

    if (b.phase === 'shell') {
      if (b.stressBulge > 0.02) {
        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        const r = b.R * (0.12 + b.stressBulge * 0.16);
        const gr = ctx.createRadialGradient(holdX, holdY, 0, holdX, holdY, r);
        gr.addColorStop(0, hsl(th.core, 24, 0.95));
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(holdX, holdY, r, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      ctx.save();
      ctx.globalAlpha = alpha * shellAlpha;
      ctx.drawImage(b.oc, -b.ocHalf, -b.ocHalf, b.ocSize, b.ocSize);
      ctx.restore();
      if (b.cracks.length) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = alpha * clampNum(0.2 + (1 - b.shellInteg) * 0.42, 0, 0.62);
        ctx.strokeStyle = hsl(th.core, 20, 0.9);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = hsl(th.core, 24, 1);
        ctx.shadowBlur = 8 + (1 - b.shellInteg) * 12;
        ctx.lineWidth = 1.6 + (1 - b.shellInteg) * 4;
        for (const c of b.cracks) {
          ctx.beginPath();
          for (let i = 0; i < c.pts.length; i += 1) { const p = c.pts[i]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
          ctx.stroke();
        }
        ctx.restore();
      }
      for (const pl of b.plates) {
        let mx = 0;
        let my = 0;
        for (const p of pl.pts) { mx += p[0]; my += p[1]; }
        mx /= pl.pts.length;
        my /= pl.pts.length;
        drawBulge(ctx, mx, my, b.R * 0.1, th.core);
      }
    }
    ctx.restore();
  }

  function flakePoly(r) {
    const n = 3 + ((Math.random() * 3) | 0);
    const pts = [];
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * TAU + frand(-0.3, 0.3);
      const rr = r * (0.6 + Math.random() * 0.6);
      pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
    }
    return pts;
  }
  function spawnFlakes(gx, gy, col, n) {
    let count = n;
    if (reduceMotion) count = Math.ceil(count * 0.5);
    for (let i = 0; i < count; i += 1) {
      const a = frand(0, TAU);
      const sp = frand(40, 190);
      flakes.push({
        x: gx, y: gy, vx: Math.cos(a) * sp + frand(-30, 30), vy: Math.sin(a) * sp - frand(70, 200),
        rot: frand(0, TAU), vrot: frand(-9, 9), pts: flakePoly(frand(5, 13)), col, life: 1, fade: frand(0.5, 1.0), frozen,
      });
    }
  }
  function spawnDrops(gx, gy, co, n) {
    let count = n;
    if (reduceMotion) count = Math.ceil(count * 0.5);
    for (let i = 0; i < count; i += 1) {
      const a = frand(0, TAU);
      const sp = frand(30, 170);
      parts.push({ kind: 'drop', x: gx, y: gy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - frand(40, 150), r: frand(3, 9), co, life: 1, fade: frand(0.7, 1.3) });
    }
  }
  function spawnSpark(gx, gy, n) {
    for (let i = 0; i < n; i += 1) {
      const a = frand(0, TAU);
      const sp = frand(60, 280);
      parts.push({ kind: 'spark', x: gx, y: gy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: frand(1.5, 3.5), life: 1, fade: frand(1.4, 2.6) });
    }
  }
  function updateDrawFlakes(dt) {
    for (let i = flakes.length - 1; i >= 0; i -= 1) {
      const f = flakes[i];
      f.vy += 1500 * dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.rot += f.vrot * dt;
      f.vx *= Math.pow(0.5, dt);
      f.life -= dt * f.fade;
      if (f.life <= 0 || f.y > H + 60) { flakes.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);
      ctx.globalAlpha = clampNum(f.life, 0, 1);
      const g = ctx.createLinearGradient(-9, -9, 9, 9);
      g.addColorStop(0, hsl(f.col, 18 + (f.frozen ? 6 : 0)));
      g.addColorStop(1, hsl(f.col, -14));
      ctx.fillStyle = g;
      ctx.beginPath();
      const p = f.pts;
      for (let j = 0; j < p.length; j += 1) { if (j) ctx.lineTo(p[j][0], p[j][1]); else ctx.moveTo(p[j][0], p[j][1]); }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    }
  }
  function updateDrawParts(dt) {
    for (let i = parts.length - 1; i >= 0; i -= 1) {
      const p = parts[i];
      if (p.kind === 'drop') p.vy += 1300 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(0.6, dt);
      p.life -= dt * p.fade;
      if (p.life <= 0 || p.y > H + 50) { parts.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = clampNum(p.life, 0, 1);
      if (p.kind === 'spark') {
        ctx.fillStyle = 'rgba(255,255,255,.95)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, TAU);
        ctx.fill();
      } else {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, hsl(p.co, 18));
        g.addColorStop(1, hsl(p.co, -8));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.6 + p.life * 0.4), 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  const sparkles = [];
  for (let i = 0; i < 16; i += 1) sparkles.push({ fx: Math.random(), fy: Math.random(), r: frand(1.5, 4), ph: frand(0, TAU), spd: frand(0.6, 1.6) });
  function drawSparkles(now) {
    for (const s of sparkles) {
      const x = s.fx * W;
      const y = s.fy * H;
      const tw = 0.3 + 0.7 * Math.abs(Math.sin(now * 0.001 * s.spd + s.ph));
      ctx.save();
      ctx.globalAlpha = tw * 0.5;
      ctx.translate(x, y);
      ctx.rotate(s.ph);
      ctx.fillStyle = 'rgba(255,255,255,.9)';
      ctx.beginPath();
      const r = s.r;
      for (let i = 0; i < 4; i += 1) {
        const a = i * (Math.PI / 2);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(a + 0.4) * r * 0.32, Math.sin(a + 0.4) * r * 0.32);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
  function drawShadow() {
    if (!ball) return;
    const sy = ball.cy + ball.R * 0.98;
    ctx.save();
    ctx.globalAlpha = 0.3;
    const g = ctx.createRadialGradient(ball.cx, sy, 0, ball.cx, sy, ball.R * 0.9);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(ball.cx, sy, ball.R * 0.82, ball.R * 0.2, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function vibrate(p) {
    if (reduceMotion || !p) return;
    try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* noop */ }
  }
  function popPhrase() {
    const span = document.createElement('span');
    span.className = 'smash-phrase';
    span.textContent = pick(SMASH_PHRASES);
    span.style.left = `${40 + Math.random() * 20}%`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 700);
  }

  function breakShell() {
    const b = ball;
    const th = b.theme;
    b.phase = 'core';
    for (let k = 0; k < 22; k += 1) {
      const a = frand(0, TAU);
      const rr = b.R * frand(0.55, 1.0);
      spawnFlakes(b.cx + Math.cos(a) * rr, b.cy + Math.sin(a) * rr, th.shell, 1);
    }
    spawnFlakes(b.cx, b.cy, th.shell, 10);
    spawnSpark(b.cx, b.cy, reduceMotion ? 6 : 20);
    crackSound(1, true);
    flash = 0.3;
    shake = reduceMotion ? 4 : 15;
    vibrate([0, 18, 28, 18, 30, 50]);
    popPhrase();
    b.coreR = b.R * 0.985;
    b.wobv = -16;
    b.oc = null;
    b.sx = 1.18;
    b.sy = 0.84;
    if (held) { stopTension(true); startTension('core'); }
  }
  function crushCore() {
    const b = ball;
    const th = b.theme;
    spawnDrops(b.cx, b.cy, th.core, reduceMotion ? 12 : 30);
    spawnSpark(b.cx, b.cy, reduceMotion ? 5 : 16);
    squishSound(true);
    flash = 0.2;
    shake = reduceMotion ? 4 : 11;
    vibrate([0, 30, 40, 30]);
    brokenCount += 1;
    localStorage.setItem(KEYS.SMASH_COUNT, String(brokenCount));
    const countEl = document.getElementById('smashCount');
    if (countEl) countEl.textContent = brokenCount;
    if (counterEl) {
      counterEl.classList.add('bump');
      setTimeout(() => counterEl.classList.remove('bump'), 200);
    }
    ball = null;
    stopTension(true);
    held = false;
    activePointer = null;
    pressure = 0;
    setTimeout(() => {
      if (brokenState) brokenState.classList.remove('hidden');
      if (adBox) adBox.classList.remove('hidden');
    }, 700);
  }
  function applyDamage(dt, impulse) {
    const b = ball;
    if (!b || b.spawning) return;
    const th = b.theme;
    if (b.phase === 'shell') {
      const base = impulse != null ? impulse : dt * (0.22 + pressure * 0.95) * (frozen ? 1.25 : 1);
      const rate = base / shellToughness;
      b.shellInteg = clampNum(b.shellInteg - rate, 0, 1);
      b.stressBulge = Math.max(b.stressBulge, pressure * 0.6 + (impulse ? 0.4 : 0));
      while (b.shellInteg <= b.nextCrackAt && b.nextCrackAt > 0) {
        addCracks(holdX, holdY);
        if (b.shellInteg < 0.7) b.plates.push(platePoly(holdX, holdY, b.R * (0.1 + Math.random() * 0.08)));
        const dmg = 1 - b.shellInteg;
        crackSound(0.35 + dmg * 0.7, false);
        spawnFlakes(b.cx + holdX, b.cy + holdY, th.shell, 3 + ((Math.random() * 3) | 0));
        b.sx = 1.12;
        b.sy = 0.9;
        shake = Math.max(shake, 4 + dmg * 4);
        vibrate([0, 10, 8, 8]);
        b.nextCrackAt -= 0.14;
        rebuildShell();
      }
      if (b.shellInteg <= 0) breakShell();
    } else if (b.phase === 'core') {
      const base = impulse != null ? impulse : dt * (0.35 + pressure * 1.15);
      const rate = base / coreToughness;
      b.coreInteg = clampNum(b.coreInteg - rate, 0, 1);
      const sq = clampNum(pressure, 0.3, 1);
      b.sx = lerp(b.sx, 1 + sq * 0.22, Math.min(1, dt * 12));
      b.sy = lerp(b.sy, 1 - sq * 0.2, Math.min(1, dt * 12));
      while (b.coreInteg <= b.nextSquishAt && b.nextSquishAt > 0) {
        spawnDrops(b.cx + holdX * 0.4, b.cy + holdY * 0.4, th.core, 6);
        squishSound(false);
        b.wobv -= 10;
        shake = Math.max(shake, 4);
        vibrate(20);
        b.nextSquishAt -= 0.2;
      }
      if (b.coreInteg <= 0) crushCore();
    }
  }

  function localFromEvent(e) {
    const dx = e.clientX - ball.cx;
    const dy = e.clientY - ball.cy;
    const d = Math.hypot(dx, dy);
    if (d > ball.R * 0.99) { const k = (ball.R * 0.99) / d; return [dx * k, dy * k]; }
    return [dx, dy];
  }
  function hideHint() {
    if (hintHidden) return;
    hintHidden = true;
    if (hintEl) hintEl.classList.add('gone');
  }
  function onDown(e) {
    e.preventDefault();
    ensureAudio();
    hideHint();
    if (!ball || ball.spawning || activePointer !== null) return;
    const dx = e.clientX - ball.cx;
    const dy = e.clientY - ball.cy;
    if (dx * dx + dy * dy > ball.R * ball.R * 1.02) return;
    activePointer = e.pointerId;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    held = true;
    pressure = clampNum(e.pressure > 0 ? e.pressure * 1.2 : 0.45, 0.2, 1);
    [holdX, holdY] = localFromEvent(e);
    startTension(ball.phase === 'shell' ? 'shell' : 'core');
    applyDamage(0, ball.phase === 'shell' ? 0.16 : 0.2);
  }
  function onMove(e) {
    if (!held || e.pointerId !== activePointer || !ball) return;
    e.preventDefault();
    [holdX, holdY] = localFromEvent(e);
    if (e.pressure > 0) pressure = lerp(pressure, clampNum(e.pressure * 1.1, 0.2, 1), 0.3);
  }
  function endPress(e) {
    if (e.pointerId !== activePointer) return;
    activePointer = null;
    held = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
    stopTension(false);
    if (ball && !ball.spawning && ball.phase === 'core' && ball.coreInteg < 0.98) { riseSound(); ball.wobv -= 6; }
  }

  const countEl = document.getElementById('smashCount');
  if (countEl) countEl.textContent = brokenCount;

  const muteBtn = document.getElementById('muteBtn');
  if (muteBtn) {
    muteBtn.textContent = muted ? '🔈' : '🔊';
    muteBtn.addEventListener('click', () => {
      muted = !muted;
      localStorage.setItem(KEYS.SMASH_MUTE, muted ? '1' : '0');
      muteBtn.textContent = muted ? '🔈' : '🔊';
      ensureAudio();
      if (master) master.gain.value = muted ? 0 : 0.9;
      if (muted) stopTension(true);
    });
  }
  const freezeBtn = document.getElementById('freezeBtn');
  function refreshFreezeBtn() {
    if (!freezeBtn) return;
    freezeBtn.classList.toggle('on', frozen);
    freezeBtn.textContent = frozen ? '❄️' : '🧊';
  }
  if (freezeBtn) {
    freezeBtn.addEventListener('click', () => {
      frozen = !frozen;
      localStorage.setItem(KEYS.SMASH_FREEZE, frozen ? '1' : '0');
      refreshFreezeBtn();
      if (ball && ball.phase === 'shell') { buildFrost(); rebuildShell(); }
      flash = Math.max(flash, 0.1);
    });
    refreshFreezeBtn();
  }

  canvas.addEventListener('pointerdown', onDown, { passive: false });
  canvas.addEventListener('pointermove', onMove, { passive: false });
  canvas.addEventListener('pointerup', endPress);
  canvas.addEventListener('pointercancel', endPress);
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  window.addEventListener('blur', () => {
    if (held) { held = false; activePointer = null; stopTension(true); }
  });

  const resmashBtn = document.getElementById('resmashBtn');
  if (resmashBtn) {
    resmashBtn.addEventListener('click', () => {
      if (brokenState) brokenState.classList.add('hidden');
      if (adBox) adBox.classList.add('hidden');
      spawnBall();
    });
  }
  const remakeFromSmashBtn = document.getElementById('remakeFromSmashBtn');
  if (remakeFromSmashBtn) {
    remakeFromSmashBtn.addEventListener('click', () => { window.location.href = 'maker.html'; });
  }

  function frame(now) {
    const dt = Math.max(0, Math.min(0.05, (now - lastT) / 1000));
    lastT = now;
    if (held && ball && !ball.spawning) {
      pressure = clampNum(pressure + dt * 1.5, 0.2, 1);
      applyDamage(dt, null);
      updateTension(pressure);
    } else if (!held && pressure > 0) {
      pressure = Math.max(0, pressure - dt * 3);
    }

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    let sx = 0;
    let sy = 0;
    if (shake > 0.1 && !reduceMotion) { sx = frand(-shake, shake); sy = frand(-shake, shake); }
    ctx.save();
    ctx.translate(sx, sy);
    drawSparkles(now);
    drawShadow();
    if (ball) drawBall(now, dt);
    updateDrawFlakes(dt);
    updateDrawParts(dt);
    ctx.restore();

    if (flash > 0.01) {
      ctx.save();
      ctx.globalAlpha = Math.min(0.6, flash);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    flash *= 0.84;
    if (flash < 0.01) flash = 0;
    shake *= 0.86;
    if (shake < 0.1) shake = 0;

    requestAnimationFrame(frame);
  }

  resize();
  spawnBall();
  requestAnimationFrame(frame);
}

document.addEventListener('DOMContentLoaded', () => {
  initMaker();
  initResult();
  initSmash();
});
