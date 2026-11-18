'use strict';
/* nation3 — 격자 전장 전투 */
const BW = 15, BH = 11, GATE = [10, 5], KEEP = [13, 5], MAX_DAY = 30;
const T = { PLAIN: 0, FOREST: 1, MOUNT: 2, RIVER: 3, WALL: 4, GATE: 5, INNER: 6, KEEP: 7 };
const KIND = { inf: { n: '보병', mv: 4, rng: 1 }, cav: { n: '기병', mv: 6, rng: 1 }, arc: { n: '궁병', mv: 3, rng: 2 } };
const WEATHER = ['맑음', '맑음', '흐림', '비', '강풍'];
const man = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const NAVAL_KIND = { inf: '주가', cav: '몽충', arc: '누선' };
const kindName = (s, k) => (s.naval ? NAVAL_KIND[k] : KIND[k].n);

function tbMap(naval) {
  const m = [];
  for (let y = 0; y < BH; y++) {
    m.push([]);
    for (let x = 0; x < BW; x++) {
      let t = T.PLAIN;
      if (x >= 10 && y >= 2 && y <= 8) t = x === 10 || y === 2 || y === 8 ? T.WALL : T.INNER;
      m[y].push(t);
    }
  }
  m[GATE[1]][GATE[0]] = T.GATE; m[KEEP[1]][KEEP[0]] = T.KEEP;
  if (naval) {
    for (let y = 0; y < BH; y++) for (let x = 2; x < 10; x++) m[y][x] = T.RIVER;
    for (let y = 0; y < 2; y++) for (let x = 10; x < BW; x++) m[y][x] = T.RIVER;
    for (let y = 9; y < BH; y++) for (let x = 10; x < BW; x++) m[y][x] = T.RIVER;
    for (let i = 0; i < 9; i++) m[ri(0, BH - 1)][ri(3, 8)] = T.FOREST;
    return m;
  }
  const b1 = ri(1, 4), b2 = ri(6, 9);
  for (let y = 0; y < BH; y++) if (y !== b1 && y !== b2) m[y][7] = T.RIVER;
  for (let i = 0; i < 14; i++) { const x = ri(2, 6), y = ri(0, BH - 1); m[y][x] = Math.random() < 0.65 ? T.FOREST : T.MOUNT; }
  return m;
}

function tbCreate(b) {
  const from = G.cities[b.from], to = G.cities[b.to];
  const s = { b, naval: !!b.naval, map: tbMap(b.naval), day: 1, weather: '맑음', gate: to.wall * 25 + 300, units: [], kept: { att: 0, def: 0 }, winner: null, log: [] };
  const make = (side, a, city, spots) => {
    const offs = a.offs.length ? a.offs : [null];
    const w = offs.map(o => (o ? o.men || o.st[0] : 40)), sum = w.reduce((x, y) => x + y, 0);
    let horse = b.naval ? city.ships : city.horse, bow = b.naval ? city.ships : city.bow;
    const sf = a.shipF || 1;
    offs.forEach((o, i) => {
      const troops = Math.max(1, Math.round(a.troops * w[i] / sum));
      let kind = 'inf';
      if (o && o.st[1] >= 84 && horse >= troops) { kind = 'cav'; horse -= troops; }
      else if (o && o.st[2] >= 70 && bow >= troops) { kind = 'arc'; bow -= troops; }
      s.units.push({
        id: s.units.length, side, off: o ? o.id : null, name: o ? o.name : '수비대', kind, troops, max: troops, morale: a.morale, train: a.train,
        cmd: o ? (b.naval ? Math.round(navyOf(o) * sf) : o.st[0]) : 40, war: o ? (b.naval ? Math.round((o.st[1] + navyOf(o)) / 2 * sf) : o.st[1]) : 40, int: o ? o.st[2] : 40, mvB: o ? itemMove(o) : 0, x: spots[i][0], y: spots[i][1], moved: false, acted: false, conf: 0, burn: 0, dueled: false, alive: true,
      });
    });
  };
  make('att', b.att, from, [[1, 5], [1, 3], [1, 7], [0, 4], [0, 6]]);
  make('def', b.def, to, [[12, 5], [11, 4], [11, 6], [12, 3], [12, 7]]);
  return s;
}
const tbAt = (s, x, y) => s.units.find(u => u.alive && u.x === x && u.y === y);
const tbSide = (s, side) => s.units.filter(u => u.alive && u.side === side);
const other = side => (side === 'att' ? 'def' : 'att');
function tbNote(s, msg) { s.log.push(`${s.day}일 │ ${msg}`); if (s.log.length > 80) s.log.shift(); }

