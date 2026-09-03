/* Union Steward Hub (Unofficial) — nav, search, dark mode, Web Share */
(function() {
  function toggleMobileMenu() {
    const m = document.getElementById('mobile-menu');
    const h = document.getElementById('hamburger');
    if (m) {
      const open = m.style.display === 'block';
      m.style.display = open ? 'none' : 'block';
      if (h) {
        h.setAttribute('aria-expanded', open ? 'false' : 'true');
        h.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      }
    }
  }
  window.toggleMobileMenu = toggleMobileMenu;

  function openNavSearch() {
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
    const menu = document.getElementById('mobile-menu');
    if (isMobile && menu && menu.style.display !== 'block') toggleMobileMenu();

    window.setTimeout(function() {
      const inputs = document.querySelectorAll('.global-search-input');
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].offsetParent) {
          inputs[i].focus();
          return;
        }
      }
    }, 60);
  }
  window.openNavSearch = openNavSearch;

  function doSearch() {
    const inputs = document.querySelectorAll('.global-search-input');
    let q = '';
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].offsetParent) { q = (inputs[i].value || '').trim(); break; }
    }
    if (!q) return;
    const pdfFrame = document.getElementById('pdf-frame');
    if (pdfFrame) {
      pdfFrame.src = getPdfViewerUrl(q);
      pdfFrame.focus();
    } else {
      window.location.href = 'index.html?search=' + encodeURIComponent(q);
    }
  }
  window.doSearch = doSearch;

  function getContractUrl() {
    return window.location.origin + '/contract.pdf';
  }
  window.getContractUrl = getContractUrl;

  function getPdfViewerUrl(search) {
    var base = window.location.origin + '/';
    var url = base + 'pdf-viewer.html?file=contract.pdf';
    if (search) url += '&search=' + encodeURIComponent(search) + '&t=' + Date.now();
    return url;
  }
  window.getPdfViewerUrl = getPdfViewerUrl;

  function searchContract(term) {
    var inp = document.getElementById('global-search');
    var mobileInp = document.getElementById('mobile-search');
    if (inp) inp.value = term;
    if (mobileInp) mobileInp.value = term;
    var pdfFrame = document.getElementById('pdf-frame');
    if (pdfFrame) {
      pdfFrame.src = getPdfViewerUrl(term);
    } else {
      window.location.href = 'index.html?search=' + encodeURIComponent(term);
    }
  }
  window.searchContract = searchContract;

  function initPageSearch() {
    const inputs = document.querySelectorAll('.page-search-input');
    if (!inputs.length) return;

    function norm(s) {
      return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    inputs.forEach(function(input) {
      const target = input.getAttribute('data-target') || '.accordion-item';
      const textSel = input.getAttribute('data-text') || '.accordion-header';
      const countId = input.getAttribute('data-count-id') || '';
      const countEl = countId ? document.getElementById(countId) : null;
      const items = Array.prototype.slice.call(document.querySelectorAll(target));
      if (!items.length) return;

      function apply() {
        const q = norm(input.value);
        let shown = 0;
        items.forEach(function(item) {
          const node = item.querySelector(textSel);
          const hay = norm((node ? node.textContent : '') + ' ' + item.textContent);
          const match = !q || hay.indexOf(q) !== -1;
          item.style.display = match ? '' : 'none';
          if (match) shown++;
        });
        if (countEl) countEl.textContent = q ? (shown + ' match' + (shown === 1 ? '' : 'es')) : '';
      }

      input.addEventListener('input', apply);
      input.addEventListener('search', apply);
      apply();
    });
  }
  document.addEventListener('DOMContentLoaded', initPageSearch);

  function copyURL() {
    const b = document.getElementById('copyBtn');
    navigator.clipboard.writeText(window.location.href).then(function() {
      if (b) { b.textContent = '✅ Copied!'; setTimeout(function() { b.textContent = '🔗 Copy Link'; }, 2000); }
    });
  }
  window.copyURL = copyURL;

  function shareWhatsApp() {
    window.open('https://wa.me/?text=' + encodeURIComponent('Union Steward Resource Hub (Unofficial): ' + window.location.href));
  }
  window.shareWhatsApp = shareWhatsApp;

  function shareEmail() {
    window.location.href = 'mailto:?subject=Union Steward Resource Hub (Unofficial)&body=' + encodeURIComponent('Check out: ' + window.location.href);
  }
  window.shareEmail = shareEmail;

  function webShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Union Steward Resource Hub (Unofficial)',
        text: 'Check out this unofficial union steward resource hub — contract, grievances, safety, benefits.',
        url: window.location.href
      }).catch(function() { shareEmail(); });
    } else {
      shareEmail();
    }
  }
  window.webShare = webShare;

  var APP_DOWNLOAD_URL = 'https://github.com/cajub311/Local10starter/releases/download/local10-android-debug/Local10-Hub-debug.apk';
  var APP_RELEASE_URL = 'https://github.com/cajub311/Local10starter/releases/tag/local10-android-debug';

  function copyText(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showToast((label || 'Link') + ' copied.');
      }).catch(function() {
        window.prompt('Copy this link:', text);
      });
    } else {
      window.prompt('Copy this link:', text);
    }
  }

  function shareAppDownload() {
    if (navigator.share) {
      navigator.share({
        title: 'Local 10 Hub Android App',
        text: 'Download the unofficial Local 10 Hub Android app.',
        url: APP_DOWNLOAD_URL
      }).catch(function() {});
    } else {
      copyText(APP_DOWNLOAD_URL, 'App download link');
    }
  }
  window.shareAppDownload = shareAppDownload;

  function closeAppShare() {
    var modal = document.getElementById('app-share-modal');
    if (modal) modal.remove();
  }
  window.closeAppShare = closeAppShare;

  function openAppShare() {
    closeAppShare();
    var modal = document.createElement('div');
    modal.id = 'app-share-modal';
    modal.className = 'app-share-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'app-share-title');
    modal.innerHTML =
      '<div class="app-share-modal">' +
        '<button class="app-share-close" type="button" aria-label="Close" onclick="closeAppShare()">x</button>' +
        '<div class="hazard-stripe-thin" aria-hidden="true"></div>' +
        '<div class="app-share-body">' +
          '<span class="tag tag-gold">Android app</span>' +
          '<h2 id="app-share-title">Share Local 10 Hub With A Coworker</h2>' +
          '<p>Have them scan this QR code with their Android phone. It downloads the newest APK from GitHub.</p>' +
          '<div class="app-share-qr"><img src="app-download-qr.svg" alt="QR code to download the Local 10 Hub Android app"></div>' +
          '<div class="app-share-actions">' +
            '<button class="btn-red" type="button" onclick="shareAppDownload()">Share Link</button>' +
            '<button class="btn-outline" type="button" onclick="copyText(\'' + APP_DOWNLOAD_URL + '\', \'App download link\')">Copy Link</button>' +
            '<a class="btn-outline" href="' + APP_RELEASE_URL + '" target="_blank" rel="noopener">Release Page</a>' +
          '</div>' +
          '<p class="app-share-note">Android may ask to allow installs from the browser. If an update will not install, uninstall the old debug copy first, then install this one.</p>' +
        '</div>' +
      '</div>';
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeAppShare();
    });
    document.body.appendChild(modal);
    var closeButton = modal.querySelector('.app-share-close');
    if (closeButton) closeButton.focus();
  }
  window.openAppShare = openAppShare;
  window.copyText = copyText;

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAppShare();
  });

  function showToast(msg, cls) {
    var t = document.createElement('div');
    t.className = cls || '';
    t.textContent = msg;
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    t.style.cssText =
      'position:fixed;left:1rem;right:1rem;bottom:108px;max-width:360px;margin:0 auto;z-index:9999;' +
      'background:linear-gradient(180deg,#166534,#052e16);color:#dcfce7;border:1px solid #22c55e;' +
      'border-radius:0.45rem;padding:0.8rem 1rem;box-shadow:0 18px 40px -16px rgba(0,0,0,.85);' +
      'font-weight:700;font-size:0.9rem;text-align:center;';
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

  // PWA install prompt — surfaces a small card once per browser
  var deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (localStorage.getItem('pwaInstallDismissed') === '1') return;
    setTimeout(showInstallCard, 1500);
  });

  function showInstallCard() {
    if (document.getElementById('pwa-install-card')) return;
    var el = document.createElement('div');
    el.id = 'pwa-install-card';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Install this app');
    el.innerHTML =
      '<div style="display:flex;gap:0.75rem;align-items:center;">' +
        '<div style="font-size:1.6rem;" aria-hidden="true">📲</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="color:#f1f5f9;font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:0.95rem;line-height:1.1;">Install Local 10 Hub</div>' +
          '<div style="color:#94a3b8;font-size:0.78rem;line-height:1.2;">One-tap access on the jobsite, works offline.</div>' +
        '</div>' +
        '<button id="pwa-install-btn" class="btn-red" style="font-size:0.78rem;padding:0.4rem 0.8rem;min-height:auto;">Install</button>' +
        '<button id="pwa-install-close" aria-label="Dismiss" style="background:transparent;border:0;color:#94a3b8;font-size:1.1rem;cursor:pointer;padding:0.25rem 0.4rem;">✕</button>' +
      '</div>';
    el.style.cssText =
      'position:fixed;left:1rem;right:1rem;bottom:108px;max-width:420px;margin:0 auto;z-index:98;' +
      'background:linear-gradient(160deg,#111f3a 0%,#0a1629 100%);border:1px solid #1e3a5f;' +
      'border-left:4px solid #dc2626;border-radius:0.75rem;padding:0.75rem 0.9rem;' +
      'box-shadow:0 20px 45px -15px rgba(0,0,0,.7),0 8px 20px -8px rgba(239,68,68,.35);' +
      'animation:slideUp .25s ease;';
    document.body.appendChild(el);
    document.getElementById('pwa-install-btn').onclick = function() {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(function() {
        deferredInstallPrompt = null;
        el.remove();
        localStorage.setItem('pwaInstallDismissed', '1');
      });
    };
    document.getElementById('pwa-install-close').onclick = function() {
      el.remove();
      localStorage.setItem('pwaInstallDismissed', '1');
    };
  }
  window.addEventListener('appinstalled', function() {
    localStorage.setItem('pwaInstallDismissed', '1');
    var el = document.getElementById('pwa-install-card'); if (el) el.remove();
  });

  // Offline indicator — tiny pill, non-intrusive
  function renderOnlineStatus() {
    var id = 'offline-pill';
    var el = document.getElementById(id);
    if (!navigator.onLine) {
      if (el) return;
      el = document.createElement('div');
      el.id = id;
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.textContent = '● Offline — viewing cached copy';
      el.style.cssText =
        'position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:101;' +
        'background:linear-gradient(180deg,#7c1d1d,#450a0a);color:#fecaca;' +
        'font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:0.78rem;letter-spacing:0.08em;' +
        'text-transform:uppercase;padding:0.3rem 0.8rem;border-radius:999px;' +
        'border:1px solid #dc2626;box-shadow:0 6px 18px -6px rgba(239,68,68,.6);';
      document.body.appendChild(el);
    } else if (el) {
      el.remove();
    }
  }
  window.addEventListener('online', renderOnlineStatus);
  window.addEventListener('offline', renderOnlineStatus);
  document.addEventListener('DOMContentLoaded', renderOnlineStatus);
})();

/* Keyframes used by shared widgets */
(function() {
  var s = document.createElement('style');
  s.textContent = '@keyframes slideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}';
  document.head.appendChild(s);
})();
