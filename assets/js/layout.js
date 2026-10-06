/* Shared chrome: nav + footer. Set <html data-base="./"> or "../". */
(function () {
  const base = document.documentElement.getAttribute('data-base') || './';
  const page = document.body.getAttribute('data-page') || 'home';

  function href(path) {
    return base + path.replace(/^\//, '');
  }

  function active(key) {
    return page === key ? ' is-active' : '';
  }

  /** Homepage section anchors; deep-link from other pages. */
  function homeHash(hash) {
    return page === 'home' ? hash : href('index.html') + hash;
  }

  const sections = [
    { label: 'What We Do', href: homeHash('#what-we-do'), key: 'what-we-do' },
    { label: 'Events', href: homeHash('#events'), key: 'events' },
    { label: 'The Company', href: homeHash('#founder'), key: 'story' },
    { label: 'Contact', href: href('contact.html'), key: 'contact' },
  ];

  const navLinks = sections
    .map((s) => `<a href="${s.href}" class="nav-link${active(s.key)}">${s.label}</a>`)
    .join('\n      ');

  const mobileLinks = sections
    .map((s) => `<a href="${s.href}" class="border-b border-line py-3.5 text-md font-medium text-ink/80">${s.label}</a>`)
    .join('\n    ');

  const footerLinks = sections
    .map((s) => `<a href="${s.href}" class="text-sm text-cream/70 transition-colors hover:text-white">${s.label}</a>`)
    .join('\n        ');

  const nav = `
<nav class="sticky top-0 z-50 border-b border-line bg-white/80 shadow-[0_1px_0_rgba(109,40,217,0.05),0_16px_32px_-28px_rgba(23,30,43,0.25)] backdrop-blur-[20px] backdrop-saturate-150" data-site-nav aria-label="Primary">
  <div class="shell flex items-center justify-between py-[18px]">
    <a href="${href('index.html')}" class="inline-flex items-center" aria-label="Guby Rogers">
      <img src="${href('assets/brand/wordmark-on-light.png')}" alt="Guby Rogers" width="200" height="83" class="h-[30px] w-auto">
    </a>

    <div class="hidden items-center gap-[34px] lg:flex">
      ${navLinks}
    </div>

    <div class="hidden items-center gap-3.5 lg:flex">
      <a href="${href('contact.html')}" class="btn btn-sm btn-violet">Start a Conversation</a>
    </div>

    <button type="button" data-nav-toggle aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"
            class="nav-toggle flex flex-col gap-[5px] p-1.5 lg:hidden">
      <span class="h-0.5 w-[22px] bg-ink"></span>
      <span class="h-0.5 w-[22px] bg-ink"></span>
      <span class="h-0.5 w-[22px] bg-ink"></span>
    </button>
  </div>

  <div id="mobile-menu" data-mobile-menu
       class="hidden flex-col border-t border-line bg-white px-[22px] pt-2.5 pb-[22px] shadow-menu lg:hidden" style="display:none">
    ${mobileLinks}
    <a href="${href('contact.html')}" class="btn btn-violet btn-block mt-4">Start a Conversation</a>
  </div>
</nav>`;

  const footer = `
<footer class="relative overflow-hidden bg-navy pt-12 pb-8 font-display">
  <div class="shell">
    <div class="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
      <a href="${href('index.html')}" class="inline-flex items-center" aria-label="Guby Rogers">
        <img src="${href('assets/brand/wordmark-on-dark.png')}" alt="Guby Rogers" width="200" height="83" class="h-8 w-auto rounded-md">
      </a>
      <nav class="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
        ${footerLinks}
      </nav>
    </div>

    <div class="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-xs tracking-[0.02em] text-cream/35">
      <span>© ${new Date().getFullYear()} Guby Rogers</span>
      <span>Made with love by Guby Rogers</span>
      <span>India · Education ecosystems</span>
    </div>
  </div>
</footer>`;

  const navHost = document.getElementById('site-nav');
  const footerHost = document.getElementById('site-footer');
  if (navHost) navHost.outerHTML = nav;
  if (footerHost) footerHost.outerHTML = footer;

  let icon = document.querySelector('link[rel="icon"]');
  if (!icon) {
    icon = document.createElement('link');
    icon.rel = 'icon';
    document.head.appendChild(icon);
  }
  icon.type = 'image/png';
  icon.href = href('assets/brand/mark-on-light.png');
  let touch = document.querySelector('link[rel="apple-touch-icon"]');
  if (!touch) {
    touch = document.createElement('link');
    touch.rel = 'apple-touch-icon';
    document.head.appendChild(touch);
  }
  touch.href = href('assets/brand/mark-on-dark.png');
})();
