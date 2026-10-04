// ===== FarmGuard =====
// Paste your Supabase keys below. Leave as-is to run in demo mode (data stays in this browser).
const CONFIG = { url: 'YOUR_SUPABASE_URL', key: 'YOUR_SUPABASE_ANON_KEY' };

const $ = (id) => document.getElementById(id);
const demo = CONFIG.url.startsWith('YOUR_');
const sb = demo ? null : window.supabase.createClient(CONFIG.url, CONFIG.key);
let user = null, file = null, isSignup = false;

const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ----- Data -----
const PRODUCTS = [
  { id: 1, name: 'Copper Oxychloride', type: 'Fungicide', target: 'Late blight, leaf spot, bacterial blight', note: 'Protective contact fungicide.' },
  { id: 2, name: 'Mancozeb', type: 'Fungicide', target: 'Early blight, downy mildew, rust', note: 'Broad-spectrum protectant.' },
  { id: 3, name: 'Carbendazim', type: 'Fungicide', target: 'Powdery mildew, blast, wilt', note: 'Systemic fungicide.' },
  { id: 4, name: 'Neem Oil', type: 'Bio-pesticide', target: 'Aphids, whitefly, mites', note: 'Plant-based option for soft-bodied pests.' },
  { id: 5, name: 'Imidacloprid', type: 'Insecticide', target: 'Aphids, jassids, whitefly', note: 'Systemic insecticide.' },
  { id: 6, name: 'Streptomycin + Tetracycline', type: 'Bactericide', target: 'Bacterial leaf spot and blight', note: 'Used against bacterial diseases.' },
  { id: 7, name: 'Sulphur WP', type: 'Fungicide / Miticide', target: 'Powdery mildew, mites', note: 'Contact protectant.' },
  { id: 8, name: 'Trichoderma viride', type: 'Bio-fungicide', target: 'Root rot, damping-off, wilt', note: 'Soil-applied biological control.' }
];
const DIAGNOSES = [
  { name: 'Early Blight', sev: 'Moderate', symptoms: 'Brown spots with concentric rings on older leaves.', advice: 'Remove affected leaves, avoid overhead watering and improve spacing.', products: [2, 1] },
  { name: 'Powdery Mildew', sev: 'Mild', symptoms: 'White powdery coating on leaf surfaces.', advice: 'Increase airflow and avoid excess nitrogen.', products: [7, 3] },
  { name: 'Leaf Spot (Bacterial)', sev: 'Moderate', symptoms: 'Small dark water-soaked spots with yellow halos.', advice: 'Remove infected leaves, avoid working in wet fields.', products: [6, 1] },
  { name: 'Aphid Infestation', sev: 'Mild', symptoms: 'Curled leaves, sticky residue and clusters of small insects.', advice: 'Spray water to dislodge aphids and encourage natural predators.', products: [4, 5] },
  { name: 'Healthy Crop', sev: 'None', symptoms: 'No clear signs of disease or pests detected.', advice: 'Keep monitoring regularly and maintain good field hygiene.', products: [] }
];

// ----- Navigation -----
const VIEWS = ['home', 'scan', 'products', 'history', 'profile', 'settings'];
function go(view) {
  if (!user) return;
  VIEWS.forEach((v) => $(v + 'View').classList.toggle('hidden', v !== view));
  closeMenu(); window.scrollTo(0, 0);
  if (view === 'products') renderProducts();
  if (view === 'history') renderHistory();
  if (view === 'profile') renderProfile();
}
function closeMenu() { $('menuPanel').classList.add('hidden'); $('menuBtn').setAttribute('aria-expanded', 'false'); }

$('menuBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  const open = $('menuPanel').classList.toggle('hidden') === false;
  $('menuBtn').setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-view]');
  if (b) { go(b.dataset.view); return; }
  if (!$('menuPanel').contains(e.target)) closeMenu();
});

// ----- Auth -----
function setMode(signup) {
  isSignup = signup;
  $('loginTab').classList.toggle('active', !signup);
  $('signupTab').classList.toggle('active', signup);
  $('nameLabel').classList.toggle('hidden', !signup);
  $('authSubmit').textContent = signup ? 'Create account' : 'Login';
}
$('loginTab').onclick = () => setMode(false);
$('signupTab').onclick = () => setMode(true);
$('authNote').textContent = demo ? 'Demo mode: accounts are saved in this browser only.' : 'Secure authentication powered by Supabase';

