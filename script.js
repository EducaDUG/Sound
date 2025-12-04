document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const foundEl = document.getElementById('found');
  const totalEl = document.getElementById('total');
  const logEl = document.getElementById('log');

  const state = {
    player: { x: 120, y: 520, w: 28, h: 28, speed: 2.6 },
    score: 0,
    lastTime: performance.now(),
    foundCount: 0,
    log: []
  };

  const walls = [
    { x: 0, y: 0, w: 1100, h: 14 },
    { x: 0, y: 606, w: 1100, h: 14 },
    { x: 0, y: 0, w: 14, h: 620 },
    { x: 1086, y: 0, w: 14, h: 620 },
    { x: 14, y: 140, w: 360, h: 14 },
    { x: 340, y: 140, w: 14, h: 240 },
    { x: 14, y: 380, w: 340, h: 14 },
    { x: 14, y: 280, w: 220, h: 14 },
    { x: 580, y: 14, w: 14, h: 300 },
    { x: 420, y: 300, w: 400, h: 14 },
    { x: 820, y: 14, w: 14, h: 600 },
    { x: 580, y: 460, w: 240, h: 14 }
  ];

  const grass = { x: 420, y: 474, w: 400, h: 132 };

  const parts = [
    { name: 'LED strip (living room)', x: 120, y: 80, color: '#f59e0b', collected: false },
    { name: 'Switch (hallway)', x: 260, y: 210, color: '#f59e0b', collected: false },
    { name: 'Fuse box (stairs)', x: 600, y: 40, color: '#f59e0b', collected: false },
    { name: 'LDR porch light', x: 900, y: 100, color: '#f59e0b', collected: false },
    { name: 'Resistor dimmer', x: 480, y: 360, color: '#f59e0b', collected: false },
    { name: 'LED night-light', x: 200, y: 330, color: '#f59e0b', collected: false },
    { name: 'Garden solar cell', x: 680, y: 540, color: '#f59e0b', collected: false },
    { name: 'LDR garden lamp', x: 500, y: 520, color: '#f59e0b', collected: false },
    { name: 'Garage resistor pack', x: 940, y: 400, color: '#f59e0b', collected: false },
    { name: 'Switch + LED tester', x: 700, y: 200, color: '#f59e0b', collected: false }
  ];

  totalEl.textContent = parts.length;

  const keysDown = {};
  window.addEventListener('keydown', (e) => {
    keysDown[e.key.toLowerCase()] = true;
  });
  window.addEventListener('keyup', (e) => {
    keysDown[e.key.toLowerCase()] = false;
  });

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function movePlayer(dt) {
    const { player } = state;
    let dx = 0;
    let dy = 0;

    if (keysDown['arrowup'] || keysDown['w']) dy -= 1;
    if (keysDown['arrowdown'] || keysDown['s']) dy += 1;
    if (keysDown['arrowleft'] || keysDown['a']) dx -= 1;
    if (keysDown['arrowright'] || keysDown['d']) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy) || 1;
      dx = (dx / len) * state.player.speed * dt;
      dy = (dy / len) * state.player.speed * dt;

      const next = { ...player, x: player.x + dx, y: player.y + dy };
      if (!walls.some((wall) => rectsOverlap(next, wall))) {
        player.x = next.x;
        player.y = next.y;
      }
    }
  }

  function drawBackground() {
    ctx.fillStyle = '#0b1428';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#0f2c22';
    ctx.fillRect(grass.x, grass.y, grass.w, grass.h);
  }

  function drawWalls() {
    ctx.fillStyle = '#475569';
    walls.forEach((wall) => ctx.fillRect(wall.x, wall.y, wall.w, wall.h));
  }

  function drawParts() {
    parts.forEach((part) => {
      ctx.fillStyle = part.collected ? 'rgba(251,191,36,0.35)' : '#fbbf24';
      ctx.beginPath();
      ctx.arc(part.x, part.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.stroke();
    });
  }

  function drawPlayer() {
    const { x, y, w, h } = state.player;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#0ea5e9';
    ctx.strokeRect(x, y, w, h);
  }

  function renderLog() {
    logEl.innerHTML = state.log.slice(0, 5).map((item) => `<li>${item}</li>`).join('');
    scoreEl.textContent = state.score.toFixed(0);
    foundEl.textContent = state.foundCount;
  }

  function updateScore(dt) {
    state.score += dt * 2;
    parts.forEach((part) => {
      if (!part.collected && Math.hypot(state.player.x - part.x, state.player.y - part.y) < 28) {
        part.collected = true;
        state.foundCount += 1;
        state.score += 100;
        state.log.unshift(`Tagged: ${part.name}`);
        renderLog();
      }
    });
  }

  function loop(now) {
    const dt = Math.min((now - state.lastTime) / 16.67, 3);
    state.lastTime = now;

    movePlayer(dt);
    updateScore(dt);

    drawBackground();
    drawWalls();
    drawParts();
    drawPlayer();

    requestAnimationFrame(loop);
  }

  renderLog();
  requestAnimationFrame(loop);
});
