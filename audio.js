// ===================== 소리 =====================
// 타이틀과 시작 메뉴: 옛 중국풍 창작곡(오음음계, 칠현 뜯기 + 활현 + 전고 + 징)
// 게임 진행 중: 버튼 클릭음만. 모든 소리는 파일 없이 브라우저에서 합성한다.
const SOUND_KEY = 'nation3_sound', BEAT = 0.88, BAR = BEAT * 4;
let audioCtx = null, audioMaster = null, soundOn = true, wantMusic = false, music = null, unlockTap = false;
try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off'; } catch (e) { /* 기본값 사용 */ }

const midiHz = m => 440 * Math.pow(2, (m - 69) / 12);
// [시작 박, 길이, 음]
const TUNE = [
  [[0, 3, 69], [3, .5, 67], [3.5, .5, 64]], [[0, 1.5, 62], [1.5, .5, 64], [2, 2, 67]],
  [[0, 1, 69], [1, 1, 72], [2, 1.5, 74], [3.5, .5, 72]], [[0, 4, 69]],
  [[0, 2, 76], [2, 1, 74], [3, 1, 72]], [[0, 1.5, 74], [1.5, .5, 72], [2, 2, 69]],
  [[0, 1, 67], [1, .5, 69], [1.5, .5, 67], [2, 1, 64], [3, 1, 62]], [[0, 4, 64]],
  [[0, 1, 69], [1, 1, 72], [2, 2, 76]], [[0, 1.5, 79], [1.5, .5, 76], [2, 2, 74]],
  [[0, 1, 76], [1, .5, 74], [1.5, .5, 72], [2, 1, 69], [3, 1, 72]], [[0, 4, 74]],
  [[0, 1.5, 76], [1.5, .5, 79], [2, 2, 81]], [[0, 1, 79], [1, 1, 76], [2, 1, 74], [3, 1, 72]],
  [[0, 1.5, 69], [1.5, .5, 72], [2, 1, 67], [3, 1, 64]], [[0, 4, 69]],
];
const ROOTS = [45, 43, 50, 45, 48, 50, 43, 40, 45, 43, 48, 50, 45, 48, 40, 45];
const ARP = [[0, 0], [1, 1], [1.5, 2], [2, 3], [3, 2], [3.5, 1]];

