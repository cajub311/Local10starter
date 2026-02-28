/* Local 10 Shared JS — nav, search, dark mode, Web Share */
(function() {
  function toggleMobileMenu() {
    const m = document.getElementById('mobile-menu');
    const h = document.getElementById('hamburger');
    if (m) {
      const open = m.style.display === 'block';
      m.style.display = open ? 'none' : 'block';
      if (h) {
        h.setAttribute('aria-expanded', !open);
        h.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      }
    }
  }
  window.toggleMobileMenu = toggleMobileMenu;

  function doSearch() {
    const inputs = document.querySelectorAll('.global-search-input');
    let q = '';
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].offsetParent) { q = (inputs[i].value || '').trim(); break; }
    }
    if (!q) return;
    const pdfFrame = document.getElementById('pdf-frame');
    if (pdfFrame) {
      const base = getContractUrl();
      pdfFrame.src = base + '#search=' + encodeURIComponent(q) + '&zoom=page-width';
      pdfFrame.focus();
    } else {
      window.location.href = 'index.html?search=' + encodeURIComponent(q);
    }
  }
  window.doSearch = doSearch;

  function getContractUrl() {
    const base = window.location.origin + (window.location.pathname || '/').replace(/\/?$/, '/');
    return base + 'contract.pdf';
  }
  window.getContractUrl = getContractUrl;

  function searchContract(term) {
    var inp = document.getElementById('global-search');
    var mobileInp = document.getElementById('mobile-search');
    if (inp) inp.value = term;
    if (mobileInp) mobileInp.value = term;
    var pdfFrame = document.getElementById('pdf-frame');
    if (pdfFrame) {
      pdfFrame.src = getContractUrl() + '#search=' + encodeURIComponent(term) + '&zoom=page-width';
    } else {
      window.location.href = 'index.html?search=' + encodeURIComponent(term);
    }
  }
  window.searchContract = searchContract;

  function copyURL() {
    const b = document.getElementById('copyBtn');
    navigator.clipboard.writeText(window.location.href).then(function() {
      if (b) { b.textContent = '✅ Copied!'; setTimeout(function() { b.textContent = '🔗 Copy Link'; }, 2000); }
    });
  }
  window.copyURL = copyURL;

  function shareWhatsApp() {
    window.open('https://wa.me/?text=' + encodeURIComponent('Local 10 Union Contract Hub: ' + window.location.href));
  }
  window.shareWhatsApp = shareWhatsApp;

  function shareEmail() {
    window.location.href = 'mailto:?subject=Local 10 Union Contract Hub&body=' + encodeURIComponent('Check out: ' + window.location.href);
  }
  window.shareEmail = shareEmail;

  function webShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Local 10 Union Contract Hub',
        text: 'Check out the Sheet Metal Workers Local 10 contract and resources.',
        url: window.location.href
      }).catch(function() { shareEmail(); });
    } else {
      shareEmail();
    }
  }
  window.webShare = webShare;

  function showToast(msg, cls) {
    var t = document.createElement('div');
    t.className = (cls || 'bg-green-500 text-white') + ' fixed bottom-24 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[9999] px-4 py-3 rounded-lg shadow-lg font-semibold text-sm text-center';
    t.textContent = msg;
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 3500);
  }
  window.showToast = showToast;

  function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    var icon = document.getElementById('dark-toggle-icon');
    if (icon) icon.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    localStorage.setItem('lightMode', document.body.classList.contains('light-mode'));
  }
  window.toggleDarkMode = toggleDarkMode;

  if (localStorage.getItem('lightMode') === 'true') {
    document.body.classList.add('light-mode');
  }
})();