function enter(u) {
  user = u;
  $('authView').classList.add('hidden'); $('appView').classList.remove('hidden');
  $('menuBtn').classList.remove('hidden');
  go('home');
}
function showAuth() {
  user = null; resetScan();
  $('appView').classList.add('hidden'); $('authView').classList.remove('hidden');
  $('menuBtn').classList.add('hidden'); closeMenu();
}

$('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('email').value.trim().toLowerCase(), password = $('password').value, name = $('name').value.trim();
  const btn = $('authSubmit'); btn.disabled = true;
  try {
    if (demo) {
      const users = store.get('fg_users', {});
      if (isSignup) {
        if (users[email]) throw new Error('Account already exists. Please login.');
        users[email] = { name: name || email.split('@')[0], password }; store.set('fg_users', users);
        store.set('fg_session', email); enter({ email, name: users[email].name }); toast('Account created');
      } else {
        if (!users[email] || users[email].password !== password) throw new Error('Wrong email or password.');
        store.set('fg_session', email); enter({ email, name: users[email].name }); toast('Welcome back!');
      }
    } else if (isSignup) {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name } } });
      if (error) throw error;
      if (data.session) { enter({ email, name: name || email.split('@')[0] }); toast('Account created'); }
      else { toast('Check your email to confirm, then login.'); setMode(false); }
    } else {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const u = data.user; enter({ email: u.email, name: (u.user_metadata && u.user_metadata.name) || u.email.split('@')[0] });
      toast('Welcome back!');
    }
    $('authForm').reset();
  } catch (err) { toast(err.message || 'Something went wrong'); }
  btn.disabled = false;
});

async function logout() {
  if (demo) store.set('fg_session', null); else await sb.auth.signOut();
  showAuth(); setMode(false);
}
$('logoutBtn').onclick = logout;
$('addAccountBtn').onclick = async () => { await logout(); setMode(true); toast('Create a new account'); };

// ----- Scan -----
function resetScan() {
  file = null; $('cropInput').value = '';
  $('preview').classList.add('hidden'); $('scanActions').classList.add('hidden'); $('dropZone').classList.remove('hidden');
  $('resultCard').innerHTML = '<div class="empty-result"><span>🌿</span><h2>Your result will appear here</h2><p>Upload a crop photo to begin.</p></div>';
}
$('chooseBtn').onclick = (e) => { e.stopPropagation(); $('cropInput').click(); };
$('dropZone').onclick = () => $('cropInput').click();
$('clearBtn').onclick = resetScan;
$('cropInput').addEventListener('change', (e) => {
  const f = e.target.files[0]; if (!f) return;
  if (!f.type.startsWith('image/')) return toast('Please choose an image file.');
  if (f.size > 8 * 1024 * 1024) return toast('Image is too large (max 8 MB).');
  file = f;
  const p = $('preview'); p.src = URL.createObjectURL(f);
  p.classList.remove('hidden'); $('scanActions').classList.remove('hidden'); $('dropZone').classList.add('hidden');
});