const pluckCache = {};
function pluckBuffer(c, midi) {
  const key = c.sampleRate + ':' + midi;
  if (pluckCache[key]) return pluckCache[key];
  const sr = c.sampleRate, f = midiHz(midi), n = Math.max(2, Math.round(sr / f)), len = Math.floor(sr * 3), line = new Float32Array(n);
  let last = 0, seed = midi * 7919 + 13;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 1073741823.5 - 1; };
  for (let i = 0; i < n; i++) { last = last * .55 + rnd() * .45; line[i] = last; }
  const buf = c.createBuffer(1, len, sr), d = buf.getChannelData(0), keep = midi < 52 ? .9975 : .9962;
  for (let i = 0, p = 0; i < len; i++) {
    const q = (p + 1) % n, v = line[p]; d[i] = v;
    line[p] = keep * (.5 * v + .5 * line[q]); p = q;
  }
  for (let i = 0; i < 90 && i < len; i++) d[i] *= i / 90;
  return (pluckCache[key] = { buf, rate: f * (n - .5) / sr });
}
function noiseBuffer(c) {
  if (c._noise) return c._noise;
  const b = c.createBuffer(1, Math.floor(c.sampleRate * .4), c.sampleRate), d = b.getChannelData(0);
  let s = 22222; for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823.5 - 1; }
  return (c._noise = b);
}
function musicGraph(c, dest) {
  const bus = c.createGain(), wet = c.createGain(), rev = c.createConvolver(), sr = c.sampleRate, ir = c.createBuffer(2, Math.floor(sr * 2.6), sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch); let s = 4099 + ch * 991, lp = 0;
    for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; lp += ((s / 1073741823.5 - 1) - lp) * .32; d[i] = lp * Math.pow(1 - i / d.length, 3.2); }
  }
  rev.buffer = ir; wet.gain.value = .9; wet.connect(rev); rev.connect(bus); bus.connect(dest);
  const send = v => { const g = c.createGain(); g.gain.value = v; g.connect(wet); return g; };
  return { bus, dry: bus, pluck: send(.2), bow: send(.3), drum: send(.12), gong: send(.34) };
}
function route(node, out, send) { node.connect(out.dry); node.connect(send); }
function playPluck(c, out, t, midi, vol) {
  const p = pluckBuffer(c, midi), s = c.createBufferSource(), g = c.createGain(), lp = c.createBiquadFilter();
  s.buffer = p.buf; s.playbackRate.value = p.rate; lp.type = 'lowpass'; lp.frequency.value = 2600;
  g.gain.value = vol; s.connect(lp); lp.connect(g); route(g, out, out.pluck); s.start(t); s.stop(t + 3);
}
function playBow(c, out, t, dur, midi, from, vol) {
  const end = t + dur, g = c.createGain(), bp = c.createBiquadFilter(), lp = c.createBiquadFilter(), lfo = c.createOscillator(), depth = c.createGain();
  bp.type = 'bandpass'; bp.frequency.value = 1050; bp.Q.value = .75; lp.type = 'lowpass'; lp.frequency.value = 3400;
  lfo.frequency.value = 5.1; depth.gain.setValueAtTime(0, t); depth.gain.linearRampToValueAtTime(0, t + Math.min(.32, dur * .4)); depth.gain.linearRampToValueAtTime(15, t + Math.min(.9, dur * .8));
  lfo.connect(depth);
  [-5, 5].forEach(cents => {
    const o = c.createOscillator(); o.type = 'sawtooth'; o.detune.value = cents;
    o.frequency.setValueAtTime(midiHz(from || midi), t); o.frequency.exponentialRampToValueAtTime(midiHz(midi), t + Math.min(.13, dur * .3));
    depth.connect(o.detune); o.connect(bp); o.start(t); o.stop(end + .3);
  });
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + Math.min(.14, dur * .35));
  g.gain.setValueAtTime(vol, Math.max(t + .15, end - .16)); g.gain.linearRampToValueAtTime(.0001, end + .12);
  bp.connect(lp); lp.connect(g); route(g, out, out.bow); lfo.start(t); lfo.stop(end + .3);
}
function playDrum(c, out, t, vol) {
  const o = c.createOscillator(), g = c.createGain(), n = c.createBufferSource(), ng = c.createGain(), lp = c.createBiquadFilter();
  o.frequency.setValueAtTime(104, t); o.frequency.exponentialRampToValueAtTime(43, t + .2);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + .72); o.connect(g); route(g, out, out.drum); o.start(t); o.stop(t + .75);
  n.buffer = noiseBuffer(c); lp.type = 'lowpass'; lp.frequency.value = 520; ng.gain.setValueAtTime(vol * .42, t); ng.gain.exponentialRampToValueAtTime(.001, t + .09);
  n.connect(lp); lp.connect(ng); route(ng, out, out.drum); n.start(t); n.stop(t + .11);
}
function playGong(c, out, t, vol) {
  [[1, 1], [1.483, .72], [2.09, .55], [2.77, .34], [3.44, .24], [4.62, .13]].forEach(([r, a], i) => {
    const o = c.createOscillator(), g = c.createGain(), life = 6.2 - i * .75;
    o.type = 'sine'; o.frequency.setValueAtTime(92 * r * .985, t); o.frequency.linearRampToValueAtTime(92 * r, t + .5);
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol * a, t + .05 + i * .03); g.gain.exponentialRampToValueAtTime(.0005, t + life);
    o.connect(g); route(g, out, out.gong); o.start(t); o.stop(t + life + .05);
  });
}
function renderBar(c, out, pos, t) {
  const at = b => t + b * BEAT;
  if (pos < 2) { // 도입: 징과 멀리서 다가오는 북
    if (pos === 0) playGong(c, out, t + .05, .13);
    const r = pos ? 45 : 45;
    [[0, 0], [2, 7], [3, 12]].forEach(([b, iv]) => playPluck(c, out, at(b), r + iv, .42));
    (pos ? [0, 1.5, 2, 3, 3.5] : [0, 2]).forEach((b, i) => playDrum(c, out, at(b), (pos ? .3 : .2) + i * .025));
    return;
  }
  const i = (pos - 2) % 16, heroic = i >= 8, root = ROOTS[i], fifth = root % 12 === 4 ? 5 : 7, iv = [0, fifth, 12, 12 + fifth];
  if (i === 0 || i === 8) playGong(c, out, t, i ? .12 : .08);
  ARP.forEach(([b, k], n) => playPluck(c, out, at(b), root + iv[k], (n ? .3 : .46) * (heroic ? 1.08 : 1)));
  const line = TUNE[i], prevBar = TUNE[(i + 15) % 16];
  line.forEach(([b, d, m], n) => {
    const from = n ? line[n - 1][2] : prevBar[prevBar.length - 1][2];
    playBow(c, out, at(b), d * BEAT * .97, m, Math.abs(from - m) <= 5 ? from : 0, heroic ? .34 : .27);
  });
  if (heroic) { [0, 1.5, 2, 3, 3.5].forEach((b, n) => playDrum(c, out, at(b), n % 2 ? .3 : .46)); if (i === 15) [3.75].forEach(b => playDrum(c, out, at(b), .34)); }
  else if (i % 2 === 0) playDrum(c, out, at(0), .28); else playDrum(c, out, at(2), .2);
}