function tbCost(s, u, x, y) {
  if (x < 0 || y < 0 || x >= BW || y >= BH) return 99;
  const t = s.map[y][x];
  if (t === T.WALL || tbAt(s, x, y)) return 99;
  if (t === T.GATE) return u.side === 'def' || s.gate <= 0 ? 1 : 99;
  if (t === T.MOUNT) return u.kind === 'cav' ? 99 : 3;
  if (t === T.RIVER) return s.naval ? 1 : 3;
  if (t === T.FOREST) return u.kind === 'cav' ? 3 : 2;
  return 1;
}
function tbReach(s, u) {
  const k = (x, y) => x + ',' + y, best = { [k(u.x, u.y)]: 0 }, q = [[u.x, u.y]];
  const mv = KIND[u.kind].mv + (s.naval ? 0 : u.mvB || 0) - (s.weather === '비' ? 1 : 0);
  while (q.length) {
    const [x, y] = q.shift(), c = best[k(x, y)];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, n = c + tbCost(s, u, nx, ny);
      if (n <= mv && (best[k(nx, ny)] === undefined || n < best[k(nx, ny)])) { best[k(nx, ny)] = n; q.push([nx, ny]); }
    }
  }
  return best;
}
function tbMove(s, u, x, y) {
  if (u.moved || u.acted || u.conf > 0 || tbReach(s, u)[x + ',' + y] === undefined) return false;
  u.x = x; u.y = y; u.moved = true; tbCheck(s);
  return true;
}
const tbInRange = (u, t, r) => man(u, t) <= (r || KIND[u.kind].rng);
function tbHit(s, t, d) {
  d = Math.min(t.troops, Math.max(20, Math.round(d)));
  t.troops -= d;
  t.morale = Math.max(0, t.morale - Math.min(12, d / t.max * 40));
  if (t.troops <= 0) { t.alive = false; tbNote(s, `${t.name} 부대가 전멸했습니다.`); }
  else if (t.morale <= 0) { t.alive = false; s.kept[t.side] += Math.round(t.troops * 0.5); tbNote(s, `${t.name} 부대가 무너져 달아났습니다.`); }
  return d;
}
function tbDamage(s, u, t, mult) {
  const rps = (u.kind === 'cav' && t.kind === 'inf') || (u.kind === 'inf' && t.kind === 'arc') || (u.kind === 'arc' && t.kind === 'cav') ? 1.3 : 1;
  const ter = { [T.FOREST]: 0.8, [T.MOUNT]: 0.7, [T.INNER]: 0.9, [T.KEEP]: 0.75 }[s.map[t.y][t.x]] || 1;
  const stat = u.kind === 'arc' ? u.cmd : u.war, wet = u.kind === 'arc' && s.weather === '비' ? 0.7 : 1;
  const uo = G.officers[u.off], kin = uo && tbSide(s, u.side).some(v => v !== u && v.off !== null && man(u, v) === 1 && isKin(uo.name, G.officers[v.off].name)) ? 1.12 : 1;
  const front = u.troops <= 5000 ? u.troops : 5000 + (u.troops - 5000) * 0.4; // 한 부대가 너무 크면 전열에 다 서지 못한다
  return kin * front * 0.15 * (0.6 + u.train / 250) * (0.5 + u.morale / 200) * (stat / 80) * rps * ter * wet * mult * rnd(0.85, 1.15);
}
function tbReady(u) { return u.alive && !u.acted && u.conf <= 0; }
function tbAttack(s, u, t) {
  if (!tbReady(u) || !t.alive || t.side === u.side || !tbInRange(u, t)) return false;
  const d = tbHit(s, t, tbDamage(s, u, t, 1));
  let txt = `${u.name}의 공격 → ${t.name} -${num(d)}`;
  if (t.alive && man(u, t) === 1) txt += `, 반격 -${num(tbHit(s, u, tbDamage(s, t, u, 0.5)))}`;
  tbNote(s, txt); u.acted = true; tbCheck(s);
  return true;
}
function tbGateHit(s, u) {
  if (!tbReady(u) || u.side !== 'att' || s.gate <= 0 || man(u, { x: GATE[0], y: GATE[1] }) > KIND[u.kind].rng) return false;
  const d = Math.round(u.troops * 0.06 * (u.war / 80) * rnd(0.85, 1.15)) + 40;
  s.gate = Math.max(0, s.gate - d); u.acted = true;
  tbNote(s, s.gate > 0 ? `${u.name}이(가) 성문을 공격합니다. (남은 내구 ${num(s.gate)})` : `${u.name}이(가) 성문을 부쉈습니다!`);
  return true;
}
function tbFire(s, u, t) {
  if (!tbReady(u) || !t.alive || t.side === u.side || man(u, t) > 3) return false;
  u.acted = true;
  if (s.weather === '비') { tbNote(s, `비 때문에 ${u.name}의 화공이 꺼졌습니다.`); tbCheck(s); return true; }
  const p = clamp(0.5 + (u.int - t.int) / 80 + (s.map[t.y][t.x] === T.FOREST ? 0.2 : 0) + (s.weather === '강풍' ? 0.15 : 0) + (s.naval ? 0.15 : 0), 0.05, 0.95);
  if (Math.random() < p) {
    const d = tbHit(s, t, t.troops * 0.12 + u.troops * 0.03); t.burn = 2;
    tbNote(s, `${u.name}의 화공! ${t.name} -${num(d)}`);
    if (s.naval) tbSide(s, t.side).filter(v => v !== t && man(v, t) === 1).forEach(v => { v.burn = 1; tbHit(s, v, v.troops * 0.06); tbNote(s, `불길이 ${v.name} 함대로 번집니다!`); });
  } else tbNote(s, `${u.name}의 화공이 간파당했습니다.`);
  tbCheck(s);
  return true;
}
function tbConfuse(s, u, t) {
  if (!tbReady(u) || !t.alive || t.side === u.side || man(u, t) > 3) return false;
  u.acted = true;
  if (Math.random() < clamp(0.45 + (u.int - t.int) / 70, 0.05, 0.95)) { t.conf = 1; t.morale = Math.max(1, t.morale - 8); tbNote(s, `${u.name}의 계략으로 ${t.name} 부대가 혼란에 빠졌습니다.`); }
  else tbNote(s, `${u.name}의 혼란 계략이 실패했습니다.`);
  return true;
}
function tbDuel(s, u, t) {
  if (!tbReady(u) || u.dueled || u.off === null || !t.alive || t.side === u.side || t.off === null || man(u, t) !== 1) return false;
  u.acted = true; u.dueled = true;
  if (t.war < u.war - 10) { t.morale = Math.max(1, t.morale - 8); tbNote(s, `${t.name}이(가) ${u.name}의 일기토를 피했습니다. (사기 -8)`); return true; }
  const [win, lose] = Math.random() < clamp(0.5 + (u.war - t.war) / 40, 0.05, 0.95) ? [u, t] : [t, u];
  win.morale = Math.min(120, win.morale + 10);
  tbNote(s, `일기토! ${win.name}이(가) ${lose.name}을(를) 꺾었습니다!`);
  lose.morale = Math.max(0, lose.morale - 30);
  tbHit(s, lose, lose.troops * 0.1); tbCheck(s);
  return true;
}
function tbRally(s, u) {
  if (!tbReady(u)) return false;
  u.morale = Math.min(120, u.morale + 8 + Math.round(u.cmd / 10)); u.acted = true;
  tbNote(s, `${u.name} 부대가 전열을 가다듬습니다.`);
  return true;
}
function tbCycleKind(s, u) {
  if (s.day !== 1 || u.moved || u.acted) return false;
  const c = G.cities[u.side === 'att' ? s.b.from : s.b.to], list = ['inf', 'cav', 'arc'];
  for (let i = 1; i <= 3; i++) {
    const k = list[(list.indexOf(u.kind) + i) % 3];
    if (k === 'inf' || (s.naval ? c.ships : k === 'cav' ? c.horse : c.bow) >= u.troops) { u.kind = k; return true; }
  }
  return false;
}
function tbCheck(s) {
  if (s.winner) return;
  if (!tbSide(s, 'att').length) s.winner = 'def';
  else if (!tbSide(s, 'def').length) s.winner = 'att';
  else if (tbSide(s, 'att').some(u => u.x === KEEP[0] && u.y === KEEP[1])) { s.winner = 'att'; tbNote(s, '공격군이 본진을 점령했습니다!'); }
}

