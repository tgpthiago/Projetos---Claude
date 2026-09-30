// ============ Nav shadow on scroll ============
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ============ Reveal on scroll ============
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ============ Theme toggle ============
const toggle = document.getElementById('themeToggle');
const icon = document.getElementById('themeIcon');
const iconMoon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
const iconSun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';

let current = null;
try { current = localStorage.getItem('theme'); } catch (e) {}
if (current) {
  document.documentElement.setAttribute('data-theme', current);
  icon.innerHTML = current === 'dark' ? iconSun : iconMoon;
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  icon.innerHTML = prefersDark ? iconSun : iconMoon;
}

toggle.addEventListener('click', () => {
  const currentAttr = document.documentElement.getAttribute('data-theme');
  let next;
  if (currentAttr === 'dark') next = 'light';
  else if (currentAttr === 'light') next = 'dark';
  else next = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  icon.innerHTML = next === 'dark' ? iconSun : iconMoon;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

document.getElementById('year').textContent = new Date().getFullYear();

// ============ Certificate Modal ============
const modal = document.getElementById('certModal');
const modalFrame = document.getElementById('modalFrame');
const modalName = document.getElementById('modalName');
const modalEyebrow = document.getElementById('modalEyebrow');
const modalDownload = document.getElementById('modalDownload');
const modalClose = document.getElementById('modalClose');
let lastFocused = null;

function openCertModal(card) {
  const pdf = card.dataset.pdf;
  const name = card.dataset.certName || 'Certificado';
  const eyebrow = card.dataset.certEyebrow || '';
  if (!pdf) return;

  lastFocused = document.activeElement;
  modalName.textContent = name;
  modalEyebrow.textContent = eyebrow;
  modalDownload.href = pdf;
  modalFrame.src = pdf;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => modalClose.focus(), 60);
}

function closeCertModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  setTimeout(() => { modalFrame.src = 'about:blank'; }, 320);
  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
}

document.querySelectorAll('.cert-card.clickable').forEach(card => {
  card.addEventListener('click', () => openCertModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCertModal(card);
    }
  });
});

modalClose.addEventListener('click', closeCertModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeCertModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeCertModal();
});