function getAudio() {
  if (audioCtx) return audioCtx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  audioCtx = new AC();
  const comp = audioCtx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = .006; comp.release.value = .2;
  audioMaster = audioCtx.createGain(); audioMaster.gain.value = .72; audioMaster.connect(comp); comp.connect(audioCtx.destination);
  audioCtx.addEventListener && audioCtx.addEventListener('statechange', () => { updateMusic(); syncSoundUI(); });
  return audioCtx;
}
const audioReady = () => !!audioCtx && audioCtx.state === 'running';
function startMusic() {
  const c = audioCtx, out = musicGraph(c, audioMaster), now = c.currentTime;
  out.bus.gain.setValueAtTime(.0001, now); out.bus.gain.exponentialRampToValueAtTime(1, now + 1.2);
  const m = music = { out, pos: 0, next: now + .12, timer: 0 };
  const tick = () => { while (music === m && m.next < c.currentTime + 1.6) { renderBar(c, out, m.pos, m.next); m.pos++; m.next += BAR; } };
  tick(); m.timer = setInterval(tick, 400);
}
function stopMusic() {
  const m = music; if (!m) return; music = null; clearInterval(m.timer);
  const c = audioCtx, now = c.currentTime, g = m.out.bus.gain;
  g.cancelScheduledValues(now); g.setValueAtTime(Math.max(.0001, g.value), now); g.exponentialRampToValueAtTime(.0001, now + 1.1);
  setTimeout(() => { try { m.out.bus.disconnect(); } catch (e) { /* 이미 해제됨 */ } }, 1400);
}
function updateMusic() {
  const should = soundOn && wantMusic && audioReady();
  if (should && !music) startMusic(); else if (!should && music) stopMusic();
}
function setTitleMusic(on) { wantMusic = on; updateMusic(); syncSoundUI(); }
function syncSoundUI() {
  const label = soundOn ? '소리 끄기' : '소리 켜기';
  ['sndBtn', 'tSnd'].forEach(id => { const b = document.getElementById(id); if (b) b.textContent = label; });
  const h = document.getElementById('tHint');
  if (h) { const need = soundOn && wantMusic && !audioReady(); h.classList.toggle('need', need); h.textContent = need ? '화면을 누르면 음악이 시작됩니다' : '화면을 누르면 건너뜁니다'; }
}
function toggleSound() {
  soundOn = !soundOn; unlockTap = false;
  try { localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off'); } catch (e) { /* 저장 불가 환경 */ }
  if (soundOn && getAudio()) audioCtx.resume();
  updateMusic(); syncSoundUI();
}
function takeUnlockTap() { const t = unlockTap; unlockTap = false; return t; }
function unlockAudio() {
  if (!soundOn || audioReady() || !getAudio()) return;
  if (wantMusic) unlockTap = true;
  audioCtx.resume().then(() => { updateMusic(); syncSoundUI(); }).catch(() => {});
}
function warDrum(n) {
  if (!soundOn || !audioCtx) return;
  const t = audioCtx.currentTime + .02, out = { dry: audioMaster, drum: audioMaster.context.createGain() };
  out.drum.gain.value = 0; out.drum.connect(audioMaster);
  for (let i = 0; i < n; i++) playDrum(audioCtx, out, t + i * .24, .62 - i * .08);
}
function clickSound() {
  if (!soundOn || !audioCtx) return;
  const c = audioCtx, t = c.currentTime + .004, o = c.createOscillator(), g = c.createGain(), hi = c.createOscillator(), hg = c.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(1180, t); o.frequency.exponentialRampToValueAtTime(460, t + .04);
  g.gain.setValueAtTime(.2, t); g.gain.exponentialRampToValueAtTime(.001, t + .075); o.connect(g); g.connect(audioMaster); o.start(t); o.stop(t + .08);
  hi.frequency.value = 2650; hg.gain.setValueAtTime(.045, t); hg.gain.exponentialRampToValueAtTime(.001, t + .028); hi.connect(hg); hg.connect(audioMaster); hi.start(t); hi.stop(t + .03);
}

['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, unlockAudio, { capture: true, passive: true }));
document.addEventListener('click', e => {
  const b = e.target && e.target.closest && e.target.closest('button');
  if (b && !b.disabled && b.id !== 'tGo' && b.id !== 'tSnd') clickSound();
}, true);
document.addEventListener('visibilitychange', () => {
  if (!audioCtx) return;
  if (document.hidden) audioCtx.suspend(); else if (soundOn) audioCtx.resume();
});
window.addEventListener('DOMContentLoaded', syncSoundUI);