// ----- 전장 AI -----
function tbGoal(s, u) {
  const foes = tbSide(s, other(u.side)).sort((a, b) => man(u, a) - man(u, b)), near = foes[0];
  if (u.side === 'def') return near && man(u, near) <= 6 ? near : u;
  if (near && man(u, near) <= 3) return near;
  if (u.x < GATE[0]) return s.gate > 0 ? { x: GATE[0] - 1, y: GATE[1] } : { x: GATE[0], y: GATE[1] };
  return { x: KEEP[0], y: KEEP[1] };
}
function tbAiAct(s, u) {
  if (!tbReady(u) || s.winner) return;
  const foes = tbSide(s, other(u.side)), g = tbGoal(s, u), want = u.kind === 'arc' && g.side ? 2 : 0;
  const rear = Math.min(...tbSide(s, u.side).map(v => v.x));
  const hold = u.side === 'att' && u.x >= rear + 3 && !foes.some(t => man(u, t) <= 3); // 빠른 부대가 혼자 앞서가지 않게 한다
  if (!u.moved && !hold) {
    let best = null, score = 1e9;
    for (const k of Object.keys(tbReach(s, u))) {
      const [x, y] = k.split(',').map(Number), d = man({ x, y }, g);
      const v = Math.abs(d - want) * 2 + (s.map[y][x] === T.FOREST ? -0.5 : 0) + Math.random() * 0.2;
      if (v < score) { score = v; best = [x, y]; }
    }
    if (best) tbMove(s, u, best[0], best[1]);
    if (s.winner) return;
  }
  const inR = foes.filter(t => t.alive && tbInRange(u, t)).sort((a, b) => a.troops - b.troops);
  const near3 = foes.filter(t => t.alive && man(u, t) <= 3);
  if (near3.length && u.int >= 70 && Math.random() < 0.3) {
    const t = near3[ri(0, near3.length - 1)];
    if (s.weather !== '비' && Math.random() < 0.6) tbFire(s, u, t); else tbConfuse(s, u, t);
  } else if (inR.length) {
    const adj = inR.find(t => man(u, t) === 1 && t.off !== null);
    if (adj && u.off !== null && !u.dueled && u.war >= adj.war + 5 && Math.random() < 0.3) tbDuel(s, u, adj); else tbAttack(s, u, inR[0]);
  } else if (!tbGateHit(s, u) && u.morale < 50) tbRally(s, u);
}
function tbAiSide(s, side) { for (const u of tbSide(s, side)) { if (s.winner) return; tbAiAct(s, u); } }
function tbNewDay(s) {
  if (s.winner) return;
  s.day++;
  if (s.day % 4 === 1) { s.weather = WEATHER[ri(0, WEATHER.length - 1)]; tbNote(s, `날씨: ${s.weather}`); }
  for (const u of s.units.filter(x => x.alive)) {
    u.moved = false; u.acted = false;
    if (u.conf > 0) { u.conf--; u.moved = u.acted = true; }
    if (u.burn > 0) { u.burn--; tbHit(s, u, u.troops * 0.05); }
  }
  const from = G.cities[s.b.from], need = Math.round(tbSide(s, 'att').reduce((n, u) => n + u.troops, 0) * 0.01);
  if (from.food >= need) from.food -= need;
  else { from.food = 0; tbSide(s, 'att').forEach(u => { u.morale = Math.max(1, u.morale - 6); }); tbNote(s, '공격군의 군량이 떨어졌습니다!'); }
  tbCheck(s);
  if (!s.winner && s.day > MAX_DAY) { s.winner = 'def'; tbNote(s, '30일이 지나 공격군이 물러납니다.'); }
}
function tbApply(s) {
  const b = s.b, sum = side => tbSide(s, side).reduce((n, u) => n + u.troops, 0) + s.kept[side];
  b.att.troops = sum('att'); b.def.troops = sum('def'); b.winner = s.winner;
  const best = side => Math.round(Math.min(120, Math.max(1, ...tbSide(s, side).map(u => u.morale), 1)));
  b.att.morale = best('att'); b.def.morale = best('def');
  if (s.gate <= 0) { const c = G.cities[b.to]; c.wall = Math.max(0, c.wall - 10); }
  b.log.push(...s.log.slice(-6));
}

