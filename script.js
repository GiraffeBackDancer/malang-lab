const KEYS = {
  MAKER: 'malang_maker_selection',
  RESULT: 'malang_result',
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
const PARTICLE_EMOJI = ['✨', '💥', '🌟', '🎉', '💫'];
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

function addCrack(ball) {
  const crack = document.createElement('div');
  crack.className = 'crack-line';
  const angle = Math.random() * 360;
  const length = 40 + Math.random() * 70;
  crack.style.setProperty('--angle', `${angle}deg`);
  crack.style.setProperty('--length', `${length}px`);
  ball.appendChild(crack);
  requestAnimationFrame(() => crack.classList.add('show'));
}

function shakeBall(ball) {
  ball.classList.remove('shake');
  void ball.offsetWidth;
  ball.classList.add('shake');
}

function popPhrase(stage) {
  const span = document.createElement('span');
  span.className = 'smash-phrase';
  span.textContent = pick(SMASH_PHRASES);
  span.style.left = `${40 + Math.random() * 20}%`;
  stage.appendChild(span);
  setTimeout(() => span.remove(), 700);
}

function spawnParticles(stage) {
  for (let i = 0; i < 14; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'smash-particle';
    particle.textContent = pick(PARTICLE_EMOJI);
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 100;
    particle.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    particle.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    stage.appendChild(particle);
    setTimeout(() => particle.remove(), 900);
  }
}

function initSmash() {
  const stage = document.getElementById('smashStage');
  if (!stage) return;

  const result = loadJSON(KEYS.RESULT, null);
  const emptyState = document.getElementById('emptyState');

  if (!result) {
    stage.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  const ball = document.getElementById('ballPreview');
  const toppingsEl = document.getElementById('ballToppings');
  updateBallPreview(ball, toppingsEl, result.selection);

  const hint = document.getElementById('smashHint');
  const brokenState = document.getElementById('brokenState');
  const adBox = document.getElementById('smashAdBox');
  const MAX_HITS = 7;
  let clicks = 0;

  function handleHit() {
    if (clicks >= MAX_HITS) return;
    clicks += 1;
    addCrack(ball);
    shakeBall(ball);
    popPhrase(stage);
    if ('vibrate' in navigator) navigator.vibrate(20);
    hint.textContent = `${clicks}/${MAX_HITS} 번 부쉈어요!`;
    if (clicks >= MAX_HITS) {
      setTimeout(breakBall, 260);
    }
  }

  function breakBall() {
    ball.classList.add('breaking');
    spawnParticles(stage);
    if ('vibrate' in navigator) navigator.vibrate([30, 20, 30, 20, 80]);
    setTimeout(() => {
      stage.classList.add('hidden');
      brokenState.classList.remove('hidden');
      if (adBox) adBox.classList.remove('hidden');
    }, 650);
  }

  function resetSmash() {
    clicks = 0;
    ball.classList.remove('breaking');
    ball.querySelectorAll('.crack-line').forEach((crack) => crack.remove());
    hint.textContent = '왁뿌볼을 눌러서 부숴보세요!';
    brokenState.classList.add('hidden');
    if (adBox) adBox.classList.add('hidden');
    stage.classList.remove('hidden');
  }

  ball.addEventListener('click', handleHit);

  const resmashBtn = document.getElementById('resmashBtn');
  if (resmashBtn) resmashBtn.addEventListener('click', resetSmash);

  const remakeFromSmashBtn = document.getElementById('remakeFromSmashBtn');
  if (remakeFromSmashBtn) {
    remakeFromSmashBtn.addEventListener('click', () => {
      window.location.href = 'maker.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMaker();
  initResult();
  initSmash();
});
