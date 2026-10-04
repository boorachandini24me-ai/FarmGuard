// FarmGuard: top-right menu, Settings page, Add account
(function () {
  const $ = (id) => document.getElementById(id);
  const panel = $('menuPanel');
  const menuBtn = $('menuBtn');

  function showView(name) {
    document.querySelectorAll('#appView .view').forEach(v => v.classList.add('hidden'));
    const el = $(name + 'View');
    if (el) el.classList.remove('hidden');
    $('authView').classList.add('hidden');
    $('appView').classList.remove('hidden');
  }

  // open / close dropdown
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = panel.classList.toggle('hidden') === false;
    menuBtn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target)) panel.classList.add('hidden');
  });

  // Home / Settings
  panel.querySelectorAll('[data-view]').forEach(b =>
    b.addEventListener('click', () => {
      panel.classList.add('hidden');
      showView(b.dataset.view);
    })
  );

  // Add account -> show signup form
  $('addAccountBtn').addEventListener('click', () => {
    panel.classList.add('hidden');
    $('appView').classList.add('hidden');
    $('authView').classList.remove('hidden');
    $('signupTab').click();
  });

  // Settings: dark mode (remembered)
  const dark = $('darkToggle');
  const applyDark = (on) => {
    document.body.style.background = on ? '#10200f' : '';
    document.body.style.color = on ? '#e8f3e6' : '';
  };
  try { dark.checked = localStorage.getItem('fg_dark') === '1'; } catch (e) {}
  applyDark(dark.checked);
  dark.addEventListener('change', () => {
    applyDark(dark.checked);
    try { localStorage.setItem('fg_dark', dark.checked ? '1' : '0'); } catch (e) {}
  });

  // Settings: language (remembered)
  const lang = $('langSelect');
  try { lang.value = localStorage.getItem('fg_lang') || 'en'; } catch (e) {}
  lang.addEventListener('change', () => {
    try { localStorage.setItem('fg_lang', lang.value); } catch (e) {}
  });

  // Settings: clear history (list on screen; app.js owns the saved data)
  $('clearHistoryBtn').addEventListener('click', () => {
    if (confirm('Clear your scan history?')) $('historyList').innerHTML = '';
  });
})();