// ----- 전장 화면 -----
let TB = null;
const TCOL = { 0: '#c9c08a', 1: '#7f9f62', 2: '#9a8763', 3: '#7fb0c4', 4: '#5c5348', 5: '#8a5a2c', 6: '#d8cba6', 7: '#c9a227' };
const TGLYPH = { 1: '♣', 2: '▲', 3: '≈', 7: '本' };

function uiBattleEntry(b) {
  return new Promise(resolve => {
    const to = G.cities[b.to];
    window._be = async mode => {
      if (mode === 'grid') await uiTactical(b);
      else if (mode === 'quick') await uiBattle(b);
      else { while (!b.winner) battleRound(b, aiTactic(b.att, b.def, false), aiTactic(b.def, b.att, true)); closeModal(); }
      resolve();
    };
    openModal(`<h2>${b.naval ? '⚓' : '⚔'} ${to.name} ${b.naval ? '수전' : '공방전'}</h2>
      <p>공격 ${fname(b.att.faction)} ${num(b.att.troops)} (${b.att.offs.map(o => o.name).join('·') || '수비대'})<br>수비 ${fname(b.def.faction)} ${num(b.def.troops)} (${b.def.offs.map(o => o.name).join('·') || '수비대'})</p>
      <button class="wide atk" onclick="_be('grid')">전장에서 직접 지휘</button>
      <button class="wide" onclick="_be('quick')">간이 전투 (전술 선택)</button>
      <button class="wide" onclick="_be('auto')">부장에게 맡기기 (자동)</button>`);
  });
}