function thumbnail(f) {
  return new Promise((res) => {
    const img = new Image(), url = URL.createObjectURL(f);
    img.onload = () => {
      const c = document.createElement('canvas'), s = 120 / Math.max(img.width, img.height);
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => res(''); img.src = url;
  });
}
const histKey = () => 'fg_hist_' + user.email;

$('analyzeBtn').onclick = async () => {
  if (!file) return toast('Choose a photo first.');
  const btn = $('analyzeBtn'); btn.disabled = true; btn.textContent = '⏳ Analyzing...';
  $('resultCard').innerHTML = '<div class="empty-result"><span>🔬</span><h2>Analyzing your crop...</h2></div>';
  await new Promise((r) => setTimeout(r, 1500));
  // Demo diagnosis layer: replace with a real model/API call later.
  const d = DIAGNOSES[file.size % DIAGNOSES.length], conf = 70 + (file.size % 25);
  const sevCls = d.sev === 'None' ? '' : d.sev === 'Mild' ? 'warn' : 'bad';
  const prods = d.products.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  $('resultCard').innerHTML =
    `<span class="pill">RESULT</span><h2>${esc(d.name)}</h2>
     <span class="tag">${conf}% confidence</span><span class="tag ${sevCls}">Severity: ${esc(d.sev)}</span>
     <p><b>Signs:</b> ${esc(d.symptoms)}</p><p><b>Advice:</b> ${esc(d.advice)}</p>` +
    (prods.length ? `<p><b>Suggested products:</b></p>${prods.map((p) => `<span class="tag">${esc(p.name)}</span>`).join('')}` : '') +
    `<div class="notice">⚠️ Demo assessment, not a confirmed diagnosis. Verify with a local agriculture officer and follow product labels.</div>`;
  const h = store.get(histKey(), []);
  h.unshift({ id: Date.now(), name: d.name, conf, sev: d.sev, date: new Date().toLocaleString(), img: await thumbnail(file) });
  store.set(histKey(), h.slice(0, 30));
  btn.disabled = false; btn.textContent = '🔍 Analyze crop'; toast('Scan saved to My Scans');
};

// ----- Products / History / Profile -----
function renderProducts() {
  const q = $('productSearch').value.trim().toLowerCase();
  const list = PRODUCTS.filter((p) => (p.name + ' ' + p.type + ' ' + p.target).toLowerCase().includes(q));
  $('productsGrid').innerHTML = list.length
    ? list.map((p) => `<div class="product"><h3>${esc(p.name)}</h3><span class="tag">${esc(p.type)}</span><p><b>For:</b> ${esc(p.target)}</p><p>${esc(p.note)}</p></div>`).join('')
    : '<p class="muted">No products match your search.</p>';
}
$('productSearch').addEventListener('input', renderProducts);

function renderHistory() {
  const h = store.get(histKey(), []);
  $('historyList').innerHTML = h.length
    ? h.map((s) => `<div class="history-item">${s.img ? `<img src="${s.img}" alt="">` : '<span style="font-size:2em">🌿</span>'}
        <div><b>${esc(s.name)}</b><br><span class="muted">${s.conf}% · ${esc(s.sev)} · ${esc(s.date)}</span></div>
        <button data-del="${s.id}" aria-label="Delete scan">🗑</button></div>`).join('')
    : '<p class="muted">No scans yet. Scan a crop to see it here.</p>';
}
$('historyList').addEventListener('click', (e) => {
  const b = e.target.closest('[data-del]'); if (!b) return;
  store.set(histKey(), store.get(histKey(), []).filter((s) => String(s.id) !== b.dataset.del));
  renderHistory(); toast('Scan deleted');
});

function renderProfile() {
  $('profileName').textContent = user.name; $('profileEmail').textContent = user.email;
  $('profileMode').textContent = demo ? 'DEMO ACCOUNT' : 'SUPABASE ACCOUNT';
  $('profileScans').textContent = store.get(histKey(), []).length + ' scans saved';
}

// ----- Settings -----
function applySettings() {
  const s = store.get('fg_settings', { dark: false, size: 'normal' });
  document.body.classList.toggle('dark', !!s.dark);
  document.body.classList.remove('size-small', 'size-large');
  if (s.size !== 'normal') document.body.classList.add('size-' + s.size);
  $('darkToggle').checked = !!s.dark; $('sizeSelect').value = s.size;
}
function saveSettings() { store.set('fg_settings', { dark: $('darkToggle').checked, size: $('sizeSelect').value }); applySettings(); }
$('darkToggle').onchange = saveSettings; $('sizeSelect').onchange = saveSettings;
$('clearHistoryBtn').onclick = () => {
  if (confirm('Delete all your saved scans?')) { store.set(histKey(), []); renderHistory(); toast('History cleared'); }
};

// ----- Start -----
(async function init() {
  applySettings(); setMode(false);
  if (demo) {
    const email = store.get('fg_session', null), users = store.get('fg_users', {});
    if (email && users[email]) enter({ email, name: users[email].name });
  } else {
    const { data } = await sb.auth.getSession();
    if (data.session) { const u = data.session.user; enter({ email: u.email, name: (u.user_metadata && u.user_metadata.name) || u.email.split('@')[0] }); }
  }
})();