function uiTactical(b) {
  return new Promise(resolve => {
    const s = tbCreate(b), me = b.att.faction === G.player ? 'att' : 'def';
    TB = { s, me, sel: null, mode: null, resolve };
    if (me === 'def') { tbAiSide(s, 'att'); }
    $('modalBox').classList.add('big');
    tbDraw();
  });
}
function tbDraw() {
  const { s, me, sel: id, mode } = TB, u = id === null ? null : s.units[id], S = 40;
  const reach = u && u.alive && u.side === me && !u.moved && !u.acted && u.conf <= 0 && !mode ? tbReach(s, u) : {};
  let g = '';
  for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
    let t = s.map[y][x], fill = TCOL[t];
    if (t === T.GATE && s.gate <= 0) fill = TCOL[6];
    g += `<rect x="${x * S}" y="${y * S}" width="${S}" height="${S}" fill="${fill}" stroke="#00000022" onclick="tbClick(${x},${y})"/>`;
    if (TGLYPH[t]) g += `<text x="${x * S + 20}" y="${y * S + 26}" text-anchor="middle" class="tg">${TGLYPH[t]}</text>`;
    if (t === T.GATE && s.gate > 0) g += `<text x="${x * S + 20}" y="${y * S + 26}" text-anchor="middle" class="tg" fill="#fff">門</text>`;
    if (reach[x + ',' + y] !== undefined && !tbAt(s, x, y)) g += `<rect x="${x * S + 2}" y="${y * S + 2}" width="${S - 4}" height="${S - 4}" fill="#3f7fe0" opacity=".35" onclick="tbClick(${x},${y})"/>`;
  }
  s.units.filter(v => v.alive).forEach(v => {
    const col = F[s.b[v.side].faction] ? F[s.b[v.side].faction].color : '#888', X = v.x * S, Y = v.y * S;
    const tgt = u && u.side === me && v.side !== me && tbReady(u) && (mode ? (mode === 'duel' ? man(u, v) === 1 : man(u, v) <= 3) : tbInRange(u, v));
    g += `<g onclick="tbClick(${v.x},${v.y})" opacity="${v.side === me && v.moved && v.acted ? 0.55 : 1}">
      <rect x="${X + 3}" y="${Y + 3}" width="34" height="34" rx="3" fill="${col}" stroke="${v.id === id ? '#fff' : tgt ? '#ff3b30' : '#1a1410'}" stroke-width="${v.id === id || tgt ? 3 : 1.5}"/>
      <text x="${X + 20}" y="${Y + 19}" text-anchor="middle" class="tu">${kindName(s, v.kind)[0]}${v.conf > 0 ? '?' : ''}${v.burn > 0 ? '火' : ''}</text>
      <text x="${X + 20}" y="${Y + 31}" text-anchor="middle" class="tn">${v.name.slice(0, 3)}</text>
      <rect x="${X + 5}" y="${Y + 33}" width="${30 * v.troops / v.max}" height="3" fill="#fff"/></g>`;
  });
  const info = u && u.alive ? `<b>${u.name}</b> ${kindName(s, u.kind)} · 병력 ${num(u.troops)} · 사기 ${Math.round(u.morale)} · 통${u.cmd} 무${u.war} 지${u.int}` : '부대를 선택하세요. 파란 칸으로 이동, 붉은 테두리 적을 눌러 공격합니다.';
  const mine = u && u.alive && u.side === me && !s.winner;
  const b = (t, f, off) => `<button ${off ? 'disabled' : ''} onclick="${f}">${t}</button>`, ready = mine && tbReady(u);
  const gateNear = ready && me === 'att' && s.gate > 0 && man(u, { x: GATE[0], y: GATE[1] }) <= KIND[u.kind].rng;
  const box = $('modalBox'), oldWrap = box.querySelector('.fieldwrap'), left = oldWrap ? oldWrap.scrollLeft : null, top = box.scrollTop;
  openModal(`<h2>${G.cities[s.b.to].name} ${s.naval ? '수전' : '전장'} <small>${s.day}/${MAX_DAY}일 · ${s.weather} · 성문 ${s.gate > 0 ? num(s.gate) : '파괴'} · 아군 ${num(tbSide(s, me).reduce((n, v) => n + v.troops, 0))} / 적 ${num(tbSide(s, other(me)).reduce((n, v) => n + v.troops, 0))}</small></h2>
    <div class="fieldwrap"><svg class="field" viewBox="0 0 ${BW * S} ${BH * S}">${g}</svg></div>
    <div class="flash">${mode ? { fire: '화공할 적을 고르세요. (3칸)', conf: '혼란시킬 적을 고르세요. (3칸)', duel: '일기토할 인접한 적장을 고르세요.' }[mode] : info}</div>
    ${s.winner ? `<button class="wide" onclick="tbEnd()">${s.winner === me ? '승리!' : '패배...'} — 닫기</button>` : `<div class="cmds">
      ${b('성문 공격', 'tbDo(\'gate\')', !gateNear)}${b('화공', 'tbMode(\'fire\')', !ready)}${b('혼란', 'tbMode(\'conf\')', !ready)}${b('일기토', 'tbMode(\'duel\')', !ready || u.dueled || u.off === null)}${b('정비', 'tbDo(\'rally\')', !ready)}
      ${b('병종 변경', 'tbDo(\'kind\')', !mine || s.day !== 1 || u.moved || u.acted)}${b('대기', 'tbDo(\'wait\')', !mine)}${b('자동 진행', 'tbAuto()')}${b(me === 'att' ? '퇴각' : '성 포기', 'tbRetreat()')}<button class="atk" onclick="tbNext()">턴 종료</button></div>`}
    <div class="blog small">${s.log.slice(-5).reverse().map(l => `<div>${l}</div>`).join('')}</div>`);
  const wrap = box.querySelector('.fieldwrap');
  wrap.scrollLeft = left === null ? (me === 'def' ? wrap.scrollWidth : 0) : left;
  box.scrollTop = top;
}
function tbClick(x, y) {
  const { s, me, sel: id, mode } = TB, u = id === null ? null : s.units[id], v = tbAt(s, x, y);
  if (s.winner) return;
  if (u && u.alive && u.side === me && v && v.side !== me) {
    const r = mode === 'fire' ? tbFire(s, u, v) : mode === 'conf' ? tbConfuse(s, u, v) : mode === 'duel' ? tbDuel(s, u, v) : tbAttack(s, u, v);
    if (r) { TB.mode = null; return tbDraw(); }
  }
  TB.mode = null;
  if (v) TB.sel = v.id;
  else if (u && u.side === me) tbMove(s, u, x, y);
  tbDraw();
}
function tbMode(m) { TB.mode = TB.mode === m ? null : m; tbDraw(); }
function tbDo(k) {
  const { s, sel: id } = TB, u = s.units[id];
  if (k === 'gate') tbGateHit(s, u); else if (k === 'rally') tbRally(s, u); else if (k === 'kind') tbCycleKind(s, u);
  else { u.moved = true; u.acted = true; TB.sel = null; }
  tbDraw();
}
function tbNext() {
  const { s, me } = TB;
  TB.sel = null; TB.mode = null;
  if (me === 'att') { tbAiSide(s, 'def'); tbNewDay(s); }
  else { tbNewDay(s); if (!s.winner) tbAiSide(s, 'att'); }
  tbDraw();
}
function tbAuto() {
  const { s, me } = TB;
  tbAiSide(s, me);
  tbNext();
}
function tbRetreat() { const { s, me } = TB; s.winner = other(me); tbNote(s, '아군이 전장에서 물러났습니다.'); tbDraw(); }
function tbEnd() {
  const { s, resolve, me } = TB;
  tbApply(s);
  TB = null;
  $('modalBox').classList.remove('big');
  closeModal(); resolve();
}
